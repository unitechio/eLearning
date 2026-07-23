package handler

import (
	"context"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/internal/utils/constants"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type IELTSHandler struct {
	svc usecase.IELTSUsecase
}

func NewIELTSHandler(svc usecase.IELTSUsecase) *IELTSHandler {
	return &IELTSHandler{svc: svc}
}

// PublicList godoc
// @Summary      List published IELTS content
// @Description  Returns paginated list of published IELTS content items filtered by skill, level, module, etc.
// @Tags         ielts-public
// @Produce      json
// @Param        skill        query  string  false  "Skill: reading, listening, writing, speaking"
// @Param        module       query  string  false  "Module: ielts, sat, toeic"
// @Param        level        query  string  false  "Level: band5, band6, band7"
// @Param        content_type query  string  false  "Content type"
// @Param        page         query  int     false  "Page number (default 1)"
// @Param        page_size    query  int     false  "Page size (default 20)"
// @Param        q            query  string  false  "Search by title"
// @Success      200  {object}  response.Envelope{data=[]domain.IELTSContentItem}
// @Router       /public/ielts/content [get]
func (h *IELTSHandler) PublicList(c *gin.Context) {
	setPublicCache(c, 60, 300)
	var query dto.IELTSContentFilter
	if !bindQueryOrAbort(c, &query) {
		return
	}
	if query.Status == "" {
		query.Status = constants.IELTSStatusPublished
	}
	h.list(c, query)
}

// AdminList godoc
// @Summary      List all IELTS content (admin)
// @Description  Returns all IELTS content items regardless of status, for admin management.
// @Tags         admin-ielts
// @Security     BearerAuth
// @Produce      json
// @Param        skill        query  string  false  "Skill filter"
// @Param        module       query  string  false  "Module filter"
// @Param        status       query  string  false  "Status: draft, published, archived"
// @Param        review_status query string false   "Review status: draft, approved, rejected"
// @Param        level        query  string  false  "Level filter"
// @Param        page         query  int     false  "Page number"
// @Param        page_size    query  int     false  "Page size"
// @Success      200  {object}  response.Envelope{data=[]domain.IELTSContentItem}
// @Router       /admin/ielts/content [get]
func (h *IELTSHandler) AdminList(c *gin.Context) {
	var query dto.IELTSContentFilter
	if !bindQueryOrAbort(c, &query) {
		return
	}
	h.list(c, query)
}

