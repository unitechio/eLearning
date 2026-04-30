package impl

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type PracticeUsecase struct {
	repo           repository.PracticeRepository
	vocabularyRepo repository.VocabularyRepository
	llm            ai.LLMService
}

func NewPracticeService(repo repository.PracticeRepository, vocabularyRepo repository.VocabularyRepository, llm ai.LLMService) *PracticeUsecase {
	return &PracticeUsecase{repo: repo, vocabularyRepo: vocabularyRepo, llm: llm}
}

func (s *PracticeUsecase) GetModes(ctx context.Context) (*dto.PracticeModesResponse, error) {
	_ = ctx
	return &dto.PracticeModesResponse{Modes: []string{"dictation", "shadowing", "speaking", "writing", "vocabulary"}}, nil
}

func (s *PracticeUsecase) Start(ctx context.Context, userID uuid.UUID, req dto.PracticeStartRequest) (*dto.PracticeSessionItem, error) {
	_ = ctx
	mode := strings.ToLower(strings.TrimSpace(req.Mode))
	if mode == "" {
		return nil, apperr.BadRequest("mode is required")
	}
	expected := "Academy English helps me build fluent communication every day."
	if mode == "dictation" {
		expected = "Consistent dictation practice strengthens listening accuracy and spelling memory."
	}
	session := &domain.PracticeSession{
		UserID:       userID,
		TenantID:     uuid.Nil,
		Mode:         "practice",
		SubMode:      fallback(req.SubMode, mode),
		Status:       "started",
		Prompt:       fallback(req.Prompt, "Practice with Academy English adaptive coach."),
		ExpectedText: expected,
		StartedAt:    time.Now().UTC(),
	}
	if err := s.repo.CreateSession(session); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapPracticeSession(session), nil
}

func (s *PracticeUsecase) Submit(ctx context.Context, userID uuid.UUID, req dto.PracticeSubmitRequest) (*dto.PracticeSessionItem, error) {
	_ = ctx
	sessionID, err := uuid.Parse(req.SessionID)
	if err != nil {
		return nil, apperr.BadRequest("invalid session id")
	}
	session, err := s.repo.FindSessionByIDForUser(sessionID, userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("practice session", req.SessionID)
		}
		return nil, apperr.Internal(err)
	}
	eval, err := s.llm.EvaluateSpeaking(req.Answer)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	now := time.Now().UTC()
	session.Answer = req.Answer
	session.Status = "submitted"
	session.Feedback = eval.Feedback
	session.Score = &eval.Score
	session.SubmittedAt = &now
	if err := s.repo.SaveSession(session); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapPracticeSession(session), nil
}

func (s *PracticeUsecase) AnalyzeWord(ctx context.Context, userID uuid.UUID, req dto.PronunciationAnalyzeWordRequest) (*dto.PronunciationHistoryItem, error) {
	return s.savePronunciation(ctx, userID, "word", req.Word)
}

func (s *PracticeUsecase) AnalyzeSentence(ctx context.Context, userID uuid.UUID, req dto.PronunciationAnalyzeSentenceRequest) (*dto.PronunciationHistoryItem, error) {
	return s.savePronunciation(ctx, userID, "sentence", req.Sentence)
}

