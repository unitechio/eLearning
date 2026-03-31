package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Helper struct for shared default fields (excluding ID as it's UUID)
type BaseModel struct {
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

// -----------------------------------------------------------------------------
// 1. TENANT & CONFIGURATION
// -----------------------------------------------------------------------------

type Tenant struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Name      string         `gorm:"type:varchar(255);not null"`
	Domain    *string        `gorm:"type:varchar(255);unique"`
	Settings  datatypes.JSON `gorm:"default:'{}'"`
	BaseModel
}

// -----------------------------------------------------------------------------
// 2. USERS & AUTHENTICATION
// -----------------------------------------------------------------------------

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	TenantID     uuid.UUID `gorm:"type:uuid;not null;index:idx_users_tenant_email,unique"`
	Email        string    `gorm:"type:varchar(255);not null;index:idx_users_tenant_email,unique"`
	PasswordHash *string   `gorm:"type:varchar(255)"`
	IsActive     bool      `gorm:"default:true"`
	BaseModel
}

type UserProfile struct {
	ID              uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID          uuid.UUID `gorm:"type:uuid;uniqueIndex;not null"`
	TenantID        uuid.UUID `gorm:"type:uuid;not null"`
	FirstName       *string   `gorm:"type:varchar(100)"`
	LastName        *string   `gorm:"type:varchar(100)"`
	AvatarURL       *string   `gorm:"type:text"`
	TargetBandScore *float64  `gorm:"type:decimal(3,1)"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

type Role struct {
	ID          uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	TenantID    uuid.UUID      `gorm:"type:uuid;not null"`
	Name        string         `gorm:"type:varchar(50);not null"`
	Permissions datatypes.JSON `gorm:"default:'[]'"`
}

type RefreshToken struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;not null"`
	Token     string    `gorm:"type:text;uniqueIndex;not null"`
	ExpiresAt time.Time `gorm:"not null"`
	CreatedAt time.Time
}

// -----------------------------------------------------------------------------
// 3. LEARNING SYSTEM (Core Content)
// -----------------------------------------------------------------------------

type Course struct {
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	TenantID    uuid.UUID `gorm:"type:uuid;not null"`
	Title       string    `gorm:"type:varchar(255);not null"`
	Description *string   `gorm:"type:text"`
	BaseModel
}

type Unit struct {
	ID         uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CourseID   uuid.UUID `gorm:"type:uuid;not null"`
	TenantID   uuid.UUID `gorm:"type:uuid;not null"`
	Title      string    `gorm:"type:varchar(255);not null"`
	OrderIndex int       `gorm:"not null"`
}

type Lesson struct {
	ID          uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UnitID      uuid.UUID      `gorm:"type:uuid;not null"`
	TenantID    uuid.UUID      `gorm:"type:uuid;not null"`
	Title       string         `gorm:"type:varchar(255);not null"`
	ContentType string         `gorm:"type:varchar(50);not null"`
	Content     datatypes.JSON `gorm:"not null"`
	OrderIndex  int            `gorm:"not null"`
}

