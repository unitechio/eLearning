package service

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type AuthWorkflowService interface {
	Refresh(req dto.TokenRefreshRequest) (map[string]string, error)
	Logout(userID uuid.UUID) error
	VerifyEmail(req dto.VerifyEmailRequest) error
	ForgotPassword(req dto.ForgotPasswordRequest) error
	ResetPassword(req dto.ResetPasswordRequest) error
}
