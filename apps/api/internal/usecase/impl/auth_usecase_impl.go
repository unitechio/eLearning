package impl

import (
	"context"
	"fmt"
	"log/slog"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/cache"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/utils/constants"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"github.com/unitechio/eLearning/apps/api/pkg/verify"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase struct {
	userRepo         repository.UserRepository
	authRepo         repository.AuthRepository
	sessionRepo      repository.SessionRepository
	loginAttemptRepo repository.LoginAttemptRepository
	jwtSecret        string
	jwtExpiry        time.Duration
	refreshExpiry    time.Duration
	maxSessions      int
	otp              *verify.OTP
	mailer           Mailer
	logger           *slog.Logger
}

func NewAuthService(
	userRepo repository.UserRepository,
	authRepo repository.AuthRepository,
	sessionRepo repository.SessionRepository,
	loginAttemptRepo repository.LoginAttemptRepository,
	cfg *config.JWTConfig,
) *AuthUsecase {
	return &AuthUsecase{
		userRepo:         userRepo,
		authRepo:         authRepo,
		sessionRepo:      sessionRepo,
		loginAttemptRepo: loginAttemptRepo,
		jwtSecret:        cfg.Secret,
		jwtExpiry:        cfg.AccessExpiry,
		refreshExpiry:    cfg.RefreshExpiration,
		maxSessions:      cfg.MaxSessionsPerUser,
		otp:              verify.NewOTP(5 * time.Minute),
		mailer:           mailer,
		logger:           slog.Default(),
	}
}

func (s *AuthUsecase) Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))
	existing, err := s.userRepo.FindByEmail(ctx, email)
	if err == nil && existing != nil {
		return nil, apperr.Conflict("email already registered")
	}
	if err != nil && !isNotFoundErr(err) {
		return nil, apperr.Internal(err)
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	fullName := strings.TrimSpace(req.FirstName + " " + req.LastName)
	user := &domain.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		FullName:  fullName,
		Email:     email,
		Password:  string(hashed),
		Status:    domain.UserStatusActive,
		TenantID:  uuid.New(),
	}
	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.userRepo.AssignRoleByName(ctx, user.ID, "user"); err != nil && !isNotFoundErr(err) {
		return nil, apperr.Internal(err)
	}
	s.sendEmailVerification(ctx, user)

	token, err := s.generateToken(user)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	refreshToken, err := s.issueRefreshToken(ctx, user.ID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.AuthResponse{Token: token, RefreshToken: refreshToken.Token, User: user}, nil
}

func (s *AuthUsecase) Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		s.logAttempt(ctx, email, false, "invalid_credentials")
		return nil, apperr.Unauthorized("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		s.logAttempt(ctx, email, false, "invalid_credentials")
		return nil, apperr.Unauthorized("invalid credentials")
	}
	if user.Status == domain.UserStatusSuspended || user.Status == domain.UserStatusInactive {
		s.logAttempt(ctx, email, false, "account_disabled")
		return nil, apperr.Unauthorized("account is not active")
	}
	if user.TwoFactorEnabled {
		if strings.TrimSpace(req.TOTPCode) == "" {
			s.logAttempt(ctx, email, false, "two_factor_required")
			return &dto.AuthResponse{TwoFactorRequired: true}, nil
		}
		if !verify.ValidateCode(req.TOTPCode, 6) || !verify.New(user.TwoFactorSecret).Verify(req.TOTPCode) {
			s.logAttempt(ctx, email, false, "invalid_two_factor_code")
			return nil, apperr.Unauthorized("invalid two-factor code")
		}
	}
	s.logAttempt(ctx, email, true, "")
	token, err := s.generateToken(user)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	refreshToken, err := s.issueRefreshToken(ctx, user.ID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.trackSession(ctx, user.ID, token, refreshToken.Token); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.AuthResponse{Token: token, RefreshToken: refreshToken.Token, User: user}, nil
}

func (s *AuthUsecase) Logout(ctx context.Context, token string) error {
	if token == "" {
		return apperr.BadRequest("token is required")
	}
	rawToken := strings.TrimSpace(strings.TrimPrefix(token, "Bearer "))
	if rawToken == "" {
		return apperr.BadRequest("token is required")
	}
	if s.sessionRepo != nil {
		if err := s.sessionRepo.DeleteByToken(ctx, rawToken); err != nil && !isNotFoundErr(err) {
			return apperr.Internal(err)
		}
	}
	return nil
}

