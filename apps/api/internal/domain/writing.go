package domain

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/pkg/compress"
)

type WritingSubmission struct {
	UUIDModel
	UserID          uuid.UUID               `json:"user_id" gorm:"type:uuid;not null;index"`
	PromptText      string                  `json:"prompt" gorm:"type:text"`
	Response        string                  `json:"response" gorm:"type:text;not null"`
	WordCount       int                     `json:"word_count"`
	AIScore         float64                 `json:"ai_score"`
	AIFeedback      string                  `json:"ai_feedback" gorm:"type:text"`
	TeacherAudioURL string                  `json:"teacher_audio_url" gorm:"type:text"`
	AnnotatedText   compress.CompressedText `json:"annotated_text" gorm:"type:bytea"`   // JSON array of annotations (compressed)
	CriteriaScores  compress.CompressedText `json:"criteria_scores" gorm:"type:bytea"` // JSON representation of radar chart metrics (compressed)
	IsGraded        bool                    `json:"is_graded" gorm:"default:false;index"`
}
