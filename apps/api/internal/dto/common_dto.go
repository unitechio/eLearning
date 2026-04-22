package dto

import "github.com/unitechio/eLearning/apps/api/pkg/response"

type PaginationQuery struct {
	Page     int `form:"page"`
	PageSize int `form:"page_size"`
}

func (q PaginationQuery) Normalize() PaginationQuery {
	if q.Page < 1 {
		q.Page = 1
	}
	if q.PageSize < 1 {
		q.PageSize = 10
	}
	if q.PageSize > 100 {
		q.PageSize = 100
	}
	return q
}

type PageResult[T any] struct {
	Items []T
	Meta  response.Meta
}
