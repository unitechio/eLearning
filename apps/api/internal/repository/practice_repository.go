package repository

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type PracticeRepository interface {
	CreateSession(session *model.PracticeSession) error
	FindSessionByIDForUser(id, userID uuid.UUID) (*model.PracticeSession, error)
	SaveSession(session *model.PracticeSession) error
	CreatePronunciationHistory(item *model.PronunciationHistory) error
	ListPronunciationHistory(userID uuid.UUID, filter PronunciationHistoryFilter) ([]model.PronunciationHistory, int64, error)
	CreateDictionaryHistory(item *model.DictionaryHistory) error
	FindLatestDictionaryHistoryByWord(userID uuid.UUID, word string) (*model.DictionaryHistory, error)
	ListDictionaryHistory(userID uuid.UUID, filter DictionaryHistoryFilter) ([]model.DictionaryHistory, int64, error)
	CreateVocabularySet(item *model.VocabularySet) error
	FindVocabularySetByIDForUser(id, userID uuid.UUID) (*model.VocabularySet, error)
	ListVocabularySets(userID uuid.UUID, filter VocabularySetFilter) ([]model.VocabularySet, int64, error)
	AddWordToSet(item *model.VocabularySetWord) error
	ListVocabularySetWords(setID uuid.UUID) ([]model.VocabularyWord, error)
}
