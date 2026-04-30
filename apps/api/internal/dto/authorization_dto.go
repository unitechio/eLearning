package dto

type AccessProfile struct {
	UserID       string   `json:"user_id"`
	TenantID     string   `json:"tenant_id"`
	Email        string   `json:"email"`
	Roles        []string `json:"roles"`
	Permissions  []string `json:"permissions"`
	Features     []string `json:"features"`
	IsAdmin      bool     `json:"is_admin"`
	IsInstructor bool     `json:"is_instructor"`
	IsPremium    bool     `json:"is_premium"`
}

type AuthorizationPermissionAssignmentRequest struct {
	UserID        string `json:"user_id" binding:"required"`
	PermissionIDs []uint `json:"permission_ids" binding:"required,min=1"`
}

type AuthorizationRoleAssignmentRequest struct {
	UserID string `json:"user_id" binding:"required"`
	RoleID uint   `json:"role_id" binding:"required"`
}
