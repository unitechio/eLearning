package tts

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"
)

type TTSService interface {
	Synthesize(ctx context.Context, text string, locale string) ([]byte, error)
	AdjustSpeed(ctx context.Context, wavBytes []byte, speed float64) ([]byte, error)
}

type PiperTTS struct {
	piperPath string
	models    map[string]string
}

func NewPiperTTS() *PiperTTS {
	// Look up Piper path from environment variable, default to '/opt/piper/piper'
	pPath := os.Getenv("PIPER_PATH")
	if pPath == "" {
		pPath = "/opt/piper/piper"
	}

	// Dynamic locale voice models mapping
	viModel := os.Getenv("PIPER_MODEL_VI")
	if viModel == "" {
		viModel = "/opt/piper/models/vi_VN-vais1000-medium.onnx"
	}

	enModel := os.Getenv("PIPER_MODEL_EN")
	if enModel == "" {
		enModel = "/opt/piper/models/en_US-lessac-medium.onnx"
	}

	return &PiperTTS{
		piperPath: pPath,
		models: map[string]string{
			"vi": viModel,
			"en": enModel,
		},
	}
}

// Synthesize streams text to Piper on stdin and returns wav bytes from stdout
func (s *PiperTTS) Synthesize(ctx context.Context, text string, locale string) ([]byte, error) {
	cleanText := strings.TrimSpace(text)
	if cleanText == "" {
		return nil, fmt.Errorf("text input is empty")
	}

	// Clean locale default mapping
	lang := strings.ToLower(locale)
	if lang == "" || (lang != "vi" && lang != "en") {
		lang = "en" // fallback to english
	}

	modelPath, ok := s.models[lang]
	if !ok {
		return nil, fmt.Errorf("model for locale '%s' not configured", locale)
	}

	// Enforce context execution safety
	cmdCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	cmd := exec.CommandContext(cmdCtx, s.piperPath, "--model", modelPath, "--output_file", "-")
	
	var stdoutBuf bytes.Buffer
	var stderrBuf bytes.Buffer
	cmd.Stdout = &stdoutBuf
	cmd.Stderr = &stderrBuf
	cmd.Stdin = strings.NewReader(cleanText)

	if err := cmd.Run(); err != nil {
		stderrStr := stderrBuf.String()
		return nil, fmt.Errorf("piper synthesis failed: %w (stderr: %s)", err, stderrStr)
	}

	return stdoutBuf.Bytes(), nil
}

// AdjustSpeed co-expands audio speed using FFmpeg's atempo filter entirely in-memory
func (s *PiperTTS) AdjustSpeed(ctx context.Context, wavBytes []byte, speed float64) ([]byte, error) {
	if len(wavBytes) == 0 {
		return nil, fmt.Errorf("empty input wav bytes")
	}

	// Speed boundaries validation
	if speed < 0.5 {
		speed = 0.5
	}
	if speed > 2.5 {
		speed = 2.5
	}

	// If speed is 1.0, bypass FFmpeg step completely to save performance
	if speed == 1.0 {
		return wavBytes, nil
	}

	// Build atempo chains for speeds > 2.0 (ffmpeg atempo filter is limited between 0.5 and 2.0)
	var filters []string
	tempFactor := speed
	for tempFactor > 2.0 {
		filters = append(filters, "atempo=2.0")
		tempFactor /= 2.0
	}
	filters = append(filters, fmt.Sprintf("atempo=%.4f", tempFactor))
	filterStr := strings.Join(filters, ",")

	cmdCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	// Direct in-memory piping
	cmd := exec.CommandContext(cmdCtx, "ffmpeg", "-y", "-i", "pipe:0", "-filter:a", filterStr, "-f", "wav", "pipe:1")

	var stdoutBuf bytes.Buffer
	var stderrBuf bytes.Buffer
	cmd.Stdout = &stdoutBuf
	cmd.Stderr = &stderrBuf
	cmd.Stdin = bytes.NewReader(wavBytes)

	if err := cmd.Run(); err != nil {
		stderrStr := stderrBuf.String()
		return nil, fmt.Errorf("ffmpeg speedup failed: %w (stderr: %s)", err, stderrStr)
	}

	return stdoutBuf.Bytes(), nil
}
