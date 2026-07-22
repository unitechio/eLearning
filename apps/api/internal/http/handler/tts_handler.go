package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
	"github.com/unitechio/eLearning/apps/api/pkg/tts"
)

type TTSHandler struct {
	ttsSvc tts.TTSService
}

type TTSRequest struct {
	Text   string  `json:"text" binding:"required"`
	Speed  float64 `json:"speed"`  // e.g. 0.85, 1.0, 1.2
	Locale string  `json:"locale"` // e.g. "vi", "en"
}

func NewTTSHandler(svc tts.TTSService) *TTSHandler {
	return &TTSHandler{ttsSvc: svc}
}

// Synthesize godoc
// @Summary      Synthesize text to speech (neural local piper) and adjust speed
// @Tags         practice
// @Accept       json
// @Produce      audio/wav
// @Param        body  body      TTSRequest  true  "TTS request payload"
// @Success      200   {string}  binary      "wav audio file"
// @Failure      400   {object}  response.Envelope
// @Failure      500   {object}  response.Envelope
// @Router       /public/practice/tts [post]
func (h *TTSHandler) Synthesize(c *gin.Context) {
	var req TTSRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}

	// Validate default speed
	if req.Speed <= 0 {
		req.Speed = 1.0
	}
	if req.Locale == "" {
		req.Locale = "en"
	}

	ctx := requestContext(c)

	// 1. Synthesize audio bytes (WAV format) from Piper neural network
	wavBytes, err := h.ttsSvc.Synthesize(ctx, req.Text, req.Locale)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	// 2. Adjust audio playback speed using FFmpeg filter
	finalBytes, err := h.ttsSvc.AdjustSpeed(ctx, wavBytes, req.Speed)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	// Output raw audio directly
	c.Header("Content-Type", "audio/wav")
	c.Data(http.StatusOK, "audio/wav", finalBytes)
}
