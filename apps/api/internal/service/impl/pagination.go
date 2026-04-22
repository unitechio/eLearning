package impl

import (
	"math"
	"strings"

	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

func normalizePagination(q dto.PaginationQuery) dto.PaginationQuery {
	return q.Normalize()
}

func buildMeta(q dto.PaginationQuery, total int64) response.Meta {
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

func fallback(v, def string) string {
	if strings.TrimSpace(v) == "" {
		return def
	}
	return v
}

func containsQuery(q string, candidates ...string) bool {
	q = strings.TrimSpace(strings.ToLower(q))
	if q == "" {
		return true
	}
	for _, candidate := range candidates {
		if strings.Contains(strings.ToLower(candidate), q) {
			return true
		}
	}
	return false
}
