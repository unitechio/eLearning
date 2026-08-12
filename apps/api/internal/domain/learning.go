package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

// -----------------------------------------------------------------------------
// 3. LEARNING SYSTEM (Core Content)
// -----------------------------------------------------------------------------

type Course struct {
	UUIDModel
	TenantID        uuid.UUID      `json:"tenant_id" gorm:"type:uuid;not null;index"`
	CreatedBy       uuid.UUID      `json:"created_by" gorm:"type:uuid;not null;index"`
	Title           string         `json:"title" gorm:"type:varchar(255);not null"`
	Subtitle        string         `json:"subtitle" gorm:"type:varchar(500)"`
	Description     string         `json:"description" gorm:"type:text"`
	Domain          string         `json:"domain" gorm:"type:varchar(50);not null;index"`
	Level           string         `json:"level" gorm:"type:varchar(50);default:'beginner'"`
	Status          string         `json:"status" gorm:"type:varchar(50);default:'draft';index"`
	Visibility      string         `json:"visibility" gorm:"type:varchar(20);default:'private';index"`
	Price           float64        `json:"price" gorm:"type:decimal(10,2);default:0"`
	OriginalPrice   float64        `json:"original_price" gorm:"type:decimal(10,2);default:0"`
	Currency        string         `json:"currency" gorm:"type:varchar(10);default:'USD'"`
	ThumbnailURL    string         `json:"thumbnail_url" gorm:"type:varchar(1000)"`
	IsPublished     bool           `json:"is_published" gorm:"default:false"`
	PublishedAt     *time.Time     `json:"published_at,omitempty"`
	InstructorID    *uuid.UUID     `json:"instructor_id" gorm:"type:uuid;index"`
	CategoryID      *uuid.UUID     `json:"category_id" gorm:"type:uuid;index"`
	VideoPreviewURL string         `json:"video_preview_url" gorm:"type:varchar(1000)"`
	WhatYouLearn    datatypes.JSON `json:"what_you_learn" gorm:"type:jsonb;default:'[]'"`
	ToolsUsed       string         `json:"tools_used" gorm:"type:text"`
	HasCertificate  bool           `json:"has_certificate" gorm:"default:false"`
	Rating          float64        `json:"rating" gorm:"type:decimal(3,2);default:0"`
	ReviewCount     int            `json:"review_count" gorm:"default:0"`
	EnrollmentCount int            `json:"enrollment_count" gorm:"default:0"`

	// Associations with constraint:false for safe migrations
	Category *CourseCategory  `json:"category,omitempty" gorm:"foreignKey:CategoryID;constraint:false;-:migration"`
	Units    []Unit           `json:"units,omitempty" gorm:"foreignKey:CourseID;constraint:false;-:migration"`
	Resources []CourseResource `json:"resources,omitempty" gorm:"foreignKey:CourseID;constraint:false;-:migration"`
	Reviews   []CourseReview   `json:"reviews,omitempty" gorm:"foreignKey:CourseID;constraint:false;-:migration"`
}

type CourseCategory struct {
	UUIDModel
	TenantID uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Name     string    `json:"name" gorm:"type:varchar(100);not null"`
	Slug     string    `json:"slug" gorm:"type:varchar(100);not null;index"`
	Color    string    `json:"color" gorm:"type:varchar(20);default:'#3B82F6'"`
}

func (CourseCategory) TableName() string { return "course_categories" }

type CourseResource struct {
	UUIDModel
	CourseID    uuid.UUID `json:"course_id" gorm:"type:uuid;not null;index"`
	Name        string    `json:"name" gorm:"type:varchar(255);not null"`
	StorageKey  string    `json:"storage_key" gorm:"type:varchar(500);not null"`
	MimeType    string    `json:"mime_type" gorm:"type:varchar(100)"`
	SizeBytes   int64     `json:"size_bytes" gorm:"type:bigint"`
	UploadedBy  uuid.UUID `json:"uploaded_by" gorm:"type:uuid;not null"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
}

func (CourseResource) TableName() string { return "course_resources" }

type CourseReview struct {
	UUIDModel
	CourseID  uuid.UUID `json:"course_id" gorm:"type:uuid;not null;index"`
	UserID    uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	Rating    int       `json:"rating" gorm:"type:integer;not null;default:5"`
	Comment   string    `json:"comment" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`

	User *User `json:"user,omitempty" gorm:"foreignKey:UserID;constraint:false;-:migration"`
}

func (CourseReview) TableName() string { return "course_reviews" }

type Unit struct {
	UUIDModel
	CourseID   uuid.UUID `json:"course_id" gorm:"type:uuid;not null;index"`
	TenantID   uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Title      string    `json:"title" gorm:"type:varchar(255);not null"`
	OrderIndex int       `json:"order_index" gorm:"not null"`
}

type Lesson struct {
	UUIDModel
	UnitID      uuid.UUID `json:"unit_id" gorm:"type:uuid;not null;index"`
	TenantID    uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Title       string    `json:"title" gorm:"type:varchar(255);not null"`
	ContentType string    `json:"content_type" gorm:"type:varchar(50);not null;default:'markdown'"`
	Content     string    `json:"content" gorm:"type:text;not null"`
	OrderIndex  int       `json:"order_index" gorm:"not null"`
}

type UserProgress struct {
	UUIDModel
	UserID      uuid.UUID  `json:"user_id" gorm:"type:uuid;not null;index:idx_user_progress_tenant_user;uniqueIndex:idx_user_prog_unique"`
	TenantID    uuid.UUID  `json:"tenant_id" gorm:"type:uuid;not null;index:idx_user_progress_tenant_user"`
	LessonID    uuid.UUID  `json:"lesson_id" gorm:"type:uuid;not null;uniqueIndex:idx_user_prog_unique"`
	Status      string     `json:"status" gorm:"type:varchar(50);default:'in_progress'"`
	Score       *float64   `json:"score,omitempty" gorm:"type:decimal(5,2)"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
}

type Voucher struct {
	UUIDModel
	Code      string    `json:"code" gorm:"type:varchar(50);not null;uniqueIndex"`
	Discount  float64   `json:"discount" gorm:"type:decimal(10,2);not null"`
	Type      string    `json:"type" gorm:"type:varchar(20);default:'fixed'"` // fixed or percent
	ExpiresAt time.Time `json:"expires_at" gorm:"not null"`
	IsActive  bool      `json:"is_active" gorm:"default:true;index"`
}
