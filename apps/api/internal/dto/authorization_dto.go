package dto

type AccessProfile struct {
	UserID       string   `json:"user_id"`
	Email        string   `json:"email"`
	Roles        []string `json:"roles"`
	Permissions  []string `json:"permissions"`
	Features     []string `json:"features"`
	IsAdmin      bool     `json:"is_admin"`
	IsInstructor bool     `json:"is_instructor"`
	IsPremium    bool     `json:"is_premium"`
}
