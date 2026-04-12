package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

// -----------------------------------------------------------------------------
// 3. LEARNING SYSTEM (Core Content)
// -----------------------------------------------------------------------------

type Course struct {
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	TenantID    uuid.UUID `gorm:"type:uuid;not null"`
	Title       string    `gorm:"type:varchar(255);not null"`
	Description *string   `gorm:"type:text"`
	BaseModel
}

type Unit struct {
	ID         uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CourseID   uuid.UUID `gorm:"type:uuid;not null"`
	TenantID   uuid.UUID `gorm:"type:uuid;not null"`
	Title      string    `gorm:"type:varchar(255);not null"`
	OrderIndex int       `gorm:"not null"`
}

type Lesson struct {
	ID          uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UnitID      uuid.UUID      `gorm:"type:uuid;not null"`
	TenantID    uuid.UUID      `gorm:"type:uuid;not null"`
	Title       string         `gorm:"type:varchar(255);not null"`
	ContentType string         `gorm:"type:varchar(50);not null"`
	Content     datatypes.JSON `gorm:"not null"`
	OrderIndex  int            `gorm:"not null"`
}

type UserProgress struct {
	ID          uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID      uuid.UUID  `gorm:"type:uuid;not null;index:idx_user_progress_tenant_user;uniqueIndex:idx_user_prog_unique"`
	TenantID    uuid.UUID  `gorm:"type:uuid;not null;index:idx_user_progress_tenant_user"`
	LessonID    uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_user_prog_unique"`
	Status      string     `gorm:"type:varchar(50);default:'in_progress'"`
	Score       *float64   `gorm:"type:decimal(5,2)"`
	CompletedAt *time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