func (s *AuthUsecase) RefreshToken(ctx context.Context, refreshToken string) (*dto.AuthResponse, error) {
	if refreshToken == "" {
		return nil, apperr.BadRequest("refresh token is required")
	}
	tokenRecord, err := s.authRepo.GetRefreshTokenByToken(ctx, refreshToken)
	if err != nil {
		return nil, apperr.Unauthorized("invalid refresh token")
	}
	if tokenRecord.Revoked || tokenRecord.IsExpired() {
		return nil, apperr.Unauthorized("refresh token is no longer valid")
	}
	tokenID := fmt.Sprintf("%d", tokenRecord.ID)
	if err := s.authRepo.UpdateLastUsedAt(ctx, tokenID); err != nil && !isNotFoundErr(err) {
		return nil, apperr.Internal(err)
	}
	user, err := s.userRepo.FindByID(ctx, tokenRecord.UserID)
	if err != nil {
		return nil, apperr.Unauthorized("user not found")
	}
	accessToken, err := s.generateToken(user)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	newRefreshToken, err := s.issueRefreshToken(ctx, user.ID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.authRepo.RevokeRefreshToken(ctx, tokenID); err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.trackSession(ctx, user.ID, accessToken, newRefreshToken.Token); err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.AuthResponse{Token: accessToken, RefreshToken: newRefreshToken.Token, User: user}, nil
}

func (s *AuthUsecase) RequestPasswordReset(ctx context.Context, req dto.ForgotPasswordRequest) error {
	if req.Email == "" {
		return apperr.BadRequest("email is required")
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))

	// Rate limit
	allowed, _, _, err := cache.CheckRateLimit(
		ctx, "forgot:"+email, 5, 15*time.Minute,
	)
	if err != nil {
		return err
	}

	if !allowed {
		return apperr.TooManyRequests("too many password reset requests")
	}

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil // Không leak account
	}

	otp, err := s.otp.GenerateOTP(ctx, constants.ScopePasswordReset, user.Email)
	if err != nil {
		return err
	}

	// Send mail async
	go func() {
		if err := s.mailer.SendPasswordResetOTP(
			context.Background(),
			user.Email,
			user.FullName,
			otp,
		); err != nil {
			s.logger.Error(
				"failed to send password reset email",
				slog.Any("error", err),
				slog.String("email", user.Email),
			)
		}
	}()

	return nil
}

func (s *AuthUsecase) ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error {
	email := strings.ToLower(strings.TrimSpace(req.Email))
	if email == "" || req.Token == "" || req.NewPassword == "" {
		return apperr.BadRequest("email, token and new password are required")
	}
	ok, err := s.otp.Verify(ctx, constants.ScopePasswordReset, email, req.Token)
	if err != nil || !ok {
		return apperr.BadRequest("invalid or expired password reset token")
	}
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return apperr.BadRequest("invalid or expired password reset token")
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return apperr.Internal(err)
	}
	if err := s.userRepo.ResetPassword(ctx, user.ID.String(), string(hashed)); err != nil {
		return apperr.Internal(err)
	}
	if s.authRepo != nil {
		_ = s.authRepo.RevokeAllRefreshTokensForUser(ctx, user.ID)
	}
	return nil
}

func (s *AuthUsecase) VerifyEmail(ctx context.Context, req dto.VerifyEmailRequest) error {
	email := strings.ToLower(strings.TrimSpace(req.Email))
	if email == "" || req.Code == "" {
		return apperr.BadRequest("email and code are required")
	}
	ok, err := s.otp.Verify(ctx, constants.ScopeEmailVerify, email, req.Code)
	if err != nil || !ok {
		return apperr.BadRequest("invalid or expired verification code")
	}
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return apperr.BadRequest("invalid or expired verification code")
	}
	if err := s.userRepo.UpdateEmailVerification(ctx, user.ID, true); err != nil {
		return apperr.Internal(err)
	}
	go func() {
		if err := s.mailer.SendWelcomeAccountEmail(context.Background(), user.Email, user.FullName); err != nil {
			s.logger.Error("failed to send welcome email", slog.Any("error", err), slog.String("email", user.Email))
		}
	}()
	return nil
}

func (s *AuthUsecase) ResendVerificationEmail(ctx context.Context, req dto.ResendVerificationEmailRequest) error {
	email := strings.ToLower(strings.TrimSpace(req.Email))
	if email == "" {
		return apperr.BadRequest("email is required")
	}
	allowed, _, _, err := cache.CheckRateLimit(ctx, "verify-email:"+email, 5, 15*time.Minute)
	if err != nil {
		return err
	}
	if !allowed {
		return apperr.TooManyRequests("too many verification email requests")
	}
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil || user.EmailVerified {
		return nil
	}
	s.sendEmailVerification(ctx, user)
	return nil
}

