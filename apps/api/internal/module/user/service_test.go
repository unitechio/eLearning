package user_test

import (
	"errors"
	"testing"

	"github.com/unitechio/eLearning/apps/api/internal/module/user"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type mockUserRepo struct {
	store map[uint]*user.User
}

func newMockRepo() *mockUserRepo {
	return &mockUserRepo{store: map[uint]*user.User{
		1: {Name: "Alice", Email: "alice@test.com"},
	}}
}

func (m *mockUserRepo) FindByEmail(email string) (*user.User, error) {
	for _, u := range m.store {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, errors.New("not found")
}

func (m *mockUserRepo) FindByID(id uint) (*user.User, error) {
	u, ok := m.store[id]
	if !ok {
		return nil, errors.New("not found")
	}
	return u, nil
}

func (m *mockUserRepo) Create(u *user.User) error {
	u.Model.ID = uint(len(m.store) + 1)
	m.store[u.Model.ID] = u
	return nil
}

func (m *mockUserRepo) Update(u *user.User) error {
	m.store[u.Model.ID] = u
	return nil
}

func TestGetByID_Found(t *testing.T) {
	svc := user.NewService(newMockRepo())
	u, err := svc.GetByID(1)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if u.Name != "Alice" {
		t.Errorf("expected Alice, got %s", u.Name)
	}
}

func TestGetByID_NotFound(t *testing.T) {
	svc := user.NewService(newMockRepo())
	_, err := svc.GetByID(999)
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	if !apperr.IsNotFound(err) {
		t.Errorf("expected NotFound error, got %T: %v", err, err)
	}
}

func TestUpdateProfile_Success(t *testing.T) {
	svc := user.NewService(newMockRepo())
	u, err := svc.UpdateProfile(1, user.UpdateProfileRequest{Name: "Alice Updated"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if u.Name != "Alice Updated" {
		t.Errorf("expected 'Alice Updated', got %s", u.Name)
	}
}

func TestUpdateProfile_UserNotFound(t *testing.T) {
	svc := user.NewService(newMockRepo())
	_, err := svc.UpdateProfile(404, user.UpdateProfileRequest{Name: "Ghost"})
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	if !apperr.IsNotFound(err) {
		t.Errorf("expected NotFound error, got %T: %v", err, err)
	}
}
