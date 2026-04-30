package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type AuthHandler struct {
	svc usecase.AuthUsecase
}

func NewAuthHandler(svc usecase.AuthUsecase) *AuthHandler {
	return &AuthHandler{svc: svc}
}

// Register godoc
// @Summary      Register a new user
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.RegisterRequest  true  "Registration payload"
// @Success      201   {object}  response.Envelope{data=dto.AuthResponse}
// @Failure      400   {object}  response.Envelope
// @Failure      409   {object}  response.Envelope
// @Router       /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}

	res, err := h.svc.Register(requestContext(c), req)
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
// @Param        body  body      dto.LoginRequest  true  "Login credentials"
// @Success      200   {object}  response.Envelope{data=dto.AuthResponse}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}

	res, err := h.svc.Login(requestContext(c), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "login successful", res)
}

func (h *AuthHandler) ForgotPassword(c *gin.Context) {
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

func (h *AuthHandler) ResetPassword(c *gin.Context) {
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

func (h *AuthHandler) VerifyEmail(c *gin.Context) {
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

func registerToDomainUser(req dto.RegisterRequest) *domain.User {
	return &domain.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
	}
}
