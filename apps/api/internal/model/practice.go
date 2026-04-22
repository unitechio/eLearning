package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// -----------------------------------------------------------------------------
// 5. PRACTICE SYSTEM & AI FEEDBACK
// -----------------------------------------------------------------------------

type SpeakingAttempt struct {
	ID              uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CreatedAt       time.Time  `gorm:"primaryKey;default:CURRENT_TIMESTAMP"`
	TenantID        uuid.UUID  `gorm:"type:uuid;not null;index:idx_speaking_attempts_user_time"`
	UserID          uuid.UUID  `gorm:"type:uuid;not null;index:idx_speaking_attempts_user_time"`
	LessonID        *uuid.UUID `gorm:"type:uuid"`
	PromptText      *string    `gorm:"type:text"`
	AudioURL        string     `gorm:"type:text;not null"`
	Transcript      *string    `gorm:"type:text"`
	DurationSeconds *int
	AIScore         *float64       `gorm:"type:decimal(3,1)"`
	AIFeedback      datatypes.JSON `gorm:"index:idx_speaking_attempts_ai_feedback,type:gin"`
	DeletedAt       gorm.DeletedAt `gorm:"index"`
}
