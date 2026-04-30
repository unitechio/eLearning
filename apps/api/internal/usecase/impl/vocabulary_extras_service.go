package impl

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type VocabularyExtrasUsecase struct {
	repo repository.VocabularyRepository
}

func NewVocabularyExtrasService(repo repository.VocabularyRepository) *VocabularyExtrasUsecase {
	return &VocabularyExtrasUsecase{repo: repo}
}

func (s *VocabularyExtrasUsecase) UpdateWord(ctx context.Context, id string, req dto.UpdateWordRequest) (map[string]any, error) {
	_ = ctx
	wordID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid word id")
	}
	word, err := s.repo.FindWordByID(wordID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("word", id)
		}
		return nil, apperr.Internal(err)
	}
	word.Word = req.Word
	word.Definition = req.Definition
	word.PartOfSpeech = req.PartOfSpeech
	word.Phonetic = req.Phonetic
	word.Level = req.Level
	word.Example = req.Example
	if err := s.repo.UpdateWord(word); err != nil {
		return nil, apperr.Internal(err)
	}
	return map[string]any{
		"id":             word.ID.String(),
		"word":           word.Word,
		"definition":     word.Definition,
		"part_of_speech": word.PartOfSpeech,
		"phonetic":       word.Phonetic,
		"level":          word.Level,
		"example":        word.Example,
	}, nil
}

func (s *VocabularyExtrasUsecase) DeleteWord(ctx context.Context, id string) error {
	_ = ctx
	wordID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid word id")
	}
	if err := s.repo.DeleteWord(wordID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *VocabularyExtrasUsecase) ListVocabularyHistory(ctx context.Context, userID uuid.UUID, query dto.VocabularyHistoryQuery) (*dto.PageResult[dto.VocabularyHistoryItem], error) {
	_ = ctx
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, err := s.repo.ListProgressHistoryByUser(userID, 100)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	mapped := make([]dto.VocabularyHistoryItem, 0, len(items))
	for _, item := range items {
		result := "incorrect"
		if item.ConsecutiveCorrect > 0 {
			result = "correct"
		}
		if query.Result != "" && !strings.EqualFold(query.Result, result) {
			continue
		}
		if !containsQuery(query.Search, item.Word.Word, item.Word.Definition, result) {
			continue
		}
		reviewedAt := ""
		if item.LastReviewDate != nil {
			reviewedAt = item.LastReviewDate.Format(time.RFC3339)
		}
		mapped = append(mapped, dto.VocabularyHistoryItem{
			ID:         item.ID.String(),
			WordID:     item.WordID.String(),
			Result:     result,
			ReviewedAt: reviewedAt,
		})
	}
	total := int64(len(mapped))
	start := (query.Page - 1) * query.PageSize
	if start > len(mapped) {
		start = len(mapped)
	}
	end := start + query.PageSize
	if end > len(mapped) {
		end = len(mapped)
	}
	return &dto.PageResult[dto.VocabularyHistoryItem]{Items: mapped[start:end], Meta: buildMeta(query.PaginationQuery, total)}, nil
}
