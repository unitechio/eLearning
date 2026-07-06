package dto

import "gorm.io/datatypes"

type LMSDashboardData struct {
	HeroTitle         string         `json:"hero_title"`
	HeroDescription   string         `json:"hero_description"`
	CurrentStreak     int            `json:"current_streak"`
	LongestStreak     int            `json:"longest_streak"`
	EstimatedBand     float64        `json:"estimated_band"`
	TargetBand        float64        `json:"target_band"`
	OverallProgress   int            `json:"overall_progress"`
	AttendanceRate    int            `json:"attendance_rate"`
	PracticeRate      int            `json:"practice_rate"`
	AssignmentRate    int            `json:"assignment_rate"`
	ActiveCourses     int            `json:"active_courses"`
	UpcomingCourses   int            `json:"upcoming_courses"`
	CompletedCourses  int            `json:"completed_courses"`
	StudyDays         int            `json:"study_days"`
	PracticeSets      int            `json:"practice_sets"`
	AssignmentsDone   int            `json:"assignments_done"`
	Toolkit           datatypes.JSON `json:"toolkit"`
	SkillPlan         datatypes.JSON `json:"skill_plan"`
	ScoreBreakdown    datatypes.JSON `json:"score_breakdown"`
	FourSkills        datatypes.JSON `json:"four_skills"`
	AIFeatures        datatypes.JSON `json:"ai_features"`
	HighlightCards    datatypes.JSON `json:"highlight_cards"`
	CurrentFocus      string         `json:"current_focus"`
	CurrentFocusNote  string         `json:"current_focus_note"`
}

type LMSDashboardResponse struct {
	UserID       string               `json:"user_id"`
	Dashboard    LMSDashboardData     `json:"dashboard"`
	Enrollments  []LMSEnrollmentItem  `json:"enrollments"`
}

type UpsertLMSDashboardRequest struct {
	HeroTitle         string         `json:"hero_title"`
	HeroDescription   string         `json:"hero_description"`
	CurrentStreak     int            `json:"current_streak"`
	LongestStreak     int            `json:"longest_streak"`
	EstimatedBand     float64        `json:"estimated_band"`
	TargetBand        float64        `json:"target_band"`
	OverallProgress   int            `json:"overall_progress"`
	AttendanceRate    int            `json:"attendance_rate"`
	PracticeRate      int            `json:"practice_rate"`
	AssignmentRate    int            `json:"assignment_rate"`
	ActiveCourses     int            `json:"active_courses"`
	UpcomingCourses   int            `json:"upcoming_courses"`
	CompletedCourses  int            `json:"completed_courses"`
	StudyDays         int            `json:"study_days"`
	PracticeSets      int            `json:"practice_sets"`
	AssignmentsDone   int            `json:"assignments_done"`
	Toolkit           datatypes.JSON `json:"toolkit"`
	SkillPlan         datatypes.JSON `json:"skill_plan"`
	ScoreBreakdown    datatypes.JSON `json:"score_breakdown"`
	FourSkills        datatypes.JSON `json:"four_skills"`
	AIFeatures        datatypes.JSON `json:"ai_features"`
	HighlightCards    datatypes.JSON `json:"highlight_cards"`
	CurrentFocus      string         `json:"current_focus"`
	CurrentFocusNote  string         `json:"current_focus_note"`
}

type LMSEnrollmentItem struct {
	ID                 string         `json:"id"`
	UserID             string         `json:"user_id"`
	CourseID           string         `json:"course_id,omitempty"`
	Title              string         `json:"title"`
	Track              string         `json:"track"`
	Status             string         `json:"status"`
	ProgressPercent    int            `json:"progress_percent"`
	AttendancePercent  int            `json:"attendance_percent"`
	PracticePercent    int            `json:"practice_percent"`
	AssignmentPercent  int            `json:"assignment_percent"`
	ScheduleLabel      string         `json:"schedule_label"`
	TimeRange          string         `json:"time_range"`
	CenterName         string         `json:"center_name"`
	RoomName           string         `json:"room_name"`
	InstructorName     string         `json:"instructor_name"`
	CurrentLesson      string         `json:"current_lesson"`
	NextLesson         string         `json:"next_lesson"`
	CertificateName    string         `json:"certificate_name"`
	CertificateURL     string         `json:"certificate_url"`
	Metrics            datatypes.JSON `json:"metrics"`
	SortOrder          int            `json:"sort_order"`
}

type UpsertLMSEnrollmentRequest struct {
	CourseID           string         `json:"course_id"`
	Title              string         `json:"title" binding:"required"`
	Track              string         `json:"track"`
	Status             string         `json:"status"`
	ProgressPercent    int            `json:"progress_percent"`
	AttendancePercent  int            `json:"attendance_percent"`
	PracticePercent    int            `json:"practice_percent"`
	AssignmentPercent  int            `json:"assignment_percent"`
	ScheduleLabel      string         `json:"schedule_label"`
	TimeRange          string         `json:"time_range"`
	CenterName         string         `json:"center_name"`
	RoomName           string         `json:"room_name"`
	InstructorName     string         `json:"instructor_name"`
	CurrentLesson      string         `json:"current_lesson"`
	NextLesson         string         `json:"next_lesson"`
	CertificateName    string         `json:"certificate_name"`
	CertificateURL     string         `json:"certificate_url"`
	Metrics            datatypes.JSON `json:"metrics"`
	SortOrder          int            `json:"sort_order"`
}
