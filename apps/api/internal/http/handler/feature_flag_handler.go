package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type FeatureFlagHandler struct {
	svc usecase.FeatureFlagUsecase
}

func NewFeatureFlagHandler(svc usecase.FeatureFlagUsecase) *FeatureFlagHandler {
	return &FeatureFlagHandler{svc: svc}
}

// CreateFeatureFlag godoc
// @Summary      Create feature flag
// @Tags         feature-flags
// @Accept       json
// @Produce      json
// @Param        body  body      domain.FeatureFlag  true  "Feature flag payload"
// @Success      201   {object}  response.Envelope{data=domain.FeatureFlag}
// @Router       /feature-flags [post]
func (h *FeatureFlagHandler) CreateFeatureFlag(c *gin.Context) {
	var req domain.FeatureFlag
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.CreateFeatureFlag(&req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "feature flag created", item)
}

// GetFeatureFlagByName godoc
// @Summary      Get feature flag by name
// @Tags         feature-flags
// @Produce      json
// @Param        name  path      string  true  "Feature flag name"
// @Success      200   {object}  response.Envelope{data=domain.FeatureFlag}
// @Router       /feature-flags/name/{name} [get]
func (h *FeatureFlagHandler) GetFeatureFlagByName(c *gin.Context) {
	item, err := h.svc.GetFeatureFlagByName(c.Param("name"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "feature flag fetched", item)
}

// GetAllFeatureFlags godoc
// @Summary      List feature flags
// @Tags         feature-flags
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]domain.FeatureFlag}
// @Router       /feature-flags [get]
func (h *FeatureFlagHandler) GetAllFeatureFlags(c *gin.Context) {
	items, err := h.svc.GetAllFeatureFlags()
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "feature flags fetched", items)
}

// GetFeatureFlagsByCategory godoc
// @Summary      List feature flags by category
// @Tags         feature-flags
// @Produce      json
// @Param        category  path      string  true  "Category"
// @Success      200       {object}  response.Envelope{data=[]domain.FeatureFlag}
// @Router       /feature-flags/category/{category} [get]
func (h *FeatureFlagHandler) GetFeatureFlagsByCategory(c *gin.Context) {
	items, err := h.svc.GetFeatureFlagsByCategory(c.Param("category"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "feature flags fetched", items)
}

// UpdateFeatureFlag godoc
// @Summary      Update feature flag
// @Tags         feature-flags
// @Accept       json
// @Produce      json
// @Param        body  body      domain.FeatureFlag  true  "Feature flag payload"
// @Success      200   {object}  response.Envelope{data=domain.FeatureFlag}
// @Router       /feature-flags [put]
func (h *FeatureFlagHandler) UpdateFeatureFlag(c *gin.Context) {
	var req domain.FeatureFlag
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.UpdateFeatureFlag(&req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "feature flag updated", item)
}

// DeleteFeatureFlag godoc
// @Summary      Delete feature flag
// @Tags         feature-flags
// @Produce      json
// @Param        id   path      string  true  "Feature flag ID"
// @Success      200  {object}  response.Envelope
// @Router       /feature-flags/{id} [delete]
func (h *FeatureFlagHandler) DeleteFeatureFlag(c *gin.Context) {
	if err := h.svc.DeleteFeatureFlag(c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "feature flag deleted", gin.H{"deleted": true})
}
