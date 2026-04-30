package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type WritingExtrasService interface {
	GetWritingByID(ctx context.Context, userID uuid.UUID, id string) (map[string]any, error)
	EvaluateWriting(ctx context.Context, req dto.WritingEvaluationRequest) (map[string]any, error)
}

type SpeakingExtrasService interface {
	StartSession(ctx context.Context, userID uuid.UUID) (*dto.SpeakingSession, error)
	StopSession(ctx context.Context, userID uuid.UUID) (*dto.SpeakingSession, error)
	GetSession(ctx context.Context, userID uuid.UUID, id string) (*dto.SpeakingSession, error)
	CheckPronunciation(ctx context.Context, req dto.PronunciationRequest) (*dto.PronunciationResult, error)
}

type VocabularyExtrasService interface {
	UpdateWord(ctx context.Context, id string, req dto.UpdateWordRequest) (map[string]any, error)
	DeleteWord(ctx context.Context, id string) error
	ListVocabularyHistory(ctx context.Context, userID uuid.UUID, query dto.VocabularyHistoryQuery) (*dto.PageResult[dto.VocabularyHistoryItem], error)
}

type ListeningService interface {
	ListLessons(ctx context.Context, query dto.ListeningLessonListQuery) (*dto.PageResult[dto.ListeningLesson], error)
	GetLesson(ctx context.Context, id string) (*dto.ListeningLesson, error)
	SubmitLesson(ctx context.Context, id string, req dto.ListeningSubmissionRequest) (map[string]any, error)
}

type AIService interface {
	Chat(ctx context.Context, req dto.AIChatRequest) (map[string]any, error)
	EvaluateWriting(ctx context.Context, req dto.WritingEvaluationRequest) (map[string]any, error)
	EvaluateSpeaking(ctx context.Context, req dto.AIChatRequest) (map[string]any, error)
	GenerateQuestion(ctx context.Context, req dto.AIQuestionRequest) (map[string]any, error)
}
