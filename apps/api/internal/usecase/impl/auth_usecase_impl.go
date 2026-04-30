package impl

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
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
	}
}

func (s *AuthUsecase) Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
	existing, err := s.userRepo.FindByEmail(ctx, req.Email)
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

	user := &domain.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
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
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		s.logAttempt(ctx, req.Email, false, "invalid_credentials")
		return nil, apperr.Unauthorized("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		s.logAttempt(ctx, req.Email, false, "invalid_credentials")
		return nil, apperr.Unauthorized("invalid credentials")
	}
	s.logAttempt(ctx, req.Email, true, "")
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
	_ = ctx
	if req.Email == "" {
		return apperr.BadRequest("email is required")
	}
	return nil
}

func (s *AuthUsecase) ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error {
	_ = ctx
	if req.Token == "" || req.NewPassword == "" {
		return apperr.BadRequest("token and new password are required")
	}
	return nil
}

func (s *AuthUsecase) VerifyEmail(ctx context.Context, req dto.VerifyEmailRequest) error {
	_ = ctx
	if req.Email == "" || req.Code == "" {
		return apperr.BadRequest("email and code are required")
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
