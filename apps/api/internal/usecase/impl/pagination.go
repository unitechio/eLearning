package impl

import (
	"strings"

	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/utils/pagination"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

func normalizePagination(q dto.PaginationQuery) dto.PaginationQuery {
	return pagination.Normalize(q)
}

func buildMeta(q dto.PaginationQuery, total int64) response.Meta {
	return pagination.BuildMeta(q, total)
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
