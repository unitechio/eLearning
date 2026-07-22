package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type LMSStudentDashboard struct {
	UUIDModel
	TenantID          uuid.UUID      `json:"tenant_id" gorm:"type:uuid;not null;index"`
	UserID            uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;uniqueIndex"`
	HeroTitle         string         `json:"hero_title" gorm:"size:255"`
	HeroDescription   string         `json:"hero_description" gorm:"type:text"`
	CurrentStreak     int            `json:"current_streak" gorm:"default:0"`
	LongestStreak     int            `json:"longest_streak" gorm:"default:0"`
	EstimatedBand     float64        `json:"estimated_band" gorm:"default:0"`
	TargetBand        float64        `json:"target_band" gorm:"default:0"`
	OverallProgress   int            `json:"overall_progress" gorm:"default:0"`
	AttendanceRate    int            `json:"attendance_rate" gorm:"default:0"`
	PracticeRate      int            `json:"practice_rate" gorm:"default:0"`
	AssignmentRate    int            `json:"assignment_rate" gorm:"default:0"`
	ActiveCourses     int            `json:"active_courses" gorm:"default:0"`
	UpcomingCourses   int            `json:"upcoming_courses" gorm:"default:0"`
	CompletedCourses  int            `json:"completed_courses" gorm:"default:0"`
	StudyDays         int            `json:"study_days" gorm:"default:0"`
	PracticeSets      int            `json:"practice_sets" gorm:"default:0"`
	AssignmentsDone   int            `json:"assignments_done" gorm:"default:0"`
	Toolkit           datatypes.JSON `json:"toolkit" gorm:"type:jsonb;default:'[]'"`
	SkillPlan         datatypes.JSON `json:"skill_plan" gorm:"type:jsonb;default:'[]'"`
	ScoreBreakdown    datatypes.JSON `json:"score_breakdown" gorm:"type:jsonb;default:'[]'"`
	FourSkills        datatypes.JSON `json:"four_skills" gorm:"type:jsonb;default:'[]'"`
	AIFeatures        datatypes.JSON `json:"ai_features" gorm:"type:jsonb;default:'[]'"`
	HighlightCards    datatypes.JSON `json:"highlight_cards" gorm:"type:jsonb;default:'[]'"`
	CurrentFocus      string         `json:"current_focus" gorm:"size:255"`
	CurrentFocusNote  string         `json:"current_focus_note" gorm:"type:text"`
}

func (LMSStudentDashboard) TableName() string { return "lms_student_dashboards" }

type LMSCourseEnrollment struct {
	UUIDModel
	TenantID           uuid.UUID      `json:"tenant_id" gorm:"type:uuid;not null;index"`
	UserID             uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;index"`
	CourseID           *uuid.UUID     `json:"course_id,omitempty" gorm:"type:uuid;index"`
	Title              string         `json:"title" gorm:"size:255;not null"`
	Track              string         `json:"track" gorm:"size:120"`
	Status             string         `json:"status" gorm:"size:50;default:'in_progress';index"`
	ProgressPercent    int            `json:"progress_percent" gorm:"default:0"`
	AttendancePercent  int            `json:"attendance_percent" gorm:"default:0"`
	PracticePercent    int            `json:"practice_percent" gorm:"default:0"`
	AssignmentPercent  int            `json:"assignment_percent" gorm:"default:0"`
	ScheduleLabel      string         `json:"schedule_label" gorm:"size:120"`
	TimeRange          string         `json:"time_range" gorm:"size:120"`
	CenterName         string         `json:"center_name" gorm:"size:255"`
	RoomName           string         `json:"room_name" gorm:"size:255"`
	InstructorName     string         `json:"instructor_name" gorm:"size:255"`
	CurrentLesson      string         `json:"current_lesson" gorm:"size:255"`
	NextLesson         string         `json:"next_lesson" gorm:"size:255"`
	CertificateName    string         `json:"certificate_name" gorm:"size:255"`
	CertificateURL     string         `json:"certificate_url" gorm:"size:1000"`
	Metrics            datatypes.JSON `json:"metrics" gorm:"type:jsonb;default:'[]'"`
	SortOrder          int            `json:"sort_order" gorm:"default:0;index"`
}

func (LMSCourseEnrollment) TableName() string { return "lms_course_enrollments" }

