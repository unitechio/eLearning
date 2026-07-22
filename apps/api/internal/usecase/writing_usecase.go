package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

// SubmitRequest is the payload for submitting a writing response.
type SubmitRequest struct {
	PromptText string `json:"prompt" binding:"required"`
	Response   string `json:"response" binding:"required,min=50"`
	// TaskType: "task1" (graph/chart) or "task2" (essay). Defaults to "task2".
	TaskType string `json:"task_type"`
}

// ReviewWritingRequest is the teacher's review payload for a writing submission.
type ReviewWritingRequest struct {
	// TeacherAudioURL URL to teacher's audio feedback recording
	TeacherAudioURL string `json:"teacher_audio_url"`
	// ReviewNote general review comment from the teacher
	ReviewNote string `json:"review_note"`
	// ScoreOverride optional manual band score override (overrides AI score)
	ScoreOverride *float64 `json:"score_override,omitempty"`
	// AnnotatedText JSON array of annotation objects (highlighting errors/suggestions)
	AnnotatedText string `json:"annotated_text,omitempty"`
	// CriteriaScores JSON with TA, CC, LR, GRA band scores
	CriteriaScores string `json:"criteria_scores,omitempty"`
}

// HistoryResponse wraps paginated writing submission list.
type HistoryResponse struct {
	Items []domain.WritingSubmission `json:"items"`
	Meta  response.Meta              `json:"meta"`
}

// WritingService defines operations for the writing skill module.
type WritingService interface {
	// Student-facing operations
	Submit(ctx context.Context, userID uuid.UUID, req SubmitRequest) (*domain.WritingSubmission, error)
	GetHistory(ctx context.Context, userID uuid.UUID, page, pageSize int) (*HistoryResponse, error)
	GetSubmissionByID(ctx context.Context, userID, submissionID uuid.UUID) (*domain.WritingSubmission, error)

	// Admin/teacher-facing operations
	AdminListSubmissions(ctx context.Context, page, pageSize int) (*HistoryResponse, error)
	AdminGetSubmissionByID(ctx context.Context, submissionID uuid.UUID) (*domain.WritingSubmission, error)
	AdminReviewSubmission(ctx context.Context, reviewerID, submissionID uuid.UUID, req ReviewWritingRequest) (*domain.WritingSubmission, error)
}
