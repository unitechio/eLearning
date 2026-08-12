package impl

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type DocumentRepository struct {
	db *gorm.DB
}

func NewDocumentRepository(db *gorm.DB) *DocumentRepository {
	return &DocumentRepository{db: db}
}

func (r *DocumentRepository) Create(ctx context.Context, doc *domain.Document) error {
	return r.db.WithContext(ctx).Create(doc).Error
}

func (r *DocumentRepository) Update(ctx context.Context, doc *domain.Document) error {
	return r.db.WithContext(ctx).Save(doc).Error
}

func (r *DocumentRepository) GetByID(ctx context.Context, id uint) (*domain.Document, error) {
	var doc domain.Document
	err := r.db.WithContext(ctx).
		Preload("Owner").
		Preload("Folder").
		Preload("CurrentVersion.FileAsset").
		First(&doc, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("document not found")
		}
		return nil, err
	}
	return &doc, nil
}

func (r *DocumentRepository) Delete(ctx context.Context, id uint) error {
	// Soft delete Document and automatically unfavorite & set status to deleted
	now := time.Now()
	return r.db.WithContext(ctx).Model(&domain.Document{}).Where("id = ?", id).Updates(map[string]any{
		"deleted_at":  &now,
		"is_favorite": false,
		"status":      domain.DocStatusDeleted,
	}).Error
}

