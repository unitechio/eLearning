package handler

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type AuditHandler struct {
	svc usecase.AuditUsecase
}

func NewAuditHandler(svc usecase.AuditUsecase) *AuditHandler {
	return &AuditHandler{svc: svc}
}

// Log godoc
// @Summary      Create audit log entry
// @Tags         audit
// @Accept       json
// @Produce      json
// @Param        body  body      domain.AuditLog  true  "Audit log payload"
// @Success      201   {object}  response.Envelope{data=domain.AuditLog}
// @Router       /audit/logs [post]
func (h *AuditHandler) Log(c *gin.Context) {
	var req domain.AuditLog
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if req.IPAddress == "" {
		req.IPAddress = c.ClientIP()
	}
	if req.UserAgent == "" {
		req.UserAgent = c.GetHeader("User-Agent")
	}
	if req.Method == "" {
		req.Method = c.Request.Method
	}
	if req.Path == "" {
		req.Path = c.FullPath()
	}
	if req.CreatedAt.IsZero() {
		req.CreatedAt = time.Now()
	}
	if err := h.svc.Log(requestContext(c), &req); err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "audit entry logged", req)
}

// GetAll godoc
// @Summary      List audit logs
// @Tags         audit
// @Produce      json
// @Param        page         query     int     false  "Page number"
// @Param        page_size    query     int     false  "Page size"
// @Param        user_id      query     int     false  "Filter by user ID"
// @Param        action       query     string  false  "Filter by action"
// @Param        resource     query     string  false  "Filter by resource"
// @Param        resource_id  query     int     false  "Filter by resource ID"
// @Param        ip_address   query     string  false  "Filter by IP address"
// @Param        method       query     string  false  "Filter by HTTP method"
// @Param        path         query     string  false  "Filter by path"
// @Param        start_date   query     string  false  "Start date (RFC3339)"
// @Param        end_date     query     string  false  "End date (RFC3339)"
// @Param        sort_by      query     string  false  "Sort field"
// @Param        sort_order   query     string  false  "Sort order"
// @Success      200          {object}  response.Envelope{data=[]domain.AuditLog}
// @Router       /audit/logs [get]
func (h *AuditHandler) GetAll(c *gin.Context) {
	filter, ok := parseAuditFilter(c)
	if !ok {
		return
	}
	items, total, err := h.svc.ListAuditLogs(requestContext(c), filter)
	if err != nil {
		_ = c.Error(err)
		return
	}
	meta := buildAuditMeta(filter, total)
	response.OKWithMeta(c, "audit logs fetched", items, &meta)
}

// GetByID godoc
// @Summary      Get audit log
// @Tags         audit
// @Produce      json
// @Param        id   path      string  true  "Audit log ID"
// @Success      200  {object}  response.Envelope{data=domain.AuditLog}
// @Router       /audit/logs/{id} [get]
func (h *AuditHandler) GetByID(c *gin.Context) {
	item, err := h.svc.GetAuditLog(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "audit log fetched", item)
}

// GetUserAuditLogs godoc
// @Summary      List user audit logs
// @Tags         audit
// @Produce      json
// @Param        user_id     path      string  true   "User ID"
// @Param        page        query     int     false  "Page number"
// @Param        page_size   query     int     false  "Page size"
// @Param        action      query     string  false  "Filter by action"
// @Param        resource    query     string  false  "Filter by resource"
// @Param        start_date  query     string  false  "Start date (RFC3339)"
// @Param        end_date    query     string  false  "End date (RFC3339)"
// @Success      200         {object}  response.Envelope{data=[]domain.AuditLog}
// @Router       /audit/users/{user_id}/logs [get]
func (h *AuditHandler) GetUserAuditLogs(c *gin.Context) {
	filter, ok := parseAuditFilter(c)
	if !ok {
		return
	}
	items, total, err := h.svc.GetUserAuditLogs(requestContext(c), c.Param("user_id"), filter)
	if err != nil {
		_ = c.Error(err)
		return
	}
	meta := buildAuditMeta(filter, total)
	response.OKWithMeta(c, "user audit logs fetched", items, &meta)
}

// GetResourceAuditLogs godoc
// @Summary      List resource audit logs
// @Tags         audit
// @Produce      json
// @Param        resource     path      string  true   "Resource"
// @Param        resource_id  path      string  true   "Resource ID"
// @Param        page         query     int     false  "Page number"
// @Param        page_size    query     int     false  "Page size"
// @Param        action       query     string  false  "Filter by action"
// @Param        start_date   query     string  false  "Start date (RFC3339)"
// @Param        end_date     query     string  false  "End date (RFC3339)"
// @Success      200          {object}  response.Envelope{data=[]domain.AuditLog}
// @Router       /audit/resources/{resource}/{resource_id}/logs [get]
func (h *AuditHandler) GetResourceAuditLogs(c *gin.Context) {
	filter, ok := parseAuditFilter(c)
	if !ok {
		return
	}
	items, total, err := h.svc.GetResourceAuditLogs(requestContext(c), c.Param("resource"), c.Param("resource_id"), filter)
	if err != nil {
		_ = c.Error(err)
		return
	}
	meta := buildAuditMeta(filter, total)
	response.OKWithMeta(c, "resource audit logs fetched", items, &meta)
}

