package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/module/user"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type RegisterRequest struct {
	Name     string `json:"name"     binding:"required,min=2,max=100"`
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type AuthResponse struct {
	Token string     `json:"token"`
	User  *user.User `json:"user"`
}

type Service interface {
	Register(req RegisterRequest) (*AuthResponse, error)
	Login(req LoginRequest) (*AuthResponse, error)
}

type service struct {
	userRepo  user.Repository
	jwtSecret string
	jwtExpiry time.Duration
}

func NewService(userRepo user.Repository, cfg *config.JWTConfig) Service {
	return &service{
		userRepo:  userRepo,
		jwtSecret: cfg.Secret,
		jwtExpiry: cfg.AccessExpiry,
	}
}

func (s *service) Register(req RegisterRequest) (*AuthResponse, error) {
	existing, _ := s.userRepo.FindByEmail(req.Email)
	if existing != nil && existing.ID != 0 {
		return nil, apperr.Conflict("email already registered")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	u := &user.User{Name: req.Name, Email: req.Email, Password: string(hashed)}
	if err := s.userRepo.Create(u); err != nil {
		return nil, apperr.Internal(err)
	}

	token, err := s.generateToken(u)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return &AuthResponse{Token: token, User: u}, nil
}

func (s *service) Login(req LoginRequest) (*AuthResponse, error) {
	u, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, apperr.Unauthorized("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(req.Password)); err != nil {
		return nil, apperr.Unauthorized("invalid credentials")
	}

	token, err := s.generateToken(u)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return &AuthResponse{Token: token, User: u}, nil
}

func (s *service) generateToken(u *user.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": u.ID,
		"email":   u.Email,
		"exp":     time.Now().Add(s.jwtExpiry).Unix(),
		"iat":     time.Now().Unix(),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(s.jwtSecret))
}
