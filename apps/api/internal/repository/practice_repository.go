package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type PracticeRepository interface {
	CreateSession(session *domain.PracticeSession) error
	FindSessionByIDForUser(id, userID uuid.UUID) (*domain.PracticeSession, error)
	SaveSession(session *domain.PracticeSession) error
	CreatePronunciationHistory(item *domain.PronunciationHistory) error
	ListPronunciationHistory(userID uuid.UUID, filter PronunciationHistoryFilter) ([]domain.PronunciationHistory, int64, error)
	CreateDictionaryHistory(item *domain.DictionaryHistory) error
	FindLatestDictionaryHistoryByWord(userID uuid.UUID, word string) (*domain.DictionaryHistory, error)
	ListDictionaryHistory(userID uuid.UUID, filter DictionaryHistoryFilter) ([]domain.DictionaryHistory, int64, error)
	CreateVocabularySet(item *domain.VocabularySet) error
	FindVocabularySetByIDForUser(id, userID uuid.UUID) (*domain.VocabularySet, error)
	ListVocabularySets(userID uuid.UUID, filter VocabularySetFilter) ([]domain.VocabularySet, int64, error)
	AddWordToSet(item *domain.VocabularySetWord) error
	ListVocabularySetWords(setID uuid.UUID) ([]domain.VocabularyWord, error)
}