func (s *AuthUsecase) SetupTOTP(ctx context.Context, userID string) (*dto.TOTPSetupResponse, error) {
	user, err := s.getUserByIDString(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user.TwoFactorEnabled {
		return nil, apperr.BadRequest("two-factor authentication is already enabled")
	}
	secret, err := verify.GenerateSecret()
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.userRepo.UpdateTwoFactor(ctx, user.ID, false, secret); err != nil {
		return nil, apperr.Internal(err)
	}
	issuer := "IELTS Academy"
	totp := verify.New(secret)
	return &dto.TOTPSetupResponse{
		Secret:      secret,
		OTPAuthURL:  totp.GetQRCodeURL(issuer, user.Email),
		Issuer:      issuer,
		AccountName: user.Email,
	}, nil
}

func (s *AuthUsecase) EnableTOTP(ctx context.Context, userID string, req dto.TOTPVerifyRequest) error {
	user, err := s.getUserByIDString(ctx, userID)
	if err != nil {
		return err
	}
	if user.TwoFactorSecret == "" {
		return apperr.BadRequest("two-factor setup has not been initialized")
	}
	if !verify.ValidateCode(req.Code, 6) || !verify.New(user.TwoFactorSecret).Verify(req.Code) {
		return apperr.BadRequest("invalid two-factor code")
	}
	if err := s.userRepo.UpdateTwoFactor(ctx, user.ID, true, user.TwoFactorSecret); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *AuthUsecase) DisableTOTP(ctx context.Context, userID string, req dto.TOTPVerifyRequest) error {
	user, err := s.getUserByIDString(ctx, userID)
	if err != nil {
		return err
	}
	if !user.TwoFactorEnabled {
		return nil
	}
	if !verify.ValidateCode(req.Code, 6) || !verify.New(user.TwoFactorSecret).Verify(req.Code) {
		return apperr.BadRequest("invalid two-factor code")
	}
	if err := s.userRepo.UpdateTwoFactor(ctx, user.ID, false, ""); err != nil {
		return apperr.Internal(err)
	}
	if s.authRepo != nil {
		_ = s.authRepo.RevokeAllRefreshTokensForUser(ctx, user.ID)
	}
	return nil
}

func (s *AuthUsecase) generateToken(user *domain.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID.String(),
		"email":   user.Email,
		"exp":     time.Now().Add(s.jwtExpiry).Unix(),
		"iat":     time.Now().Unix(),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(s.jwtSecret))
}

func (s *AuthUsecase) issueRefreshToken(ctx context.Context, userID uuid.UUID) (*domain.RefreshToken, error) {
	if s.authRepo == nil {
		return &domain.RefreshToken{UserID: userID, Token: uuid.NewString(), ExpiresAt: time.Now().Add(s.refreshExpiry)}, nil
	}
	if s.maxSessions > 0 {
		if err := s.authRepo.CleanupUserTokens(ctx, userID, s.maxSessions); err != nil {
			return nil, err
		}
	}
	item := &domain.RefreshToken{
		UserID:    userID,
		Token:     uuid.NewString(),
		ExpiresAt: time.Now().Add(s.refreshExpiry),
	}
	if err := s.authRepo.SaveRefreshToken(ctx, item); err != nil {
		return nil, err
	}
	return item, nil
}

func (s *AuthUsecase) trackSession(ctx context.Context, userID uuid.UUID, accessToken, refreshToken string) error {
	if s.sessionRepo == nil {
		return nil
	}
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

func (s *AuthUsecase) logAttempt(ctx context.Context, email string, success bool, failureCode string) {
	if s.loginAttemptRepo == nil {
		return
	}
	var code *string
	if failureCode != "" {
		code = &failureCode
	}
	_ = s.loginAttemptRepo.Create(ctx, &domain.LoginAttempt{
		Email:       strings.ToLower(strings.TrimSpace(email)),
		Successful:  success,
		FailureCode: code,
	})
}

func (s *AuthUsecase) sendEmailVerification(ctx context.Context, user *domain.User) {
	otp, err := s.otp.GenerateOTP(ctx, constants.ScopeEmailVerify, user.Email)
	if err != nil {
		s.logger.Error("failed to generate verification otp", slog.Any("error", err), slog.String("email", user.Email))
		return
	}
	go func() {
		if err := s.mailer.SendEmailVerificationOTP(context.Background(), user.Email, user.FullName, otp); err != nil {
			s.logger.Error("failed to send verification email", slog.Any("error", err), slog.String("email", user.Email))
		}
	}()
}

func (s *AuthUsecase) getUserByIDString(ctx context.Context, rawID string) (*domain.User, error) {
	id, err := uuid.Parse(strings.TrimSpace(rawID))
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	user, err := s.userRepo.FindByID(ctx, id)
	if err != nil {
		return nil, apperr.NotFound("user", rawID)
	}
	return user, nil
}
