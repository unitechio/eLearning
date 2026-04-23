package domain

import "github.com/google/uuid"

type WritingSubmission struct {
	UUIDModel
	UserID     uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	PromptText string    `json:"prompt" gorm:"type:text"`
	Response   string    `json:"response" gorm:"type:text;not null"`
	WordCount  int       `json:"word_count"`
	AIScore    float64   `json:"ai_score"`
	AIFeedback string    `json:"ai_feedback" gorm:"type:text"`
}
