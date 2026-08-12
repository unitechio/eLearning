package impl

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/errs"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	storage "github.com/unitechio/eLearning/apps/api/internal/infrastructure/filestorage"
)

type DocumentUsecase struct {
	repo    repository.DocumentRepository
	storage storage.IStorage
	userRepo repository.UserRepository
}

func NewDocumentUsecase(repo repository.DocumentRepository, store storage.IStorage, userRepo repository.UserRepository) *DocumentUsecase {
	return &DocumentUsecase{
		repo:     repo,
		storage:  store,
		userRepo: userRepo,
	}
}

// checkPermission checks if a user has access to a document
func (u *DocumentUsecase) checkPermission(ctx context.Context, doc *domain.Document, userID uuid.UUID, required string) error {
	// Owner and Admin always have full access
	if doc.OwnerID == userID {
		return nil
	}

	// Check if user is Admin/SuperAdmin
	user, err := u.userRepo.FindByIDWithAccess(ctx, userID)
	if err == nil && user != nil {
		for _, role := range user.Roles {
			if role.Name == "admin" || role.Name == "super_admin" {
				return nil
			}
		}
	}

	// Public visibility allows viewing
	if doc.Visibility == domain.VisibilityPublic && required == domain.PermViewer {
		return nil
	}

	// Check explicit document permissions
	perms, err := u.repo.GetPermissions(ctx, doc.ID)
	if err != nil {
		return errors.New("unauthorized: permission check failed")
	}

	for _, p := range perms {
		if p.SubjectType == "user" && p.SubjectID == userID.String() {
			if u.permLevelSatisfies(p.Permission, required) {
				return nil
			}
		}
	}

	return errors.New("unauthorized: permission denied")
}

func (u *DocumentUsecase) permLevelSatisfies(has, needs string) bool {
	if has == domain.PermOwner {
		return true
	}
	if has == domain.PermEditor {
		return needs == domain.PermEditor || needs == domain.PermViewer
	}
	return has == needs
}

// generateDocumentCode produces a human-readable, unique reference code.
// Format: DOC-YYYYMMDD-XXXXXXXX (8 hex chars from a new UUID).
func generateDocumentCode() string {
	return fmt.Sprintf("DOC-%s-%s",
		time.Now().Format("20060102"),
		strings.ToUpper(uuid.New().String()[:8]),
	)
}

