package domain

import (
	"time"

	"github.com/google/uuid"
)

// Document status constants
const (
	DocStatusActive     = "active"
	DocStatusProcessing = "processing"
	DocStatusFailed     = "failed"
	DocStatusArchived   = "archived"
	DocStatusDeleted    = "deleted"
)

// Visibility constants
const (
	VisibilityPublic  = "public"
	VisibilityPrivate = "private"
)

// Permission level constants
const (
	PermViewer = "viewer"
	PermEditor = "editor"
	PermOwner  = "owner"
)

// AllowedDocumentMIMEs is the canonical set of MIME types accepted for document uploads.
// Keep in sync with storage.IsAllowedFileType.
var AllowedDocumentMIMEs = map[string]bool{
	// Office documents
	"application/pdf":    true,
	"application/msword": true,
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
	"application/vnd.ms-excel": true,
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":         true,
	"application/vnd.ms-powerpoint":                                             true,
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": true,
	"application/vnd.oasis.opendocument.text":                                   true,
	"application/vnd.oasis.opendocument.spreadsheet":                            true,
	"application/vnd.oasis.opendocument.presentation":                           true,
	// Plain text / code
	"text/plain":       true,
	"text/csv":         true,
	"text/markdown":    true,
	"text/html":        true,
	"application/json": true,
	"application/xml":  true,
	// Images
	"image/jpeg":    true,
	"image/png":     true,
	"image/gif":     true,
	"image/webp":    true,
	"image/svg+xml": true,
	// Archives
	"application/zip":              true,
	"application/x-rar-compressed": true,
	"application/gzip":             true,
	// Audio / Video
	"audio/mpeg": true,
	"audio/wav":  true,
	"video/mp4":  true,
	"video/webm": true,
}

// AllowedDocumentExtensions mirrors AllowedDocumentMIMEs but keyed by lowercase extension (including dot).
// This is what IsAllowedFileType uses for fast lookup.
var AllowedDocumentExtensions = map[string]bool{
	// Documents
	".pdf":  true,
	".doc":  true,
	".docx": true,
	".txt":  true,
	".rtf":  true,
	".odt":  true,
	// Spreadsheets
	".xls":  true,
	".xlsx": true,
	".csv":  true,
	".ods":  true,
	// Presentations
	".ppt":  true,
	".pptx": true,
	".odp":  true,
	// Text / code
	".md":   true,
	".json": true,
	".xml":  true,
	".log":  true,
	".yaml": true,
	".yml":  true,
	".html": true,
	".htm":  true,
	// Images
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".gif":  true,
	".webp": true,
	".svg":  true,
	// Archives
	".zip": true,
	".rar": true,
	".gz":  true,
	".tar": true,
	// Audio / Video
	".mp3":  true,
	".mp4":  true,
	".wav":  true,
	".webm": true,
}