// GetStatistics godoc
// @Summary      Get audit statistics
// @Tags         audit
// @Produce      json
// @Param        start_date  query     string  false  "Start date (RFC3339)"
// @Param        end_date    query     string  false  "End date (RFC3339)"
// @Success      200         {object}  response.Envelope{data=domain.AuditStatistics}
// @Router       /audit/statistics [get]
func (h *AuditHandler) GetStatistics(c *gin.Context) {
	startDate, endDate, ok := parseDateRange(c)
	if !ok {
		return
	}
	stats, err := h.svc.GetAuditStatistics(requestContext(c), startDate, endDate)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "audit statistics fetched", gin.H{
		"statistics": stats,
		"period": gin.H{
			"start_date": startDate,
			"end_date":   endDate,
		},
	})
}

// CleanupOldLogs godoc
// @Summary      Cleanup old audit logs
// @Tags         audit
// @Produce      json
// @Param        retention_days  query     int  false  "Retention period in days"
// @Success      200             {object}  response.Envelope
// @Router       /audit/cleanup [post]
func (h *AuditHandler) CleanupOldLogs(c *gin.Context) {
	retentionDays := 90
	if raw := c.Query("retention_days"); raw != "" {
		value, err := strconv.Atoi(raw)
		if err != nil || value < 1 {
			response.Fail(c, 400, "invalid retention_days")
			return
		}
		retentionDays = value
	}
	if err := h.svc.CleanupOldLogs(requestContext(c), retentionDays); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "old audit logs cleaned", gin.H{"retention_days": retentionDays})
}

// ExportAuditLogs godoc
// @Summary      Export audit logs
// @Tags         audit
// @Produce      json
// @Param        format       query     string  false  "Export format"
// @Param        user_id      query     int     false  "Filter by user ID"
// @Param        action       query     string  false  "Filter by action"
// @Param        resource     query     string  false  "Filter by resource"
// @Param        resource_id  query     int     false  "Filter by resource ID"
// @Param        start_date   query     string  false  "Start date (RFC3339)"
// @Param        end_date     query     string  false  "End date (RFC3339)"
// @Success      200          {object}  response.Envelope
// @Router       /audit/export [get]
func (h *AuditHandler) ExportAuditLogs(c *gin.Context) {
	filter, ok := parseAuditFilter(c)
	if !ok {
		return
	}
	format := c.DefaultQuery("format", "json")
	if format != "json" && format != "csv" {
		response.Fail(c, 400, "invalid export format")
		return
	}
	exportPath, err := h.svc.ExportAuditLogs(requestContext(c), filter, format)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "audit logs exported", gin.H{"format": format, "export_path": exportPath})
}

func parseAuditFilter(c *gin.Context) (domain.AuditFilter, bool) {
	filter := domain.AuditFilter{
		Page:      1,
		PageSize:  20,
		SortBy:    c.DefaultQuery("sort_by", "created_at"),
		SortOrder: c.DefaultQuery("sort_order", "desc"),
		Resource:  c.Query("resource"),
		IPAddress: c.Query("ip_address"),
		Method:    c.Query("method"),
		Path:      c.Query("path"),
	}

	if raw := c.Query("page"); raw != "" {
		value, err := strconv.Atoi(raw)
		if err != nil || value < 1 {
			response.Fail(c, 400, "invalid page")
			return domain.AuditFilter{}, false
		}
		filter.Page = value
	}

	if raw := c.Query("page_size"); raw != "" {
		value, err := strconv.Atoi(raw)
		if err != nil || value < 1 || value > 100 {
			response.Fail(c, 400, "invalid page_size")
			return domain.AuditFilter{}, false
		}
		filter.PageSize = value
	}

	if raw := c.Query("user_id"); raw != "" {
		value, err := strconv.ParseUint(raw, 10, 64)
		if err != nil {
			response.Fail(c, 400, "invalid user_id")
			return domain.AuditFilter{}, false
		}
		parsed := uint(value)
		filter.UserID = &parsed
	}

	if raw := c.Query("resource_id"); raw != "" {
		value, err := strconv.ParseUint(raw, 10, 64)
		if err != nil {
			response.Fail(c, 400, "invalid resource_id")
			return domain.AuditFilter{}, false
		}
		parsed := uint(value)
		filter.ResourceID = &parsed
	}

	if raw := c.Query("action"); raw != "" {
		action := domain.AuditAction(raw)
		filter.Action = &action
	}

	if raw := c.Query("start_date"); raw != "" {
		value, err := time.Parse(time.RFC3339, raw)
		if err != nil {
			response.Fail(c, 400, "invalid start_date")
			return domain.AuditFilter{}, false
		}
		filter.StartDate = &value
	}

	if raw := c.Query("end_date"); raw != "" {
		value, err := time.Parse(time.RFC3339, raw)
		if err != nil {
			response.Fail(c, 400, "invalid end_date")
			return domain.AuditFilter{}, false
		}
		filter.EndDate = &value
	}

	return filter.Normalize(), true
}

func parseDateRange(c *gin.Context) (time.Time, time.Time, bool) {
	startDate := time.Now().AddDate(0, 0, -30)
	endDate := time.Now()

	if raw := c.Query("start_date"); raw != "" {
		value, err := time.Parse(time.RFC3339, raw)
		if err != nil {
			response.Fail(c, 400, "invalid start_date")
			return time.Time{}, time.Time{}, false
		}
		startDate = value
	}

	if raw := c.Query("end_date"); raw != "" {
		value, err := time.Parse(time.RFC3339, raw)
		if err != nil {
			response.Fail(c, 400, "invalid end_date")
			return time.Time{}, time.Time{}, false
		}
		endDate = value
	}

	return startDate, endDate, true
}

func buildAuditMeta(filter domain.AuditFilter, total int64) response.Meta {
	totalPages := int((total + int64(filter.PageSize) - 1) / int64(filter.PageSize))
	return response.Meta{
		Page:       filter.Page,
		PageSize:   filter.PageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}
}
