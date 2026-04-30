package handler

import (
	"encoding/base64"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type EmailHandler struct {
	svc usecase.EmailUsecase
}

func NewEmailHandler(svc usecase.EmailUsecase) *EmailHandler {
	return &EmailHandler{svc: svc}
}

type SendEmailRequest struct {
	To       []string          `json:"to" binding:"required,min=1"`
	CC       []string          `json:"cc"`
	BCC      []string          `json:"bcc"`
	Subject  string            `json:"subject" binding:"required"`
	Body     string            `json:"body"`
	HTMLBody string            `json:"html_body"`
	ReplyTo  string            `json:"reply_to"`
	Priority string            `json:"priority"`
	Headers  map[string]string `json:"headers"`
}

type SendTemplateEmailRequest struct {
	To           []string               `json:"to" binding:"required,min=1"`
	CC           []string               `json:"cc"`
	BCC          []string               `json:"bcc"`
	TemplateName string                 `json:"template_name" binding:"required"`
	Data         map[string]interface{} `json:"data" binding:"required"`
}

type SendBulkEmailRequest struct {
	Emails []SendEmailRequest `json:"emails" binding:"required,min=1,dive"`
}

type SendEmailWithAttachmentRequest struct {
	SendEmailRequest
	Attachments []AttachmentRequest `json:"attachments" binding:"required,min=1,dive"`
}

type AttachmentRequest struct {
	Filename    string `json:"filename" binding:"required"`
	Content     string `json:"content" binding:"required"`
	ContentType string `json:"content_type" binding:"required"`
	Inline      bool   `json:"inline"`
	ContentID   string `json:"content_id"`
}

type ScheduleEmailRequest struct {
	SendAt time.Time        `json:"send_at" binding:"required"`
	Email  SendEmailRequest `json:"email" binding:"required"`
}

type ValidateEmailRequest struct {
	Email string `json:"email" binding:"required"`
}

// SendEmail godoc
// @Summary      Send email
// @Tags         emails
// @Accept       json
// @Produce      json
// @Param        body  body      handler.SendEmailRequest  true  "Email payload"
// @Success      200   {object}  response.Envelope
// @Router       /emails/send [post]
func (h *EmailHandler) SendEmail(c *gin.Context) {
	var req SendEmailRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	var err error
	if req.HTMLBody != "" {
		err = h.svc.SendHTMLEmail(requestContext(c), req.To, req.Subject, req.HTMLBody)
	} else {
		err = h.svc.SendEmail(requestContext(c), req.To, req.Subject, req.Body)
	}
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "email sent", gin.H{"to": req.To})
}

// SendTemplateEmail godoc
// @Summary      Send template email
// @Tags         emails
// @Accept       json
// @Produce      json
// @Param        body  body      handler.SendTemplateEmailRequest  true  "Template payload"
// @Success      200   {object}  response.Envelope
// @Router       /emails/send-template [post]
func (h *EmailHandler) SendTemplateEmail(c *gin.Context) {
	var req SendTemplateEmailRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	if err := h.svc.SendEmailWithTemplate(requestContext(c), req.To, req.TemplateName, req.Data); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "template email sent", gin.H{"to": req.To, "template_name": req.TemplateName})
}

// SendBulkEmail godoc
// @Summary      Send bulk emails
// @Tags         emails
// @Accept       json
// @Produce      json
// @Param        body  body      handler.SendBulkEmailRequest  true  "Bulk payload"
// @Success      200   {object}  response.Envelope
// @Router       /emails/send-bulk [post]
func (h *EmailHandler) SendBulkEmail(c *gin.Context) {
	var req SendBulkEmailRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	emails := make([]domain.EmailData, 0, len(req.Emails))
	for _, item := range req.Emails {
		emails = append(emails, domain.EmailData{
			To:       item.To,
			CC:       item.CC,
			BCC:      item.BCC,
			Subject:  item.Subject,
			Body:     item.Body,
			HTMLBody: item.HTMLBody,
			ReplyTo:  item.ReplyTo,
			Headers:  item.Headers,
			Priority: domain.EmailPriority(item.Priority),
		})
	}
	if err := h.svc.SendBulkEmail(requestContext(c), emails); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "bulk emails sent", gin.H{"count": len(emails)})
}

// SendEmailWithAttachment godoc
// @Summary      Send email with attachments
// @Tags         emails
// @Accept       json
// @Produce      json
// @Param        body  body      handler.SendEmailWithAttachmentRequest  true  "Email attachment payload"
// @Success      200   {object}  response.Envelope
// @Router       /emails/send-with-attachment [post]
func (h *EmailHandler) SendEmailWithAttachment(c *gin.Context) {
	var req SendEmailWithAttachmentRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	attachments := make([]domain.EmailAttachment, 0, len(req.Attachments))
	for _, item := range req.Attachments {
		content, err := base64.StdEncoding.DecodeString(item.Content)
		if err != nil {
			response.Fail(c, 400, "invalid attachment content")
			return
		}
		attachments = append(attachments, domain.EmailAttachment{
			Filename:    item.Filename,
			Content:     content,
			ContentType: item.ContentType,
			Inline:      item.Inline,
			ContentID:   item.ContentID,
		})
	}
	if err := h.svc.SendEmailWithAttachment(requestContext(c), req.To, req.Subject, req.Body, attachments); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "email with attachments sent", gin.H{"to": req.To, "attachments": len(attachments)})
}

