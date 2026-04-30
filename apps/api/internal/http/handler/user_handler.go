package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type UserHandler struct {
	svc usecase.UserService
}

func NewUserHandler(svc usecase.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

// GetMe godoc
// @Summary      Get current user profile
// @Tags         users
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=domain.User}
// @Failure      401  {object}  response.Envelope
// @Failure      404  {object}  response.Envelope
// @Router       /users/me [get]
func (h *UserHandler) GetMe(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	user, err := h.svc.GetByID(requestContext(c), userID)
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
// @Param        body  body      usecase.UpdateProfileRequest  true  "Profile data"
// @Success      200   {object}  response.Envelope{data=domain.User}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /users/me [put]
func (h *UserHandler) UpdateMe(c *gin.Context) {
	var req usecase.UpdateProfileRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	user, err := h.svc.UpdateProfile(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "profile updated", user)
}
