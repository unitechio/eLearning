package user

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/middleware"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type Handler struct{ svc Service }

func NewHandler(svc Service) *Handler { return &Handler{svc: svc} }

// GetMe godoc
// @Summary      Get current user profile
// @Tags         users
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=User}
// @Failure      401  {object}  response.Envelope
// @Failure      404  {object}  response.Envelope
// @Router       /users/me [get]
func (h *Handler) GetMe(c *gin.Context) {
	uid := c.GetUint(middleware.ContextKeyUserID)
	u, err := h.svc.GetByID(uid)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "profile fetched", u)
}

// UpdateMe godoc
// @Summary      Update current user profile
// @Tags         users
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      UpdateProfileRequest  true  "Profile data"
// @Success      200   {object}  response.Envelope{data=User}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /users/me [put]
func (h *Handler) UpdateMe(c *gin.Context) {
	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	uid := c.GetUint(middleware.ContextKeyUserID)
	u, err := h.svc.UpdateProfile(uid, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "profile updated", u)
}
