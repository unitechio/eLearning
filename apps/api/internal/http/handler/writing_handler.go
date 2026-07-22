package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type WritingHandler struct {
	svc usecase.WritingService
}

func NewWritingHandler(svc usecase.WritingService) *WritingHandler {
	return &WritingHandler{svc: svc}
}

// Submit godoc
// @Summary      Submit a writing response for AI evaluation
// @Description  Submits a writing response (task 1 or task 2). Triggers automatic AI grading by band score criteria.
// @Tags         writing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      usecase.SubmitRequest  true  "Writing submission"
// @Success      201   {object}  response.Envelope{data=domain.WritingSubmission}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /writing/submissions [post]
func (h *WritingHandler) Submit(c *gin.Context) {
	var req usecase.SubmitRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	submission, err := h.svc.Submit(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "submission graded", submission)
}

// GetHistory godoc
// @Summary      Get writing submission history
// @Description  Returns paginated list of the authenticated user's writing submissions with grades.
// @Tags         writing
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int  false  "Page number"
// @Param        page_size  query     int  false  "Page size"
// @Success      200        {object}  response.Envelope{data=[]domain.WritingSubmission}
// @Failure      401        {object}  response.Envelope
// @Router       /writing/submissions [get]
func (h *WritingHandler) GetHistory(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	res, err := h.svc.GetHistory(requestContext(c), userID, page, pageSize)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "history fetched", res.Items, &res.Meta)
}

// GetSubmission godoc
// @Summary      Get a writing submission by id
// @Description  Returns a single writing submission with full AI grading details and teacher feedback.
// @Tags         writing
// @Security     BearerAuth
// @Produce      json
// @Param        submissionId  path      string  true  "Submission ID (UUID)"
// @Success      200           {object}  response.Envelope{data=domain.WritingSubmission}
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
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GetSubmissionByID(requestContext(c), userID, submissionID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "submission fetched", item)
}

// AdminListSubmissions godoc
// @Summary      List all writing submissions (admin)
// @Description  Returns paginated list of writing submissions across all users. Used by admins and teachers to manage grading.
// @Tags         admin-writing
// @Security     BearerAuth
// @Produce      json
// @Param        page        query  int     false  "Page number"
// @Param        page_size   query  int     false  "Page size"
// @Param        q           query  string  false  "Search by user email or title"
// @Param        status      query  string  false  "Filter by status: pending, graded, reviewed"
// @Param        task_type   query  string  false  "Filter by task type: task1, task2"
// @Param        from_date   query  string  false  "From date (YYYY-MM-DD)"
// @Param        to_date     query  string  false  "To date (YYYY-MM-DD)"
// @Success      200  {object}  response.Envelope{data=[]domain.WritingSubmission}
// @Router       /admin/writing/submissions [get]
func (h *WritingHandler) AdminListSubmissions(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	res, err := h.svc.AdminListSubmissions(requestContext(c), page, pageSize)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "admin submissions fetched", res.Items, &res.Meta)
}

// AdminGetSubmission godoc
// @Summary      Get any writing submission by ID (admin)
// @Description  Returns full submission detail including annotated text, scores, and audio feedback for admin/teacher review.
// @Tags         admin-writing
// @Security     BearerAuth
// @Produce      json
// @Param        submissionId  path  string  true  "Submission ID (UUID)"
// @Success      200  {object}  response.Envelope{data=domain.WritingSubmission}
// @Failure      400  {object}  response.Envelope
// @Failure      404  {object}  response.Envelope
// @Router       /admin/writing/submissions/{submissionId} [get]
func (h *WritingHandler) AdminGetSubmission(c *gin.Context) {
	submissionID, err := uuid.Parse(c.Param("submissionId"))
	if err != nil {
		response.Fail(c, 400, "invalid submission id")
		return
	}
	item, err := h.svc.AdminGetSubmissionByID(requestContext(c), submissionID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "submission fetched", item)
}

// AdminReviewSubmission godoc
// @Summary      Submit teacher review for a writing submission
// @Description  Teacher adds manual review notes, audio feedback URL, and optionally overrides AI band scores.
// @Tags         admin-writing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        submissionId  path  string                       true  "Submission ID (UUID)"
// @Param        body          body  usecase.ReviewWritingRequest true  "Review payload with score overrides and audio URL"
// @Success      200  {object}  response.Envelope{data=domain.WritingSubmission}
// @Failure      400  {object}  response.Envelope
// @Router       /admin/writing/submissions/{submissionId}/review [post]
func (h *WritingHandler) AdminReviewSubmission(c *gin.Context) {
	submissionID, err := uuid.Parse(c.Param("submissionId"))
	if err != nil {
		response.Fail(c, 400, "invalid submission id")
		return
	}
	var req usecase.ReviewWritingRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	reviewerID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.AdminReviewSubmission(requestContext(c), reviewerID, submissionID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "review submitted", item)
}
