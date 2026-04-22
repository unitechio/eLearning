package model

import (
	"time"

	"github.com/google/uuid"
)

// -----------------------------------------------------------------------------
// 4. VOCABULARY SYSTEM (Spaced Repetition)
// -----------------------------------------------------------------------------

type VocabularyWord struct {
	ID           uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	TenantID     uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null"`
	Word         string    `json:"word" gorm:"type:varchar(100);not null"`
	PartOfSpeech *string   `json:"part_of_speech,omitempty" gorm:"type:varchar(50)"`
	Definition   string    `json:"definition" gorm:"type:text;not null"`
	Phonetic     *string   `json:"phonetic,omitempty" gorm:"type:varchar(100)"`
	Level        *string   `json:"level,omitempty" gorm:"type:varchar(20)"`
	Example      *string   `json:"example,omitempty" gorm:"type:text"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type UserVocabularyProgress struct {
	ID                 uuid.UUID      `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID             uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;index:idx_vocabulary_progress_tenant_user_date;uniqueIndex:idx_user_vocab_unique"`
	TenantID           uuid.UUID      `json:"tenant_id" gorm:"type:uuid;not null;index:idx_vocabulary_progress_tenant_user_date"`
	WordID             uuid.UUID      `json:"word_id" gorm:"type:uuid;not null;uniqueIndex:idx_user_vocab_unique"`
	Word               VocabularyWord `json:"word" gorm:"foreignKey:WordID;references:ID"`
	BoxNumber          int            `json:"box_number" gorm:"default:1"`
	NextReviewDate     time.Time      `json:"next_review_date" gorm:"not null;default:CURRENT_TIMESTAMP;index:idx_vocabulary_progress_tenant_user_date"`
	LastReviewDate     *time.Time     `json:"last_review_date,omitempty"`
	ConsecutiveCorrect int            `json:"consecutive_correct" gorm:"default:0"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
}
