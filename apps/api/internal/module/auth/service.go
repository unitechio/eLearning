package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/owner/eenglish/api/internal/module/user"
	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	Login(email, password string) (string, *user.User, error)
	Register(name, email, password string) (*user.User, error)
}

type service struct {
	userRepo   user.Repository
	jwtSecret  string
}

func NewService(repo user.Repository, jwtSecret string) Service {
	return &service{userRepo: repo, jwtSecret: jwtSecret}
}

func (s *service) Login(email, password string) (string, *user.User, error) {
	u, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", nil, errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.PasswordStr), []byte(password))
	if err != nil {
		return "", nil, errors.New("invalid credentials")
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": u.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", nil, err
	}

	return tokenString, u, nil
}

func (s *service) Register(name, email, password string) (*user.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	u := &user.User{
		Name:        name,
		Email:       email,
		PasswordStr: string(hashedPassword),
	}

	createdUser, err := s.userRepo.Create(u)
	if err != nil {
		return nil, err
	}
	return createdUser, nil
}
