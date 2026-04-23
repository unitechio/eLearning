package usecase

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type PracticeService interface {
	GetModes() (*dto.PracticeModesResponse, error)
	Start(userID uuid.UUID, req dto.PracticeStartRequest) (*dto.PracticeSessionItem, error)
	Submit(userID uuid.UUID, req dto.PracticeSubmitRequest) (*dto.PracticeSessionItem, error)
	AnalyzeWord(userID uuid.UUID, req dto.PronunciationAnalyzeWordRequest) (*dto.PronunciationHistoryItem, error)
	AnalyzeSentence(userID uuid.UUID, req dto.PronunciationAnalyzeSentenceRequest) (*dto.PronunciationHistoryItem, error)
	ListPronunciationHistory(userID uuid.UUID, query dto.PronunciationHistoryQuery) (*dto.PageResult[dto.PronunciationHistoryItem], error)
	LookupDictionary(userID uuid.UUID, word string) (*dto.DictionaryLookupResponse, error)
	SaveDictionaryWord(userID uuid.UUID, req dto.DictionarySaveRequest) (*dto.DictionaryLookupResponse, error)
	ListDictionaryHistory(userID uuid.UUID, query dto.DictionaryHistoryQuery) (*dto.PageResult[dto.DictionaryLookupResponse], error)
	ReadingLookup(userID uuid.UUID, req dto.ReadingLookupRequest) (*dto.DictionaryLookupResponse, error)
	ReadingSaveWord(userID uuid.UUID, req dto.ReadingSaveWordRequest) (*dto.DictionaryLookupResponse, error)
	ListVocabularySets(userID uuid.UUID, query dto.VocabularySetListQuery) (*dto.PageResult[dto.VocabularySetItem], error)
	CreateVocabularySet(userID uuid.UUID, req dto.VocabularySetRequest) (*dto.VocabularySetItem, error)
	GetVocabularySet(userID uuid.UUID, id string) (*dto.VocabularySetItem, error)
	AddWordToSet(userID uuid.UUID, id string, req dto.VocabularySetAddWordRequest) (*dto.VocabularySetItem, error)
	StreamResponse(userID uuid.UUID, req dto.AIStreamRequest) (map[string]any, error)
	PronunciationFeedback(userID uuid.UUID, req dto.AIStreamRequest) (map[string]any, error)
	ContextCorrection(userID uuid.UUID, req dto.AIStreamRequest) (map[string]any, error)
}
