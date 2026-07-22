package domain

import (
	"time"

	"github.com/google/uuid"
)

type Session struct {
	BaseModel
	UserID       uuid.UUID  `gorm:"type:uuid;index;not null" json:"user_id"`
	Token        string     `gorm:"size:512;uniqueIndex;not null" json:"token"`
	RefreshToken string     `gorm:"size:512" json:"refresh_token"`
	IPAddress    string     `gorm:"size:45" json:"ip_address"`
	UserAgent    string     `gorm:"size:500" json:"user_agent"`
	LastActivity time.Time  `gorm:"index" json:"last_activity"`
	ExpiresAt    time.Time  `gorm:"index;not null" json:"expires_at"`
	IsActive     bool       `gorm:"default:true;index" json:"is_active"`
	RevokedAt    *time.Time `json:"revoked_at,omitempty"`
}

func (Session) TableName() string {
	return "sessions"
}

func (s *Session) IsExpired() bool {
	return time.Now().After(s.ExpiresAt)
}

type LoginAttempt struct {
	BaseModel
	Email       string  `gorm:"size:255;index;not null" json:"email"`
	IPAddress   string  `gorm:"size:45;index" json:"ip_address"`
	UserAgent   string  `gorm:"size:500" json:"user_agent"`
	Successful  bool    `gorm:"index" json:"successful"`
	FailureCode *string `gorm:"size:100" json:"failure_code,omitempty"`
}

func (LoginAttempt) TableName() string {
	return "login_attempts"
}