// Folder represents a logical directory structure
type Folder struct {
	ID        uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string     `json:"name" gorm:"size:255;not null"`
	ParentID  *uint      `json:"parent_id" gorm:"index"`
	OwnerID   uuid.UUID  `json:"owner_id" gorm:"type:uuid;not null;index"`
	CreatedAt time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt *time.Time `json:"deleted_at" gorm:"index"`

	Parent   *Folder  `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Children []Folder `json:"children,omitempty" gorm:"foreignKey:ParentID"`
	Owner    *User    `json:"owner,omitempty" gorm:"foreignKey:OwnerID;references:ID"`
}

// Document represents a logical resource
type Document struct {
	ID               uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	DocumentCode     string     `json:"document_code" gorm:"size:50;not null;uniqueIndex"`
	Title            string     `json:"title" gorm:"size:255;not null"`
	Description      string     `json:"description" gorm:"type:text"`
	OwnerID          uuid.UUID  `json:"owner_id" gorm:"type:uuid;not null;index"`
	FolderID         *uint      `json:"folder_id" gorm:"index"`
	Status           string     `json:"status" gorm:"size:50;not null;default:'active';index"`
	Visibility       string     `json:"visibility" gorm:"size:50;not null;default:'private'"`
	CurrentVersionID *uint      `json:"current_version_id" gorm:"index"`
	IsFavorite       bool       `json:"is_favorite" gorm:"default:false;index"`
	CreatedAt        time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt        time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt        *time.Time `json:"deleted_at" gorm:"index"`

	// Associations are ignored only during AutoMigrate to keep table creation
	// ordered by the explicit migration passes. Runtime preloads still use them.
	Owner          *User                `json:"owner,omitempty" gorm:"foreignKey:OwnerID;references:ID;constraint:false;-:migration"`
	Folder         *Folder              `json:"folder,omitempty" gorm:"foreignKey:FolderID;constraint:false;-:migration"`
	CurrentVersion *DocumentVersion     `json:"current_version,omitempty" gorm:"foreignKey:CurrentVersionID;constraint:false;-:migration"`
	Versions       []DocumentVersion    `json:"versions,omitempty" gorm:"foreignKey:DocumentID;constraint:false;-:migration"`
	Permissions    []DocumentPermission `json:"permissions,omitempty" gorm:"foreignKey:DocumentID;constraint:false;-:migration"`
	Activities     []DocumentActivity   `json:"activities,omitempty" gorm:"foreignKey:DocumentID;constraint:false;-:migration"`
}

// FileAsset represents a physical binary object
type FileAsset struct {
	ID           uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	DocumentID   uint      `json:"document_id" gorm:"not null;index"`
	VersionID    *uint     `json:"version_id,omitempty" gorm:"index"`
	StorageKey   string    `json:"storage_key" gorm:"size:500;not null"`
	OriginalName string    `json:"original_name" gorm:"size:255;not null"`
	MimeType     string    `json:"mime_type" gorm:"size:100;not null;index"`
	Extension    string    `json:"extension" gorm:"size:50;not null;index"`
	Size         int64     `json:"size" gorm:"not null"`
	Checksum     string    `json:"checksum" gorm:"size:100"`
	Width        int       `json:"width"`
	Height       int       `json:"height"`
	Duration     float64   `json:"duration"`
	PageCount    int       `json:"page_count"`
	ThumbnailKey string    `json:"thumbnail_key" gorm:"size:500"`
	PreviewKey   string    `json:"preview_key" gorm:"size:500"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`
}

// DocumentVersion tracks document revisions
type DocumentVersion struct {
	ID            uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	DocumentID    uint      `json:"document_id" gorm:"not null;index"`
	FileAssetID   uint      `json:"file_asset_id" gorm:"not null;index"`
	VersionNumber int       `json:"version_number" gorm:"not null"`
	CreatedBy     uuid.UUID `json:"created_by" gorm:"type:uuid;not null;index"`
	ChangeSummary string    `json:"change_summary" gorm:"type:text"`
	CreatedAt     time.Time `json:"created_at" gorm:"autoCreateTime"`

	// Associations are ignored only during AutoMigrate to avoid circular FK ordering.
	FileAsset FileAsset `json:"file_asset" gorm:"foreignKey:FileAssetID;constraint:false;-:migration"`
	Creator   *User     `json:"creator,omitempty" gorm:"foreignKey:CreatedBy;references:ID;constraint:false;-:migration"`
}

// DocumentPermission defines access control for documents
type DocumentPermission struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	DocumentID  uint      `json:"document_id" gorm:"not null;index"`
	SubjectType string    `json:"subject_type" gorm:"size:50;not null"`      // "user", "role"
	SubjectID   string    `json:"subject_id" gorm:"size:255;not null;index"` // User UUID or Role Name
	Permission  string    `json:"permission" gorm:"size:50;not null"`        // viewer, editor, owner
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UserEmail   string    `json:"user_email,omitempty" gorm:"-"`
}

// DocumentActivity tracks important events
type DocumentActivity struct {
	ID         uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	DocumentID uint      `json:"document_id" gorm:"not null;index"`
	ActorID    uuid.UUID `json:"actor_id" gorm:"type:uuid;not null;index"`
	Action     string    `json:"action" gorm:"size:100;not null"` // created, uploaded, viewed, deleted, etc.
	Metadata   string    `json:"metadata" gorm:"type:text"`       // JSON details
	CreatedAt  time.Time `json:"created_at" gorm:"autoCreateTime"`

	Actor *User `json:"actor,omitempty" gorm:"foreignKey:ActorID;references:ID;constraint:false;-:migration"`
}

// DocumentLMSAttachment links documents to LMS entities
type DocumentLMSAttachment struct {
	ID           uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	DocumentID   uint      `json:"document_id" gorm:"not null;index"`
	ResourceType string    `json:"resource_type" gorm:"size:50;not null;index"` // "course", "lesson", "assignment"
	ResourceID   uint      `json:"resource_id" gorm:"not null;index"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`

	Document *Document `json:"document,omitempty" gorm:"foreignKey:DocumentID;constraint:false;-:migration"`
}

// DocumentComment allows users to add comments to documents
type DocumentComment struct {
	ID         uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	DocumentID uint       `json:"document_id" gorm:"not null;index"`
	UserID     uuid.UUID  `json:"user_id" gorm:"type:uuid;not null;index"`
	Comment    string     `json:"comment" gorm:"type:text;not null"`
	CreatedAt  time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt  *time.Time `json:"deleted_at" gorm:"index"`

	Document *Document `json:"-" gorm:"foreignKey:DocumentID;constraint:false;-:migration"`
	User     *User     `json:"user,omitempty" gorm:"foreignKey:UserID;constraint:false;-:migration"`
}

// DocumentFilter for pagination and search
type DocumentFilter struct {
	OwnerID    *uuid.UUID `json:"owner_id"`
	FolderID   *uint      `json:"folder_id"`
	FolderNull bool       `json:"folder_null"`
	Status     string     `json:"status"`
	Visibility string     `json:"visibility"`
	MimeType   string     `json:"mime_type"`
	Search     string     `json:"search"`
	IsFavorite *bool      `json:"is_favorite"`
	Limit      int        `json:"limit"`
	Offset     int        `json:"offset"`
	SortBy     string     `json:"sort_by"`
	StartDate  *time.Time `json:"start_date"`
	EndDate    *time.Time `json:"end_date"`
}

// DocumentStats holds statistics
type DocumentStats struct {
	TotalDocuments int64            `json:"total_documents"`
	TotalStorage   int64            `json:"total_storage"`
	UploadedMonth  int64            `json:"uploaded_month"`
	StatsByType    map[string]int64 `json:"stats_by_type"` // e.g. "pdf" -> count
}
