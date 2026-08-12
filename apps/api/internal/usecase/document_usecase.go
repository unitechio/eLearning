package usecase

import (
	"context"
	"io"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type DocumentUsecase interface {
	CreateDocument(ctx context.Context, title, description string, folderID *uint, visibility string, ownerID uuid.UUID, filename string, reader io.Reader, size int64, mimeType string) (*domain.Document, error)
	UpdateDocument(ctx context.Context, id uint, title, description string, folderID *uint, visibility string, isFavorite bool, userID uuid.UUID) (*domain.Document, error)
	GetDocumentByID(ctx context.Context, id uint, userID uuid.UUID) (*domain.Document, error)
	DeleteDocument(ctx context.Context, id uint, userID uuid.UUID) error
	RestoreDocument(ctx context.Context, id uint, userID uuid.UUID) error
	PermanentDeleteDocument(ctx context.Context, id uint, userID uuid.UUID) error
	ListDocuments(ctx context.Context, filter domain.DocumentFilter, userID uuid.UUID) ([]*domain.Document, int64, error)
	
	// Folders
	CreateFolder(ctx context.Context, name string, parentID *uint, ownerID uuid.UUID) (*domain.Folder, error)
	UpdateFolder(ctx context.Context, id uint, name string, parentID *uint, userID uuid.UUID) (*domain.Folder, error)
	GetFolderByID(ctx context.Context, id uint, userID uuid.UUID) (*domain.Folder, error)
	DeleteFolder(ctx context.Context, id uint, userID uuid.UUID) error
	ListFolders(ctx context.Context, ownerID uuid.UUID, parentID *uint) ([]*domain.Folder, error)

	// Versions
	CreateVersion(ctx context.Context, docID uint, changeSummary string, createdBy uuid.UUID, filename string, reader io.Reader, size int64, mimeType string) (*domain.DocumentVersion, error)
	GetVersions(ctx context.Context, docID uint, userID uuid.UUID) ([]*domain.DocumentVersion, error)

	// Sharing
	ShareDocument(ctx context.Context, docID uint, subjectType, subjectID, permission string, userID uuid.UUID) (*domain.DocumentPermission, error)
	RevokeAccess(ctx context.Context, docID, permID uint, userID uuid.UUID) error
	GetPermissions(ctx context.Context, docID uint, userID uuid.UUID) ([]*domain.DocumentPermission, error)

	// Activities
	GetActivities(ctx context.Context, docID uint, userID uuid.UUID) ([]*domain.DocumentActivity, error)

	// LMS Attachments
	AttachToResource(ctx context.Context, docID uint, resType string, resID uint, userID uuid.UUID) error
	DetachFromResource(ctx context.Context, docID uint, resType string, resID uint, userID uuid.UUID) error
	GetAttachmentsForResource(ctx context.Context, resType string, resID uint, userID uuid.UUID) ([]*domain.Document, error)

	// Stats & Presigned URLs
	GetStats(ctx context.Context, ownerID *uuid.UUID, userID uuid.UUID) (*domain.DocumentStats, error)
	GetDownloadURL(ctx context.Context, docID uint, userID uuid.UUID) (string, error)
	GetPreviewURL(ctx context.Context, docID uint, userID uuid.UUID) (string, error)
}
