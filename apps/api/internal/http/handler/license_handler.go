package handler

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type LicenseHandler struct {
	svc usecase.LicenseUsecase
}

func NewLicenseHandler(svc usecase.LicenseUsecase) *LicenseHandler {
	return &LicenseHandler{svc: svc}
}

type CreateLicenseRequest struct {
	Tier             string `json:"tier" binding:"required"`
	OrganizationID   string `json:"organization_id"`
	OrganizationName string `json:"organization_name"`
	ContactEmail     string `json:"contact_email" binding:"omitempty,email"`
	DurationDays     *int   `json:"duration_days,omitempty"`
}

type UpgradeLicenseRequest struct {
	NewTier string `json:"new_tier" binding:"required"`
}

// ActivateLicense godoc
// @Summary      Activate license
// @Tags         licenses
// @Accept       json
// @Produce      json
// @Param        body  body      domain.LicenseActivationRequest  true  "Activation payload"
// @Success      200   {object}  response.Envelope{data=domain.LicenseValidationResponse}
// @Router       /licenses/activate [post]
func (h *LicenseHandler) ActivateLicense(c *gin.Context) {
	var req domain.LicenseActivationRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.ActivateLicense(&req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "license activated", item)
}

// ValidateLicense godoc
// @Summary      Validate license
// @Tags         licenses
// @Produce      json
// @Param        license_key  query     string  true  "License key"
// @Success      200          {object}  response.Envelope{data=domain.LicenseValidationResponse}
// @Router       /licenses/validate [get]
func (h *LicenseHandler) ValidateLicense(c *gin.Context) {
	licenseKey := c.Query("license_key")
	if licenseKey == "" {
		response.Fail(c, 400, "license_key is required")
		return
	}
	item, err := h.svc.ValidateLicense(licenseKey)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "license validated", item)
}

// GetCurrentLicense godoc
// @Summary      Get current license
// @Tags         licenses
// @Produce      json
// @Success      200  {object}  response.Envelope{data=domain.License}
// @Router       /licenses/current [get]
func (h *LicenseHandler) GetCurrentLicense(c *gin.Context) {
	licenseKey, ok := resolveLicenseKey(c)
	if !ok {
		response.Fail(c, 401, "license key not found in context")
		return
	}
	item, err := h.svc.GetLicenseByKey(licenseKey)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "current license fetched", item)
}

// GetUsageStatistics godoc
// @Summary      Get license usage
// @Tags         licenses
// @Produce      json
// @Success      200  {object}  response.Envelope{data=domain.LicenseLimits}
// @Router       /licenses/usage [get]
func (h *LicenseHandler) GetUsageStatistics(c *gin.Context) {
	licenseKey, ok := resolveLicenseKey(c)
	if !ok {
		response.Fail(c, 401, "license key not found in context")
		return
	}
	item, err := h.svc.GetUsageStatistics(licenseKey)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "license usage fetched", item)
}

// CreateLicense godoc
// @Summary      Create license
// @Tags         licenses
// @Accept       json
// @Produce      json
// @Param        body  body      handler.CreateLicenseRequest  true  "Create license payload"
// @Success      201   {object}  response.Envelope{data=domain.License}
// @Router       /admin/licenses [post]
func (h *LicenseHandler) CreateLicense(c *gin.Context) {
	var req CreateLicenseRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	tier := domain.LicenseTier(req.Tier)
	var duration *time.Duration
	if req.DurationDays != nil {
		value := time.Duration(*req.DurationDays) * 24 * time.Hour
		duration = &value
	}
	item, err := h.svc.CreateLicense(tier, req.OrganizationID, req.OrganizationName, req.ContactEmail, duration)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "license created", item)
}

// ListLicenses godoc
// @Summary      List licenses
// @Tags         licenses
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]domain.License}
// @Router       /admin/licenses [get]
func (h *LicenseHandler) ListLicenses(c *gin.Context) {
	items, err := h.svc.GetAllLicenses()
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "licenses fetched", items)
}

// UpgradeLicense godoc
// @Summary      Upgrade license
// @Tags         licenses
// @Accept       json
// @Produce      json
// @Param        body  body      handler.UpgradeLicenseRequest  true  "Upgrade payload"
// @Success      200   {object}  response.Envelope{data=domain.License}
// @Router       /licenses/upgrade [post]
func (h *LicenseHandler) UpgradeLicense(c *gin.Context) {
	licenseKey, ok := resolveLicenseKey(c)
	if !ok {
		response.Fail(c, 401, "license key not found in context")
		return
	}
	var req UpgradeLicenseRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.UpgradeLicense(licenseKey, domain.LicenseTier(req.NewTier))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "license upgraded", item)
}

// SuspendLicense godoc
// @Summary      Suspend license
// @Tags         licenses
// @Accept       json
// @Produce      json
// @Param        license_key  path      string  true  "License key"
// @Param        body         body      map[string]string  true  "Suspend payload"
// @Success      200          {object}  response.Envelope
// @Router       /admin/licenses/{license_key}/suspend [post]
func (h *LicenseHandler) SuspendLicense(c *gin.Context) {
	var req struct {
		Reason string `json:"reason" binding:"required"`
	}
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if err := h.svc.SuspendLicense(c.Param("license_key"), req.Reason); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "license suspended", gin.H{"suspended": true})
}

// ReactivateLicense godoc
// @Summary      Reactivate license
// @Tags         licenses
// @Produce      json
// @Param        license_key  path      string  true  "License key"
// @Success      200          {object}  response.Envelope
// @Router       /admin/licenses/{license_key}/reactivate [post]
func (h *LicenseHandler) ReactivateLicense(c *gin.Context) {
	if err := h.svc.ReactivateLicense(c.Param("license_key")); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "license reactivated", gin.H{"reactivated": true})
}

func resolveLicenseKey(c *gin.Context) (string, bool) {
	if value, ok := c.Get("license_key"); ok {
		if key, valid := value.(string); valid && key != "" {
			return key, true
		}
	}
	if key := c.Query("license_key"); key != "" {
		return key, true
	}
	if key := c.GetHeader("X-License-Key"); key != "" {
		return key, true
	}
	return "", false
}
