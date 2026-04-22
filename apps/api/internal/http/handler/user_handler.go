package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	httpmw "github.com/unitechio/eLearning/apps/api/internal/http/middleware"
	"github.com/unitechio/eLearning/apps/api/internal/service"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type UserHandler struct {
	svc service.UserService
}

func NewUserHandler(svc service.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

// GetMe godoc
// @Summary      Get current user profile
// @Tags         users
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=model.User}
// @Failure      401  {object}  response.Envelope
// @Failure      404  {object}  response.Envelope
// @Router       /users/me [get]
func (h *UserHandler) GetMe(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}

	user, err := h.svc.GetByID(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "profile fetched", user)
}

// UpdateMe godoc
// @Summary      Update current user profile
// @Tags         users
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      service.UpdateProfileRequest  true  "Profile data"
// @Success      200   {object}  response.Envelope{data=model.User}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /users/me [put]
func (h *UserHandler) UpdateMe(c *gin.Context) {
	var req service.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}

	user, err := h.svc.UpdateProfile(userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "profile updated", user)
}

func currentUserID(c *gin.Context) (uuid.UUID, bool) {
	val, exists := c.Get(httpmw.ContextKeyUserID)
	if !exists {
		return uuid.UUID{}, false
	}
	userID, ok := val.(uuid.UUID)
	return userID, ok
}