type LMSActivity struct {
	UUIDModel
	TenantID      uuid.UUID      `json:"tenant_id" gorm:"type:uuid;not null;index"`
	UserID        *uuid.UUID     `json:"user_id,omitempty" gorm:"type:uuid;index"`
	EnrollmentID *uuid.UUID     `json:"enrollment_id,omitempty" gorm:"type:uuid;index"`
	Title         string         `json:"title" gorm:"size:255;not null"`
	Description   string         `json:"description" gorm:"type:text"`
	Kind          string         `json:"kind" gorm:"size:80;not null;index"`  // assignment, exercise, dictation, mock_test, blog, voice
	Skill         string         `json:"skill" gorm:"size:80;not null;index"` // reading, listening, writing, speaking
	Topic         string         `json:"topic" gorm:"size:160;index"`
	Difficulty    string         `json:"difficulty" gorm:"size:80;index"`
	Status        string         `json:"status" gorm:"size:60;default:'assigned';index"`
	ThumbnailURL  string         `json:"thumbnail_url" gorm:"size:1000"`
	AudioURL      string         `json:"audio_url" gorm:"size:1000"`
	Storyline     string         `json:"storyline" gorm:"type:text"`
	Instructions  string         `json:"instructions" gorm:"type:text"`
	DueAt         *time.Time     `json:"due_at,omitempty" gorm:"index"`
	DurationSec   int            `json:"duration_sec" gorm:"default:0"`
	QuestionCount int            `json:"question_count" gorm:"default:0"`
	Score         float64        `json:"score" gorm:"default:0"`
	Payload       datatypes.JSON `json:"payload" gorm:"type:jsonb;default:'{}'"`
	Metrics       datatypes.JSON `json:"metrics" gorm:"type:jsonb;default:'{}'"`
	SortOrder     int            `json:"sort_order" gorm:"default:0;index"`
	IsActive      bool           `json:"is_active" gorm:"default:true;index"`
}

func (LMSActivity) TableName() string { return "lms_activities" }

type LMSAssignmentSubmission struct {
	UUIDModel
	TenantID          uuid.UUID      `json:"tenant_id" gorm:"type:uuid;not null;index"`
	ActivityID        uuid.UUID      `json:"activity_id" gorm:"type:uuid;not null;index"`
	UserID            uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;index"`
	Skill             string         `json:"skill" gorm:"size:80;not null;index"`
	Status            string         `json:"status" gorm:"size:60;default:'submitted';index"`
	ResponseText      string         `json:"response_text" gorm:"type:text"`
	AudioURL          string         `json:"audio_url" gorm:"size:1000"`
	Transcript        string         `json:"transcript" gorm:"type:text"`
	TeacherFeedback   string         `json:"teacher_feedback" gorm:"type:text"`
	TeacherAudioURL   string         `json:"teacher_audio_url" gorm:"size:1000"`
	Score             float64        `json:"score" gorm:"default:0"`
	InlineNotes       datatypes.JSON `json:"inline_notes" gorm:"type:jsonb;default:'[]'"`
	SavedNotes        datatypes.JSON `json:"saved_notes" gorm:"type:jsonb;default:'[]'"`
	RubricScores      datatypes.JSON `json:"rubric_scores" gorm:"type:jsonb;default:'{}'"`
	ProgressChart     datatypes.JSON `json:"progress_chart" gorm:"type:jsonb;default:'{}'"`
	SubmittedAt       time.Time      `json:"submitted_at" gorm:"not null;index"`
	ReviewedAt        *time.Time     `json:"reviewed_at,omitempty" gorm:"index"`
	ReviewedBy        *uuid.UUID     `json:"reviewed_by,omitempty" gorm:"type:uuid;index"`
}

func (LMSAssignmentSubmission) TableName() string { return "lms_assignment_submissions" }

type LMSVoiceAsset struct {
	UUIDModel
	TenantID       uuid.UUID      `json:"tenant_id" gorm:"type:uuid;not null;index"`
	Title          string         `json:"title" gorm:"size:255;not null"`
	VoiceName      string         `json:"voice_name" gorm:"size:160;index"`
	Provider       string         `json:"provider" gorm:"size:120"`
	Skill          string         `json:"skill" gorm:"size:80;index"`
	Topic          string         `json:"topic" gorm:"size:160;index"`
	Difficulty     string         `json:"difficulty" gorm:"size:80;index"`
	AudioURL       string         `json:"audio_url" gorm:"size:1000;not null"`
	Transcript     string         `json:"transcript" gorm:"type:text"`
	DurationSec    int            `json:"duration_sec" gorm:"default:0"`
	Pronunciation  datatypes.JSON `json:"pronunciation" gorm:"type:jsonb;default:'{}'"`
	Metadata       datatypes.JSON `json:"metadata" gorm:"type:jsonb;default:'{}'"`
	IsActive       bool           `json:"is_active" gorm:"default:true;index"`
}

func (LMSVoiceAsset) TableName() string { return "lms_voice_assets" }
