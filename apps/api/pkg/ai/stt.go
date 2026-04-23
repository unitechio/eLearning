package ai

import "fmt"

type SpeechToTextService interface {
	Transcribe(audioData []byte) (string, error)
}

type sttUsecase struct{}

func NewSTTService() SpeechToTextUsecase { return &sttUsecase{} }

func (s *sttUsecase) Transcribe(audioData []byte) (string, error) {
	if len(audioData) == 0 {
		return "", fmt.Errorf("empty audio data")
	}
	return "Technology has fundamentally changed how we communicate. Ten years ago we called each other; now we mostly text or use apps.", nil
}
