package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type AdminHandler struct {
	adminSvc usecase.AdminService
}

type BillingHandler struct {
	svc usecase.BillingService
}

func NewAdminHandler(adminSvc usecase.AdminService) *AdminHandler {
	return &AdminHandler{adminSvc: adminSvc}
}

func NewBillingHandler(svc usecase.BillingService) *BillingHandler {
	return &BillingHandler{svc: svc}
}

// ListUsers godoc
// @Summary      List admin users
// @Tags         admin
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by email or name"
// @Param        status     query     string  false  "Filter by status"
// @Success      200  {object}  response.Envelope{data=[]dto.AdminUser}
// @Router       /admin/users [get]
func (h *AdminHandler) ListUsers(c *gin.Context) {
	var query dto.AdminUserListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.adminSvc.ListUsers(query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "admin users fetched", res.Items, &res.Meta)
}

// UpdateUserStatus godoc
// @Summary      Update user status
// @Tags         admin
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                          true  "User ID"
// @Param        body  body      dto.UpdateUserStatusRequest  true  "Status payload"
// @Success      200   {object}  response.Envelope{data=dto.AdminUser}
// @Router       /admin/users/{id}/status [put]
func (h *AdminHandler) UpdateUserStatus(c *gin.Context) {
	var req dto.UpdateUserStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.adminSvc.UpdateUserStatus(c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "user status updated", item)
}

// ListCourses godoc
// @Summary      List admin courses
// @Tags         admin
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by title or description"
// @Param        domain     query     string  false  "Filter by domain"
// @Param        level      query     string  false  "Filter by level"
// @Param        status     query     string  false  "Filter by status"
// @Success      200  {object}  response.Envelope{data=[]dto.Course}
// @Router       /admin/courses [get]
func (h *AdminHandler) ListCourses(c *gin.Context) {
	var query dto.CourseListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.adminSvc.ListCourses(query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "admin courses fetched", res.Items, &res.Meta)
}

// CreateCourse godoc
// @Summary      Create admin course
// @Tags         admin
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.UpsertCourseRequest  true  "Course payload"
// @Success      201   {object}  response.Envelope{data=dto.Course}
// @Router       /admin/courses [post]
func (h *AdminHandler) CreateCourse(c *gin.Context) { h.courseCreateOrUpdate(c, true) }

// UpdateCourse godoc
// @Summary      Update admin course
// @Tags         admin
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                     true  "Course ID"
// @Param        body  body      dto.UpsertCourseRequest  true  "Course payload"
// @Success      200   {object}  response.Envelope{data=dto.Course}
// @Router       /admin/courses/{id} [put]
func (h *AdminHandler) UpdateCourse(c *gin.Context) { h.courseCreateOrUpdate(c, false) }
func (h *AdminHandler) courseCreateOrUpdate(c *gin.Context, create bool) {
	var req dto.UpsertCourseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	var item any
	var err error
	if create {
		item, err = h.adminSvc.CreateCourse(req)
	} else {
		item, err = h.adminSvc.UpdateCourse(c.Param("id"), req)
	}
	if err != nil {
		_ = c.Error(err)
		return
	}
	if create {
		response.Created(c, "admin course created", item)
	} else {
		response.OK(c, "admin course updated", item)
	}
}

// DeleteCourse godoc
// @Summary      Delete admin course
// @Tags         admin
// @Security     BearerAuth
// @Param        id  path  string  true  "Course ID"
// @Success      204
// @Router       /admin/courses/{id} [delete]
func (h *AdminHandler) DeleteCourse(c *gin.Context) {
	if err := h.adminSvc.DeleteCourse(c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.NoContent(c)
}

// Analytics godoc
// @Summary      Get admin analytics
// @Tags         admin
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.AnalyticsSnapshot}
// @Router       /admin/analytics [get]
func (h *AdminHandler) Analytics(c *gin.Context) {
	item, err := h.adminSvc.GetAnalytics()
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "analytics fetched", item)
}

// AIUsage godoc
// @Summary      Get admin AI usage
// @Tags         admin
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.AIUsageSnapshot}
// @Router       /admin/ai-usage [get]
func (h *AdminHandler) AIUsage(c *gin.Context) {
	item, err := h.adminSvc.GetAIUsage()
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "ai usage fetched", item)
}

// Plans godoc
// @Summary      List billing plans
// @Tags         billing
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by plan name or description"
// @Param        currency   query     string  false  "Filter by currency"
// @Success      200  {object}  response.Envelope{data=[]dto.BillingPlan}
// @Router       /billing/plans [get]
func (h *BillingHandler) Plans(c *gin.Context) {
	var query dto.BillingPlanListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.ListPlans(query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "billing plans fetched", res.Items, &res.Meta)
}

// Subscribe godoc
// @Summary      Subscribe billing plan
// @Tags         billing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.SubscribeRequest  true  "Subscription payload"
// @Success      200   {object}  response.Envelope
// @Router       /billing/subscribe [post]
func (h *BillingHandler) Subscribe(c *gin.Context) {
	var req dto.SubscribeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.Subscribe(userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "subscription created", item)
}

