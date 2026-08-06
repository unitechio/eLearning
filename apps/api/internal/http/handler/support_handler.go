package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type SupportHandler struct {
	svc usecase.SupportService
}

func NewSupportHandler(svc usecase.SupportService) *SupportHandler {
	return &SupportHandler{svc: svc}
}

func (h *SupportHandler) Create(c *gin.Context) {
	var req dto.CreateSupportTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.CreateTicket(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "support ticket created", item)
}

func (h *SupportHandler) MyTickets(c *gin.Context) {
	var query dto.SupportTicketListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	res, err := h.svc.ListMyTickets(requestContext(c), userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "support tickets fetched", res.Items, &res.Meta)
}

func (h *SupportHandler) Get(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GetTicket(requestContext(c), userID, c.Param("id"), false)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "support ticket fetched", item)
}

func (h *SupportHandler) Comment(c *gin.Context) {
	h.comment(c, false)
}

func (h *SupportHandler) AdminTickets(c *gin.Context) {
	var query dto.SupportTicketListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.ListAdminTickets(requestContext(c), query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "admin support tickets fetched", res.Items, &res.Meta)
}

func (h *SupportHandler) AdminGet(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GetTicket(requestContext(c), userID, c.Param("id"), true)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "admin support ticket fetched", item)
}

func (h *SupportHandler) AdminComment(c *gin.Context) {
	h.comment(c, true)
}

func (h *SupportHandler) Assign(c *gin.Context) {
	var req dto.AssignSupportTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.AssignTicket(requestContext(c), c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "support ticket assigned", item)
}

func (h *SupportHandler) UpdateStatus(c *gin.Context) {
	var req dto.UpdateSupportTicketStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.UpdateTicketStatus(requestContext(c), c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "support ticket status updated", item)
}

func (h *SupportHandler) comment(c *gin.Context, staff bool) {
	var req dto.AddSupportTicketCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.AddComment(requestContext(c), userID, c.Param("id"), staff, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "support ticket comment created", item)
}
