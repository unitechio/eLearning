package speaking

import (
	"fmt"

	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
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
	stt ai.SpeechToTextService
	llm ai.LLMService
}

func NewService(stt ai.SpeechToTextService, llm ai.LLMService) Service {
	return &service{stt: stt, llm: llm}
}

func (s *service) AnalyzeAudio(audioData []byte) (*AnalyzeResult, error) {
	if len(audioData) == 0 {
		return nil, apperr.BadRequest("audio data is empty")
	}

	transcript, err := s.stt.Transcribe(audioData)
	if err != nil {
		return nil, apperr.Internal(fmt.Errorf("stt: %w", err))
	}

	eval, err := s.llm.EvaluateSpeaking(transcript)
	if err != nil {
		return nil, apperr.Internal(fmt.Errorf("llm: %w", err))
	}

	return &AnalyzeResult{
		Transcript:     transcript,
		Score:          eval.Score,
		Feedback:       eval.Feedback,
		ImprovedAnswer: eval.ImprovedAnswer,
	}, nil
}
