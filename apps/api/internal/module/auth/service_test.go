package auth_test

import (
	"errors"
	"testing"

	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/module/auth"
	"github.com/unitechio/eLearning/apps/api/internal/module/user"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"golang.org/x/crypto/bcrypt"
)

// mockUserRepo fulfils user.Repository for testing without a real DB.
type mockUserRepo struct {
	users map[string]*user.User
}

func newMockRepo() *mockUserRepo {
	return &mockUserRepo{users: make(map[string]*user.User)}
}

func (m *mockUserRepo) FindByEmail(email string) (*user.User, error) {
	u, ok := m.users[email]
	if !ok {
		return nil, errors.New("not found")
	}
	return u, nil
}

func (m *mockUserRepo) FindByID(id uint) (*user.User, error) {
	for _, u := range m.users {
		if u.ID == id {
			return u, nil
		}
	}
	return nil, errors.New("not found")
}

func (m *mockUserRepo) Create(u *user.User) error {
	if _, exists := m.users[u.Email]; exists {
		return errors.New("duplicate email")
	}
	u.Model.ID = uint(len(m.users) + 1)
	m.users[u.Email] = u
	return nil
}

func (m *mockUserRepo) Update(u *user.User) error {
	m.users[u.Email] = u
	return nil
}

func testCfg() *config.JWTConfig {
	return &config.JWTConfig{
		Secret:           "test-secret",
		AccessExpiration: 1<<62 - 1,
	}
}

func TestRegister_Success(t *testing.T) {
	svc := auth.NewService(newMockRepo(), testCfg())
	res, err := svc.Register(auth.RegisterRequest{
		Name: "Alice", Email: "alice@test.com", Password: "password123",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Token == "" {
		t.Error("expected a token")
	}
	if res.User.Email != "alice@test.com" {
		t.Errorf("expected email alice@test.com, got %s", res.User.Email)
	}
}

func TestRegister_DuplicateEmail(t *testing.T) {
	repo := newMockRepo()
	svc := auth.NewService(repo, testCfg())

	req := auth.RegisterRequest{Name: "Alice", Email: "alice@test.com", Password: "password123"}
	_, _ = svc.Register(req)
	_, err := svc.Register(req)
	if err == nil {
		t.Fatal("expected conflict error, got nil")
	}
	if !apperr.IsConflict(err) {
		t.Errorf("expected Conflict error, got %T: %v", err, err)
	}
}

func TestLogin_Success(t *testing.T) {
	repo := newMockRepo()
	svc := auth.NewService(repo, testCfg())

	_, _ = svc.Register(auth.RegisterRequest{
		Name: "Bob", Email: "bob@test.com", Password: "secret123",
	})

	res, err := svc.Login(auth.LoginRequest{Email: "bob@test.com", Password: "secret123"})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Token == "" {
		t.Error("expected a token")
	}
}

func TestLogin_WrongPassword(t *testing.T) {
	repo := newMockRepo()
	svc := auth.NewService(repo, testCfg())

	_, _ = svc.Register(auth.RegisterRequest{
		Name: "Bob", Email: "bob@test.com", Password: "secret123",
	})

	_, err := svc.Login(auth.LoginRequest{Email: "bob@test.com", Password: "wrong"})
	if err == nil {
		t.Fatal("expected unauthorized error, got nil")
	}
	if !apperr.IsUnauthorized(err) {
		t.Errorf("expected Unauthorized error, got %T: %v", err, err)
	}
}

func TestLogin_UserNotFound(t *testing.T) {
	svc := auth.NewService(newMockRepo(), testCfg())
	_, err := svc.Login(auth.LoginRequest{Email: "ghost@test.com", Password: "pass"})
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	if !apperr.IsUnauthorized(err) {
		t.Errorf("expected Unauthorized error, got %T: %v", err, err)
	}
}

func TestBcryptRoundtrip(t *testing.T) {
	hash, err := bcrypt.GenerateFromPassword([]byte("mypassword"), bcrypt.DefaultCost)
	if err != nil {
		t.Fatal(err)
	}
	if err := bcrypt.CompareHashAndPassword(hash, []byte("mypassword")); err != nil {
		t.Errorf("expected password to match hash: %v", err)
	}
}
