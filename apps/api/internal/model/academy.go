package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type Activity struct {
	UUIDModel
	TenantID      uuid.UUID  `json:"tenant_id" gorm:"type:uuid;not null;index"`
	CourseID      *uuid.UUID `json:"course_id,omitempty" gorm:"type:uuid;index"`
	LessonID      *uuid.UUID `json:"lesson_id,omitempty" gorm:"type:uuid;index"`
	Title         string     `json:"title" gorm:"type:varchar(255);not null"`
	Type          string     `json:"type" gorm:"type:varchar(50);not null;index"`
	Domain        string     `json:"domain" gorm:"type:varchar(50);not null;index"`
	Instructions  string     `json:"instructions" gorm:"type:text"`
	Status        string     `json:"status" gorm:"type:varchar(50);default:'draft';index"`
	MaxScore      float64    `json:"max_score" gorm:"default:100"`
	ExpectedInput string     `json:"expected_input" gorm:"type:varchar(50);default:'text'"`
}

type ActivitySubmission struct {
	UUIDModel
	ActivityID  uuid.UUID `json:"activity_id" gorm:"type:uuid;not null;index"`
	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	TenantID    uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Answer      string    `json:"answer" gorm:"type:text;not null"`
	Score       *float64  `json:"score,omitempty" gorm:"type:decimal(5,2)"`
	Feedback    string    `json:"feedback" gorm:"type:text"`
	Status      string    `json:"status" gorm:"type:varchar(50);default:'submitted';index"`
	SubmittedAt time.Time `json:"submitted_at" gorm:"autoCreateTime"`
}

type SpeakingSession struct {
	UUIDModel
	UserID     uuid.UUID  `json:"user_id" gorm:"type:uuid;not null;index"`
	TenantID   uuid.UUID  `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Status     string     `json:"status" gorm:"type:varchar(50);default:'started';index"`
	PromptText string     `json:"prompt_text" gorm:"type:text"`
	Transcript string     `json:"transcript" gorm:"type:text"`
	Accuracy   *float64   `json:"accuracy,omitempty" gorm:"type:decimal(5,2)"`
	Feedback   string     `json:"feedback" gorm:"type:text"`
	StartedAt  time.Time  `json:"started_at" gorm:"autoCreateTime"`
	StoppedAt  *time.Time `json:"stopped_at,omitempty"`
}

type ListeningLesson struct {
	UUIDModel
	TenantID    uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Title       string    `json:"title" gorm:"type:varchar(255);not null"`
	Description string    `json:"description" gorm:"type:text"`
	AudioURL    string    `json:"audio_url" gorm:"type:text"`
	Transcript  string    `json:"transcript" gorm:"type:text"`
	Level       string    `json:"level" gorm:"type:varchar(50);default:'beginner';index"`
	Domain      string    `json:"domain" gorm:"type:varchar(50);default:'english';index"`
	IsActive    bool      `json:"is_active" gorm:"default:true;index"`
}

type StudyPlanner struct {
	UUIDModel
	UserID       uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;uniqueIndex"`
	TenantID     uuid.UUID      `json:"tenant_id" gorm:"type:uuid;not null;index"`
	FocusArea    string         `json:"focus_area" gorm:"type:varchar(100)"`
	WeeklyTarget int            `json:"weekly_target" gorm:"default:3"`
	Tasks        datatypes.JSON `json:"tasks" gorm:"type:jsonb;default:'[]'"`
}

type BillingPlan struct {
	UUIDModel
	TenantID     uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Name         string    `json:"name" gorm:"type:varchar(100);not null"`
	Code         string    `json:"code" gorm:"type:varchar(50);not null;uniqueIndex"`
	Price        float64   `json:"price" gorm:"type:decimal(10,2);not null"`
	Currency     string    `json:"currency" gorm:"type:varchar(10);default:'USD'"`
	Description  string    `json:"description" gorm:"type:text"`
	BillingCycle string    `json:"billing_cycle" gorm:"type:varchar(20);default:'monthly'"`
	IsActive     bool      `json:"is_active" gorm:"default:true"`
}

type BillingSubscription struct {
	UUIDModel
	UserID      uuid.UUID  `json:"user_id" gorm:"type:uuid;not null;index"`
	TenantID    uuid.UUID  `json:"tenant_id" gorm:"type:uuid;not null;index"`
	PlanID      uuid.UUID  `json:"plan_id" gorm:"type:uuid;not null;index"`
	Status      string     `json:"status" gorm:"type:varchar(50);default:'active';index"`
	StartedAt   time.Time  `json:"started_at" gorm:"autoCreateTime"`
	ExpiresAt   *time.Time `json:"expires_at,omitempty"`
	CancelledAt *time.Time `json:"cancelled_at,omitempty"`
}

type BillingHistory struct {
	UUIDModel
	UserID         uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	SubscriptionID uuid.UUID `json:"subscription_id" gorm:"type:uuid;not null;index"`
	PlanName       string    `json:"plan_name" gorm:"type:varchar(100);not null"`
	Amount         float64   `json:"amount" gorm:"type:decimal(10,2);not null"`
	Currency       string    `json:"currency" gorm:"type:varchar(10);default:'USD'"`
	Status         string    `json:"status" gorm:"type:varchar(50);default:'paid'"`
	PaidAt         time.Time `json:"paid_at" gorm:"autoCreateTime"`
}
