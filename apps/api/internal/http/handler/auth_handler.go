package handler

import (
	"einfra/api/pkg/errorx"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type AuthHandler struct {
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthUsecase) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// Register godoc
// @Summary      Register a new user
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      service.RegisterRequest  true  "Registration payload"
// @Success      201   {object}  response.Envelope{data=service.AuthResponse}
// @Failure      400   {object}  response.Envelope
// @Failure      409   {object}  response.Envelope
// @Router       /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req service.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	res, err := h.authService.Register(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "registration successful", res)
}

// Login godoc
// @Summary      Login with email and password
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      service.LoginRequest  true  "Login credentials"
// @Success      200   {object}  response.Envelope{data=service.AuthResponse}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req service.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	res, err := h.authService.Login(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "login successful", res)
}

// ForgotPassword handles password reset requests
// @Summary Request Password Reset
// @Description Request a password reset token via email
// @Tags auth
// @Accept json
// @Produce json
// @Param request body struct{Email string `json:"email"`} true "Email address"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Router /auth/forgot-password [post]
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(errorx.New(http.StatusBadRequest, "Invalid request body"))
		return
	}

	resetReq := &domain.PasswordResetRequest{Email: req.Email}
	if err := h.authService.RequestPasswordReset(c.Request.Context(), resetReq); err != nil {
		// Don't reveal if email exists or not for security
		c.JSON(http.StatusOK, gin.H{"message": "If the email exists, a password reset link has been sent"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "If the email exists, a password reset link has been sent"})
}

// ResetPassword handles password reset with token
// @Summary Reset Password
// @Description Reset password using reset token
// @Tags auth
// @Accept json
// @Produce json
// @Param request body domain.PasswordResetConfirm true "Reset token and new password"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Router /auth/reset-password [post]
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req domain.PasswordResetConfirm
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(errorx.New(http.StatusBadRequest, "Invalid request body"))
		return
	}

	if err := h.authService.ResetPassword(c.Request.Context(), &req); err != nil {
		c.Error(errorx.New(http.StatusBadRequest, err.Error()))
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}

// VerifyEmail handles email verification
// @Summary Verify Email
// @Description Verify user email with verification token
// @Tags auth
// @Accept json
// @Produce json
// @Param request body domain.EmailVerificationRequest true "Verification token"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Router /auth/verify-email [post]
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	var req domain.EmailVerificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(errorx.New(http.StatusBadRequest, "Invalid request body"))
		return
	}

	if err := h.authService.VerifyEmail(c.Request.Context(), &req); err != nil {
		c.Error(errorx.New(http.StatusBadRequest, err.Error()))
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email verified successfully"})
}
