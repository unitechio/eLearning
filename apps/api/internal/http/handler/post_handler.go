package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type PostHandler struct {
	svc usecase.PostUsecase
}

func NewPostHandler(svc usecase.PostUsecase) *PostHandler {
	return &PostHandler{svc: svc}
}

func (h *PostHandler) List(c *gin.Context) {
	var query dto.PostFilter
	if !bindQueryOrAbort(c, &query) {
		return
	}
	items, total, err := h.svc.List(requestContext(c), query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	normalized := query.PaginationQuery.Normalize()
	totalPages := int((total + int64(normalized.PageSize) - 1) / int64(normalized.PageSize))
	meta := response.Meta{Page: normalized.Page, PageSize: normalized.PageSize, TotalItems: total, TotalPages: totalPages}
	response.OKWithMetaCode(c, response.CodeSuccess, items, &meta)
}

func (h *PostHandler) PublicList(c *gin.Context) {
	setPublicCache(c, 60, 300)
	var query dto.PostFilter
	if !bindQueryOrAbort(c, &query) {
		return
	}
	if query.Status == "" {
		query.Status = string(domain.PostStatusPublished)
	}
	h.listWithQuery(c, query)
}

func (h *PostHandler) listWithQuery(c *gin.Context, query dto.PostFilter) {
	items, total, err := h.svc.List(requestContext(c), query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	normalized := query.PaginationQuery.Normalize()
	totalPages := int((total + int64(normalized.PageSize) - 1) / int64(normalized.PageSize))
	meta := response.Meta{Page: normalized.Page, PageSize: normalized.PageSize, TotalItems: total, TotalPages: totalPages}
	response.OKWithMetaCode(c, response.CodeSuccess, items, &meta)
}

func (h *PostHandler) Get(c *gin.Context) {
	item, err := h.svc.GetBySlug(requestContext(c), c.Param("slug"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

func (h *PostHandler) PublicGet(c *gin.Context) {
	setPublicCache(c, 120, 600)
	item, err := h.svc.GetBySlug(requestContext(c), c.Param("slug"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	if item.Status != domain.PostStatusPublished {
		response.FailCode(c, 404, response.CodeNotFound)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

func (h *PostHandler) Create(c *gin.Context) {
	actor := h.actor(c)
	var req dto.PostRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.Create(requestContext(c), req, actor)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.CreatedCode(c, response.CodeSuccess, item)
}

func (h *PostHandler) Update(c *gin.Context) {
	id, err := parsePostID(c)
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	var req dto.PostRequest
	if !bindJSONOrAbort(c, &req) {
		return
	}
	item, err := h.svc.Update(requestContext(c), id, req, h.actor(c))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, item)
}

func (h *PostHandler) Delete(c *gin.Context) {
	id, err := parsePostID(c)
	if err != nil {
		response.FailCode(c, 400, response.CodeBadRequest)
		return
	}
	if err := h.svc.Delete(requestContext(c), id); err != nil {
		_ = c.Error(err)
		return
	}
	response.OKCode(c, response.CodeSuccess, gin.H{"deleted": true})
}

func (h *PostHandler) actor(c *gin.Context) dto.PostActor {
	userID, _ := currentUserID(c)
	if userID == uuid.Nil {
		userID = uuid.New()
	}
	return dto.PostActor{UserID: userID, Name: userID.String()}
}

func parsePostID(c *gin.Context) (uint, error) {
	value, err := strconv.ParseUint(c.Param("id"), 10, 64)
	return uint(value), err
}
