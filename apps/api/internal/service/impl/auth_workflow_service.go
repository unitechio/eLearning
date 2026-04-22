package impl

import (
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type AuthWorkflowService struct{}

func NewAuthWorkflowService() *AuthWorkflowService {
	return &AuthWorkflowService{}
}

func (s *AuthWorkflowService) Refresh(req dto.TokenRefreshRequest) (map[string]string, error) {
	return map[string]string{
		"access_token":  "refreshed-token",
		"refresh_token": req.RefreshToken,
		"issued_at":     time.Now().UTC().Format(time.RFC3339),
	}, nil
}

func (s *AuthWorkflowService) Logout(userID uuid.UUID) error { return nil }

func (s *AuthWorkflowService) VerifyEmail(req dto.VerifyEmailRequest) error { return nil }

func (s *AuthWorkflowService) ForgotPassword(req dto.ForgotPasswordRequest) error { return nil }

func (s *AuthWorkflowService) ResetPassword(req dto.ResetPasswordRequest) error { return nil }
