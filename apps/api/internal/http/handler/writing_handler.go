package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/service"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type WritingHandler struct {
	svc service.WritingService
}

func NewWritingHandler(svc service.WritingService) *WritingHandler {
	return &WritingHandler{svc: svc}
}

// Submit godoc
// @Summary      Submit a writing response for AI evaluation
// @Tags         writing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      service.SubmitRequest  true  "Writing submission"
// @Success      201   {object}  response.Envelope{data=model.WritingSubmission}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /writing/submit [post]
// @Router       /writing/submissions [post]
func (h *WritingHandler) Submit(c *gin.Context) {
	var req service.SubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}

	submission, err := h.svc.Submit(userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "submission graded", submission)
}

// GetHistory godoc
// @Summary      Get writing submission history
// @Tags         writing
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int  false  "Page number"
// @Param        page_size  query     int  false  "Page size"
// @Success      200        {object}  response.Envelope{data=[]model.WritingSubmission}
// @Failure      401        {object}  response.Envelope
// @Router       /writing/history [get]
// @Router       /writing/submissions [get]
func (h *WritingHandler) GetHistory(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}

	res, err := h.svc.GetHistory(userID, page, pageSize)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "history fetched", res.Items, &res.Meta)
}

// GetSubmission godoc
// @Summary      Get a writing submission by id
// @Tags         writing
// @Security     BearerAuth
// @Produce      json
// @Param        submissionId  path      string  true  "Submission ID"
// @Success      200           {object}  response.Envelope{data=model.WritingSubmission}
// @Failure      400           {object}  response.Envelope
// @Failure      401           {object}  response.Envelope
// @Failure      404           {object}  response.Envelope
// @Router       /writing/submissions/{submissionId} [get]
func (h *WritingHandler) GetSubmission(c *gin.Context) {
	submissionID, err := uuid.Parse(c.Param("submissionId"))
	if err != nil {
		response.Fail(c, 400, "invalid submission id")
		return
	}

	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}

	item, err := h.svc.GetSubmissionByID(userID, submissionID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "submission fetched", item)
}
