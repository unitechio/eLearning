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
	UserID      string              `json:"user_id"`
	Dashboard   LMSDashboardData    `json:"dashboard"`
	Enrollments []LMSEnrollmentItem `json:"enrollments"`
	Activities  []LMSActivityItem   `json:"activities"`
	Assignments []LMSSubmissionItem `json:"assignments"`
	Voices      []LMSVoiceAssetItem `json:"voices"`
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

type LMSActivityQuery struct {
	PaginationQuery
	Kind       string `form:"kind"`
	Skill      string `form:"skill"`
	Topic      string `form:"topic"`
	Difficulty string `form:"difficulty"`
	Status     string `form:"status"`
}

type LMSActivityItem struct {
	ID            string         `json:"id"`
	UserID        string         `json:"user_id,omitempty"`
	EnrollmentID  string         `json:"enrollment_id,omitempty"`
	Title         string         `json:"title"`
	Description   string         `json:"description"`
	Kind          string         `json:"kind"`
	Skill         string         `json:"skill"`
	Topic         string         `json:"topic"`
	Difficulty    string         `json:"difficulty"`
	Status        string         `json:"status"`
	ThumbnailURL  string         `json:"thumbnail_url"`
	AudioURL      string         `json:"audio_url"`
	Storyline     string         `json:"storyline"`
	Instructions  string         `json:"instructions"`
	DueAt         string         `json:"due_at,omitempty"`
	DurationSec   int            `json:"duration_sec"`
	QuestionCount int            `json:"question_count"`
	Score         float64        `json:"score"`
	Payload       datatypes.JSON `json:"payload"`
	Metrics       datatypes.JSON `json:"metrics"`
	SortOrder     int            `json:"sort_order"`
}

type UpsertLMSActivityRequest struct {
	UserID        string         `json:"user_id"`
	EnrollmentID  string         `json:"enrollment_id"`
	Title         string         `json:"title" binding:"required"`
	Description   string         `json:"description"`
	Kind          string         `json:"kind" binding:"required"`
	Skill         string         `json:"skill" binding:"required"`
	Topic         string         `json:"topic"`
	Difficulty    string         `json:"difficulty"`
	Status        string         `json:"status"`
	ThumbnailURL  string         `json:"thumbnail_url"`
	AudioURL      string         `json:"audio_url"`
	Storyline     string         `json:"storyline"`
	Instructions  string         `json:"instructions"`
	DueAt         string         `json:"due_at"`
	DurationSec   int            `json:"duration_sec"`
	QuestionCount int            `json:"question_count"`
	Score         float64        `json:"score"`
	Payload       datatypes.JSON `json:"payload"`
	Metrics       datatypes.JSON `json:"metrics"`
	SortOrder     int            `json:"sort_order"`
}

type LMSSubmissionRequest struct {
	ResponseText string         `json:"response_text"`
	AudioURL     string         `json:"audio_url"`
	Transcript   string         `json:"transcript"`
	SavedNotes   datatypes.JSON `json:"saved_notes"`
}

type LMSReviewSubmissionRequest struct {
	TeacherFeedback string         `json:"teacher_feedback"`
	TeacherAudioURL string         `json:"teacher_audio_url"`
	Score           float64        `json:"score"`
	InlineNotes     datatypes.JSON `json:"inline_notes"`
	RubricScores    datatypes.JSON `json:"rubric_scores"`
	ProgressChart   datatypes.JSON `json:"progress_chart"`
	Status          string         `json:"status"`
}

type LMSSubmissionItem struct {
	ID              string         `json:"id"`
	ActivityID      string         `json:"activity_id"`
	UserID          string         `json:"user_id"`
	Skill           string         `json:"skill"`
	Status          string         `json:"status"`
	ResponseText    string         `json:"response_text"`
	AudioURL        string         `json:"audio_url"`
	Transcript      string         `json:"transcript"`
	TeacherFeedback string         `json:"teacher_feedback"`
	TeacherAudioURL string         `json:"teacher_audio_url"`
	Score           float64        `json:"score"`
	InlineNotes     datatypes.JSON `json:"inline_notes"`
	SavedNotes      datatypes.JSON `json:"saved_notes"`
	RubricScores    datatypes.JSON `json:"rubric_scores"`
	ProgressChart   datatypes.JSON `json:"progress_chart"`
	SubmittedAt     string         `json:"submitted_at"`
	ReviewedAt      string         `json:"reviewed_at,omitempty"`
}

type LMSVoiceAssetQuery struct {
	PaginationQuery
	Skill      string `form:"skill"`
	Topic      string `form:"topic"`
	Difficulty string `form:"difficulty"`
	VoiceName  string `form:"voice_name"`
}

type LMSVoiceAssetRequest struct {
	Title         string         `json:"title" binding:"required"`
	VoiceName     string         `json:"voice_name"`
	Provider      string         `json:"provider"`
	Skill         string         `json:"skill"`
	Topic         string         `json:"topic"`
	Difficulty    string         `json:"difficulty"`
	AudioURL      string         `json:"audio_url" binding:"required"`
	Transcript    string         `json:"transcript"`
	DurationSec   int            `json:"duration_sec"`
	Pronunciation datatypes.JSON `json:"pronunciation"`
	Metadata      datatypes.JSON `json:"metadata"`
	IsActive      *bool          `json:"is_active"`
}

type LMSVoiceAssetItem struct {
	ID            string         `json:"id"`
	Title         string         `json:"title"`
	VoiceName     string         `json:"voice_name"`
	Provider      string         `json:"provider"`
	Skill         string         `json:"skill"`
	Topic         string         `json:"topic"`
	Difficulty    string         `json:"difficulty"`
	AudioURL      string         `json:"audio_url"`
	Transcript    string         `json:"transcript"`
	DurationSec   int            `json:"duration_sec"`
	Pronunciation datatypes.JSON `json:"pronunciation"`
	Metadata      datatypes.JSON `json:"metadata"`
	IsActive      bool           `json:"is_active"`
}
