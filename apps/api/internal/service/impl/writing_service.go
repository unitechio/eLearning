package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/service"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type WritingService struct {
	repo repository.WritingRepository
	llm  ai.LLMService
}

func NewWritingService(repo repository.WritingRepository, llm ai.LLMService) *WritingService {
	return &WritingService{repo: repo, llm: llm}
}

func (s *WritingService) Submit(userID uuid.UUID, req service.SubmitRequest) (*model.WritingSubmission, error) {
	wc := wordCount(req.Response)
	if wc < 50 {
		return nil, apperr.BadRequest("response must be at least 50 words")
	}

	eval, err := s.llm.EvaluateWriting(req.PromptText, req.Response)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	submission := &model.WritingSubmission{
		UserID:     userID,
		PromptText: req.PromptText,
		Response:   req.Response,
		WordCount:  wc,
		AIScore:    eval.Score,
		AIFeedback: eval.Feedback,
	}
	if err := s.repo.CreateSubmission(submission); err != nil {
		return nil, apperr.Internal(err)
	}
	return submission, nil
}

func (s *WritingService) GetHistory(userID uuid.UUID, page, pageSize int) (*service.HistoryResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize
	items, total, err := s.repo.ListSubmissionsByUser(userID, pageSize, offset)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize != 0 {
		totalPages++
	}

	return &service.HistoryResponse{
		Items: items,
		Meta: response.Meta{
			Page:       page,
			PageSize:   pageSize,
			TotalItems: total,
			TotalPages: totalPages,
		},
	}, nil
}

func (s *WritingService) GetSubmissionByID(userID, submissionID uuid.UUID) (*model.WritingSubmission, error) {
	item, err := s.repo.FindSubmissionByIDForUser(submissionID, userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("submission", submissionID.String())
		}
		return nil, apperr.Internal(err)
	}
	return item, nil
}

func wordCount(text string) int {
	count := 0
	inWord := false
	for _, ch := range text {
		switch ch {
		case ' ', '\n', '\t', '\r':
			inWord = false
		default:
			if !inWord {
				inWord = true
				count++
			}
		}
	}
	return count
}