// History godoc
// @Summary      Get billing history
// @Tags         billing
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by plan name"
// @Param        status     query     string  false  "Filter by payment status"
// @Success      200  {object}  response.Envelope{data=[]dto.BillingHistoryItem}
// @Router       /billing/history [get]
func (h *BillingHandler) History(c *gin.Context) {
	var query dto.BillingHistoryQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	res, err := h.svc.ListBillingHistory(userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "billing history fetched", res.Items, &res.Meta)
}

// AdminPlans godoc
// @Summary      List admin billing plans
// @Tags         admin-billing
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by plan name or code"
// @Param        currency   query     string  false  "Filter by currency"
// @Param        active     query     bool    false  "Filter by active"
// @Success      200  {object}  response.Envelope{data=[]dto.AdminBillingPlan}
// @Router       /admin/billing/plans [get]
func (h *BillingHandler) AdminPlans(c *gin.Context) {
	var query dto.AdminBillingPlanListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.ListAdminPlans(query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "admin billing plans fetched", res.Items, &res.Meta)
}

// CreatePlan godoc
// @Summary      Create billing plan
// @Tags         admin-billing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.CreateBillingPlanRequest  true  "Plan payload"
// @Success      201   {object}  response.Envelope{data=dto.AdminBillingPlan}
// @Router       /admin/billing/plans [post]
func (h *BillingHandler) CreatePlan(c *gin.Context) {
	var req dto.CreateBillingPlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.CreatePlan(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "billing plan created", item)
}

// UpdatePlan godoc
// @Summary      Update billing plan
// @Tags         admin-billing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                        true  "Plan ID"
// @Param        body  body      dto.UpdateBillingPlanRequest  true  "Plan payload"
// @Success      200   {object}  response.Envelope{data=dto.AdminBillingPlan}
// @Router       /admin/billing/plans/{id} [put]
func (h *BillingHandler) UpdatePlan(c *gin.Context) {
	var req dto.UpdateBillingPlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.UpdatePlan(c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "billing plan updated", item)
}

// DeletePlan godoc
// @Summary      Delete billing plan
// @Tags         admin-billing
// @Security     BearerAuth
// @Param        id  path  string  true  "Plan ID"
// @Success      204
// @Router       /admin/billing/plans/{id} [delete]
func (h *BillingHandler) DeletePlan(c *gin.Context) {
	if err := h.svc.DeletePlan(c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.NoContent(c)
}

// AdminSubscriptions godoc
// @Summary      List subscriptions
// @Tags         admin-billing
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by user email or plan name"
// @Param        status     query     string  false  "Filter by status"
// @Success      200  {object}  response.Envelope{data=[]dto.AdminBillingSubscription}
// @Router       /admin/billing/subscriptions [get]
func (h *BillingHandler) AdminSubscriptions(c *gin.Context) {
	var query dto.AdminBillingSubscriptionListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.ListSubscriptions(query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "billing subscriptions fetched", res.Items, &res.Meta)
}

// GetSubscription godoc
// @Summary      Get subscription
// @Tags         admin-billing
// @Security     BearerAuth
// @Produce      json
// @Param        id  path  string  true  "Subscription ID"
// @Success      200  {object}  response.Envelope{data=dto.AdminBillingSubscription}
// @Router       /admin/billing/subscriptions/{id} [get]
func (h *BillingHandler) GetSubscription(c *gin.Context) {
	item, err := h.svc.GetSubscription(c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "billing subscription fetched", item)
}

// UpdateSubscriptionStatus godoc
// @Summary      Update subscription status
// @Tags         admin-billing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                              true  "Subscription ID"
// @Param        body  body      dto.UpdateSubscriptionStatusRequest true  "Status payload"
// @Success      200   {object}  response.Envelope{data=dto.AdminBillingSubscription}
// @Router       /admin/billing/subscriptions/{id}/status [put]
func (h *BillingHandler) UpdateSubscriptionStatus(c *gin.Context) {
	var req dto.UpdateSubscriptionStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.UpdateSubscriptionStatus(c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "subscription status updated", item)
}

// CancelSubscription godoc
// @Summary      Cancel subscription
// @Tags         admin-billing
// @Security     BearerAuth
// @Produce      json
// @Param        id  path  string  true  "Subscription ID"
// @Success      200  {object}  response.Envelope{data=dto.AdminBillingSubscription}
// @Router       /admin/billing/subscriptions/{id}/cancel [post]
func (h *BillingHandler) CancelSubscription(c *gin.Context) {
	item, err := h.svc.CancelSubscription(c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "subscription cancelled", item)
}

// GrantPremium godoc
// @Summary      Grant premium subscription
// @Tags         admin-billing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.GrantPremiumRequest  true  "Grant premium payload"
// @Success      200   {object}  response.Envelope{data=dto.AdminBillingSubscription}
// @Router       /admin/billing/subscriptions/grant-premium [post]
func (h *BillingHandler) GrantPremium(c *gin.Context) {
	var req dto.GrantPremiumRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.GrantPremium(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "premium granted", item)
}
