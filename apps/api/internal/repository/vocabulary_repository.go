package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type VocabularyRepository interface {
	FindDueProgressByUser(ctx context.Context, userID uuid.UUID, limit int) ([]domain.UserVocabularyProgress, error)
	FindProgressByUserAndWord(ctx context.Context, userID, wordID uuid.UUID) (*domain.UserVocabularyProgress, error)
	ListWords(ctx context.Context) ([]domain.VocabularyWord, error)
	FindWordByID(ctx context.Context, id uuid.UUID) (*domain.VocabularyWord, error)
	CreateWord(ctx context.Context, word *domain.VocabularyWord) error
	UpdateWord(ctx context.Context, word *domain.VocabularyWord) error
	DeleteWord(ctx context.Context, id uuid.UUID) error
	ListProgressHistoryByUser(ctx context.Context, userID uuid.UUID, limit int) ([]domain.UserVocabularyProgress, error)
	SaveProgress(ctx context.Context, progress *domain.UserVocabularyProgress) error
}
