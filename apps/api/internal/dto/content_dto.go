package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type PostFilter struct {
	PaginationQuery
	Search string `form:"q"`
	Status string `form:"status"`
}

type PostRequest struct {
	Title           string            `json:"title" binding:"required"`
	Slug            string            `json:"slug" binding:"required"`
	Content         string            `json:"content"`
	Excerpt         string            `json:"excerpt"`
	FeaturedImage   string            `json:"featured_image"`
	Status          domain.PostStatus `json:"status"`
	AuthorName      string            `json:"author_name"`
	Language        string            `json:"language"`
	PublishedAt     *time.Time        `json:"published_at"`
	ScheduledAt     *time.Time        `json:"scheduled_at"`
	MetaTitle       string            `json:"meta_title"`
	MetaDescription string            `json:"meta_description"`
	MetaKeywords    string            `json:"meta_keywords"`
	TableOfContents string            `json:"table_of_contents"`
	Tags            string            `json:"tags"`
	Categories      string            `json:"categories"`
}

type PostActor struct {
	UserID uuid.UUID
	Name   string
}
