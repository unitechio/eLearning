package usecase

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type AuthUsecase interface {
	Register(ctx context.Context, user *domain.User, password string) (*dto.AuthResponse, error)
	Login(ctx context.Context, credentials *dto.AuthCredentials, ipAddress, userAgent string) (*dto.AuthResponse, error)
	Logout(ctx context.Context, token string) error
	RefreshToken(ctx context.Context, refreshToken string) (*dto.AuthResponse, error)
	ValidateToken(ctx context.Context, token string) (*domain.User, error)
	ChangePassword(ctx context.Context, userID string, request *dto.ChangePasswordRequest) error
	RequestPasswordReset(ctx context.Context, request *dto.PasswordResetRequest) error
	ResetPassword(ctx context.Context, request *dto.PasswordResetConfirm) error
	VerifyEmail(ctx context.Context, request *dto.EmailVerificationRequest) error
	ResendVerificationEmail(ctx context.Context, email string) error
	GetUserSessions(ctx context.Context, userID string) ([]*domain.Session, error)
	RevokeSession(ctx context.Context, sessionID string) error
	RevokeAllSessions(ctx context.Context, userID string) error
	GetOAuthLoginURL(ctx context.Context, provider domain.AuthProvider, redirectURL string) (string, error)
	HandleOAuthCallback(ctx context.Context, provider dto.AuthProvider, code, state string) (*dto.AuthResponse, error)
}
