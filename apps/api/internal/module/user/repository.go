package user

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `json:"name"  gorm:"not null"`
	Email    string `json:"email" gorm:"uniqueIndex;not null"`
	Password string `json:"-"     gorm:"column:password;not null"`
}

type Repository interface {
	FindByEmail(email string) (*User, error)
	FindByID(id uint) (*User, error)
	Create(u *User) error
	Update(u *User) error
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) FindByEmail(email string) (*User, error) {
	var u User
	err := r.db.Where("email = ?", email).First(&u).Error
	return &u, err
}

func (r *repository) FindByID(id uint) (*User, error) {
	var u User
	err := r.db.First(&u, id).Error
	return &u, err
}

func (r *repository) Create(u *User) error {
	return r.db.Create(u).Error
}

func (r *repository) Update(u *User) error {
	return r.db.Save(u).Error
}
