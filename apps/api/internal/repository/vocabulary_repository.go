package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type VocabularyRepository interface {
	FindDueProgressByUser(userID uuid.UUID, limit int) ([]model.UserVocabularyProgress, error)
	FindProgressByUserAndWord(userID, wordID uuid.UUID) (*model.UserVocabularyProgress, error)
	ListWords() ([]model.VocabularyWord, error)
	FindWordByID(id uuid.UUID) (*model.VocabularyWord, error)
	CreateWord(word *model.VocabularyWord) error
	UpdateWord(word *model.VocabularyWord) error
	DeleteWord(id uuid.UUID) error
	ListProgressHistoryByUser(userID uuid.UUID, limit int) ([]model.UserVocabularyProgress, error)
	SaveProgress(progress *model.UserVocabularyProgress) error
}
