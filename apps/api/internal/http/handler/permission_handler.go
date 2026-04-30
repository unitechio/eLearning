package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type PermissionHandler struct {
	svc usecase.PermissionUsecase
}

func NewPermissionHandler(svc usecase.PermissionUsecase) *PermissionHandler {
	return &PermissionHandler{svc: svc}
}

// Create godoc
// @Summary      Create permission
// @Tags         permissions
// @Accept       json
// @Produce      json
// @Param        body  body      domain.Permission  true  "Permission payload"
// @Success      201   {object}  response.Envelope{data=domain.Permission}
// @Router       /permissions [post]
func (h *PermissionHandler) Create(c *gin.Context) {
	var req domain.Permission
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if err := h.svc.Create(requestContext(c), &req); err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "permission created", req)
}

// Get godoc
// @Summary      Get permission
// @Tags         permissions
// @Produce      json
// @Param        id   path      string  true  "Permission ID"
// @Success      200  {object}  response.Envelope{data=domain.Permission}
// @Router       /permissions/{id} [get]
func (h *PermissionHandler) Get(c *gin.Context) {
	item, err := h.svc.GetByID(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "permission fetched", item)
}

// List godoc
// @Summary      List permissions
// @Tags         permissions
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        resource   query     string  false  "Filter by resource"
// @Param        action     query     string  false  "Filter by action"
// @Success      200        {object}  response.Envelope{data=[]domain.Permission}
// @Router       /permissions [get]
func (h *PermissionHandler) List(c *gin.Context) {
	var query dto.PermissionFilter
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
	response.OKWithMeta(c, "permissions fetched", items, &meta)
}

// Update godoc
// @Summary      Update permission
// @Tags         permissions
// @Accept       json
// @Produce      json
// @Param        id    path      string             true  "Permission ID"
// @Param        body  body      domain.Permission  true  "Permission payload"
// @Success      200   {object}  response.Envelope{data=domain.Permission}
// @Router       /permissions/{id} [put]
func (h *PermissionHandler) Update(c *gin.Context) {
	var req domain.Permission
	if !bindJSONOrAbort(c, &req) {
		return
	}
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Fail(c, 400, "invalid permission id")
		return
	}
	req.ID = uint(id)
	if err := h.svc.Update(requestContext(c), &req); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "permission updated", req)
}

// Delete godoc
// @Summary      Delete permission
// @Tags         permissions
// @Produce      json
// @Param        id   path      string  true  "Permission ID"
// @Success      200  {object}  response.Envelope
// @Router       /permissions/{id} [delete]
func (h *PermissionHandler) Delete(c *gin.Context) {
	if err := h.svc.Delete(requestContext(c), c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "permission deleted", gin.H{"deleted": true})
}

// GetByResource godoc
// @Summary      List permissions by resource
// @Tags         permissions
// @Produce      json
// @Param        resource  path      string  true  "Resource"
// @Success      200       {object}  response.Envelope{data=[]domain.Permission}
// @Router       /permissions/resource/{resource} [get]
func (h *PermissionHandler) GetByResource(c *gin.Context) {
	items, err := h.svc.GetByResource(requestContext(c), c.Param("resource"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "permissions fetched", items)
}
