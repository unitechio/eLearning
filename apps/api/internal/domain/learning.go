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
	TenantID    uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Title       string    `json:"title" gorm:"type:varchar(255);not null"`
	Description string    `json:"description" gorm:"type:text"`
	Domain      string    `json:"domain" gorm:"type:varchar(50);not null;index"`
	Level       string    `json:"level" gorm:"type:varchar(50);default:'beginner'"`
	Status      string    `json:"status" gorm:"type:varchar(50);default:'draft';index"`
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
