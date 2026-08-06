package impl

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/errs"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/utils/constants"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	ratelimit "github.com/unitechio/eLearning/apps/api/pkg/ratelimit"
	"github.com/unitechio/eLearning/apps/api/pkg/verify"
	"golang.org/x/crypto/bcrypt"
)

// ─────────────────────────────────────────────────────────────────────────────
// Auth constants
// ─────────────────────────────────────────────────────────────────────────────

const (
	otpTTL = 5 * time.Minute

	// passwordResetRateLimit is the maximum password reset attempts per window.
	passwordResetRateLimit       = 5
	passwordResetRateLimitWindow = 15 * time.Minute

	// emailVerificationRateLimit is the maximum resend attempts per window.
	emailVerificationRateLimit       = 5
	emailVerificationRateLimitWindow = 15 * time.Minute

	// totpIssuer is displayed in authenticator apps during TOTP setup.
	totpIssuer = "IELTS Academy"

	// jwtClaimUserID is the claim key for the user ID in JWT tokens.
	jwtClaimUserID = "user_id"
	// jwtClaimEmail is the claim key for the email in JWT tokens.
	jwtClaimEmail = "email"
	// jwtClaimExpiry is the standard JWT expiry claim key.
	jwtClaimExpiry = "exp"
	// jwtClaimIssuedAt is the standard JWT issued-at claim key.
	jwtClaimIssuedAt = "iat"
)

// ─────────────────────────────────────────────────────────────────────────────
// Mailer interface — defined here so the usecase depends on an abstraction,
// not a concrete mailer implementation.
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
// AuthUsecase
// ─────────────────────────────────────────────────────────────────────────────

// AuthUsecase handles user authentication, token lifecycle, and account security.
type AuthUsecase struct {
	userRepo         repository.UserRepository
	authRepo         repository.AuthRepository
	sessionRepo      repository.SessionRepository
	loginAttemptRepo repository.LoginAttemptRepository
	rateLimiter      ratelimit.Limiter
	mailer           Mailer
	otp              *verify.OTP
	logger           *slog.Logger
	jwtSecret        string
	jwtExpiry        time.Duration
	refreshExpiry    time.Duration
	maxSessions      int
}

// NewAuthService constructs an AuthUsecase with all required dependencies.
// All parameters are mandatory; nil values will panic at first use.
func NewAuthService(
	userRepo         repository.UserRepository,
	authRepo         repository.AuthRepository,
	sessionRepo      repository.SessionRepository,
	loginAttemptRepo repository.LoginAttemptRepository,
	rateLimiter      ratelimit.Limiter,
	mailer           Mailer,
	cfg              *config.JWTConfig,
) *AuthUsecase {
	return &AuthUsecase{
		userRepo:         userRepo,
		authRepo:         authRepo,
		sessionRepo:      sessionRepo,
		loginAttemptRepo: loginAttemptRepo,
		rateLimiter:      rateLimiter,
		mailer:           mailer,
		otp:              verify.NewOTP(otpTTL),
		logger:           slog.Default(),
		jwtSecret:        cfg.Secret,
		jwtExpiry:        cfg.AccessExpiry,
		refreshExpiry:    cfg.RefreshExpiration,
		maxSessions:      cfg.MaxSessionsPerUser,
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────────────────────────────────────

func (s *AuthUsecase) Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
	normalizedEmail := normalizeEmail(req.Email)

	if err := s.assertEmailNotRegistered(ctx, normalizedEmail); err != nil {
		return nil, err
	}

	hashedPassword, err := hashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", errs.OpRegister, apperr.Internal(err))
	}

	user := buildNewUser(req, normalizedEmail, hashedPassword)
	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("%s: %w", errs.OpRegister, apperr.Internal(err))
	}

	if err := s.userRepo.AssignRoleByName(ctx, user.ID, string(constants.RoleUser)); err != nil && !errors.Is(err, errs.ErrRoleNotFound) {
		return nil, fmt.Errorf("%s: %w", errs.OpRegister, apperr.Internal(err))
	}

	s.sendEmailVerificationAsync(ctx, user)

	return s.buildAuthResponse(ctx, user)
}

// ─────────────────────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────────────────────

