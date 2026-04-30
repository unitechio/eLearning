package usecase

type UpdateProfileRequest struct {
	FirstName string `json:"first_name" binding:"max=100"`
	LastName  string `json:"last_name" binding:"max=100"`
}