func (h *IELTSHandler) list(c *gin.Context, query dto.IELTSContentFilter) {
	items, total, err := h.svc.ListContent(requestContext(c), query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	normalized := query.PaginationQuery.Normalize()
	totalPages := int((total + int64(normalized.PageSize) - 1) / int64(normalized.PageSize))
	meta := response.Meta{Page: normalized.Page, PageSize: normalized.PageSize, TotalItems: total, TotalPages: totalPages}
	response.OKWithMetaCode(c, response.CodeSuccess, items, &meta)
}

// Get godoc
// @Summary      Get IELTS content by ID (admin)
// @Tags         admin-ielts
// @Security     BearerAuth
// @Produce      json
// @Param        id  path  int  true  "Content ID"
// @Success      200  {object}  response.Envelope{data=domain.IELTSContentItem}
// @Failure      400  {object}  response.Envelope
// @Failure      404  {object}  response.Envelope
// @Router       /admin/ielts/content/{id} [get]
func (h *IELTSHandler) Get(c *gin.Context) {
	id, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	item, err := h.svc.GetContentByID(requestContext(c), id)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

// PublicGet godoc
// @Summary      Get published IELTS content by slug
// @Tags         ielts-public
// @Produce      json
// @Param        id  path  string  true  "Content slug"
// @Success      200  {object}  response.Envelope{data=domain.IELTSContentItem}
// @Failure      404  {object}  response.Envelope
// @Router       /public/ielts/content/{id} [get]
func (h *IELTSHandler) PublicGet(c *gin.Context) {
	setPublicCache(c, 120, 600)
	item, err := h.svc.GetContent(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	if item.Status != constants.IELTSStatusPublished {
		response.FailCode(c, 404, response.CodeNotFound)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

// AnswerKey godoc
// @Summary      Get answer key for IELTS content
// @Tags         ielts
// @Security     BearerAuth
// @Produce      json
// @Param        id  path  string  true  "Content slug"
// @Success      200  {object}  response.Envelope{data=[]domain.IELTSQuestion}
// @Router       /ielts/content/{id}/answer-key [get]
func (h *IELTSHandler) AnswerKey(c *gin.Context) {
	items, err := h.svc.GetAnswerKey(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, items)
}

func (h *IELTSHandler) PublicAnswerKey(c *gin.Context) {
	setPublicCache(c, 120, 600)
	if item, err := h.svc.GetContent(requestContext(c), c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	} else if item.Status != constants.IELTSStatusPublished {
		response.FailCode(c, 404, response.CodeNotFound)
		return
	}
	h.AnswerKey(c)
}

func (h *IELTSHandler) Vocabulary(c *gin.Context) {
	items, err := h.svc.GetVocabulary(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, items)
}

func (h *IELTSHandler) PublicVocabulary(c *gin.Context) {
	setPublicCache(c, 120, 600)
	if item, err := h.svc.GetContent(requestContext(c), c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	} else if item.Status != constants.IELTSStatusPublished {
		response.FailCode(c, 404, response.CodeNotFound)
		return
	}
	h.Vocabulary(c)
}

// StartAttempt godoc
// @Summary      Start a practice attempt for IELTS content
// @Tags         ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path  string                       true  "Content slug"
// @Param        body  body  dto.IELTSStartAttemptRequest true  "Attempt options"
// @Success      201  {object}  response.Envelope{data=domain.IELTSPracticeAttempt}
// @Failure      400  {object}  response.Envelope
// @Failure      401  {object}  response.Envelope
// @Router       /ielts/content/{id}/attempts [post]
func (h *IELTSHandler) StartAttempt(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.IELTSStartAttemptRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.StartAttempt(requestContext(c), userID, c.Param("id"), req, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.CreatedCode(c, response.CodeSuccess, item)
}

// SubmitAttempt godoc
// @Summary      Submit answers for an IELTS practice attempt
// @Tags         ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path  int                           true  "Attempt ID"
// @Param        body  body  dto.IELTSSubmitAttemptRequest true  "Answers"
// @Success      200  {object}  response.Envelope{data=dto.IELTSAttemptResult}
// @Failure      400  {object}  response.Envelope
// @Failure      401  {object}  response.Envelope
// @Router       /ielts/attempts/{id}/submit [post]
func (h *IELTSHandler) SubmitAttempt(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	attemptID, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	var req dto.IELTSSubmitAttemptRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.SubmitAttempt(requestContext(c), userID, attemptID, req, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

func (h *IELTSHandler) Progress(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var query dto.IELTSProgressFilter
	if !bindQueryOrAbort(c, &query) {
		return
	}
	items, total, err := h.svc.ListProgress(requestContext(c), userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	normalized := query.PaginationQuery.Normalize()
	totalPages := int((total + int64(normalized.PageSize) - 1) / int64(normalized.PageSize))
	meta := response.Meta{Page: normalized.Page, PageSize: normalized.PageSize, TotalItems: total, TotalPages: totalPages}
	response.OKWithMetaCode(c, response.CodeSuccess, items, &meta)
}

func (h *IELTSHandler) UpdateProgress(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	contentID, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	var req dto.IELTSProgressUpdateRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.UpdateProgress(requestContext(c), userID, contentID, req, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

// Create godoc
// @Summary      Create new IELTS content
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body  dto.IELTSContentRequest true  "Content data"
// @Success      201  {object}  response.Envelope{data=domain.IELTSContentItem}
// @Failure      400  {object}  response.Envelope
// @Failure      401  {object}  response.Envelope
// @Router       /admin/ielts/content [post]
func (h *IELTSHandler) Create(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.IELTSContentRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.CreateContent(requestContext(c), req, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.CreatedCode(c, response.CodeSuccess, item)
}

// Update godoc
// @Summary      Update IELTS content
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path  int                     true  "Content ID"
// @Param        body  body  dto.IELTSContentRequest true  "Updated content"
// @Success      200  {object}  response.Envelope{data=domain.IELTSContentItem}
// @Failure      400  {object}  response.Envelope
// @Router       /admin/ielts/content/{id} [put]
func (h *IELTSHandler) Update(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	id, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	var req dto.IELTSContentRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.UpdateContent(requestContext(c), id, req, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

// Delete godoc
// @Summary      Delete IELTS content
// @Tags         admin-ielts
// @Security     BearerAuth
// @Param        id  path  int  true  "Content ID"
// @Success      200  {object}  response.Envelope
// @Failure      400  {object}  response.Envelope
// @Router       /admin/ielts/content/{id} [delete]
func (h *IELTSHandler) Delete(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	id, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	if err := h.svc.DeleteContent(requestContext(c), id, h.auditContext(c, userID)); err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, gin.H{"deleted": true})
}

// Import godoc
// @Summary      Import IELTS content from JSON file
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       multipart/form-data
// @Produce      json
// @Param        file  formData  file  true  "JSON file to import"
// @Success      201  {object}  response.Envelope{data=dto.IELTSImportResult}
// @Failure      400  {object}  response.Envelope
// @Router       /admin/ielts/content/import [post]
func (h *IELTSHandler) Import(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	file, err := c.FormFile("file")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	item, err := h.svc.ImportContent(requestContext(c), file, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.CreatedCode(c, response.CodeSuccess, item)
}

// ImportPDF godoc
// @Summary      Import IELTS content from PDF file
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       multipart/form-data
// @Produce      json
// @Param        file  formData  file  true  "PDF file to parse and import"
// @Success      201  {object}  response.Envelope{data=dto.IELTSPDFImportResult}
// @Failure      400  {object}  response.Envelope
// @Router       /admin/ielts/content/import-pdf [post]
func (h *IELTSHandler) ImportPDF(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	file, err := c.FormFile("file")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	item, err := h.svc.ImportPDF(requestContext(c), file, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.CreatedCode(c, response.CodeSuccess, item)
}

// Review godoc
// @Summary      Update review status of IELTS content
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path  int                    true  "Content ID"
// @Param        body  body  dto.IELTSReviewRequest true  "Review decision"
// @Success      200  {object}  response.Envelope{data=domain.IELTSContentItem}
// @Failure      400  {object}  response.Envelope
// @Router       /admin/ielts/content/{id}/review [post]
func (h *IELTSHandler) Review(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	id, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	var req dto.IELTSReviewRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.UpdateReview(requestContext(c), userID, id, req, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

// Attempts godoc
// @Summary      List user's IELTS practice attempts
// @Tags         ielts
// @Security     BearerAuth
// @Produce      json
// @Param        content_item_id  query  int     false  "Filter by content ID"
// @Param        status           query  string  false  "Filter by status: started, completed"
// @Param        page             query  int     false  "Page number"
// @Param        page_size        query  int     false  "Page size"
// @Success      200  {object}  response.Envelope{data=[]domain.IELTSPracticeAttempt}
// @Router       /ielts/attempts [get]
func (h *IELTSHandler) Attempts(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var query dto.IELTSAttemptFilter
	if !bindQueryOrAbort(c, &query) {
		return
	}
	items, total, err := h.svc.ListAttempts(requestContext(c), userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	normalized := query.PaginationQuery.Normalize()
	totalPages := int((total + int64(normalized.PageSize) - 1) / int64(normalized.PageSize))
	meta := response.Meta{Page: normalized.Page, PageSize: normalized.PageSize, TotalItems: total, TotalPages: totalPages}
	response.OKWithMetaCode(c, response.CodeSuccess, items, &meta)
}

// StartMockTest godoc
// @Summary      Start a full IELTS mock test session (4 skills)
// @Tags         ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body  dto.IELTSMockStartRequest true  "Mock test configuration"
// @Success      201  {object}  response.Envelope{data=domain.IELTSMockTestSession}
// @Failure      400  {object}  response.Envelope
// @Router       /ielts/mock-tests [post]
func (h *IELTSHandler) StartMockTest(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	var req dto.IELTSMockStartRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.StartMockTest(requestContext(c), userID, req, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.CreatedCode(c, response.CodeSuccess, item)
}

// SubmitMockTest godoc
// @Summary      Submit/finish a mock test session
// @Tags         ielts
// @Security     BearerAuth
// @Produce      json
// @Param        id  path  int  true  "Mock test session ID"
// @Success      200  {object}  response.Envelope{data=domain.IELTSMockTestSession}
// @Failure      400  {object}  response.Envelope
// @Router       /ielts/mock-tests/{id}/submit [post]
func (h *IELTSHandler) SubmitMockTest(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	id, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	item, err := h.svc.SubmitMockTest(requestContext(c), userID, id, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

// AdminListMockSessions godoc
// @Summary      List student mock test sessions (admin)
// @Description  Returns paginated list of all mock test sessions across all users.
// @Tags         admin-ielts
// @Security     BearerAuth
// @Produce      json
// @Param        page       query  int     false  "Page number"
// @Param        page_size  query  int     false  "Page size"
// @Param        user_id    query  string  false  "Search by student UUID"
// @Param        status     query  string  false  "Filter by status: started, submitted"
// @Success      200  {object}  response.Envelope{data=[]domain.IELTSMockTestSession}
// @Router       /admin/ielts/mock-tests [get]
func (h *IELTSHandler) AdminListMockSessions(c *gin.Context) {
	var filter dto.IELTSMockSessionFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.Fail(c, 400, "invalid query parameters")
		return
	}

	items, total, err := h.svc.ListMockSessions(requestContext(c), filter)
	if err != nil {
		_ = c.Error(err)
		return
	}

	meta := response.Meta{
		Page:       filter.Page,
		PageSize:   filter.PageSize,
		TotalItems: total,
		TotalPages: int(total) / filter.PageSize,
	}
	if int(total)%filter.PageSize != 0 {
		meta.TotalPages++
	}

	response.OKWithMeta(c, "mock sessions fetched", items, &meta)
}

// CreatePassage godoc
// @Summary      Add a reading passage to content
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path  int                    true  "Content ID"
// @Param        body  body  dto.IELTSPassageRequest true  "Passage data"
// @Success      201  {object}  response.Envelope{data=domain.IELTSPassage}
// @Router       /admin/ielts/content/{id}/passages [post]
func (h *IELTSHandler) CreatePassage(c *gin.Context) {
	h.withContentChild(c, func(userID uuid.UUID, contentID uint) (any, error) {
		var req dto.IELTSPassageRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.CreatePassage(requestContext(c), contentID, req, h.auditContext(c, userID))
	})
}

// UpdatePassage godoc
// @Summary      Update a reading passage
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path  int                    true  "Passage ID"
// @Param        body  body  dto.IELTSPassageRequest true  "Updated passage"
// @Success      200  {object}  response.Envelope{data=domain.IELTSPassage}
// @Router       /admin/ielts/passages/{id} [put]
func (h *IELTSHandler) UpdatePassage(c *gin.Context) {
	h.withItem(c, func(userID uuid.UUID, id uint) (any, error) {
		var req dto.IELTSPassageRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.UpdatePassage(requestContext(c), id, req, h.auditContext(c, userID))
	})
}

// DeletePassage godoc
// @Summary      Delete a reading passage
// @Tags         admin-ielts
// @Security     BearerAuth
// @Param        id  path  int  true  "Passage ID"
// @Success      200  {object}  response.Envelope
// @Router       /admin/ielts/passages/{id} [delete]
func (h *IELTSHandler) DeletePassage(c *gin.Context) {
	h.deleteItem(c, h.svc.DeletePassage)
}

// CreateQuestionGroup godoc
// @Summary      Add a question group to content
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path  int                          true  "Content ID"
// @Param        body  body  dto.IELTSQuestionGroupRequest true  "Question group data"
// @Success      201  {object}  response.Envelope{data=domain.IELTSQuestionGroup}
// @Router       /admin/ielts/content/{id}/question-groups [post]
func (h *IELTSHandler) CreateQuestionGroup(c *gin.Context) {
	h.withContentChild(c, func(userID uuid.UUID, contentID uint) (any, error) {
		var req dto.IELTSQuestionGroupRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.CreateQuestionGroup(requestContext(c), contentID, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) UpdateQuestionGroup(c *gin.Context) {
	h.withItem(c, func(userID uuid.UUID, id uint) (any, error) {
		var req dto.IELTSQuestionGroupRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.UpdateQuestionGroup(requestContext(c), id, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) DeleteQuestionGroup(c *gin.Context) {
	h.deleteItem(c, h.svc.DeleteQuestionGroup)
}

// CreateQuestion godoc
// @Summary      Add a question to content
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path  int                      true  "Content ID"
// @Param        body  body  dto.IELTSQuestionRequest true  "Question data"
// @Success      201  {object}  response.Envelope{data=domain.IELTSQuestion}
// @Router       /admin/ielts/content/{id}/questions [post]
func (h *IELTSHandler) CreateQuestion(c *gin.Context) {
	h.withContentChild(c, func(userID uuid.UUID, contentID uint) (any, error) {
		var req dto.IELTSQuestionRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.CreateQuestion(requestContext(c), contentID, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) UpdateQuestion(c *gin.Context) {
	h.withItem(c, func(userID uuid.UUID, id uint) (any, error) {
		var req dto.IELTSQuestionRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.UpdateQuestion(requestContext(c), id, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) DeleteQuestion(c *gin.Context) {
	h.deleteItem(c, h.svc.DeleteQuestion)
}

// CreateVocabulary godoc
// @Summary      Add vocabulary item to content
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path  int                        true  "Content ID"
// @Param        body  body  dto.IELTSVocabularyRequest true  "Vocabulary data"
// @Success      201  {object}  response.Envelope{data=domain.IELTSVocabularyItem}
// @Router       /admin/ielts/content/{id}/vocabulary [post]
func (h *IELTSHandler) CreateVocabulary(c *gin.Context) {
	h.withContentChild(c, func(userID uuid.UUID, contentID uint) (any, error) {
		var req dto.IELTSVocabularyRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.CreateVocabulary(requestContext(c), contentID, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) UpdateVocabulary(c *gin.Context) {
	h.withItem(c, func(userID uuid.UUID, id uint) (any, error) {
		var req dto.IELTSVocabularyRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.UpdateVocabulary(requestContext(c), id, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) DeleteVocabulary(c *gin.Context) {
	h.deleteItem(c, h.svc.DeleteVocabulary)
}

func (h *IELTSHandler) CreateRelatedPost(c *gin.Context) {
	h.withContentChild(c, func(userID uuid.UUID, contentID uint) (any, error) {
		var req dto.IELTSRelatedPostRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.CreateRelatedPost(requestContext(c), contentID, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) UpdateRelatedPost(c *gin.Context) {
	h.withItem(c, func(userID uuid.UUID, id uint) (any, error) {
		var req dto.IELTSRelatedPostRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.UpdateRelatedPost(requestContext(c), id, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) DeleteRelatedPost(c *gin.Context) {
	h.deleteItem(c, h.svc.DeleteRelatedPost)
}

// UploadAsset godoc
// @Summary      Upload asset (audio/image/pdf) for IELTS content
// @Description  Uploads a file and attaches it to the content item. kind values: thumbnail, audio, pdf, preview.
// @Tags         admin-ielts
// @Security     BearerAuth
// @Accept       multipart/form-data
// @Produce      json
// @Param        id    path      int     true  "Content ID"
// @Param        kind  query     string  true  "Asset kind: thumbnail, audio, pdf, preview"
// @Param        file  formData  file    true  "File to upload"
// @Success      201  {object}  response.Envelope{data=dto.IELTSAssetUploadResponse}
// @Failure      400  {object}  response.Envelope
// @Router       /admin/ielts/content/{id}/assets [post]
func (h *IELTSHandler) UploadAsset(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	contentID, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	kind := c.PostForm("kind")
	if kind == "" {
		kind = c.Query("kind")
	}
	file, err := c.FormFile("file")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	item, err := h.svc.UploadAsset(requestContext(c), userID, contentID, kind, file, h.auditContext(c, userID))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.CreatedCode(c, response.CodeSuccess, item)
}

func (h *IELTSHandler) auditContext(c *gin.Context, userID uuid.UUID) dto.IeltsAuditContext {
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

func parseUintParam(c *gin.Context, name string) (uint, error) {
	value, err := strconv.ParseUint(c.Param(name), 10, 64)
	return uint(value), err
}

func (h *IELTSHandler) withContentChild(c *gin.Context, fn func(uuid.UUID, uint) (any, error)) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	contentID, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	item, err := fn(userID, contentID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	if item != nil {
		response.CreatedCode(c, response.CodeSuccess, item)
	}
}

func (h *IELTSHandler) withItem(c *gin.Context, fn func(uuid.UUID, uint) (any, error)) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	id, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	item, err := fn(userID, id)
	if err != nil {
		_ = c.Error(err)
		return
	}
	if item != nil {
		response.OKCode(c, response.CodeSuccess, item)
	}
}

func (h *IELTSHandler) deleteItem(c *gin.Context, fn func(context.Context, uint, dto.IeltsAuditContext) error) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	id, err := parseUintParam(c, "id")
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	if err := fn(requestContext(c), id, h.auditContext(c, userID)); err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, gin.H{"deleted": true})
}