func (u *DocumentUsecase) CreateDocument(ctx context.Context, title, description string, folderID *uint, visibility string, ownerID uuid.UUID, filename string, reader io.Reader, size int64, mimeType string) (*domain.Document, error) {
	log := slog.With(
		slog.String("op", errs.OpCreateDocument),
		slog.String("owner_id", ownerID.String()),
		slog.String("filename", filename),
		slog.Int64("size", size),
	)

	// Read file content
	var content []byte
	if reader != nil {
		var err error
		content, err = io.ReadAll(reader)
		if err != nil {
			log.Error("step=read_file failed", slog.String("error", err.Error()))
			return nil, fmt.Errorf("%s: failed to read file: %w", errs.OpCreateDocument, err)
		}
		log.Info("step=read_file ok", slog.Int("bytes_read", len(content)))
	}

	// Validate File type before touching DB or storage
	if !u.storage.IsAllowedFileType(filename) {
		log.Warn("step=validate_file_type rejected", slog.String("ext", filepath.Ext(filename)))
		return nil, fmt.Errorf("%s: %w", errs.OpCreateDocument, errs.ErrDocumentFileTypeInvalid)
	}
	log.Info("step=validate_file_type ok")

	ext := strings.ToLower(filepath.Ext(filename))

	// Step 1: Create the document record first so we have a real doc.ID
	doc := &domain.Document{
		DocumentCode: generateDocumentCode(),
		Title:        title,
		Description:  description,
		OwnerID:      ownerID,
		FolderID:     folderID,
		Status:       domain.DocStatusActive,
		Visibility:   visibility,
	}

	if err := u.repo.Create(ctx, doc); err != nil {
		log.Error("step=db_create_document failed", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", errs.OpCreateDocument, err)
	}
	log.Info("step=db_create_document ok", slog.Uint64("doc_id", uint64(doc.ID)))

	// Step 2: Upload to MinIO using the real doc.ID so the storage path is correct
	objectKey, err := u.storage.UploadFileFromBytes(ctx, content, filename, "documents", doc.ID)
	if err != nil {
		log.Error("step=minio_upload failed", slog.String("error", err.Error()), slog.Uint64("doc_id", uint64(doc.ID)))
		_ = u.repo.PermanentDelete(ctx, doc.ID)
		return nil, fmt.Errorf("%s: %w: %w", errs.OpUploadDocumentFile, errs.ErrDocumentStorageFailed, err)
	}
	log.Info("step=minio_upload ok", slog.String("object_key", objectKey))

	// Step 3: Create physical file asset & version 1
	asset := domain.FileAsset{
		DocumentID:   doc.ID,
		StorageKey:   objectKey,
		OriginalName: filename,
		MimeType:     mimeType,
		Extension:    ext,
		Size:         size,
		CreatedAt:    time.Now(),
	}

	version := &domain.DocumentVersion{
		DocumentID:    doc.ID,
		VersionNumber: 1,
		CreatedBy:     ownerID,
		ChangeSummary: "Initial Upload",
		FileAsset:     asset,
	}

	if err = u.repo.CreateVersion(ctx, version); err != nil {
		log.Error("step=db_create_version failed", slog.String("error", err.Error()), slog.Uint64("doc_id", uint64(doc.ID)))
		_ = u.repo.PermanentDelete(ctx, doc.ID)
		_ = u.storage.DeleteFile(ctx, objectKey)
		return nil, fmt.Errorf("%s: %w", errs.OpCreateDocumentVersion, err)
	}
	log.Info("step=db_create_version ok", slog.Uint64("version_id", uint64(version.ID)))

	// Log activity (non-blocking, best-effort)
	meta, _ := json.Marshal(map[string]any{"filename": filename, "size": size})
	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: doc.ID,
		ActorID:    ownerID,
		Action:     "created",
		Metadata:   string(meta),
	})

	result, err := u.repo.GetByID(ctx, doc.ID)
	if err != nil {
		log.Error("step=get_by_id after create failed", slog.String("error", err.Error()), slog.Uint64("doc_id", uint64(doc.ID)))
		return nil, fmt.Errorf("%s: %w", errs.OpGetDocument, err)
	}
	log.Info("step=create_document complete", slog.Uint64("doc_id", uint64(doc.ID)), slog.String("code", result.DocumentCode))
	return result, nil
}

func (u *DocumentUsecase) UpdateDocument(ctx context.Context, id uint, title, description string, folderID *uint, visibility string, isFavorite bool, userID uuid.UUID) (*domain.Document, error) {
	doc, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if err := u.checkPermission(ctx, doc, userID, domain.PermEditor); err != nil {
		return nil, err
	}

	doc.Title = title
	doc.Description = description
	doc.FolderID = folderID
	doc.Visibility = visibility
	doc.IsFavorite = isFavorite

	err = u.repo.Update(ctx, doc)
	if err != nil {
		return nil, err
	}

	meta, _ := json.Marshal(map[string]any{"title": title})
	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: doc.ID,
		ActorID:    userID,
		Action:     "updated",
		Metadata:   string(meta),
	})

	return u.repo.GetByID(ctx, doc.ID)
}

func (u *DocumentUsecase) GetDocumentByID(ctx context.Context, id uint, userID uuid.UUID) (*domain.Document, error) {
	doc, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if err := u.checkPermission(ctx, doc, userID, domain.PermViewer); err != nil {
		return nil, err
	}

	// Log view activity (decoupled, non-blocking)
	go func() {
		_ = u.repo.LogActivity(context.Background(), &domain.DocumentActivity{
			DocumentID: doc.ID,
			ActorID:    userID,
			Action:     "viewed",
		})
	}()

	return doc, nil
}

