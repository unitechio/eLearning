package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type PracticeService interface {
	GetModes(ctx context.Context) (*dto.PracticeModesResponse, error)
	Start(ctx context.Context, userID uuid.UUID, req dto.PracticeStartRequest) (*dto.PracticeSessionItem, error)
	Submit(ctx context.Context, userID uuid.UUID, req dto.PracticeSubmitRequest) (*dto.PracticeSessionItem, error)
	AnalyzeWord(ctx context.Context, userID uuid.UUID, req dto.PronunciationAnalyzeWordRequest) (*dto.PronunciationHistoryItem, error)
	AnalyzeSentence(ctx context.Context, userID uuid.UUID, req dto.PronunciationAnalyzeSentenceRequest) (*dto.PronunciationHistoryItem, error)
	ListPronunciationHistory(ctx context.Context, userID uuid.UUID, query dto.PronunciationHistoryQuery) (*dto.PageResult[dto.PronunciationHistoryItem], error)
	LookupDictionary(ctx context.Context, userID uuid.UUID, word string) (*dto.DictionaryLookupResponse, error)
	SaveDictionaryWord(ctx context.Context, userID uuid.UUID, req dto.DictionarySaveRequest) (*dto.DictionaryLookupResponse, error)
	ListDictionaryHistory(ctx context.Context, userID uuid.UUID, query dto.DictionaryHistoryQuery) (*dto.PageResult[dto.DictionaryLookupResponse], error)
	ReadingLookup(ctx context.Context, userID uuid.UUID, req dto.ReadingLookupRequest) (*dto.DictionaryLookupResponse, error)
	ReadingSaveWord(ctx context.Context, userID uuid.UUID, req dto.ReadingSaveWordRequest) (*dto.DictionaryLookupResponse, error)
	ListVocabularySets(ctx context.Context, userID uuid.UUID, query dto.VocabularySetListQuery) (*dto.PageResult[dto.VocabularySetItem], error)
	CreateVocabularySet(ctx context.Context, userID uuid.UUID, req dto.VocabularySetRequest) (*dto.VocabularySetItem, error)
	GetVocabularySet(ctx context.Context, userID uuid.UUID, id string) (*dto.VocabularySetItem, error)
	AddWordToSet(ctx context.Context, userID uuid.UUID, id string, req dto.VocabularySetAddWordRequest) (*dto.VocabularySetItem, error)
	StreamResponse(ctx context.Context, userID uuid.UUID, req dto.AIStreamRequest) (map[string]any, error)
	PronunciationFeedback(ctx context.Context, userID uuid.UUID, req dto.AIStreamRequest) (map[string]any, error)
	ContextCorrection(ctx context.Context, userID uuid.UUID, req dto.AIStreamRequest) (map[string]any, error)
}
