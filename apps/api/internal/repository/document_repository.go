package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type DocumentRepository interface {
	Create(ctx context.Context, doc *domain.Document) error
	Update(ctx context.Context, doc *domain.Document) error
	GetByID(ctx context.Context, id uint) (*domain.Document, error)
	Delete(ctx context.Context, id uint) error
	PermanentDelete(ctx context.Context, id uint) error
	Restore(ctx context.Context, id uint) error
	List(ctx context.Context, filter domain.DocumentFilter) ([]*domain.Document, int64, error)
	
	// Folders
	CreateFolder(ctx context.Context, folder *domain.Folder) error
	UpdateFolder(ctx context.Context, folder *domain.Folder) error
	GetFolderByID(ctx context.Context, id uint) (*domain.Folder, error)
	DeleteFolder(ctx context.Context, id uint) error
	ListFolders(ctx context.Context, ownerID uuid.UUID, parentID *uint) ([]*domain.Folder, error)

	// Versions
	CreateVersion(ctx context.Context, version *domain.DocumentVersion) error
	GetVersions(ctx context.Context, docID uint) ([]*domain.DocumentVersion, error)

	// Permissions
	AddPermission(ctx context.Context, perm *domain.DocumentPermission) error
	RemovePermission(ctx context.Context, permID uint) error
	GetPermissions(ctx context.Context, docID uint) ([]*domain.DocumentPermission, error)

	// Activities
	LogActivity(ctx context.Context, act *domain.DocumentActivity) error
	GetActivities(ctx context.Context, docID uint) ([]*domain.DocumentActivity, error)

	// LMS Attachments
	Attach(ctx context.Context, attach *domain.DocumentLMSAttachment) error
	Detach(ctx context.Context, docID uint, resType string, resID uint) error
	GetAttachmentsForResource(ctx context.Context, resType string, resID uint) ([]*domain.Document, error)

	// Stats
	GetStats(ctx context.Context, ownerID *uuid.UUID) (*domain.DocumentStats, error)
}
