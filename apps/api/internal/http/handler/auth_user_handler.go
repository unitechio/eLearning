package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type AuthWorkflowHandler struct {
	svc usecase.AuthUsecase
}

type UserInsightsHandler struct {
	svc usecase.UserInsightsService
}

func NewAuthWorkflowHandler(svc usecase.AuthUsecase) *AuthWorkflowHandler {
	return &AuthWorkflowHandler{svc: svc}
}

func NewUserInsightsHandler(svc usecase.UserInsightsService) *UserInsightsHandler {
	return &UserInsightsHandler{svc: svc}
}

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
	if !bindJSONOrAbort(c, &req) {
		return
	}
	res, err := h.svc.RefreshToken(requestContext(c), req.RefreshToken)
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
	if _, ok := currentUserIDOrAbort(c); !ok {
		return
	}
	token := c.GetHeader("Authorization")
	if token == "" {
		response.Fail(c, 401, "authorization header is missing")
		return
	}
	if err := h.svc.Logout(requestContext(c), token); err != nil {
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
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if err := h.svc.VerifyEmail(requestContext(c), req); err != nil {
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
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if err := h.svc.RequestPasswordReset(requestContext(c), req); err != nil {
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
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if err := h.svc.ResetPassword(requestContext(c), req); err != nil {
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
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	items, err := h.svc.GetProgress(requestContext(c), userID)
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
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	stats, err := h.svc.GetStats(requestContext(c), userID)
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
	if !bindQueryOrAbort(c, &query) {
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	res, err := h.svc.GetActivities(requestContext(c), userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "activities fetched", res.Items, &res.Meta)
}