func (u *DocumentUsecase) DeleteDocument(ctx context.Context, id uint, userID uuid.UUID) error {
	doc, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if err := u.checkPermission(ctx, doc, userID, domain.PermOwner); err != nil {
		return err
	}

	err = u.repo.Delete(ctx, id)
	if err != nil {
		return err
	}

	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: id,
		ActorID:    userID,
		Action:     "deleted",
	})

	return nil
}

func (u *DocumentUsecase) RestoreDocument(ctx context.Context, id uint, userID uuid.UUID) error {
	doc, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if err := u.checkPermission(ctx, doc, userID, domain.PermOwner); err != nil {
		return err
	}

	err = u.repo.Restore(ctx, id)
	if err != nil {
		return err
	}

	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: id,
		ActorID:    userID,
		Action:     "restored",
	})

	return nil
}

func (u *DocumentUsecase) PermanentDeleteDocument(ctx context.Context, id uint, userID uuid.UUID) error {
	doc, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if err := u.checkPermission(ctx, doc, userID, domain.PermOwner); err != nil {
		return err
	}

	// Delete from storage
	versions, err := u.repo.GetVersions(ctx, id)
	if err == nil {
		for _, v := range versions {
			if v.FileAsset.StorageKey != "" {
				_ = u.storage.DeleteFile(ctx, v.FileAsset.StorageKey)
			}
		}
	}

	return u.repo.PermanentDelete(ctx, id)
}

func (u *DocumentUsecase) ListDocuments(ctx context.Context, filter domain.DocumentFilter, userID uuid.UUID) ([]*domain.Document, int64, error) {
	// If the user is not an Admin, they can only view documents they own or have permission on
	user, err := u.userRepo.FindByIDWithAccess(ctx, userID)
	isAdmin := false
	if err == nil && user != nil {
		for _, role := range user.Roles {
			if role.Name == "admin" || role.Name == "super_admin" {
				isAdmin = true
				break
			}
		}
	}

	if !isAdmin {
		// Non-admins can only see their own files or files with public visibility
		filter.OwnerID = &userID
	}

	return u.repo.List(ctx, filter)
}

func (u *DocumentUsecase) CreateFolder(ctx context.Context, name string, parentID *uint, ownerID uuid.UUID) (*domain.Folder, error) {
	folder := &domain.Folder{
		Name:     name,
		ParentID: parentID,
		OwnerID:  ownerID,
	}
	err := u.repo.CreateFolder(ctx, folder)
	return folder, err
}

func (u *DocumentUsecase) UpdateFolder(ctx context.Context, id uint, name string, parentID *uint, userID uuid.UUID) (*domain.Folder, error) {
	folder, err := u.repo.GetFolderByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if folder.OwnerID != userID {
		return nil, errors.New("unauthorized: folder owner mismatch")
	}

	folder.Name = name
	folder.ParentID = parentID
	err = u.repo.UpdateFolder(ctx, folder)
	return folder, err
}

func (u *DocumentUsecase) GetFolderByID(ctx context.Context, id uint, userID uuid.UUID) (*domain.Folder, error) {
	folder, err := u.repo.GetFolderByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if folder.OwnerID != userID {
		return nil, errors.New("unauthorized")
	}
	return folder, nil
}

func (u *DocumentUsecase) DeleteFolder(ctx context.Context, id uint, userID uuid.UUID) error {
	folder, err := u.repo.GetFolderByID(ctx, id)
	if err != nil {
		return err
	}
	if folder.OwnerID != userID {
		return errors.New("unauthorized")
	}
	return u.repo.DeleteFolder(ctx, id)
}

func (u *DocumentUsecase) ListFolders(ctx context.Context, ownerID uuid.UUID, parentID *uint) ([]*domain.Folder, error) {
	return u.repo.ListFolders(ctx, ownerID, parentID)
}

