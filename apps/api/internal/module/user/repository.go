package user

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name        string `json:"name"`
	Email       string `json:"email" gorm:"unique"`
	PasswordStr string `json:"-" gorm:"column:password"`
}

type Repository interface {
	FindByEmail(email string) (*User, error)
	FindByID(id string) (*User, error)
	Create(user *User) (*User, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) FindByEmail(email string) (*User, error) {
	var user User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *repository) FindByID(id string) (*User, error) {
	var user User
	err := r.db.First(&user, id).Error
	return &user, err
}

func (r *repository) Create(user *User) (*User, error) {
	err := r.db.Create(user).Error
	return user, err
}
