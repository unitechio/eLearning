package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type SystemSettingHandler struct {
	svc *usecase.SystemSettingUsecase
}

func NewSystemSettingHandler(svc *usecase.SystemSettingUsecase) *SystemSettingHandler {
	return &SystemSettingHandler{svc: svc}
}

// CreateSystemSetting godoc
// @Summary      Create system setting
// @Tags         system-settings
// @Accept       json
// @Produce      json
// @Param        body  body      domain.SystemSetting  true  "System setting payload"
// @Success      201   {object}  response.Envelope{data=domain.SystemSetting}
// @Router       /system-settings [post]
func (h *SystemSettingHandler) CreateSystemSetting(c *gin.Context) {
	var req domain.SystemSetting
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.CreateSystemSetting(requestContext(c), &req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "system setting created", item)
}

// GetSystemSettingByKey godoc
// @Summary      Get system setting by key
// @Tags         system-settings
// @Produce      json
// @Param        key  path      string  true  "Setting key"
// @Success      200  {object}  response.Envelope{data=domain.SystemSetting}
// @Router       /system-settings/key/{key} [get]
func (h *SystemSettingHandler) GetSystemSettingByKey(c *gin.Context) {
	item, err := h.svc.GetSystemSettingByKey(requestContext(c), c.Param("key"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "system setting fetched", item)
}

// GetAllSystemSettings godoc
// @Summary      List system settings
// @Tags         system-settings
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]domain.SystemSetting}
// @Router       /system-settings [get]
func (h *SystemSettingHandler) GetAllSystemSettings(c *gin.Context) {
	items, err := h.svc.GetAllSystemSettings(requestContext(c))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "system settings fetched", items)
}

// GetSystemSettingsByCategory godoc
// @Summary      List system settings by category
// @Tags         system-settings
// @Produce      json
// @Param        category  path      string  true  "Category"
// @Success      200       {object}  response.Envelope{data=[]domain.SystemSetting}
// @Router       /system-settings/category/{category} [get]
func (h *SystemSettingHandler) GetSystemSettingsByCategory(c *gin.Context) {
	items, err := h.svc.GetSystemSettingsByCategory(requestContext(c), c.Param("category"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "system settings fetched", items)
}

// UpdateSystemSetting godoc
// @Summary      Update system setting
// @Tags         system-settings
// @Accept       json
// @Produce      json
// @Param        id    path      string                true  "Setting ID"
// @Param        body  body      domain.SystemSetting  true  "System setting payload"
// @Success      200   {object}  response.Envelope{data=domain.SystemSetting}
// @Router       /system-settings/{id} [put]
func (h *SystemSettingHandler) UpdateSystemSetting(c *gin.Context) {
	var req domain.SystemSetting
	if !bindJSONOrAbort(c, &req) {
		return
	}
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Fail(c, 400, "invalid setting id")
		return
	}
	req.ID = uint(id)
	item, err := h.svc.UpdateSystemSetting(requestContext(c), &req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "system setting updated", item)
}

// DeleteSystemSetting godoc
// @Summary      Delete system setting
// @Tags         system-settings
// @Produce      json
// @Param        id   path      string  true  "Setting ID"
// @Success      200  {object}  response.Envelope
// @Router       /system-settings/{id} [delete]
func (h *SystemSettingHandler) DeleteSystemSetting(c *gin.Context) {
	if err := h.svc.DeleteSystemSetting(requestContext(c), c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "system setting deleted", gin.H{"deleted": true})
}
