package vocabulary

import (
	"time"

	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type ReviewRequest struct {
	WordID  uint `json:"word_id"  binding:"required"`
	Correct bool `json:"correct"`
}

type Service interface {
	GetDueWords(userID uint) ([]UserWordProgress, error)
	SubmitReview(userID uint, req ReviewRequest) (*UserWordProgress, error)
	GetAllWords() ([]Word, error)
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo: repo} }

func (s *service) GetDueWords(userID uint) ([]UserWordProgress, error) {
	items, err := s.repo.GetDueWords(userID, 20)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return items, nil
}

func (s *service) SubmitReview(userID uint, req ReviewRequest) (*UserWordProgress, error) {
	items, err := s.repo.GetDueWords(userID, 100)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	var progress *UserWordProgress
	for _, it := range items {
		if it.WordID == req.WordID {
			p := it
			progress = &p
			break
		}
	}
	if progress == nil {
		progress = &UserWordProgress{
			UserID:       userID,
			WordID:       req.WordID,
			BoxNumber:    1,
			NextReviewAt: time.Now(),
		}
	}

	now := time.Now()
	progress.LastReviewAt = &now

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

	progress.NextReviewAt = nextReview(progress.BoxNumber)

	if err := s.repo.UpsertProgress(progress); err != nil {
		return nil, apperr.Internal(err)
	}
	return progress, nil
}

func (s *service) GetAllWords() ([]Word, error) {
	words, err := s.repo.GetAllWords()
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return words, nil
}

func nextReview(box int) time.Time {
	intervals := []time.Duration{
		0,                   // placeholder
		1 * time.Hour,       // box 1
		24 * time.Hour,      // box 2
		3 * 24 * time.Hour,  // box 3
		7 * 24 * time.Hour,  // box 4
		30 * 24 * time.Hour, // box 5
	}
	if box < 1 || box >= len(intervals) {
		box = 1
	}
	return time.Now().Add(intervals[box])
}
