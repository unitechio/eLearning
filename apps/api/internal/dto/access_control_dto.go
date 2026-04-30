package dto

type RoleFilter struct {
	PaginationQuery
	IsActive *bool `form:"is_active"`
}

type PermissionFilter struct {
	PaginationQuery
	Resource string `form:"resource"`
	Action   string `form:"action"`
}
