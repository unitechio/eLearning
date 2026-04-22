package impl

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/service"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo  repository.UserRepository
	jwtSecret string
	jwtExpiry time.Duration
}

func NewAuthService(userRepo repository.UserRepository, cfg *config.JWTConfig) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: cfg.Secret,
		jwtExpiry: cfg.AccessExpiry,
	}
}

func (s *AuthService) Register(req service.RegisterRequest) (*service.AuthResponse, error) {
	existing, err := s.userRepo.FindByEmail(req.Email)
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

	user := &model.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Password:  string(hashed),
		Status:    model.UserStatusActive,
		TenantID:  uuid.New(),
	}
	if err := s.userRepo.Create(user); err != nil {
		return nil, apperr.Internal(err)
	}
	if err := s.userRepo.AssignRoleByName(user.ID, "user"); err != nil && !isNotFoundErr(err) {
		return nil, apperr.Internal(err)
	}

	token, err := s.generateToken(user)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	return &service.AuthResponse{Token: token, User: user}, nil
}

func (s *AuthService) Login(req service.LoginRequest) (*service.AuthResponse, error) {
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, apperr.Unauthorized("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, apperr.Unauthorized("invalid credentials")
	}

	token, err := s.generateToken(user)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return &service.AuthResponse{Token: token, User: user}, nil
}

func (s *AuthService) generateToken(user *model.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID.String(),
		"email":   user.Email,
		"exp":     time.Now().Add(s.jwtExpiry).Unix(),
		"iat":     time.Now().Unix(),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(s.jwtSecret))
}