func (s *AuthUsecase) Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error) {
	normalizedEmail := normalizeEmail(req.Email)

	user, err := s.userRepo.FindByEmail(ctx, normalizedEmail)
	if err != nil {
		s.logLoginAttempt(ctx, normalizedEmail, false, constants.LoginFailureInvalidCredentials)
		return nil, apperr.Unauthorized("invalid credentials")
	}

	if err := verifyPassword(user.Password, req.Password); err != nil {
		s.logLoginAttempt(ctx, normalizedEmail, false, constants.LoginFailureInvalidCredentials)
		return nil, apperr.Unauthorized("invalid credentials")
	}

	if err := s.assertAccountActive(user); err != nil {
		s.logLoginAttempt(ctx, normalizedEmail, false, constants.LoginFailureAccountDisabled)
		return nil, err
	}

	if user.TwoFactorEnabled {
		return s.handleTOTPLogin(ctx, user, normalizedEmail, req.TOTPCode)
	}

	s.logLoginAttempt(ctx, normalizedEmail, true, "")
	return s.buildAuthResponse(ctx, user)
}

// ─────────────────────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────────────────────

func (s *AuthUsecase) Logout(ctx context.Context, rawToken string) error {
	token := strings.TrimSpace(strings.TrimPrefix(rawToken, "Bearer "))
	if token == "" {
		return apperr.BadRequest("token is required")
	}
	if err := s.sessionRepo.DeleteByToken(ctx, token); err != nil && !errors.Is(err, errs.ErrSessionNotFound) {
		return apperr.Internal(err)
	}
	return nil
}

// ─────────────────────────────────────────────────────────────────────────────
// RefreshToken
// ─────────────────────────────────────────────────────────────────────────────

func (s *AuthUsecase) RefreshToken(ctx context.Context, refreshToken string) (*dto.AuthResponse, error) {
	if strings.TrimSpace(refreshToken) == "" {
		return nil, apperr.BadRequest("refresh token is required")
	}

	tokenRecord, err := s.authRepo.GetRefreshTokenByToken(ctx, refreshToken)
	if err != nil {
		return nil, apperr.Unauthorized("invalid refresh token")
	}
	if tokenRecord.Revoked || tokenRecord.IsExpired() {
		return nil, apperr.Unauthorized("refresh token is no longer valid")
	}

	user, err := s.userRepo.FindByID(ctx, tokenRecord.UserID)
	if err != nil {
		return nil, apperr.Unauthorized("user not found")
	}

	// Rotate: issue new refresh token then revoke old — wrapped in logical sequence.
	// A production system should wrap this in a DB transaction.
	newRefreshToken, err := s.issueRefreshToken(ctx, user.ID)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	if err := s.authRepo.RevokeRefreshToken(ctx, tokenRecord.ID); err != nil {
		return nil, fmt.Errorf("%s: %w", errs.OpRefreshToken, apperr.Internal(err))
	}

	if err := s.authRepo.UpdateLastUsedAt(ctx, tokenRecord.ID); err != nil && !errors.Is(err, errs.ErrRefreshTokenNotFound) {
		s.logger.Warn("failed to update last_used_at for refresh token",
			slog.String("token_id", tokenRecord.ID.String()),
			slog.Any("error", err),
		)
	}

	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	if err := s.trackSession(ctx, user.ID, accessToken, newRefreshToken.Token); err != nil {
		return nil, apperr.Internal(err)
	}

	return &dto.AuthResponse{Token: accessToken, RefreshToken: newRefreshToken.Token, User: user}, nil
}

// ─────────────────────────────────────────────────────────────────────────────
// Password reset
// ─────────────────────────────────────────────────────────────────────────────

func (s *AuthUsecase) RequestPasswordReset(ctx context.Context, req dto.ForgotPasswordRequest) error {
	if strings.TrimSpace(req.Email) == "" {
		return apperr.BadRequest("email is required")
	}

	normalizedEmail := normalizeEmail(req.Email)
	rateLimitKey := "forgot:" + normalizedEmail

	allowed, _, err := s.rateLimiter.Allow(ctx, rateLimitKey, passwordResetRateLimit, passwordResetRateLimitWindow)
	if err != nil {
		return apperr.Internal(err)
	}
	if !allowed {
		return apperr.TooManyRequests("too many password reset requests")
	}

	user, err := s.userRepo.FindByEmail(ctx, normalizedEmail)
	if err != nil {
		// Intentionally return nil to avoid leaking whether the account exists.
		return nil
	}

	otpCode, err := s.otp.GenerateOTP(ctx, constants.ScopePasswordReset, user.Email)
	if err != nil {
		return apperr.Internal(err)
	}

	go s.sendPasswordResetEmailAsync(user.Email, user.FullName, otpCode)
	return nil
}

