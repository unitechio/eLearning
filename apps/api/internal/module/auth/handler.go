package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/owner/eenglish/api/internal/pkg/response"
)

type Handler struct {
	Service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{Service: s}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	token, user, err := h.Service.Login(req.Email, req.Password)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	response.Success(c, http.StatusOK, "Login successful", gin.H{
		"token": token,
		"user":  user,
	})
}

func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	user, err := h.Service.Register(req.Name, req.Email, req.Password)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Could not register user")
		return
	}

	response.Success(c, http.StatusCreated, "User registered successfully", user)
}
