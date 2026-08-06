package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase/impl"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type IntegrationHandler struct {
	svc *impl.IntegrationService
}

func NewIntegrationHandler(svc *impl.IntegrationService) *IntegrationHandler {
	return &IntegrationHandler{svc: svc}
}

func (h *IntegrationHandler) GetUserIntegrationsHub(c *gin.Context) {
	tenantID := getTenantID(c)
	statusFilter := c.DefaultQuery("status", "all")

	res, err := h.svc.GetUserIntegrationsHub(requestContext(c), tenantID, statusFilter)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "integrations hub fetched", res)
}

func (h *IntegrationHandler) ListMarketplaceCatalog(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	category := c.Query("category")
	search := c.Query("search")

	pagination := dto.PaginationQuery{Page: page, PageSize: pageSize}.Normalize()
	res, err := h.svc.ListMarketplaceCatalog(requestContext(c), pagination, category, search)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "marketplace catalog fetched", res)
}

type ConnectIntegrationRequest struct {
	Slug              string `json:"slug" binding:"required"`
	AccountIdentifier string `json:"account_identifier"`
}

func (h *IntegrationHandler) ConnectIntegration(c *gin.Context) {
	var req ConnectIntegrationRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	tenantID := getTenantID(c)
	userID := getUserID(c)

	res, err := h.svc.ConnectIntegration(requestContext(c), tenantID, userID, req.Slug, req.AccountIdentifier)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "integration connected", res)
}

type ReconnectIntegrationRequest struct {
	Slug string `json:"slug" binding:"required"`
}

func (h *IntegrationHandler) ReconnectIntegration(c *gin.Context) {
	var req ReconnectIntegrationRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	tenantID := getTenantID(c)

	res, err := h.svc.ReconnectIntegration(requestContext(c), tenantID, req.Slug)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "integration re-connected", res)
}

type DisconnectIntegrationRequest struct {
	Slug string `json:"slug" binding:"required"`
}

func (h *IntegrationHandler) DisconnectIntegration(c *gin.Context) {
	var req DisconnectIntegrationRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	tenantID := getTenantID(c)

	if err := h.svc.DisconnectIntegration(requestContext(c), tenantID, req.Slug); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "integration disconnected", gin.H{"disconnected": true})
}

type UpdateIntegrationConfigRequest struct {
	Slug      string         `json:"slug" binding:"required"`
	Config    map[string]any `json:"config"`
	IsEnabled bool           `json:"is_enabled"`
}

func (h *IntegrationHandler) UpdateConfig(c *gin.Context) {
	var req UpdateIntegrationConfigRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	tenantID := getTenantID(c)

	res, err := h.svc.UpdateConfig(requestContext(c), tenantID, req.Slug, req.Config, req.IsEnabled)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "config updated", res)
}

type TriggerSyncRequest struct {
	Slug string `json:"slug" binding:"required"`
}

func (h *IntegrationHandler) TriggerSync(c *gin.Context) {
	var req TriggerSyncRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	tenantID := getTenantID(c)

	res, err := h.svc.TriggerSync(requestContext(c), tenantID, req.Slug)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "sync triggered", res)
}

func getTenantID(c *gin.Context) uuid.UUID {
	val, exists := c.Get("tenant_id")
	if exists {
		if id, ok := val.(uuid.UUID); ok {
			return id
		}
		if str, ok := val.(string); ok {
			if parsed, err := uuid.Parse(str); err == nil {
				return parsed
			}
		}
	}
	// Fallback constant tenant ID for admin session
	return uuid.MustParse("00000000-0000-0000-0000-000000000001")
}

func getUserID(c *gin.Context) uuid.UUID {
	val, exists := c.Get("user_id")
	if exists {
		if id, ok := val.(uuid.UUID); ok {
			return id
		}
		if str, ok := val.(string); ok {
			if parsed, err := uuid.Parse(str); err == nil {
				return parsed
			}
		}
	}
	return uuid.MustParse("00000000-0000-0000-0000-000000000001")
}

var _ = apperr.BadRequest