func (s *AuthUsecase) ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error {
	normalizedEmail := normalizeEmail(req.Email)
	if normalizedEmail == "" || req.Token == "" || req.NewPassword == "" {
		return apperr.BadRequest("email, token and new password are required")
	}

	ok, err := s.otp.Verify(ctx, constants.ScopePasswordReset, normalizedEmail, req.Token)
	if err != nil || !ok {
		return apperr.BadRequest("invalid or expired password reset token")
	}

	user, err := s.userRepo.FindByEmail(ctx, normalizedEmail)
	if err != nil {
		return apperr.BadRequest("invalid or expired password reset token")
	}

	hashedPassword, err := hashPassword(req.NewPassword)
	if err != nil {
		return fmt.Errorf("%s: %w", errs.OpResetPassword, apperr.Internal(err))
	}

	if err := s.userRepo.ResetPassword(ctx, user.ID, hashedPassword); err != nil {
		return fmt.Errorf("%s: %w", errs.OpResetPassword, apperr.Internal(err))
	}

	// Invalidate all tokens and sessions so a compromised account cannot be
	// continued by an attacker holding an existing JWT or refresh token.
	_ = s.authRepo.RevokeAllRefreshTokensForUser(ctx, user.ID)
	_ = s.sessionRepo.DeleteAllForUser(ctx, user.ID.String())

	return nil
}

// ─────────────────────────────────────────────────────────────────────────────
// Email verification
// ─────────────────────────────────────────────────────────────────────────────

func (s *AuthUsecase) VerifyEmail(ctx context.Context, req dto.VerifyEmailRequest) error {
	normalizedEmail := normalizeEmail(req.Email)
	if normalizedEmail == "" || req.Code == "" {
		return apperr.BadRequest("email and code are required")
	}

	ok, err := s.otp.Verify(ctx, constants.ScopeEmailVerify, normalizedEmail, req.Code)
	if err != nil || !ok {
		return apperr.BadRequest("invalid or expired verification code")
	}

	user, err := s.userRepo.FindByEmail(ctx, normalizedEmail)
	if err != nil {
		return apperr.BadRequest("invalid or expired verification code")
	}

	if err := s.userRepo.UpdateEmailVerification(ctx, user.ID, true); err != nil {
		return fmt.Errorf("%s: %w", errs.OpVerifyEmail, apperr.Internal(err))
	}

	go s.sendWelcomeEmailAsync(user.Email, user.FullName)
	return nil
}

func (s *AuthUsecase) ResendVerificationEmail(ctx context.Context, req dto.ResendVerificationEmailRequest) error {
	normalizedEmail := normalizeEmail(req.Email)
	if normalizedEmail == "" {
		return apperr.BadRequest("email is required")
	}

	rateLimitKey := "verify-email:" + normalizedEmail
	allowed, _, err := s.rateLimiter.Allow(ctx, rateLimitKey, emailVerificationRateLimit, emailVerificationRateLimitWindow)
	if err != nil {
		return apperr.Internal(err)
	}
	if !allowed {
		return apperr.TooManyRequests("too many verification email requests")
	}

	user, err := s.userRepo.FindByEmail(ctx, normalizedEmail)
	if err != nil || user.EmailVerified {
		// Silently succeed to avoid leaking account status.
		return nil
	}

	s.sendEmailVerificationAsync(ctx, user)
	return nil
}

// ─────────────────────────────────────────────────────────────────────────────
// TOTP (Two-Factor Authentication)
// ─────────────────────────────────────────────────────────────────────────────

