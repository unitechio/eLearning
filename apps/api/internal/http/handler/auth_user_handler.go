package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

// Refresh godoc
// @Summary      Refresh access token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.TokenRefreshRequest  true  "Refresh token payload"
// @Success      200   {object}  response.Envelope
// @Failure      400   {object}  response.Envelope
// @Router       /auth/refresh [post]
func (h *AuthWorkflowHandler) Refresh(c *gin.Context) {
	var req dto.TokenRefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.Refresh(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "token refreshed", res)
}

// Logout godoc
// @Summary      Logout current user
// @Tags         auth
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope
// @Failure      401  {object}  response.Envelope
// @Router       /auth/logout [post]
func (h *AuthWorkflowHandler) Logout(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	if err := h.svc.Logout(userID); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "logout successful", gin.H{"logged_out": true})
}

// VerifyEmail godoc
// @Summary      Verify email address
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.VerifyEmailRequest  true  "Verify email payload"
// @Success      200   {object}  response.Envelope
// @Failure      400   {object}  response.Envelope
// @Router       /auth/verify-email [post]
func (h *AuthWorkflowHandler) VerifyEmail(c *gin.Context) {
	var req dto.VerifyEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	if err := h.svc.VerifyEmail(req); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "email verified", gin.H{"verified": true})
}

// ForgotPassword godoc
// @Summary      Request password reset
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.ForgotPasswordRequest  true  "Forgot password payload"
// @Success      200   {object}  response.Envelope
// @Failure      400   {object}  response.Envelope
// @Router       /auth/forgot-password [post]
func (h *AuthWorkflowHandler) ForgotPassword(c *gin.Context) {
	var req dto.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	if err := h.svc.ForgotPassword(req); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "password reset email requested", gin.H{"sent": true})
}

// ResetPassword godoc
// @Summary      Reset password
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.ResetPasswordRequest  true  "Reset password payload"
// @Success      200   {object}  response.Envelope
// @Failure      400   {object}  response.Envelope
// @Router       /auth/reset-password [post]
func (h *AuthWorkflowHandler) ResetPassword(c *gin.Context) {
	var req dto.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	if err := h.svc.ResetPassword(req); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "password reset successful", gin.H{"updated": true})
}

// GetProgress godoc
// @Summary      Get current user course progress
// @Tags         users
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]dto.UserProgress}
// @Failure      401  {object}  response.Envelope
// @Router       /users/progress [get]
func (h *UserInsightsHandler) GetProgress(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	items, err := h.svc.GetProgress(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "progress fetched", items)
}

// GetStats godoc
// @Summary      Get current user stats
// @Tags         users
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.UserStats}
// @Failure      401  {object}  response.Envelope
// @Router       /users/stats [get]
func (h *UserInsightsHandler) GetStats(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	stats, err := h.svc.GetStats(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "stats fetched", stats)
}

// GetActivities godoc
// @Summary      Get current user activities
// @Tags         users
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by title or description"
// @Param        type       query     string  false  "Filter by activity type"
// @Success      200  {object}  response.Envelope{data=[]dto.UserActivityItem}
// @Failure      401  {object}  response.Envelope
// @Router       /users/activities [get]
func (h *UserInsightsHandler) GetActivities(c *gin.Context) {
	var query dto.UserActivityListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	res, err := h.svc.GetActivities(userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "activities fetched", res.Items, &res.Meta)
}
