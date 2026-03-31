package speaking

import (
	"fmt"

	"github.com/owner/eenglish/api/internal/pkg/ai"
)

type AnalyzeResult struct {
	Transcript     string  `json:"transcript"`
	Score          float64 `json:"score"`
	Feedback       string  `json:"feedback"`
	ImprovedAnswer string  `json:"improved_answer"`
}

type Service interface {
	AnalyzeAudio(audioData []byte) (*AnalyzeResult, error)
}

type service struct {
	sttService ai.SpeechToTextService
	llmService ai.LLMService
}

func NewService(stt ai.SpeechToTextService, llm ai.LLMService) Service {
	return &service{
		sttService: stt,
		llmService: llm,
	}
}

func (s *service) AnalyzeAudio(audioData []byte) (*AnalyzeResult, error) {
	// 1. Transcribe Audio
	transcript, err := s.sttService.Transcribe(audioData)
	if err != nil {
		return nil, fmt.Errorf("failed to transcribe audio: %w", err)
	}

	// 2. Evaluate Transcript with LLM
	evaluation, err := s.llmService.EvaluateSpeaking(transcript)
	if err != nil {
		return nil, fmt.Errorf("failed to evaluate transcript: %w", err)
	}

	// 3. Construct Result
	return &AnalyzeResult{
		Transcript:     transcript,
		Score:          evaluation.Score,
		Feedback:       evaluation.Feedback,
		ImprovedAnswer: evaluation.ImprovedAnswer,
	}, nil
}