func (s *AuthUsecase) SetupTOTP(ctx context.Context, userID string) (*dto.TOTPSetupResponse, error) {
	user, err := s.resolveUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user.TwoFactorEnabled {
		return nil, apperr.BadRequest(errs.ErrTOTPAlreadyEnabled.Error())
	}

	secret, err := verify.GenerateSecret()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", errs.OpSetupTOTP, apperr.Internal(err))
	}

	if err := s.userRepo.UpdateTwoFactor(ctx, user.ID, false, secret); err != nil {
		return nil, fmt.Errorf("%s: %w", errs.OpSetupTOTP, apperr.Internal(err))
	}

	totp := verify.New(secret)
	return &dto.TOTPSetupResponse{
		Secret:      secret,
		OTPAuthURL:  totp.GetQRCodeURL(totpIssuer, user.Email),
		Issuer:      totpIssuer,
		AccountName: user.Email,
	}, nil
}

func (s *AuthUsecase) EnableTOTP(ctx context.Context, userID string, req dto.TOTPVerifyRequest) error {
	user, err := s.resolveUserByID(ctx, userID)
	if err != nil {
		return err
	}
	if user.TwoFactorSecret == "" {
		return apperr.BadRequest(errs.ErrTOTPNotInitialized.Error())
	}
	if !s.verifyTOTPCode(user.TwoFactorSecret, req.Code) {
		return apperr.BadRequest(errs.ErrInvalidTOTPCode.Error())
	}
	if err := s.userRepo.UpdateTwoFactor(ctx, user.ID, true, user.TwoFactorSecret); err != nil {
		return fmt.Errorf("%s: %w", errs.OpEnableTOTP, apperr.Internal(err))
	}
	return nil
}

func (s *AuthUsecase) DisableTOTP(ctx context.Context, userID string, req dto.TOTPVerifyRequest) error {
	user, err := s.resolveUserByID(ctx, userID)
	if err != nil {
		return err
	}
	if !user.TwoFactorEnabled {
		return nil
	}
	if !s.verifyTOTPCode(user.TwoFactorSecret, req.Code) {
		return apperr.BadRequest(errs.ErrInvalidTOTPCode.Error())
	}
	if err := s.userRepo.UpdateTwoFactor(ctx, user.ID, false, ""); err != nil {
		return fmt.Errorf("%s: %w", errs.OpDisableTOTP, apperr.Internal(err))
	}
	_ = s.authRepo.RevokeAllRefreshTokensForUser(ctx, user.ID)
	return nil
}

// ─────────────────────────────────────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────────────────────────────────────

func (s *AuthUsecase) assertEmailNotRegistered(ctx context.Context, email string) error {
	existing, err := s.userRepo.FindByEmail(ctx, email)
	if err == nil && existing != nil {
		return apperr.Conflict("email already registered")
	}
	if err != nil && !errors.Is(err, errs.ErrUserNotFound) {
		return apperr.Internal(err)
	}
	return nil
}

func (s *AuthUsecase) assertAccountActive(user *domain.User) error {
	switch user.Status {
	case domain.UserStatusSuspended:
		return apperr.Unauthorized(errs.ErrUserSuspended.Error())
	case domain.UserStatusInactive:
		return apperr.Unauthorized(errs.ErrUserInactive.Error())
	}
	return nil
}

func (s *AuthUsecase) handleTOTPLogin(ctx context.Context, user *domain.User, email, totpCode string) (*dto.AuthResponse, error) {
	if strings.TrimSpace(totpCode) == "" {
		s.logLoginAttempt(ctx, email, false, constants.LoginFailureTwoFactorRequired)
		return &dto.AuthResponse{TwoFactorRequired: true}, nil
	}
	if !s.verifyTOTPCode(user.TwoFactorSecret, totpCode) {
		s.logLoginAttempt(ctx, email, false, constants.LoginFailureInvalidTwoFactor)
		return nil, apperr.Unauthorized(errs.ErrInvalidTOTPCode.Error())
	}
	s.logLoginAttempt(ctx, email, true, "")
	return s.buildAuthResponse(ctx, user)
}