func (s *PracticeUsecase) ListPronunciationHistory(ctx context.Context, userID uuid.UUID, query dto.PronunciationHistoryQuery) (*dto.PageResult[dto.PronunciationHistoryItem], error) {
	_ = ctx
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListPronunciationHistory(userID, repository.PronunciationHistoryFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Kind:       query.Kind,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.PronunciationHistoryItem, 0, len(items))
	for _, item := range items {
		res = append(res, dto.PronunciationHistoryItem{
			ID:        item.ID.String(),
			Kind:      item.Kind,
			Source:    item.SourceText,
			Accuracy:  item.Accuracy,
			Feedback:  item.Feedback,
			CreatedAt: item.CreatedAt.Format(time.RFC3339),
		})
	}
	return &dto.PageResult[dto.PronunciationHistoryItem]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *PracticeUsecase) LookupDictionary(ctx context.Context, userID uuid.UUID, word string) (*dto.DictionaryLookupResponse, error) {
	_ = ctx
	word = strings.TrimSpace(word)
	if word == "" {
		return nil, apperr.BadRequest("word is required")
	}
	if existing, err := s.repo.FindLatestDictionaryHistoryByWord(userID, word); err == nil {
		return mapDictionaryHistory(existing), nil
	}
	definition := buildDictionaryEntry(word)
	item := &domain.DictionaryHistory{
		UserID:      userID,
		TenantID:    uuid.Nil,
		Word:        strings.ToLower(word),
		Meaning:     definition.Meaning,
		IPA:         definition.IPA,
		AudioURL:    definition.Audio,
		WordType:    definition.WordType,
		Collocation: definition.Collocation,
		Example:     definition.Example,
	}
	if err := s.repo.CreateDictionaryHistory(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapDictionaryHistory(item), nil
}

func (s *PracticeUsecase) SaveDictionaryWord(ctx context.Context, userID uuid.UUID, req dto.DictionarySaveRequest) (*dto.DictionaryLookupResponse, error) {
	item, err := s.LookupDictionary(ctx, userID, req.Word)
	if err != nil {
		return nil, err
	}
	history, err := s.repo.FindLatestDictionaryHistoryByWord(userID, req.Word)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	saved := &domain.DictionaryHistory{
		UserID:      history.UserID,
		TenantID:    history.TenantID,
		Word:        history.Word,
		Meaning:     history.Meaning,
		IPA:         history.IPA,
		AudioURL:    history.AudioURL,
		WordType:    history.WordType,
		Collocation: history.Collocation,
		Example:     history.Example,
		Saved:       true,
	}
	if err := s.repo.CreateDictionaryHistory(saved); err != nil {
		return nil, apperr.Internal(err)
	}
	item.Saved = true
	return item, nil
}

func (s *PracticeUsecase) ListDictionaryHistory(ctx context.Context, userID uuid.UUID, query dto.DictionaryHistoryQuery) (*dto.PageResult[dto.DictionaryLookupResponse], error) {
	_ = ctx
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListDictionaryHistory(userID, repository.DictionaryHistoryFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Saved:      query.Saved,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.DictionaryLookupResponse, 0, len(items))
	for _, item := range items {
		res = append(res, *mapDictionaryHistory(&item))
	}
	return &dto.PageResult[dto.DictionaryLookupResponse]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *PracticeUsecase) ReadingLookup(ctx context.Context, userID uuid.UUID, req dto.ReadingLookupRequest) (*dto.DictionaryLookupResponse, error) {
	return s.LookupDictionary(ctx, userID, req.Word)
}

func (s *PracticeUsecase) ReadingSaveWord(ctx context.Context, userID uuid.UUID, req dto.ReadingSaveWordRequest) (*dto.DictionaryLookupResponse, error) {
	return s.SaveDictionaryWord(ctx, userID, dto.DictionarySaveRequest{Word: req.Word})
}

func (s *PracticeUsecase) ListVocabularySets(ctx context.Context, userID uuid.UUID, query dto.VocabularySetListQuery) (*dto.PageResult[dto.VocabularySetItem], error) {
	_ = ctx
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListVocabularySets(userID, repository.VocabularySetFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Domain:     query.Domain,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.VocabularySetItem, 0, len(items))
	for _, item := range items {
		words, _ := s.repo.ListVocabularySetWords(item.ID)
		mappedWords := make([]string, 0, len(words))
		for _, word := range words {
			mappedWords = append(mappedWords, word.Word)
		}
		res = append(res, dto.VocabularySetItem{ID: item.ID.String(), Name: item.Name, Description: item.Description, Domain: item.Domain, Words: mappedWords})
	}
	return &dto.PageResult[dto.VocabularySetItem]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *PracticeUsecase) CreateVocabularySet(ctx context.Context, userID uuid.UUID, req dto.VocabularySetRequest) (*dto.VocabularySetItem, error) {
	_ = ctx
	item := &domain.VocabularySet{UserID: userID, TenantID: uuid.Nil, Name: req.Name, Description: req.Description, Domain: fallback(req.Domain, "english")}
	if err := s.repo.CreateVocabularySet(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.VocabularySetItem{ID: item.ID.String(), Name: item.Name, Description: item.Description, Domain: item.Domain}, nil
}

func (s *PracticeUsecase) GetVocabularySet(ctx context.Context, userID uuid.UUID, id string) (*dto.VocabularySetItem, error) {
	_ = ctx
	setID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid set id")
	}
	item, err := s.repo.FindVocabularySetByIDForUser(setID, userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("vocabulary set", id)
		}
		return nil, apperr.Internal(err)
	}
	words, err := s.repo.ListVocabularySetWords(item.ID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	wordNames := make([]string, 0, len(words))
	for _, word := range words {
		wordNames = append(wordNames, word.Word)
	}
	return &dto.VocabularySetItem{ID: item.ID.String(), Name: item.Name, Description: item.Description, Domain: item.Domain, Words: wordNames}, nil
}

func (s *PracticeUsecase) AddWordToSet(ctx context.Context, userID uuid.UUID, id string, req dto.VocabularySetAddWordRequest) (*dto.VocabularySetItem, error) {
	_ = ctx
	setID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid set id")
	}
	if _, err := s.repo.FindVocabularySetByIDForUser(setID, userID); err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("vocabulary set", id)
		}
		return nil, apperr.Internal(err)
	}
	wordID, err := uuid.Parse(req.WordID)
	if err != nil {
		return nil, apperr.BadRequest("invalid word id")
	}
	if _, err := s.vocabularyRepo.FindWordByID(wordID); err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("word", req.WordID)
		}
		return nil, apperr.Internal(err)
	}
	if err := s.repo.AddWordToSet(&domain.VocabularySetWord{SetID: setID, WordID: wordID}); err != nil {
		return nil, apperr.Internal(err)
	}
	return s.GetVocabularySet(ctx, userID, id)
}

