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

func (h *IELTSHandler) Get(c *gin.Context) {
	item, err := h.svc.GetContent(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

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

func (h *IELTSHandler) CreatePassage(c *gin.Context) {
	h.withContentChild(c, func(userID uuid.UUID, contentID uint) (any, error) {
		var req dto.IELTSPassageRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.CreatePassage(requestContext(c), contentID, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) UpdatePassage(c *gin.Context) {
	h.withItem(c, func(userID uuid.UUID, id uint) (any, error) {
		var req dto.IELTSPassageRequest
		if !bindJSONOrAbort(c, &req) {
			return nil, nil
		}
		return h.svc.UpdatePassage(requestContext(c), id, req, h.auditContext(c, userID))
	})
}

func (h *IELTSHandler) DeletePassage(c *gin.Context) {
	h.deleteItem(c, h.svc.DeletePassage)
}

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
