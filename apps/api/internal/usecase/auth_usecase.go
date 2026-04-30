package usecase

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type AuthUsecase interface {
	Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error)
	Logout(ctx context.Context, token string) error
	RefreshToken(ctx context.Context, refreshToken string) (*dto.AuthResponse, error)
	RequestPasswordReset(ctx context.Context, req dto.ForgotPasswordRequest) error
	ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error
	VerifyEmail(ctx context.Context, req dto.VerifyEmailRequest) error
}
