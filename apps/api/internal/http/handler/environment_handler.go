package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type EnvironmentHandler struct {
	svc usecase.EnvironmentUsecase
}

func NewEnvironmentHandler(svc usecase.EnvironmentUsecase) *EnvironmentHandler {
	return &EnvironmentHandler{svc: svc}
}

// Create godoc
// @Summary      Create environment
// @Tags         environments
// @Accept       json
// @Produce      json
// @Param        body  body      domain.Environment  true  "Environment payload"
// @Success      201   {object}  response.Envelope{data=domain.Environment}
// @Failure      400   {object}  response.Envelope
// @Router       /environments [post]
func (h *EnvironmentHandler) Create(c *gin.Context) {
	var req domain.Environment
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if err := h.svc.CreateEnvironment(requestContext(c), &req); err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "environment created", req)
}

// Get godoc
// @Summary      Get environment
// @Tags         environments
// @Produce      json
// @Param        id   path      string  true  "Environment ID"
// @Success      200  {object}  response.Envelope{data=domain.Environment}
// @Failure      404  {object}  response.Envelope
// @Router       /environments/{id} [get]
func (h *EnvironmentHandler) Get(c *gin.Context) {
	item, err := h.svc.GetEnvironment(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "environment fetched", item)
}

// List godoc
// @Summary      List environments
// @Tags         environments
// @Produce      json
// @Param        name       query     string  false  "Search by name"
// @Param        is_active  query     bool    false  "Filter by active flag"
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Success      200  {object}  response.Envelope{data=[]domain.Environment}
// @Router       /environments [get]
func (h *EnvironmentHandler) List(c *gin.Context) {
	filter := domain.EnvironmentFilter{
		Name:     c.Query("name"),
		Page:     1,
		PageSize: 20,
	}
	if raw := c.Query("is_active"); raw != "" {
		value, err := strconv.ParseBool(raw)
		if err != nil {
			response.Fail(c, 400, "invalid is_active")
			return
		}
		filter.IsActive = &value
	}
	if raw := c.Query("page"); raw != "" {
		value, err := strconv.Atoi(raw)
		if err != nil {
			response.Fail(c, 400, "invalid page")
			return
		}
		filter.Page = value
	}
	if raw := c.Query("page_size"); raw != "" {
		value, err := strconv.Atoi(raw)
		if err != nil {
			response.Fail(c, 400, "invalid page_size")
			return
		}
		filter.PageSize = value
	}

	items, total, err := h.svc.ListEnvironments(requestContext(c), filter)
	if err != nil {
		_ = c.Error(err)
		return
	}
	totalPages := 0
	if filter.PageSize > 0 {
		totalPages = int((total + int64(filter.PageSize) - 1) / int64(filter.PageSize))
	}
	meta := response.Meta{Page: filter.Page, PageSize: filter.PageSize, TotalItems: total, TotalPages: totalPages}
	response.OKWithMeta(c, "environments fetched", items, &meta)
}

// Update godoc
// @Summary      Update environment
// @Tags         environments
// @Accept       json
// @Produce      json
// @Param        id    path      string              true  "Environment ID"
// @Param        body  body      domain.Environment  true  "Environment payload"
// @Success      200   {object}  response.Envelope{data=domain.Environment}
// @Router       /environments/{id} [put]
func (h *EnvironmentHandler) Update(c *gin.Context) {
	var req domain.Environment
	if !bindJSONOrAbort(c, &req) {
		return
	}
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Fail(c, 400, "invalid environment id")
		return
	}
	req.ID = uint(id)
	if err := h.svc.UpdateEnvironment(requestContext(c), &req); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "environment updated", req)
}

// Delete godoc
// @Summary      Delete environment
// @Tags         environments
// @Produce      json
// @Param        id   path      string  true  "Environment ID"
// @Success      200  {object}  response.Envelope
// @Router       /environments/{id} [delete]
func (h *EnvironmentHandler) Delete(c *gin.Context) {
	if err := h.svc.DeleteEnvironment(requestContext(c), c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "environment deleted", gin.H{"deleted": true})
}
