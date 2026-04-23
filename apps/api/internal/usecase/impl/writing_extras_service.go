package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type WritingExtrasUsecase struct {
	repo repository.WritingRepository
	llm  ai.LLMService
}

func NewWritingExtrasService(repo repository.WritingRepository, llm ai.LLMUsecase) *WritingExtrasUsecase {
	return &WritingExtrasUsecase{repo: repo, llm: llm}
}

func (s *WritingExtrasUsecase) GetWritingByID(userID uuid.UUID, id string) (map[string]any, error) {
	submissionID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid writing id")
	}
	item, err := s.repo.FindSubmissionByIDForUser(submissionID, userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("writing submission", id)
		}
		return nil, apperr.Internal(err)
	}
	return map[string]any{
		"id":         item.ID.String(),
		"user_id":    item.UserID.String(),
		"prompt":     item.PromptText,
		"response":   item.Response,
		"word_count": item.WordCount,
		"score":      item.AIScore,
		"feedback":   item.AIFeedback,
		"created_at": item.CreatedAt,
		"updated_at": item.UpdatedAt,
	}, nil
}

func (s *WritingExtrasUsecase) EvaluateWriting(req dto.WritingEvaluationRequest) (map[string]any, error) {
	eval, err := s.llm.EvaluateWriting(req.Prompt, req.Text)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return map[string]any{
		"prompt":          req.Prompt,
		"score":           eval.Score,
		"feedback":        eval.Feedback,
		"improved_answer": eval.ImprovedAnswer,
	}, nil
}
