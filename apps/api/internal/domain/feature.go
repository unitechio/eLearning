package domain

import (
	"time"

	"github.com/google/uuid"
)

type PracticeSession struct {
	UUIDModel
	UserID       uuid.UUID  `json:"user_id" gorm:"type:uuid;not null;index"`
	TenantID     uuid.UUID  `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Mode         string     `json:"mode" gorm:"type:varchar(50);not null;index"`
	SubMode      string     `json:"sub_mode" gorm:"type:varchar(50);index"`
	Status       string     `json:"status" gorm:"type:varchar(50);default:'started';index"`
	Prompt       string     `json:"prompt" gorm:"type:text"`
	ExpectedText string     `json:"expected_text" gorm:"type:text"`
	Answer       string     `json:"answer" gorm:"type:text"`
	Score        *float64   `json:"score,omitempty" gorm:"type:decimal(5,2)"`
	Feedback     string     `json:"feedback" gorm:"type:text"`
	StartedAt    time.Time  `json:"started_at" gorm:"autoCreateTime"`
	SubmittedAt  *time.Time `json:"submitted_at,omitempty"`
}

type PronunciationHistory struct {
	UUIDModel
	UserID     uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	TenantID   uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Kind       string    `json:"kind" gorm:"type:varchar(20);not null;index"`
	SourceText string    `json:"source_text" gorm:"type:text;not null"`
	Accuracy   float64   `json:"accuracy" gorm:"type:decimal(5,2)"`
	Feedback   string    `json:"feedback" gorm:"type:text"`
}

type DictionaryHistory struct {
	UUIDModel
	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	TenantID    uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Word        string    `json:"word" gorm:"type:varchar(100);not null;index"`
	Meaning     string    `json:"meaning" gorm:"type:text;not null"`
	IPA         string    `json:"ipa" gorm:"type:varchar(100)"`
	AudioURL    string    `json:"audio_url" gorm:"type:text"`
	WordType    string    `json:"word_type" gorm:"type:varchar(50)"`
	Collocation string    `json:"collocation" gorm:"type:text"`
	Example     string    `json:"example" gorm:"type:text"`
	Saved       bool      `json:"saved" gorm:"default:false;index"`
}

type VocabularySet struct {
	UUIDModel
	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	TenantID    uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Name        string    `json:"name" gorm:"type:varchar(150);not null"`
	Description string    `json:"description" gorm:"type:text"`
	Domain      string    `json:"domain" gorm:"type:varchar(50);default:'english';index"`
}

type VocabularySetWord struct {
	UUIDModel
	SetID  uuid.UUID `json:"set_id" gorm:"type:uuid;not null;index"`
	WordID uuid.UUID `json:"word_id" gorm:"type:uuid;not null;index"`
}
