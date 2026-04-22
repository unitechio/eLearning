package impl

import (
	"fmt"

	"github.com/unitechio/eLearning/apps/api/internal/service"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type SpeakingService struct {
	stt ai.SpeechToTextService
	llm ai.LLMService
}

func NewSpeakingService(stt ai.SpeechToTextService, llm ai.LLMService) *SpeakingService {
	return &SpeakingService{stt: stt, llm: llm}
}

func (s *SpeakingService) AnalyzeAudio(audioData []byte) (*service.AnalyzeResult, error) {
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

	return &service.AnalyzeResult{
		Transcript:     transcript,
		Score:          eval.Score,
		Feedback:       eval.Feedback,
		ImprovedAnswer: eval.ImprovedAnswer,
	}, nil
}
