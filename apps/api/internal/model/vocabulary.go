package model

import (
	"time"

	"github.com/google/uuid"
)

// -----------------------------------------------------------------------------
// 4. VOCABULARY SYSTEM (Spaced Repetition)
// -----------------------------------------------------------------------------

type VocabularyWord struct {
	ID           uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	TenantID     uuid.UUID `gorm:"type:uuid;not null"`
	Word         string    `gorm:"type:varchar(100);not null"`
	PartOfSpeech *string   `gorm:"type:varchar(50)"`
	Definition   string    `gorm:"type:text;not null"`
	Phonetic     *string   `gorm:"type:varchar(100)"`
	Level        *string   `gorm:"type:varchar(20)"`
}

type UserVocabularyProgress struct {
	ID                 uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID             uuid.UUID  `gorm:"type:uuid;not null;index:idx_vocabulary_progress_tenant_user_date;uniqueIndex:idx_user_vocab_unique"`
	TenantID           uuid.UUID  `gorm:"type:uuid;not null;index:idx_vocabulary_progress_tenant_user_date"`
	WordID             uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_user_vocab_unique"`
	BoxNumber          int        `gorm:"default:1"`
	NextReviewDate     time.Time  `gorm:"not null;default:CURRENT_TIMESTAMP;index:idx_vocabulary_progress_tenant_user_date"`
	LastReviewDate     *time.Time
	ConsecutiveCorrect int        `gorm:"default:0"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
}
