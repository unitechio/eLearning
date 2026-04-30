package dto

import "github.com/google/uuid"

type CreateMenuRequest struct {
	Title    string     `json:"title"`
	URL      string     `json:"url"`
	ParentID *uuid.UUID `json:"parentId"`
	Icon     string     `json:"icon"`
	Type     int        `json:"type"`
	Period   int        `json:"period"`
}

type UpdateMenuRequest struct {
	Title    string     `json:"title"`
	URL      string     `json:"url"`
	ParentID *uuid.UUID `json:"parentId"`
	Icon     string     `json:"icon"`
	Type     int        `json:"type"`
	Period   int        `json:"period"`
}

type MenuResponse struct {
	ID       uuid.UUID      `json:"id"`
	Title    string         `json:"title"`
	URL      string         `json:"url"`
	Icon     string         `json:"icon"`
	Children []MenuResponse `json:"children"`
}

type MenuListFilter struct {
	Search   string
	Type     *int
	ParentID *uuid.UUID
	Page     int
	PageSize int
}