func (s *PracticeUsecase) StreamResponse(ctx context.Context, userID uuid.UUID, req dto.AIStreamRequest) (map[string]any, error) {
	_ = ctx
	_ = userID
	return map[string]any{
		"chunks": []string{
			"Let's refine your sentence in real time.",
			"Focus on stronger verb choice and a cleaner clause structure.",
			"Try: " + strings.TrimSpace(req.Message) + " with clearer emphasis.",
		},
		"context": req.Context,
	}, nil
}

func (s *PracticeUsecase) PronunciationFeedback(ctx context.Context, userID uuid.UUID, req dto.AIStreamRequest) (map[string]any, error) {
	item, err := s.savePronunciation(ctx, userID, "sentence", req.Message)
	if err != nil {
		return nil, err
	}
	return map[string]any{"accuracy": item.Accuracy, "feedback": item.Feedback, "source": item.Source}, nil
}

func (s *PracticeUsecase) ContextCorrection(ctx context.Context, userID uuid.UUID, req dto.AIStreamRequest) (map[string]any, error) {
	_ = ctx
	_ = userID
	return map[string]any{
		"original":  req.Message,
		"corrected": "Academy English context correction: " + strings.TrimSpace(req.Message),
		"notes":     []string{"Keep the tense consistent", "Use more natural collocations"},
	}, nil
}

func (s *PracticeUsecase) savePronunciation(ctx context.Context, userID uuid.UUID, kind, source string) (*dto.PronunciationHistoryItem, error) {
	_ = ctx
	eval, err := s.llm.EvaluateSpeaking(source)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	item := &domain.PronunciationHistory{
		UserID:     userID,
		TenantID:   uuid.Nil,
		Kind:       kind,
		SourceText: source,
		Accuracy:   eval.Score,
		Feedback:   eval.Feedback,
	}
	if err := s.repo.CreatePronunciationHistory(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.PronunciationHistoryItem{
		ID:        item.ID.String(),
		Kind:      item.Kind,
		Source:    item.SourceText,
		Accuracy:  item.Accuracy,
		Feedback:  item.Feedback,
		CreatedAt: item.CreatedAt.Format(time.RFC3339),
	}, nil
}

func mapPracticeSession(item *domain.PracticeSession) *dto.PracticeSessionItem {
	res := &dto.PracticeSessionItem{
		ID:           item.ID.String(),
		Mode:         item.Mode,
		SubMode:      item.SubMode,
		Status:       item.Status,
		Prompt:       item.Prompt,
		ExpectedText: item.ExpectedText,
		StartedAt:    item.StartedAt.Format(time.RFC3339),
		Feedback:     item.Feedback,
	}
	if item.Score != nil {
		res.Score = *item.Score
	}
	if item.SubmittedAt != nil {
		res.SubmittedAt = item.SubmittedAt.Format(time.RFC3339)
	}
	return res
}

func mapDictionaryHistory(item *domain.DictionaryHistory) *dto.DictionaryLookupResponse {
	return &dto.DictionaryLookupResponse{
		Word:        item.Word,
		Meaning:     item.Meaning,
		IPA:         item.IPA,
		Audio:       item.AudioURL,
		WordType:    item.WordType,
		Collocation: item.Collocation,
		Example:     item.Example,
		Saved:       item.Saved,
	}
}

func buildDictionaryEntry(word string) *dto.DictionaryLookupResponse {
	lower := strings.ToLower(strings.TrimSpace(word))
	return &dto.DictionaryLookupResponse{
		Word:        lower,
		Meaning:     fmt.Sprintf("%s means to use or understand the term naturally in Academy English context.", lower),
		IPA:         "/" + lower + "/",
		Audio:       fmt.Sprintf("https://cdn.eenglish.local/dictionary/%s.mp3", strings.ReplaceAll(lower, " ", "-")),
		WordType:    "noun",
		Collocation: lower + " practice",
		Example:     fmt.Sprintf("Learners use '%s' confidently in their daily English routine.", lower),
		Saved:       false,
	}
}
