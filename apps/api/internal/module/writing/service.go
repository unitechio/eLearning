package writing

import (
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type HistoryResponse struct {
	Items []Submission  `json:"items"`
	Meta  response.Meta `json:"meta"`
}

type Service interface {
	Submit(userID uint, req SubmitRequest) (*Submission, error)
	GetHistory(userID uint, page, pageSize int) (*HistoryResponse, error)
}

type service struct {
	repo Repository
	llm  ai.LLMService
}

func NewService(repo Repository, llm ai.LLMService) Service {
	return &service{repo: repo, llm: llm}
}

func (s *service) Submit(userID uint, req SubmitRequest) (*Submission, error) {
	wc := wordCount(req.Response)
	if wc < 50 {
		return nil, apperr.BadRequest("response must be at least 50 words")
	}

	eval, err := s.llm.EvaluateWriting(req.PromptText, req.Response)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	sub := &Submission{
		UserID:     userID,
		PromptText: req.PromptText,
		Response:   req.Response,
		WordCount:  wc,
		AIScore:    eval.Score,
		AIFeedback: eval.Feedback,
	}
	if err := s.repo.Create(sub); err != nil {
		return nil, apperr.Internal(err)
	}
	return sub, nil
}

func (s *service) GetHistory(userID uint, page, pageSize int) (*HistoryResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 10
	}
	offset := (page - 1) * pageSize

	items, total, err := s.repo.FindByUser(userID, pageSize, offset)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize != 0 {
		totalPages++
	}

	return &HistoryResponse{
		Items: items,
		Meta: response.Meta{
			Page:       page,
			PageSize:   pageSize,
			TotalItems: total,
			TotalPages: totalPages,
		},
	}, nil
}
