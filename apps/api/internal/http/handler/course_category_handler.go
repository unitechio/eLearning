package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type CourseCategoryHandler struct {
	svc usecase.CourseService
}

func NewCourseCategoryHandler(svc usecase.CourseService) *CourseCategoryHandler {
	return &CourseCategoryHandler{svc: svc}
}

func (h *CourseCategoryHandler) ListCategories(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	items, err := h.svc.ListCategories(requestContext(c), userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "course categories fetched", items)
}

func (h *CourseCategoryHandler) CreateCategory(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.CourseCategoryPayload
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.CreateCategory(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "course category created", item)
}

func (h *CourseCategoryHandler) UpdateCategory(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.CourseCategoryPayload
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.UpdateCategory(requestContext(c), userID, c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "course category updated", item)
}

func (h *CourseCategoryHandler) DeleteCategory(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	if err := h.svc.DeleteCategory(requestContext(c), userID, c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "course category deleted", gin.H{"id": c.Param("id"), "deleted": true})
}
