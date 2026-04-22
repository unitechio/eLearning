package service

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type WritingExtrasService interface {
	GetWritingByID(userID uuid.UUID, id string) (map[string]any, error)
	EvaluateWriting(req dto.WritingEvaluationRequest) (map[string]any, error)
}

type SpeakingExtrasService interface {
	StartSession(userID uuid.UUID) (*dto.SpeakingSession, error)
	StopSession(userID uuid.UUID) (*dto.SpeakingSession, error)
	GetSession(userID uuid.UUID, id string) (*dto.SpeakingSession, error)
	CheckPronunciation(req dto.PronunciationRequest) (*dto.PronunciationResult, error)
}

type VocabularyExtrasService interface {
	UpdateWord(id string, req dto.UpdateWordRequest) (map[string]any, error)
	DeleteWord(id string) error
	ListVocabularyHistory(userID uuid.UUID, query dto.VocabularyHistoryQuery) (*dto.PageResult[dto.VocabularyHistoryItem], error)
}

type ListeningService interface {
	ListLessons(query dto.ListeningLessonListQuery) (*dto.PageResult[dto.ListeningLesson], error)
	GetLesson(id string) (*dto.ListeningLesson, error)
	SubmitLesson(id string, req dto.ListeningSubmissionRequest) (map[string]any, error)
}

type AIService interface {
	Chat(req dto.AIChatRequest) (map[string]any, error)
	EvaluateWriting(req dto.WritingEvaluationRequest) (map[string]any, error)
	EvaluateSpeaking(req dto.AIChatRequest) (map[string]any, error)
	GenerateQuestion(req dto.AIQuestionRequest) (map[string]any, error)
}
