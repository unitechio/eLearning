package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type AuthorizationHandler struct {
	authzSvc usecase.AuthorizationService
	permSvc  usecase.PermissionUsecase
}

func NewAuthorizationHandler(authzSvc usecase.AuthorizationService, permSvc usecase.PermissionUsecase) *AuthorizationHandler {
	return &AuthorizationHandler{authzSvc: authzSvc, permSvc: permSvc}
}

// GetMyAccessProfile godoc
// @Summary      Get current access profile
// @Tags         authorization
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.AccessProfile}
// @Router       /authorization/me [get]
func (h *AuthorizationHandler) GetMyAccessProfile(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	profile, err := h.authzSvc.GetAccessProfile(requestContext(c), userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "access profile fetched", profile)
}

// GrantResourcePermission godoc
// @Summary      Grant direct permissions to user
// @Tags         authorization
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AuthorizationPermissionAssignmentRequest  true  "Permission assignment payload"
// @Success      200   {object}  response.Envelope
// @Router       /permissions/grant [post]
func (h *AuthorizationHandler) GrantResourcePermission(c *gin.Context) {
	actorID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.AuthorizationPermissionAssignmentRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	targetUserID, err := uuid.Parse(req.UserID)
	if err != nil {
		response.Fail(c, 400, "invalid user_id")
		return
	}
	if err := h.authzSvc.GrantPermissions(requestContext(c), actorID, targetUserID, req.PermissionIDs); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "permissions granted", gin.H{"user_id": req.UserID, "permission_ids": req.PermissionIDs})
}

// RevokeResourcePermission godoc
// @Summary      Revoke direct permissions from user
// @Tags         authorization
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AuthorizationPermissionAssignmentRequest  true  "Permission revoke payload"
// @Success      200   {object}  response.Envelope
// @Router       /permissions/revoke [post]
func (h *AuthorizationHandler) RevokeResourcePermission(c *gin.Context) {
	actorID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.AuthorizationPermissionAssignmentRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	targetUserID, err := uuid.Parse(req.UserID)
	if err != nil {
		response.Fail(c, 400, "invalid user_id")
		return
	}
	if err := h.authzSvc.RevokePermissions(requestContext(c), actorID, targetUserID, req.PermissionIDs); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "permissions revoked", gin.H{"user_id": req.UserID, "permission_ids": req.PermissionIDs})
}

// AssignEnvironmentRole godoc
// @Summary      Assign role to user
// @Tags         authorization
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AuthorizationRoleAssignmentRequest  true  "Role assignment payload"
// @Success      200   {object}  response.Envelope
// @Router       /permissions/assign-role [post]
func (h *AuthorizationHandler) AssignEnvironmentRole(c *gin.Context) {
	actorID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.AuthorizationRoleAssignmentRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	targetUserID, err := uuid.Parse(req.UserID)
	if err != nil {
		response.Fail(c, 400, "invalid user_id")
		return
	}
	if err := h.authzSvc.AssignRole(requestContext(c), actorID, targetUserID, req.RoleID); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "role assigned", gin.H{"user_id": req.UserID, "role_id": req.RoleID})
}

// RemoveEnvironmentRole godoc
// @Summary      Remove role from user
// @Tags         authorization
// @Produce      json
// @Param        id       path      int     true  "Role ID"
// @Param        user_id  query     string  true  "User ID"
// @Success      200      {object}  response.Envelope
// @Router       /permissions/environment-roles/{id} [delete]
func (h *AuthorizationHandler) RemoveEnvironmentRole(c *gin.Context) {
	actorID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	roleIDValue, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Fail(c, 400, "invalid role id")
		return
	}
	targetUserID, err := uuid.Parse(c.Query("user_id"))
	if err != nil {
		response.Fail(c, 400, "invalid user_id")
		return
	}
	if err := h.authzSvc.RemoveRole(requestContext(c), actorID, targetUserID, uint(roleIDValue)); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "role removed", gin.H{"user_id": targetUserID.String(), "role_id": uint(roleIDValue)})
}

// GetUserPermissions godoc
// @Summary      Get user access profile
// @Tags         authorization
// @Produce      json
// @Param        user_id  path      string  true  "User ID"
// @Success      200      {object}  response.Envelope{data=dto.AccessProfile}
// @Router       /users/{user_id}/permissions [get]
func (h *AuthorizationHandler) GetUserPermissions(c *gin.Context) {
	userID, err := uuid.Parse(c.Param("user_id"))
	if err != nil {
		response.Fail(c, 400, "invalid user_id")
		return
	}
	profile, err := h.authzSvc.GetAccessProfile(requestContext(c), userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "user access profile fetched", profile)
}

// GetResourcePermissions godoc
// @Summary      List available permissions for a resource
// @Tags         authorization
// @Produce      json
// @Param        resource_type  path      string  true  "Resource type"
// @Param        resource_id    path      string  true  "Resource identifier"
// @Success      200            {object}  response.Envelope
// @Router       /resources/{resource_type}/{resource_id}/permissions [get]
func (h *AuthorizationHandler) GetResourcePermissions(c *gin.Context) {
	resourceType := c.Param("resource_type")
	items, err := h.permSvc.GetByResource(requestContext(c), resourceType)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "resource permissions fetched", gin.H{
		"resource_type": resourceType,
		"resource_id":   c.Param("resource_id"),
		"permissions":   items,
	})
}

// CleanupExpiredPermissions godoc
// @Summary      Cleanup expired authorization grants
// @Tags         authorization
// @Produce      json
// @Success      200  {object}  response.Envelope
// @Router       /permissions/cleanup [post]
func (h *AuthorizationHandler) CleanupExpiredPermissions(c *gin.Context) {
	response.OK(c, "no expiring authorization grants configured", gin.H{"deleted_count": 0})
}
