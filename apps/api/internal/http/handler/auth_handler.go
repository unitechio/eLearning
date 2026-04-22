package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/service"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type AuthHandler struct {
	svc service.AuthService
}

func NewAuthHandler(svc service.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
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

	res, err := h.svc.Register(req)
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

	res, err := h.svc.Login(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "login successful", res)
}
