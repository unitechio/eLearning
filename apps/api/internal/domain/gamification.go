package domain

import (
	"time"

	"github.com/google/uuid"
)

// -----------------------------------------------------------------------------
// 6. GAMIFICATION
// -----------------------------------------------------------------------------

type Streak struct {
	ID               uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID           uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex"`
	TenantID         uuid.UUID  `gorm:"type:uuid;not null"`
	CurrentStreak    int        `gorm:"default:0"`
	LongestStreak    int        `gorm:"default:0"`
	LastActivityDate *time.Time `gorm:"type:date"`
	UpdatedAt        time.Time
}

type XPPoint struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CreatedAt time.Time `gorm:"primaryKey;default:CURRENT_TIMESTAMP"`
	UserID    uuid.UUID `gorm:"type:uuid;not null"`
	TenantID  uuid.UUID `gorm:"type:uuid;not null"`
	Amount    int       `gorm:"not null"`
	Reason    string    `gorm:"type:varchar(255);not null"`
}
