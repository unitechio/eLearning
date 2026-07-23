package domain

import (
	"time"

	"github.com/google/uuid"
)

// -----------------------------------------------------------------------------
// 3. LEARNING SYSTEM (Core Content)
// -----------------------------------------------------------------------------

type Course struct {
	UUIDModel
	TenantID     uuid.UUID  `json:"tenant_id" gorm:"type:uuid;not null;index"`
	CreatedBy    uuid.UUID  `json:"created_by" gorm:"type:uuid;not null;index"`
	Title        string     `json:"title" gorm:"type:varchar(255);not null"`
	Description  string     `json:"description" gorm:"type:text"`
	Domain       string     `json:"domain" gorm:"type:varchar(50);not null;index"`
	Level        string     `json:"level" gorm:"type:varchar(50);default:'beginner'"`
	Status       string     `json:"status" gorm:"type:varchar(50);default:'draft';index"`
	Visibility   string     `json:"visibility" gorm:"type:varchar(20);default:'private';index"`
	Price        float64    `json:"price" gorm:"type:decimal(10,2);default:0"`
	Currency     string     `json:"currency" gorm:"type:varchar(10);default:'USD'"`
	ThumbnailURL string     `json:"thumbnail_url" gorm:"type:varchar(1000)"`
	IsPublished  bool       `json:"is_published" gorm:"default:false"`
	PublishedAt  *time.Time `json:"published_at,omitempty"`
}

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