func (u *DocumentUsecase) CreateVersion(ctx context.Context, docID uint, changeSummary string, createdBy uuid.UUID, filename string, reader io.Reader, size int64, mimeType string) (*domain.DocumentVersion, error) {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return nil, err
	}

	if err := u.checkPermission(ctx, doc, createdBy, domain.PermEditor); err != nil {
		return nil, err
	}

	// Read content
	content, err := io.ReadAll(reader)
	if err != nil {
		return nil, err
	}

	// Upload new file asset
	objectKey, err := u.storage.UploadFileFromBytes(ctx, content, filename, "documents", docID)
	if err != nil {
		return nil, err
	}

	versions, err := u.repo.GetVersions(ctx, docID)
	nextVerNum := 1
	if err == nil && len(versions) > 0 {
		nextVerNum = versions[0].VersionNumber + 1
	}

	ext := strings.ToLower(filepath.Ext(filename))
	asset := domain.FileAsset{
		DocumentID:   docID,
		StorageKey:   objectKey,
		OriginalName: filename,
		MimeType:     mimeType,
		Extension:    ext,
		Size:         size,
		CreatedAt:    time.Now(),
	}

	version := &domain.DocumentVersion{
		DocumentID:    docID,
		VersionNumber: nextVerNum,
		CreatedBy:     createdBy,
		ChangeSummary: changeSummary,
		FileAsset:     asset,
	}

	err = u.repo.CreateVersion(ctx, version)
	if err != nil {
		return nil, err
	}

	meta, _ := json.Marshal(map[string]any{"version": nextVerNum})
	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: docID,
		ActorID:    createdBy,
		Action:     "version_created",
		Metadata:   string(meta),
	})

	return version, nil
}

func (u *DocumentUsecase) GetVersions(ctx context.Context, docID uint, userID uuid.UUID) ([]*domain.DocumentVersion, error) {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return nil, err
	}
	if err := u.checkPermission(ctx, doc, userID, domain.PermViewer); err != nil {
		return nil, err
	}
	return u.repo.GetVersions(ctx, docID)
}

func (u *DocumentUsecase) ShareDocument(ctx context.Context, docID uint, subjectType, subjectID, permission string, userID uuid.UUID) (*domain.DocumentPermission, error) {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return nil, err
	}
	if err := u.checkPermission(ctx, doc, userID, domain.PermOwner); err != nil {
		return nil, err
	}

	if subjectType == "user" && strings.Contains(subjectID, "@") {
		targetUser, err := u.userRepo.FindByEmail(ctx, subjectID)
		if err != nil {
			return nil, fmt.Errorf("user not found with email: %s", subjectID)
		}
		subjectID = targetUser.ID.String()
	}

	perm := &domain.DocumentPermission{
		DocumentID:  docID,
		SubjectType: subjectType,
		SubjectID:   subjectID,
		Permission:  permission,
	}

	err = u.repo.AddPermission(ctx, perm)
	if err != nil {
		return nil, err
	}

	meta, _ := json.Marshal(map[string]any{"subject_id": subjectID, "permission": permission})
	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: docID,
		ActorID:    userID,
		Action:     "shared",
		Metadata:   string(meta),
	})

	return perm, nil
}

func (u *DocumentUsecase) RevokeAccess(ctx context.Context, docID, permID uint, userID uuid.UUID) error {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return err
	}
	if err := u.checkPermission(ctx, doc, userID, domain.PermOwner); err != nil {
		return err
	}

	err = u.repo.RemovePermission(ctx, permID)
	if err != nil {
		return err
	}

	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: docID,
		ActorID:    userID,
		Action:     "permission_removed",
	})

	return nil
}

func (u *DocumentUsecase) GetPermissions(ctx context.Context, docID uint, userID uuid.UUID) ([]*domain.DocumentPermission, error) {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return nil, err
	}
	if err := u.checkPermission(ctx, doc, userID, domain.PermViewer); err != nil {
		return nil, err
	}
	perms, err := u.repo.GetPermissions(ctx, docID)
	if err != nil {
		return nil, err
	}

	// Populate UserEmail for user-type permissions
	for _, p := range perms {
		if p.SubjectType == "user" {
			userUUID, err := uuid.Parse(p.SubjectID)
			if err == nil {
				user, err := u.userRepo.FindByIDWithAccess(ctx, userUUID)
				if err == nil && user != nil {
					p.UserEmail = user.Email
				}
			}
		}
	}

	return perms, nil
}

