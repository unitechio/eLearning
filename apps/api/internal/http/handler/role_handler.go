package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type RoleHandler struct {
	svc usecase.RoleUsecase
}

func NewRoleHandler(svc usecase.RoleUsecase) *RoleHandler {
	return &RoleHandler{svc: svc}
}

type AssignPermissionsRequest struct {
	PermissionIDs []string `json:"permission_ids" binding:"required"`
}

// Create godoc
// @Summary      Create role
// @Tags         roles
// @Accept       json
// @Produce      json
// @Param        body  body      domain.Role  true  "Role payload"
// @Success      201   {object}  response.Envelope{data=domain.Role}
// @Router       /roles [post]
func (h *RoleHandler) Create(c *gin.Context) {
	var req domain.Role
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if err := h.svc.Create(requestContext(c), &req); err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "role created", req)
}

// Get godoc
// @Summary      Get role
// @Tags         roles
// @Produce      json
// @Param        id   path      string  true  "Role ID"
// @Success      200  {object}  response.Envelope{data=domain.Role}
// @Router       /roles/{id} [get]
func (h *RoleHandler) Get(c *gin.Context) {
	item, err := h.svc.GetByID(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "role fetched", item)
}

// List godoc
// @Summary      List roles
// @Tags         roles
// @Produce      json
// @Param        page       query     int   false  "Page number"
// @Param        page_size  query     int   false  "Page size"
// @Param        is_active  query     bool  false  "Filter by active state"
// @Success      200  {object}  response.Envelope{data=[]domain.Role}
// @Router       /roles [get]
func (h *RoleHandler) List(c *gin.Context) {
	var query dto.RoleFilter
	if !bindQueryOrAbort(c, &query) {
		return
	}
	items, total, err := h.svc.List(requestContext(c), query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	page := query.Page
	if page < 1 {
		page = 1
	}
	pageSize := query.PageSize
	if pageSize < 1 {
		pageSize = 20
	}
	totalPages := int((total + int64(pageSize) - 1) / int64(pageSize))
	meta := response.Meta{Page: page, PageSize: pageSize, TotalItems: total, TotalPages: totalPages}
	response.OKWithMeta(c, "roles fetched", items, &meta)
}

// Update godoc
// @Summary      Update role
// @Tags         roles
// @Accept       json
// @Produce      json
// @Param        id    path      string       true  "Role ID"
// @Param        body  body      domain.Role  true  "Role payload"
// @Success      200   {object}  response.Envelope{data=domain.Role}
// @Router       /roles/{id} [put]
func (h *RoleHandler) Update(c *gin.Context) {
	var req domain.Role
	if !bindJSONOrAbort(c, &req) {
		return
	}
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Fail(c, 400, "invalid role id")
		return
	}
	req.ID = uint(id)
	if err := h.svc.Update(requestContext(c), &req); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "role updated", req)
}

// Delete godoc
// @Summary      Delete role
// @Tags         roles
// @Produce      json
// @Param        id   path      string  true  "Role ID"
// @Success      200  {object}  response.Envelope
// @Router       /roles/{id} [delete]
func (h *RoleHandler) Delete(c *gin.Context) {
	if err := h.svc.Delete(requestContext(c), c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "role deleted", gin.H{"deleted": true})
}

// AssignPermissions godoc
// @Summary      Assign permissions to role
// @Tags         roles
// @Accept       json
// @Produce      json
// @Param        id    path      string                          true  "Role ID"
// @Param        body  body      handler.AssignPermissionsRequest true  "Permissions payload"
// @Success      200   {object}  response.Envelope
// @Router       /roles/{id}/permissions [put]
func (h *RoleHandler) AssignPermissions(c *gin.Context) {
	var req AssignPermissionsRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if err := h.svc.AssignPermissions(requestContext(c), c.Param("id"), req.PermissionIDs); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "role permissions updated", gin.H{"role_id": c.Param("id"), "permission_ids": req.PermissionIDs})
}
