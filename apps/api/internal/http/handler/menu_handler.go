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

type MenuHandler struct {
	usecase usecase.MenuUsecase
}

func NewMenuHandler(u usecase.MenuUsecase) *MenuHandler {
	return &MenuHandler{usecase: u}
}

// @Summary Create menu
// @Tags Menu
// @Accept json
// @Produce json
// @Param request body CreateMenuRequest true "Create menu"
// @Success 200 {object} domain.Menu
// @Router /menus [post]
func (h *MenuHandler) Create(c *gin.Context) {
	var req dto.CreateMenuRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	menu := domain.Menu{
		Title:    req.Title,
		URL:      req.URL,
		Period:   req.Period,
		Type:     req.Type,
		ParentID: req.ParentID,
		Icon:     req.Icon,
	}

	if err := h.usecase.Create(c.Request.Context(), &menu); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, menu)
}

// @Summary Update menu
// @Tags Menu
// @Accept json
// @Produce json
// @Param id path string true "Menu ID"
// @Param request body UpdateMenuRequest true "Update menu"
// @Success 200 {object} domain.Menu
// @Router /menus/{id} [put]
func (h *MenuHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	var req dto.UpdateMenuRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	menu, err := h.usecase.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(404, gin.H{"error": "menu not found"})
		return
	}

	// mapping
	menu.Title = req.Title
	menu.URL = req.URL
	menu.Period = req.Period
	menu.Type = req.Type
	menu.ParentID = req.ParentID
	menu.Icon = req.Icon

	if err := h.usecase.Update(c.Request.Context(), menu); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, menu)
}

// @Summary Delete menu
// @Tags Menu
// @Param id path string true "Menu ID"
// @Success 200
// @Router /menus/{id} [delete]
func (h *MenuHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	if err := h.usecase.Delete(c.Request.Context(), id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "deleted"})
}

// @Summary Get menu by ID
// @Tags Menu
// @Produce json
// @Param id path string true "Menu ID"
// @Success 200 {object} domain.Menu
// @Router /menus/{id} [get]
func (h *MenuHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	menu, err := h.usecase.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(404, gin.H{"error": "menu not found"})
		return
	}

	c.JSON(200, menu)
}

// @Summary Get all menus (pagination)
// @Tags Menu
// @Produce json
// @Param search query string false "Search title"
// @Param type query int false "Menu type"
// @Param parent_id query string false "Parent ID"
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Success 200 {object} map[string]interface{}
// @Router /menus [get]
func (h *MenuHandler) GetAll(c *gin.Context) {
	var filter dto.MenuListFilter

	filter.Search = c.Query("search")

	if t := c.Query("type"); t != "" {
		val, _ := strconv.Atoi(t)
		filter.Type = &val
	}

	if p := c.Query("parent_id"); p != "" {
		id, _ := uuid.Parse(p)
		filter.ParentID = &id
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	filter.Page = page
	filter.PageSize = pageSize

	menus, total, err := h.usecase.GetAll(c.Request.Context(), filter)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"data":      menus,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

// @Summary Get menus by user
// @Tags Menu
// @Produce json
// @Param userId path string true "User ID"
// @Success 200 {array} domain.Menu
// @Router /menus/user/{userId} [get]
func (h *MenuHandler) GetByUser(c *gin.Context) {
	userID, err := uuid.Parse(c.Param("userId"))
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid user id"})
		return
	}

	menus, err := h.usecase.GetByUser(c.Request.Context(), userID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, menus)
}

// @Summary Get menu tree
// @Tags Menu
// @Produce json
// @Success 200 {array} domain.Menu
// @Router /menus/tree [get]
func (h *MenuHandler) GetTreeMenu(c *gin.Context) {
	tree, err := h.usecase.GetTree(c.Request.Context())
	if err != nil {
		_ = c.Error(err)
	}
	response.OK(c, "tree menu fetched", tree)
}
