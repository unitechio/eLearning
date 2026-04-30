package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type ReviewRequest struct {
	WordID  uuid.UUID `json:"word_id" binding:"required"`
	Correct bool      `json:"correct"`
}

type CreateWordRequest struct {
	Word         string  `json:"word" binding:"required,min=1,max=100"`
	Definition   string  `json:"definition" binding:"required"`
	PartOfSpeech *string `json:"part_of_speech,omitempty"`
	Phonetic     *string `json:"phonetic,omitempty"`
	Level        *string `json:"level,omitempty"`
	Example      *string `json:"example,omitempty"`
}

type VocabularyService interface {
	GetDueWords(ctx context.Context, userID uuid.UUID) ([]domain.UserVocabularyProgress, error)
	SubmitReview(ctx context.Context, userID uuid.UUID, req ReviewRequest) (*domain.UserVocabularyProgress, error)
	GetAllWords(ctx context.Context) ([]domain.VocabularyWord, error)
	GetWordByID(ctx context.Context, id uuid.UUID) (*domain.VocabularyWord, error)
	CreateWord(ctx context.Context, tenantID uuid.UUID, req CreateWordRequest) (*domain.VocabularyWord, error)
}
