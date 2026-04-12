package writing

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/middleware"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type Handler struct{ svc Service }

func NewHandler(svc Service) *Handler { return &Handler{svc: svc} }

// Submit godoc
// @Summary      Submit a writing response for AI evaluation
// @Tags         writing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      SubmitRequest  true  "Writing submission"
// @Success      201   {object}  response.Envelope{data=Submission}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /writing/submit [post]
func (h *Handler) Submit(c *gin.Context) {
	var req SubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	uid := c.GetUint(middleware.ContextKeyUserID)
	sub, err := h.svc.Submit(uid, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "submission graded", sub)
}

// GetHistory godoc
// @Summary      Get user's writing submission history
// @Tags         writing
// @Security     BearerAuth
// @Produce      json
// @Param        page      query  int  false  "Page number (default: 1)"
// @Param        page_size query  int  false  "Page size (default: 10, max: 50)"
// @Success      200  {object}  response.Envelope{data=HistoryResponse}
// @Failure      401  {object}  response.Envelope
// @Router       /writing/history [get]
func (h *Handler) GetHistory(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	uid := c.GetUint(middleware.ContextKeyUserID)
	res, err := h.svc.GetHistory(uid, page, pageSize)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "history fetched", res.Items, &res.Meta)
}
