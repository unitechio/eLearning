package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type VocabularyRepository interface {
	FindDueProgressByUser(userID uuid.UUID, limit int) ([]domain.UserVocabularyProgress, error)
	FindProgressByUserAndWord(userID, wordID uuid.UUID) (*domain.UserVocabularyProgress, error)
	ListWords() ([]domain.VocabularyWord, error)
	FindWordByID(id uuid.UUID) (*domain.VocabularyWord, error)
	CreateWord(word *domain.VocabularyWord) error
	UpdateWord(word *domain.VocabularyWord) error
	DeleteWord(id uuid.UUID) error
	ListProgressHistoryByUser(userID uuid.UUID, limit int) ([]domain.UserVocabularyProgress, error)
	SaveProgress(progress *domain.UserVocabularyProgress) error
}