func (s *AuthUsecase) buildAuthResponse(ctx context.Context, user *domain.User) (*dto.AuthResponse, error) {
	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	refreshToken, err := s.issueRefreshToken(ctx, user.ID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.trackSession(ctx, user.ID, accessToken, refreshToken.Token); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.AuthResponse{Token: accessToken, RefreshToken: refreshToken.Token, User: user}, nil
}

func (s *AuthUsecase) generateAccessToken(user *domain.User) (string, error) {
	claims := jwt.MapClaims{
		jwtClaimUserID:  user.ID.String(),
		jwtClaimEmail:   user.Email,
		jwtClaimExpiry:  time.Now().Add(s.jwtExpiry).Unix(),
		jwtClaimIssuedAt: time.Now().Unix(),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(s.jwtSecret))
}

func (s *AuthUsecase) issueRefreshToken(ctx context.Context, userID uuid.UUID) (*domain.RefreshToken, error) {
	if s.maxSessions > 0 {
		if err := s.authRepo.CleanupUserTokens(ctx, userID, s.maxSessions); err != nil {
			return nil, err
		}
	}
	token := &domain.RefreshToken{
		UserID:    userID,
		Token:     uuid.NewString(),
		ExpiresAt: time.Now().Add(s.refreshExpiry),
	}
	if err := s.authRepo.SaveRefreshToken(ctx, token); err != nil {
		return nil, err
	}
	return token, nil
}

func (s *AuthUsecase) trackSession(ctx context.Context, userID uuid.UUID, accessToken, refreshToken string) error {
	session := &domain.Session{
		UserID:       userID,
		Token:        accessToken,
		RefreshToken: refreshToken,
		LastActivity: time.Now(),
		ExpiresAt:    time.Now().Add(s.jwtExpiry),
		IsActive:     true,
	}
	return s.sessionRepo.Create(ctx, session)
}

func (s *AuthUsecase) logLoginAttempt(ctx context.Context, email string, success bool, failureCode string) {
	if s.loginAttemptRepo == nil {
		return
	}
	var code *string
	if failureCode != "" {
		code = &failureCode
	}
	_ = s.loginAttemptRepo.Create(ctx, &domain.LoginAttempt{
		Email:       normalizeEmail(email),
		Successful:  success,
		FailureCode: code,
	})
}

func (s *AuthUsecase) sendEmailVerificationAsync(ctx context.Context, user *domain.User) {
	otpCode, err := s.otp.GenerateOTP(ctx, constants.ScopeEmailVerify, user.Email)
	if err != nil {
		s.logger.Error("failed to generate email verification OTP",
			slog.String("email", user.Email),
			slog.Any("error", err),
		)
		return
	}
	go func() {
		if err := s.mailer.SendEmailVerificationOTP(context.Background(), user.Email, user.FullName, otpCode); err != nil {
			s.logger.Error("failed to send verification email",
				slog.String("email", user.Email),
				slog.Any("error", err),
			)
		}
	}()
}

func (s *AuthUsecase) sendPasswordResetEmailAsync(email, fullName, otpCode string) {
	if err := s.mailer.SendPasswordResetOTP(context.Background(), email, fullName, otpCode); err != nil {
		s.logger.Error("failed to send password reset email",
			slog.String("email", email),
			slog.Any("error", err),
		)
	}
}

func (s *AuthUsecase) sendWelcomeEmailAsync(email, fullName string) {
	if err := s.mailer.SendWelcomeAccountEmail(context.Background(), email, fullName); err != nil {
		s.logger.Error("failed to send welcome email",
			slog.String("email", email),
			slog.Any("error", err),
		)
	}
}

func (s *AuthUsecase) resolveUserByID(ctx context.Context, rawID string) (*domain.User, error) {
	parsedID, err := uuid.Parse(strings.TrimSpace(rawID))
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	user, err := s.userRepo.FindByID(ctx, parsedID)
	if err != nil {
		return nil, apperr.NotFound("user", rawID)
	}
	return user, nil
}

func (s *AuthUsecase) verifyTOTPCode(secret, code string) bool {
	return verify.ValidateCode(code, 6) && verify.New(secret).Verify(code)
}

// ─────────────────────────────────────────────────────────────────────────────
// Package-level pure helpers
// ─────────────────────────────────────────────────────────────────────────────

func normalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

func hashPassword(plaintext string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(plaintext), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

func verifyPassword(hashedPassword, plaintext string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plaintext))
}

func buildNewUser(req dto.RegisterRequest, normalizedEmail, hashedPassword string) *domain.User {
	fullName := strings.TrimSpace(req.FirstName + " " + req.LastName)
	return &domain.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		FullName:  fullName,
		Email:     normalizedEmail,
		Password:  hashedPassword,
		Status:    domain.UserStatusActive,
		TenantID:  uuid.New(),
	}
}
