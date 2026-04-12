package vocabulary

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/middleware"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type Handler struct{ svc Service }

func NewHandler(svc Service) *Handler { return &Handler{svc: svc} }

// GetDueWords godoc
// @Summary      Get vocabulary cards due for review today
// @Tags         vocabulary
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]UserWordProgress}
// @Failure      401  {object}  response.Envelope
// @Router       /vocabulary/due [get]
func (h *Handler) GetDueWords(c *gin.Context) {
	uid := c.GetUint(middleware.ContextKeyUserID)
	items, err := h.svc.GetDueWords(uid)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "due words fetched", items)
}

// SubmitReview godoc
// @Summary      Submit a vocabulary review result
// @Tags         vocabulary
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      ReviewRequest  true  "Review result"
// @Success      200   {object}  response.Envelope{data=UserWordProgress}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /vocabulary/review [post]
func (h *Handler) SubmitReview(c *gin.Context) {
	var req ReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	uid := c.GetUint(middleware.ContextKeyUserID)
	progress, err := h.svc.SubmitReview(uid, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "review submitted", progress)
}

// GetAllWords godoc
// @Summary      Get all vocabulary words
// @Tags         vocabulary
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]Word}
// @Failure      401  {object}  response.Envelope
// @Router       /vocabulary/words [get]
func (h *Handler) GetAllWords(c *gin.Context) {
	words, err := h.svc.GetAllWords()
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "words fetched", words)
}
