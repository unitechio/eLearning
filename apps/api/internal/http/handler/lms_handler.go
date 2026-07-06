package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type LMSHandler struct {
	svc usecase.LMSUsecase
}

func NewLMSHandler(svc usecase.LMSUsecase) *LMSHandler {
	return &LMSHandler{svc: svc}
}

func (h *LMSHandler) GetMyDashboard(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GetMyDashboard(requestContext(c), userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "lms dashboard fetched", item)
}

func (h *LMSHandler) GetUserDashboard(c *gin.Context) {
	item, err := h.svc.GetUserDashboard(requestContext(c), c.Param("user_id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "admin lms dashboard fetched", item)
}

func (h *LMSHandler) UpsertDashboard(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.UpsertLMSDashboardRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.UpsertDashboard(requestContext(c), userID, c.Param("user_id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "admin lms dashboard saved", item)
}

func (h *LMSHandler) CreateEnrollment(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.UpsertLMSEnrollmentRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.CreateEnrollment(requestContext(c), userID, c.Param("user_id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.CreatedCode(c, response.CodeSuccess, item)
}

func (h *LMSHandler) UpdateEnrollment(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.UpsertLMSEnrollmentRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.UpdateEnrollment(requestContext(c), userID, c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "admin lms enrollment updated", item)
}

func (h *LMSHandler) DeleteEnrollment(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	if err := h.svc.DeleteEnrollment(requestContext(c), userID, c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "admin lms enrollment deleted", gin.H{"id": c.Param("id"), "deleted": true})
}

func (h *LMSHandler) auditContext(c *gin.Context, userID uuid.UUID) dto.IeltsAuditContext {
	return dto.IeltsAuditContext{
		UserID:           userID,
		ActionUserName:   userID.String(),
		URI:              c.FullPath(),
		IP:               c.ClientIP(),
		RequestID:        c.GetString("RequestID"),
		SourceAppID:      "web",
		DestinationAppID: "api",
	}
}
