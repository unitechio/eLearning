package pagination

import (
	"math"

	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

// Normalize bounds-checks page and pageSize values in a PaginationQuery.
func Normalize(q dto.PaginationQuery) dto.PaginationQuery {
	return q.Normalize()
}

// BuildMeta constructs response.Meta containing page, pageSize, totalItems, and totalPages.
func BuildMeta(q dto.PaginationQuery, total int64) response.Meta {
	q = q.Normalize()
	totalPages := 0
	if total > 0 {
		totalPages = int(math.Ceil(float64(total) / float64(q.PageSize)))
	}
	return response.Meta{
		Page:       q.Page,
		PageSize:   q.PageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}
}
