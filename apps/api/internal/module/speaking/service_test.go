package speaking_test

import (
	"errors"
	"testing"

	"github.com/unitechio/eLearning/apps/api/internal/module/speaking"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type mockSTT struct{ fail bool }

func (m *mockSTT) Transcribe(data []byte) (string, error) {
	if m.fail {
		return "", errors.New("stt error")
	}
	return "mock transcript", nil
}

type mockLLM struct{ fail bool }

func (m *mockLLM) EvaluateSpeaking(transcript string) (*ai.EvaluationResult, error) {
	if m.fail {
		return nil, errors.New("llm error")
	}
	return &ai.EvaluationResult{Score: 7.5, Feedback: "Good", ImprovedAnswer: "Better"}, nil
}

func (m *mockLLM) EvaluateWriting(prompt, text string) (*ai.EvaluationResult, error) {
	return &ai.EvaluationResult{Score: 7.0, Feedback: "OK"}, nil
}

func TestAnalyzeAudio_Success(t *testing.T) {
	svc := speaking.NewService(&mockSTT{}, &mockLLM{})
	result, err := svc.AnalyzeAudio([]byte("audio-bytes"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Transcript != "mock transcript" {
		t.Errorf("expected 'mock transcript', got %s", result.Transcript)
	}
	if result.Score != 7.5 {
		t.Errorf("expected score 7.5, got %f", result.Score)
	}
}

func TestAnalyzeAudio_EmptyData(t *testing.T) {
	svc := speaking.NewService(&mockSTT{}, &mockLLM{})
	_, err := svc.AnalyzeAudio([]byte{})
	if err == nil {
		t.Fatal("expected error for empty audio")
	}
	var ae *apperr.AppError
	if !errors.As(err, &ae) {
		t.Errorf("expected AppError, got %T", err)
	}
}

func TestAnalyzeAudio_STTFails(t *testing.T) {
	svc := speaking.NewService(&mockSTT{fail: true}, &mockLLM{})
	_, err := svc.AnalyzeAudio([]byte("audio"))
	if err == nil {
		t.Fatal("expected error when STT fails")
	}
}

func TestAnalyzeAudio_LLMFails(t *testing.T) {
	svc := speaking.NewService(&mockSTT{}, &mockLLM{fail: true})
	_, err := svc.AnalyzeAudio([]byte("audio"))
	if err == nil {
		t.Fatal("expected error when LLM fails")
	}
}
