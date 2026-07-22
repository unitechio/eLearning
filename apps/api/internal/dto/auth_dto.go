package dto

import "github.com/unitechio/eLearning/apps/api/internal/domain"

type TokenRefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type VerifyEmailRequest struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required"`
}

type ResendVerificationEmailRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	TOTPCode string `json:"totp_code"`
}

type RegisterRequest struct {
	FirstName string `json:"first_name" binding:"required,min=2,max=100"`
	LastName  string `json:"last_name" binding:"required,min=2,max=100"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
}

type AuthResponse struct {
	Token             string       `json:"token,omitempty"`
	RefreshToken      string       `json:"refresh_token,omitempty"`
	User              *domain.User `json:"user,omitempty"`
	TwoFactorRequired bool         `json:"two_factor_required,omitempty"`
}

type TOTPSetupResponse struct {
	Secret      string `json:"secret"`
	OTPAuthURL  string `json:"otpauth_url"`
	Issuer      string `json:"issuer"`
	AccountName string `json:"account_name"`
}

type TOTPVerifyRequest struct {
	Code string `json:"code" binding:"required,len=6"`
}
