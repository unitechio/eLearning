package impl

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type VocabularyUsecase struct {
	repo repository.VocabularyRepository
}

func NewVocabularyService(repo repository.VocabularyRepository) *VocabularyUsecase {
	return &VocabularyUsecase{repo: repo}
}

func (s *VocabularyUsecase) GetDueWords(ctx context.Context, userID uuid.UUID) ([]domain.UserVocabularyProgress, error) {
	_ = ctx
	items, err := s.repo.FindDueProgressByUser(userID, 20)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return items, nil
}

func (s *VocabularyUsecase) SubmitReview(ctx context.Context, userID uuid.UUID, req usecase.ReviewRequest) (*domain.UserVocabularyProgress, error) {
	_ = ctx
	word, err := s.repo.FindWordByID(req.WordID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("word", req.WordID.String())
		}
		return nil, apperr.Internal(err)
	}

	progress, err := s.repo.FindProgressByUserAndWord(userID, req.WordID)
	if err != nil {
		if !isNotFoundErr(err) {
			return nil, apperr.Internal(err)
		}
		progress = &domain.UserVocabularyProgress{
			UserID:         userID,
			TenantID:       word.TenantID,
			WordID:         req.WordID,
			Word:           *word,
			BoxNumber:      1,
			NextReviewDate: time.Now().UTC(),
		}
	}

	now := time.Now().UTC()
	progress.LastReviewDate = &now

	if req.Correct {
		progress.ConsecutiveCorrect++
		progress.BoxNumber++
		if progress.BoxNumber > 5 {
			progress.BoxNumber = 5
		}
	} else {
		progress.ConsecutiveCorrect = 0
		progress.BoxNumber = 1
	}

	progress.NextReviewDate = nextReview(progress.BoxNumber)
	if err := s.repo.SaveProgress(progress); err != nil {
		return nil, apperr.Internal(err)
	}
	return progress, nil
}

func (s *VocabularyUsecase) GetAllWords(ctx context.Context) ([]domain.VocabularyWord, error) {
	_ = ctx
	words, err := s.repo.ListWords()
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return words, nil
}

func (s *VocabularyUsecase) GetWordByID(ctx context.Context, id uuid.UUID) (*domain.VocabularyWord, error) {
	_ = ctx
	word, err := s.repo.FindWordByID(id)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("word", id.String())
		}
		return nil, apperr.Internal(err)
	}
	return word, nil
}

func (s *VocabularyUsecase) CreateWord(ctx context.Context, tenantID uuid.UUID, req usecase.CreateWordRequest) (*domain.VocabularyWord, error) {
	_ = ctx
	word := &domain.VocabularyWord{
		TenantID:     tenantID,
		Word:         req.Word,
		Definition:   req.Definition,
		PartOfSpeech: req.PartOfSpeech,
		Phonetic:     req.Phonetic,
		Level:        req.Level,
		Example:      req.Example,
	}
	if err := s.repo.CreateWord(word); err != nil {
		return nil, apperr.Internal(err)
	}
	return word, nil
}

func nextReview(box int) time.Time {
	intervals := []time.Duration{0, time.Hour, 24 * time.Hour, 72 * time.Hour, 7 * 24 * time.Hour, 30 * 24 * time.Hour}
	if box < 1 || box >= len(intervals) {
		box = 1
	}
	return time.Now().UTC().Add(intervals[box])
}
