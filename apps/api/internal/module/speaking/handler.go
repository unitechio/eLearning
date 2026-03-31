package speaking

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/owner/eenglish/api/internal/pkg/response"
)

type Handler struct {
	Service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{Service: s}
}

// POST /speaking/analyze
func (h *Handler) Analyze(c *gin.Context) {
	err := c.Request.ParseMultipartForm(10 << 20) // 10 MB limit
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Failed to parse multipart form")
		return
	}

	file, _, err := c.Request.FormFile("audio")
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Audio file is required")
		return
	}
	defer file.Close()

	audioData, err := io.ReadAll(file)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to read audio file")
		return
	}

	result, err := h.Service.AnalyzeAudio(audioData)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Analysis complete", result)
}
