package user

import (
	"fmt"
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

func (h *Handler) GetMe(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	idStr := fmt.Sprintf("%v", userID)
	user, err := h.Service.GetUser(idStr)
	if err != nil {
		response.Error(c, http.StatusNotFound, "User not found")
		return
	}

	response.Success(c, http.StatusOK, "User fetched successfully", user)
}