// ScheduleEmail godoc
// @Summary      Schedule email
// @Tags         emails
// @Accept       json
// @Produce      json
// @Param        body  body      handler.ScheduleEmailRequest  true  "Schedule payload"
// @Success      200   {object}  response.Envelope
// @Router       /emails/schedule [post]
func (h *EmailHandler) ScheduleEmail(c *gin.Context) {
	var req ScheduleEmailRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	data := domain.EmailData{
		To:       req.Email.To,
		CC:       req.Email.CC,
		BCC:      req.Email.BCC,
		Subject:  req.Email.Subject,
		Body:     req.Email.Body,
		HTMLBody: req.Email.HTMLBody,
		ReplyTo:  req.Email.ReplyTo,
		Headers:  req.Email.Headers,
		Priority: domain.EmailPriority(req.Email.Priority),
	}
	if err := h.svc.ScheduleEmail(requestContext(c), req.SendAt, data); err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "email scheduled", gin.H{"send_at": req.SendAt})
}

// GetEmailLogs godoc
// @Summary      List email logs
// @Tags         emails
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        status     query     string  false  "Status"
// @Param        from       query     string  false  "Sender"
// @Param        to         query     string  false  "Recipient"
// @Param        template   query     string  false  "Template name"
// @Param        date_from  query     string  false  "Date from (RFC3339)"
// @Param        date_to    query     string  false  "Date to (RFC3339)"
// @Success      200        {object}  response.Envelope{data=[]domain.EmailLog}
// @Router       /emails/logs [get]
func (h *EmailHandler) GetEmailLogs(c *gin.Context) {
	filter, ok := parseEmailLogFilter(c)
	if !ok {
		return
	}
	items, err := h.svc.ListEmailLogs(requestContext(c), filter)
	if err != nil {
		_ = c.Error(err)
		return
	}
	meta := response.Meta{
		Page:       filter.Page,
		PageSize:   filter.PageSize,
		TotalItems: int64(len(items)),
		TotalPages: calcTotalPages(int64(len(items)), filter.PageSize),
	}
	response.OKWithMeta(c, "email logs fetched", items, &meta)
}

// GetEmailLog godoc
// @Summary      Get email log
// @Tags         emails
// @Produce      json
// @Param        id   path      string  true  "Email log ID"
// @Success      200  {object}  response.Envelope{data=domain.EmailLog}
// @Router       /emails/logs/{id} [get]
func (h *EmailHandler) GetEmailLog(c *gin.Context) {
	item, err := h.svc.GetEmailLog(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "email log fetched", item)
}

// GetEmailStatus godoc
// @Summary      Get email status
// @Tags         emails
// @Produce      json
// @Param        id   path      string  true  "Email log ID"
// @Success      200  {object}  response.Envelope
// @Router       /emails/logs/{id}/status [get]
func (h *EmailHandler) GetEmailStatus(c *gin.Context) {
	status, err := h.svc.GetEmailStatus(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "email status fetched", gin.H{"status": status})
}

// ValidateEmail godoc
// @Summary      Validate email
// @Tags         emails
// @Accept       json
// @Produce      json
// @Param        body  body      handler.ValidateEmailRequest  true  "Email validation payload"
// @Success      200   {object}  response.Envelope
// @Router       /emails/validate [post]
func (h *EmailHandler) ValidateEmail(c *gin.Context) {
	var req ValidateEmailRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	response.OK(c, "email validated", gin.H{
		"email":    req.Email,
		"is_valid": h.svc.ValidateEmail(req.Email),
	})
}

func parseEmailLogFilter(c *gin.Context) (domain.EmailLogFilter, bool) {
	filter := domain.EmailLogFilter{
		Page:     1,
		PageSize: 20,
		Status:   domain.EmailStatus(c.Query("status")),
		From:     c.Query("from"),
		To:       c.Query("to"),
		Template: c.Query("template"),
	}

	if raw := c.Query("page"); raw != "" {
		value, err := strconv.Atoi(raw)
		if err != nil || value < 1 {
			response.Fail(c, 400, "invalid page")
			return domain.EmailLogFilter{}, false
		}
		filter.Page = value
	}

	if raw := c.Query("page_size"); raw != "" {
		value, err := strconv.Atoi(raw)
		if err != nil || value < 1 || value > 100 {
			response.Fail(c, 400, "invalid page_size")
			return domain.EmailLogFilter{}, false
		}
		filter.PageSize = value
	}

	if raw := c.Query("date_from"); raw != "" {
		value, err := time.Parse(time.RFC3339, raw)
		if err != nil {
			response.Fail(c, 400, "invalid date_from")
			return domain.EmailLogFilter{}, false
		}
		filter.DateFrom = &value
	}

	if raw := c.Query("date_to"); raw != "" {
		value, err := time.Parse(time.RFC3339, raw)
		if err != nil {
			response.Fail(c, 400, "invalid date_to")
			return domain.EmailLogFilter{}, false
		}
		filter.DateTo = &value
	}

	return filter.Normalize(), true
}

func calcTotalPages(total int64, pageSize int) int {
	if pageSize < 1 {
		pageSize = 20
	}
	return int((total + int64(pageSize) - 1) / int64(pageSize))
}
