package domain

import (
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
