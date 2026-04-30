package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type ProgressHandler struct {
	svc usecase.ProgressService
}

type PlannerHandler struct {
	svc usecase.PlannerService
}

type NotificationHandler struct {
	svc usecase.NotificationService
}

func NewProgressHandler(svc usecase.ProgressService) *ProgressHandler {
	return &ProgressHandler{svc: svc}
}

func NewPlannerHandler(svc usecase.PlannerService) *PlannerHandler {
	return &PlannerHandler{svc: svc}
}

func NewNotificationHandler(svc usecase.NotificationService) *NotificationHandler {
	return &NotificationHandler{svc: svc}
}

// Overall godoc
// @Summary      Get overall progress
// @Tags         progress
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.ProgressSnapshot}
// @Router       /progress [get]
func (h *ProgressHandler) Overall(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GetOverall(requestContext(c), userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "overall progress fetched", item)
}

// Course godoc
// @Summary      Get course progress
// @Tags         progress
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Course ID"
// @Success      200  {object}  response.Envelope
// @Router       /progress/course/{id} [get]
func (h *ProgressHandler) Course(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GetCourseProgress(requestContext(c), userID, c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "course progress fetched", item)
}

// Activity godoc
// @Summary      Get activity progress
// @Tags         progress
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Activity ID"
// @Success      200  {object}  response.Envelope
// @Router       /progress/activity/{id} [get]
func (h *ProgressHandler) Activity(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GetActivityProgress(requestContext(c), userID, c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "activity progress fetched", item)
}

// Get godoc
// @Summary      Get study planner
// @Tags         planner
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.Planner}
// @Router       /planner [get]
func (h *PlannerHandler) Get(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GetPlanner(requestContext(c), userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "planner fetched", item)
}

// Generate godoc
// @Summary      Generate study planner
// @Tags         planner
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.Planner}
// @Router       /planner/generate [post]
func (h *PlannerHandler) Generate(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GeneratePlanner(requestContext(c), userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "planner generated", item)
}

// Update godoc
// @Summary      Update study planner
// @Tags         planner
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.PlannerUpdateRequest  true  "Planner payload"
// @Success      200   {object}  response.Envelope{data=dto.Planner}
// @Router       /planner/update [put]
func (h *PlannerHandler) Update(c *gin.Context) {
	var req dto.PlannerUpdateRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.UpdatePlanner(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "planner updated", item)
}

// List godoc
// @Summary      List notifications
// @Tags         notifications
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int      false  "Page number"
// @Param        page_size  query     int      false  "Page size"
// @Param        q          query     string   false  "Search title or message"
// @Param        category   query     string   false  "Filter by category"
// @Param        is_read    query     bool     false  "Filter by read status"
// @Success      200  {object}  response.Envelope{data=[]dto.NotificationItem}
// @Router       /notifications [get]
func (h *NotificationHandler) List(c *gin.Context) {
	var query dto.NotificationListQuery
	if !bindQueryOrAbort(c, &query) {
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	res, err := h.svc.ListNotifications(requestContext(c), userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "notifications fetched", res.Items, &res.Meta)
}

// Read godoc
// @Summary      Mark notification as read
// @Tags         notifications
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Notification ID"
// @Success      200  {object}  response.Envelope
// @Router       /notifications/{id}/read [put]
func (h *NotificationHandler) Read(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	if err := h.svc.MarkAsRead(requestContext(c), userID, c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "notification marked as read", gin.H{"id": c.Param("id"), "read": true})
}