func (u *DocumentUsecase) GetActivities(ctx context.Context, docID uint, userID uuid.UUID) ([]*domain.DocumentActivity, error) {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return nil, err
	}
	if err := u.checkPermission(ctx, doc, userID, domain.PermViewer); err != nil {
		return nil, err
	}
	return u.repo.GetActivities(ctx, docID)
}

func (u *DocumentUsecase) AttachToResource(ctx context.Context, docID uint, resType string, resID uint, userID uuid.UUID) error {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return err
	}
	if err := u.checkPermission(ctx, doc, userID, domain.PermViewer); err != nil {
		return err
	}

	attach := &domain.DocumentLMSAttachment{
		DocumentID:   docID,
		ResourceType: resType,
		ResourceID:   resID,
	}

	err = u.repo.Attach(ctx, attach)
	if err != nil {
		return err
	}

	meta, _ := json.Marshal(map[string]any{"resource_type": resType, "resource_id": resID})
	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: docID,
		ActorID:    userID,
		Action:     "attached",
		Metadata:   string(meta),
	})

	return nil
}

func (u *DocumentUsecase) DetachFromResource(ctx context.Context, docID uint, resType string, resID uint, userID uuid.UUID) error {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return err
	}
	if err := u.checkPermission(ctx, doc, userID, domain.PermViewer); err != nil {
		return err
	}

	err = u.repo.Detach(ctx, docID, resType, resID)
	if err != nil {
		return err
	}

	meta, _ := json.Marshal(map[string]any{"resource_type": resType, "resource_id": resID})
	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: docID,
		ActorID:    userID,
		Action:     "detached",
		Metadata:   string(meta),
	})

	return nil
}

func (u *DocumentUsecase) GetAttachmentsForResource(ctx context.Context, resType string, resID uint, userID uuid.UUID) ([]*domain.Document, error) {
	return u.repo.GetAttachmentsForResource(ctx, resType, resID)
}

func (u *DocumentUsecase) GetStats(ctx context.Context, ownerID *uuid.UUID, userID uuid.UUID) (*domain.DocumentStats, error) {
	return u.repo.GetStats(ctx, ownerID)
}

func (u *DocumentUsecase) GetDownloadURL(ctx context.Context, docID uint, userID uuid.UUID) (string, error) {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return "", fmt.Errorf("%s: %w", errs.OpGenerateDownloadURL, err)
	}
	if err := u.checkPermission(ctx, doc, userID, domain.PermViewer); err != nil {
		return "", err
	}
	if doc.CurrentVersion == nil || doc.CurrentVersion.FileAsset.StorageKey == "" {
		return "", fmt.Errorf("%s: %w", errs.OpGenerateDownloadURL, errs.ErrDocumentHasNoAsset)
	}

	// Generate presigned URL
	url, err := u.storage.GetFileURL(ctx, doc.CurrentVersion.FileAsset.StorageKey, 24*time.Hour)
	if err != nil {
		return "", fmt.Errorf("%s: %w", errs.OpGenerateDownloadURL, err)
	}

	_ = u.repo.LogActivity(ctx, &domain.DocumentActivity{
		DocumentID: docID,
		ActorID:    userID,
		Action:     "downloaded",
	})

	return url, nil
}

func (u *DocumentUsecase) GetPreviewURL(ctx context.Context, docID uint, userID uuid.UUID) (string, error) {
	doc, err := u.repo.GetByID(ctx, docID)
	if err != nil {
		return "", err
	}
	if err := u.checkPermission(ctx, doc, userID, domain.PermViewer); err != nil {
		return "", err
	}
	if doc.CurrentVersion == nil || doc.CurrentVersion.FileAsset.StorageKey == "" {
		return "", errors.New("document has no physical file asset")
	}

	return u.storage.GetFileURL(ctx, doc.CurrentVersion.FileAsset.StorageKey, 2*time.Hour)
}

var _ usecase.DocumentUsecase = (*DocumentUsecase)(nil)