func (r *DocumentRepository) PermanentDelete(ctx context.Context, id uint) error {
	// Delete attachments, versions, file assets, permissions, activities first
	tx := r.db.WithContext(ctx).Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Where("document_id = ?", id).Delete(&domain.DocumentLMSAttachment{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Where("document_id = ?", id).Delete(&domain.DocumentPermission{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Where("document_id = ?", id).Delete(&domain.DocumentActivity{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Where("document_id = ?", id).Delete(&domain.FileAsset{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Where("document_id = ?", id).Delete(&domain.DocumentVersion{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Unscoped().Delete(&domain.Document{}, id).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func (r *DocumentRepository) Restore(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Model(&domain.Document{}).Where("id = ?", id).Update("deleted_at", nil).Error
}

func (r *DocumentRepository) List(ctx context.Context, filter domain.DocumentFilter) ([]*domain.Document, int64, error) {
	var docs []*domain.Document
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.Document{}).
		Preload("Owner").
		Preload("Folder").
		Preload("CurrentVersion.FileAsset")

	// Apply soft delete filter: by default, show non-deleted unless filter.Status is "deleted"
	if filter.Status == "deleted" {
		query = query.Where("deleted_at IS NOT NULL")
	} else {
		query = query.Where("deleted_at IS NULL")
		if filter.Status != "" {
			query = query.Where("status = ?", filter.Status)
		}
	}

	if filter.OwnerID != nil {
		query = query.Where("owner_id = ?", *filter.OwnerID)
	}

	if filter.FolderNull {
		query = query.Where("folder_id IS NULL")
	} else if filter.FolderID != nil {
		query = query.Where("folder_id = ?", *filter.FolderID)
	}

	if filter.Visibility != "" {
		query = query.Where("visibility = ?", filter.Visibility)
	}

	if filter.IsFavorite != nil {
		query = query.Where("is_favorite = ?", *filter.IsFavorite)
	}

	if filter.MimeType != "" {
		// Filter by mime type category via FileAsset
		query = query.Joins("JOIN document_versions ON document_versions.id = documents.current_version_id").
			Joins("JOIN file_assets ON file_assets.id = document_versions.file_asset_id").
			Where("file_assets.mime_type LIKE ?", "%"+filter.MimeType+"%")
	}

	if filter.Search != "" {
		pattern := "%" + filter.Search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", pattern, pattern)
	}

	if filter.StartDate != nil {
		query = query.Where("documents.created_at >= ?", *filter.StartDate)
	}
	if filter.EndDate != nil {
		query = query.Where("documents.created_at <= ?", *filter.EndDate)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// Apply Sorting
	if filter.SortBy != "" {
		switch filter.SortBy {
		case "name_asc":
			query = query.Order("title ASC")
		case "name_desc":
			query = query.Order("title DESC")
		case "updated_desc":
			query = query.Order("updated_at DESC")
		case "updated_asc":
			query = query.Order("updated_at ASC")
		case "created_desc":
			query = query.Order("created_at DESC")
		case "size_desc":
			query = query.Joins("LEFT JOIN document_versions ON document_versions.id = documents.current_version_id").
				Joins("LEFT JOIN file_assets ON file_assets.id = document_versions.file_asset_id").
				Order("file_assets.size DESC")
		case "size_asc":
			query = query.Joins("LEFT JOIN document_versions ON document_versions.id = documents.current_version_id").
				Joins("LEFT JOIN file_assets ON file_assets.id = document_versions.file_asset_id").
				Order("file_assets.size ASC")
		default:
			query = query.Order("updated_at DESC")
		}
	} else {
		query = query.Order("updated_at DESC")
	}

	if filter.Limit > 0 {
		query = query.Limit(filter.Limit)
	}
	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	err = query.Find(&docs).Error
	return docs, total, err
}

func (r *DocumentRepository) CreateFolder(ctx context.Context, folder *domain.Folder) error {
	return r.db.WithContext(ctx).Create(folder).Error
}

func (r *DocumentRepository) UpdateFolder(ctx context.Context, folder *domain.Folder) error {
	return r.db.WithContext(ctx).Save(folder).Error
}

func (r *DocumentRepository) GetFolderByID(ctx context.Context, id uint) (*domain.Folder, error) {
	var folder domain.Folder
	err := r.db.WithContext(ctx).Preload("Children").First(&folder, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("folder not found")
		}
		return nil, err
	}
	return &folder, nil
}

func (r *DocumentRepository) DeleteFolder(ctx context.Context, id uint) error {
	now := time.Now()
	// Soft delete folder
	return r.db.WithContext(ctx).Model(&domain.Folder{}).Where("id = ?", id).Update("deleted_at", &now).Error
}

func (r *DocumentRepository) ListFolders(ctx context.Context, ownerID uuid.UUID, parentID *uint) ([]*domain.Folder, error) {
	var folders []*domain.Folder
	query := r.db.WithContext(ctx).Where("owner_id = ? AND deleted_at IS NULL", ownerID)
	if parentID == nil {
		query = query.Where("parent_id IS NULL")
	} else {
		query = query.Where("parent_id = ?", *parentID)
	}
	err := query.Find(&folders).Error
	return folders, err
}

func (r *DocumentRepository) CreateVersion(ctx context.Context, version *domain.DocumentVersion) error {
	// First, create the file asset
	tx := r.db.WithContext(ctx).Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Create(&version.FileAsset).Error; err != nil {
		tx.Rollback()
		return err
	}

	version.FileAssetID = version.FileAsset.ID
	if err := tx.Create(version).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Update document's current version ID
	if err := tx.Model(&domain.Document{}).Where("id = ?", version.DocumentID).Update("current_version_id", version.ID).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Update physical asset with actual version ID
	if err := tx.Model(&domain.FileAsset{}).Where("id = ?", version.FileAsset.ID).Update("version_id", version.ID).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func (r *DocumentRepository) GetVersions(ctx context.Context, docID uint) ([]*domain.DocumentVersion, error) {
	var versions []*domain.DocumentVersion
	err := r.db.WithContext(ctx).
		Preload("FileAsset").
		Preload("Creator").
		Where("document_id = ?", docID).
		Order("version_number DESC").
		Find(&versions).Error
	return versions, err
}

func (r *DocumentRepository) AddPermission(ctx context.Context, perm *domain.DocumentPermission) error {
	return r.db.WithContext(ctx).Create(perm).Error
}

func (r *DocumentRepository) RemovePermission(ctx context.Context, permID uint) error {
	return r.db.WithContext(ctx).Delete(&domain.DocumentPermission{}, permID).Error
}

func (r *DocumentRepository) GetPermissions(ctx context.Context, docID uint) ([]*domain.DocumentPermission, error) {
	var perms []*domain.DocumentPermission
	err := r.db.WithContext(ctx).Where("document_id = ?", docID).Find(&perms).Error
	return perms, err
}

func (r *DocumentRepository) LogActivity(ctx context.Context, act *domain.DocumentActivity) error {
	return r.db.WithContext(ctx).Create(act).Error
}

func (r *DocumentRepository) GetActivities(ctx context.Context, docID uint) ([]*domain.DocumentActivity, error) {
	var acts []*domain.DocumentActivity
	err := r.db.WithContext(ctx).
		Preload("Actor").
		Where("document_id = ?", docID).
		Order("created_at DESC").
		Find(&acts).Error
	return acts, err
}

func (r *DocumentRepository) Attach(ctx context.Context, attach *domain.DocumentLMSAttachment) error {
	// Check if already attached
	var count int64
	err := r.db.WithContext(ctx).Model(&domain.DocumentLMSAttachment{}).
		Where("document_id = ? AND resource_type = ? AND resource_id = ?", attach.DocumentID, attach.ResourceType, attach.ResourceID).
		Count(&count).Error
	if err != nil {
		return err
	}
	if count > 0 {
		return nil // already attached
	}
	return r.db.WithContext(ctx).Create(attach).Error
}

func (r *DocumentRepository) Detach(ctx context.Context, docID uint, resType string, resID uint) error {
	return r.db.WithContext(ctx).
		Where("document_id = ? AND resource_type = ? AND resource_id = ?", docID, resType, resID).
		Delete(&domain.DocumentLMSAttachment{}).Error
}

func (r *DocumentRepository) GetAttachmentsForResource(ctx context.Context, resType string, resID uint) ([]*domain.Document, error) {
	var docs []*domain.Document
	err := r.db.WithContext(ctx).
		Model(&domain.Document{}).
		Preload("Owner").
		Preload("Folder").
		Preload("CurrentVersion.FileAsset").
		Joins("JOIN document_lms_attachments ON document_lms_attachments.document_id = documents.id").
		Where("document_lms_attachments.resource_type = ? AND document_lms_attachments.resource_id = ? AND documents.deleted_at IS NULL", resType, resID).
		Find(&docs).Error
	return docs, err
}

func (r *DocumentRepository) GetStats(ctx context.Context, ownerID *uuid.UUID) (*domain.DocumentStats, error) {
	var stats domain.DocumentStats
	stats.StatsByType = make(map[string]int64)

	baseDocQuery := r.db.WithContext(ctx).Model(&domain.Document{}).Where("deleted_at IS NULL")
	if ownerID != nil {
		baseDocQuery = baseDocQuery.Where("owner_id = ?", *ownerID)
	}

	err := baseDocQuery.Count(&stats.TotalDocuments).Error
	if err != nil {
		return nil, err
	}

	// Calculate total storage
	var totalStorage int64
	storageQuery := r.db.WithContext(ctx).Model(&domain.FileAsset{}).
		Joins("JOIN documents ON documents.id = file_assets.document_id").
		Where("documents.deleted_at IS NULL")
	if ownerID != nil {
		storageQuery = storageQuery.Where("documents.owner_id = ?", *ownerID)
	}
	err = storageQuery.Select("COALESCE(SUM(size), 0)").Row().Scan(&totalStorage)
	if err != nil {
		return nil, err
	}
	stats.TotalStorage = totalStorage

	// Calculate uploads this month
	var monthlyCount int64
	monthAgo := time.Now().AddDate(0, -1, 0)
	monthlyQuery := r.db.WithContext(ctx).Model(&domain.Document{}).
		Where("deleted_at IS NULL AND created_at >= ?", monthAgo)
	if ownerID != nil {
		monthlyQuery = monthlyQuery.Where("owner_id = ?", *ownerID)
	}
	err = monthlyQuery.Count(&monthlyCount).Error
	if err != nil {
		return nil, err
	}
	stats.UploadedMonth = monthlyCount

	// Calculate stats by mime category
	rows, err := r.db.WithContext(ctx).Model(&domain.FileAsset{}).
		Joins("JOIN documents ON documents.id = file_assets.document_id").
		Where("documents.deleted_at IS NULL").
		Select("mime_type, count(*)").
		Group("mime_type").Rows()
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var mime string
			var count int64
			if err := rows.Scan(&mime, &count); err == nil {
				stats.StatsByType[mime] = count
			}
		}
	}

	return &stats, nil
}

// Ensure the implementation matches repository.DocumentRepository interface
var _ repository.DocumentRepository = (*DocumentRepository)(nil)
