package impl

import (
	"context"
	"fmt"
	"strings"

	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

const timeRFC3339 = "2006-01-02T15:04:05Z07:00"

type AIUsecase struct {
	llm ai.LLMService
}

func NewAIService(llm ai.LLMService) *AIUsecase {
	return &AIUsecase{llm: llm}
}

func (s *AIUsecase) Chat(ctx context.Context, req dto.AIChatRequest) (map[string]any, error) {
	_ = ctx
	message := strings.TrimSpace(req.Message)
	if message == "" {
		return nil, apperr.BadRequest("message is required")
	}
	reply := fmt.Sprintf("Academy English coach: focus on %s and improve this point: %s", fallback(req.Domain, "english"), message)
	return map[string]any{
		"domain": req.Domain,
		"reply":  reply,
		"tips":   []string{"Use precise vocabulary", "Keep sentence structure clear", "Practice daily for retention"},
	}, nil
}

func (s *AIUsecase) EvaluateWriting(ctx context.Context, req dto.WritingEvaluationRequest) (map[string]any, error) {
	_ = ctx
	eval, err := s.llm.EvaluateWriting(req.Prompt, req.Text)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return map[string]any{"score": eval.Score, "feedback": eval.Feedback, "improved_answer": eval.ImprovedAnswer}, nil
}

func (s *AIUsecase) EvaluateSpeaking(ctx context.Context, req dto.AIChatRequest) (map[string]any, error) {
	_ = ctx
	eval, err := s.llm.EvaluateSpeaking(req.Message)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return map[string]any{"score": eval.Score, "feedback": eval.Feedback, "improved_answer": eval.ImprovedAnswer}, nil
}

func (s *AIUsecase) GenerateQuestion(ctx context.Context, req dto.AIQuestionRequest) (map[string]any, error) {
	_ = ctx
	question := fmt.Sprintf("In Academy English, explain %s using a %s perspective.", req.Topic, fallback(req.Domain, "english"))
	return map[string]any{"domain": req.Domain, "topic": req.Topic, "question": question}, nil
}
