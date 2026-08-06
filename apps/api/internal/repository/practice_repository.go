package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type PracticeRepository interface {
	CreateSession(ctx context.Context, session *domain.PracticeSession) error
	FindSessionByIDForUser(ctx context.Context, id, userID uuid.UUID) (*domain.PracticeSession, error)
	SaveSession(ctx context.Context, session *domain.PracticeSession) error
	CreatePronunciationHistory(ctx context.Context, item *domain.PronunciationHistory) error
	ListPronunciationHistory(ctx context.Context, userID uuid.UUID, filter PronunciationHistoryFilter) ([]domain.PronunciationHistory, int64, error)
	CreateDictionaryHistory(ctx context.Context, item *domain.DictionaryHistory) error
	FindLatestDictionaryHistoryByWord(ctx context.Context, userID uuid.UUID, word string) (*domain.DictionaryHistory, error)
	ListDictionaryHistory(ctx context.Context, userID uuid.UUID, filter DictionaryHistoryFilter) ([]domain.DictionaryHistory, int64, error)
	CreateVocabularySet(ctx context.Context, item *domain.VocabularySet) error
	FindVocabularySetByIDForUser(ctx context.Context, id, userID uuid.UUID) (*domain.VocabularySet, error)
	ListVocabularySets(ctx context.Context, userID uuid.UUID, filter VocabularySetFilter) ([]domain.VocabularySet, int64, error)
	AddWordToSet(ctx context.Context, item *domain.VocabularySetWord) error
	ListVocabularySetWords(ctx context.Context, setID uuid.UUID) ([]domain.VocabularyWord, error)
}
