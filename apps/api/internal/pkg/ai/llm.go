package ai

import (
	"fmt"
)

type EvaluationResult struct {
	Score          float64 `json:"score"`
	Feedback       string  `json:"feedback"`
	ImprovedAnswer string  `json:"improved_answer"`
}

type LLMService interface {
	EvaluateSpeaking(transcript string) (*EvaluationResult, error)
}

type llmService struct {
	// apiKey string
}

func NewLLMService() LLMService {
	return &llmService{}
}

func (s *llmService) EvaluateSpeaking(transcript string) (*EvaluationResult, error) {
	// In a real application, you would send the transcript to an LLM like OpenAI GPT-4
	// with a prompt asking to act as an IELTS examiner and evaluate grammar, vocabulary, and fluency.
	if transcript == "" {
		return nil, fmt.Errorf("empty transcript")
	}

	// Mocking evaluation response
	return &EvaluationResult{
		Score:          7.5,
		Feedback:       "Good fluency and coherence. You used some less common vocabulary ('fundamentally changed'). However, try to avoid filler words like 'Like'. Your grammar is generally accurate.",
		ImprovedAnswer: "I believe technology has fundamentally revolutionized our communication methods. A decade ago, telephone calls were the primary mode of interaction, whereas today, we predominantly rely on text messaging and instant messaging applications.",
	}, nil
}