type UserProgress struct {
	ID          uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID      uuid.UUID  `gorm:"type:uuid;not null;index:idx_user_progress_tenant_user;uniqueIndex:idx_user_prog_unique"`
	TenantID    uuid.UUID  `gorm:"type:uuid;not null;index:idx_user_progress_tenant_user"`
	LessonID    uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_user_prog_unique"`
	Status      string     `gorm:"type:varchar(50);default:'in_progress'"`
	Score       *float64   `gorm:"type:decimal(5,2)"`
	CompletedAt *time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// -----------------------------------------------------------------------------
// 4. VOCABULARY SYSTEM (Spaced Repetition)
// -----------------------------------------------------------------------------

type VocabularyWord struct {
	ID           uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	TenantID     uuid.UUID `gorm:"type:uuid;not null"`
	Word         string    `gorm:"type:varchar(100);not null"`
	PartOfSpeech *string   `gorm:"type:varchar(50)"`
	Definition   string    `gorm:"type:text;not null"`
	Phonetic     *string   `gorm:"type:varchar(100)"`
	Level        *string   `gorm:"type:varchar(20)"`
}

type UserVocabularyProgress struct {
	ID                 uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID             uuid.UUID  `gorm:"type:uuid;not null;index:idx_vocabulary_progress_tenant_user_date;uniqueIndex:idx_user_vocab_unique"`
	TenantID           uuid.UUID  `gorm:"type:uuid;not null;index:idx_vocabulary_progress_tenant_user_date"`
	WordID             uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_user_vocab_unique"`
	BoxNumber          int        `gorm:"default:1"`
	NextReviewDate     time.Time  `gorm:"not null;default:CURRENT_TIMESTAMP;index:idx_vocabulary_progress_tenant_user_date"`
	LastReviewDate     *time.Time
	ConsecutiveCorrect int        `gorm:"default:0"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
}

// -----------------------------------------------------------------------------
// 5. PRACTICE SYSTEM & AI FEEDBACK
// Note: In Postgres these would be partitioned tables. 
// GORM's AutoMigrate will create them as regular tables, 
// so advanced partitioning should be executed via raw SQL in production.
// -----------------------------------------------------------------------------

type SpeakingAttempt struct {
	ID              uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CreatedAt       time.Time      `gorm:"primaryKey;default:CURRENT_TIMESTAMP"` // Composite PK for table partitioning
	TenantID        uuid.UUID      `gorm:"type:uuid;not null;index:idx_speaking_attempts_user_time"`
	UserID          uuid.UUID      `gorm:"type:uuid;not null;index:idx_speaking_attempts_user_time"`
	LessonID        *uuid.UUID     `gorm:"type:uuid"`
	PromptText      *string        `gorm:"type:text"`
	AudioURL        string         `gorm:"type:text;not null"`
	Transcript      *string        `gorm:"type:text"`
	DurationSeconds *int
	AIScore         *float64       `gorm:"type:decimal(3,1)"`
	AIFeedback      datatypes.JSON `gorm:"index:idx_speaking_attempts_ai_feedback,type:gin"`
	DeletedAt       gorm.DeletedAt `gorm:"index"`
}

type WritingSubmission struct {
	ID           uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CreatedAt    time.Time      `gorm:"primaryKey;default:CURRENT_TIMESTAMP"`
	TenantID     uuid.UUID      `gorm:"type:uuid;not null"`
	UserID       uuid.UUID      `gorm:"type:uuid;not null"`
	PromptText   *string        `gorm:"type:text"`
	UserResponse string         `gorm:"type:text;not null"`
	WordCount    *int
	AIScore      *float64       `gorm:"type:decimal(3,1)"`
	AIFeedback   datatypes.JSON `gorm:"index:idx_writing_submissions_ai_feedback,type:gin"`
	DeletedAt    gorm.DeletedAt `gorm:"index"`
}

// -----------------------------------------------------------------------------
// 6. GAMIFICATION
// -----------------------------------------------------------------------------

type Streak struct {
	ID               uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID           uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex"`
	TenantID         uuid.UUID  `gorm:"type:uuid;not null"`
	CurrentStreak    int        `gorm:"default:0"`
	LongestStreak    int        `gorm:"default:0"`
	LastActivityDate *time.Time `gorm:"type:date"`
	UpdatedAt        time.Time
}

type XPPoint struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	CreatedAt time.Time `gorm:"primaryKey;default:CURRENT_TIMESTAMP"`
	UserID    uuid.UUID `gorm:"type:uuid;not null"`
	TenantID  uuid.UUID `gorm:"type:uuid;not null"`
	Amount    int       `gorm:"not null"`
	Reason    string    `gorm:"type:varchar(255);not null"`
}
