package handler

import (
	"io"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type SpeakingHandler struct {
	svc service.SpeakingService
}

func NewSpeakingHandler(svc service.SpeakingUsecase) *SpeakingHandler {
	return &SpeakingHandler{svc: svc}
}

// Analyze godoc
// @Summary      Analyze speaking audio
// @Tags         speaking
// @Security     BearerAuth
// @Accept       multipart/form-data
// @Produce      json
// @Param        audio  formData  file  true  "Audio file (webm/wav/mp3)"
// @Success      200    {object}  response.Envelope{data=service.AnalyzeResult}
// @Failure      400    {object}  response.Envelope
// @Failure      401    {object}  response.Envelope
// @Failure      500    {object}  response.Envelope
// @Router       /speaking/analyze [post]
func (h *SpeakingHandler) Analyze(c *gin.Context) {
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
		response.Fail(c, 400, "failed to parse multipart form")
		return
	}

	file, _, err := c.Request.FormFile("audio")
	if err != nil {
		response.Fail(c, 400, "audio field is required")
		return
	}
	defer file.Close()

	audioData, err := io.ReadAll(file)
	if err != nil {
		response.Fail(c, 500, "failed to read audio file")
		return
	}

	result, err := h.svc.AnalyzeAudio(audioData)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "analysis complete", result)
}
