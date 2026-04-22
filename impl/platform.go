package usecase

import "github.com/google/uuid"

type TokenRefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type VerifyEmailRequest struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type UserProgress struct {
	CourseID          string  `json:"course_id"`
	CourseTitle       string  `json:"course_title"`
	CompletionRate    float64 `json:"completion_rate"`
	CompletedLessons  int     `json:"completed_lessons"`
	TotalLessons      int     `json:"total_lessons"`
	LastActivityAtUTC string  `json:"last_activity_at"`
}

type UserStats struct {
	TotalStudyMinutes int     `json:"total_study_minutes"`
	CurrentStreak     int     `json:"current_streak"`
	CompletedCourses  int     `json:"completed_courses"`
	AverageScore      float64 `json:"average_score"`
}

type UserActivityItem struct {
	ID          string `json:"id"`
	Type        string `json:"type"`
	Title       string `json:"title"`
	Description string `json:"description"`
	OccurredAt  string `json:"occurred_at"`
}

type Course struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Domain      string `json:"domain"`
	Level       string `json:"level"`
	Status      string `json:"status"`
}

type UpsertCourseRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Domain      string `json:"domain" binding:"required"`
	Level       string `json:"level"`
	Status      string `json:"status"`
}

type CourseModule struct {
	ID       string `json:"id"`
	CourseID string `json:"course_id"`
	Title    string `json:"title"`
	Order    int    `json:"order"`
}

type UpsertModuleRequest struct {
	CourseID string `json:"course_id" binding:"required"`
	Title    string `json:"title" binding:"required"`
	Order    int    `json:"order"`
}

type Lesson struct {
	ID       string `json:"id"`
	ModuleID string `json:"module_id"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Order    int    `json:"order"`
}

type UpsertLessonRequest struct {
	ModuleID string `json:"module_id" binding:"required"`
	Title    string `json:"title" binding:"required"`
	Content  string `json:"content"`
	Order    int    `json:"order"`
}

type Activity struct {
	ID           string `json:"id"`
	Title        string `json:"title"`
	Type         string `json:"type"`
	Domain       string `json:"domain"`
	Instructions string `json:"instructions"`
	Status       string `json:"status"`
}

type UpsertActivityRequest struct {
	Title        string `json:"title" binding:"required"`
	Type         string `json:"type" binding:"required"`
	Domain       string `json:"domain" binding:"required"`
	Instructions string `json:"instructions"`
	Status       string `json:"status"`
}

type SubmitActivityRequest struct {
	Answer string `json:"answer" binding:"required"`
}

type Submission struct {
	ID         string  `json:"id"`
	ActivityID string  `json:"activity_id"`
	UserID     string  `json:"user_id"`
	Answer     string  `json:"answer"`
	Score      float64 `json:"score"`
	Feedback   string  `json:"feedback"`
	Status     string  `json:"status"`
}

type WritingEvaluationRequest struct {
	Prompt string `json:"prompt" binding:"required"`
	Text   string `json:"text" binding:"required"`
}

type SpeakingSession struct {
	ID        string `json:"id"`
	Status    string `json:"status"`
	StartedAt string `json:"started_at"`
	StoppedAt string `json:"stopped_at,omitempty"`
}

type PronunciationRequest struct {
	Text string `json:"text" binding:"required"`
}

type PronunciationResult struct {
	Accuracy float64 `json:"accuracy"`
	Feedback string  `json:"feedback"`
}

type UpdateWordRequest struct {
	Word         string  `json:"word" binding:"required"`
	Definition   string  `json:"definition" binding:"required"`
	PartOfSpeech *string `json:"part_of_speech,omitempty"`
	Phonetic     *string `json:"phonetic,omitempty"`
	Level        *string `json:"level,omitempty"`
	Example      *string `json:"example,omitempty"`
}

type VocabularyHistoryItem struct {
	ID         string `json:"id"`
	WordID     string `json:"word_id"`
	Result     string `json:"result"`
	ReviewedAt string `json:"reviewed_at"`
}

type ListeningLesson struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	AudioURL    string `json:"audio_url"`
}

type ListeningSubmissionRequest struct {
	Answers []string `json:"answers" binding:"required"`
}

type AIChatRequest struct {
	Message string `json:"message" binding:"required"`
	Domain  string `json:"domain"`
}

type AIQuestionRequest struct {
	Topic  string `json:"topic" binding:"required"`
	Domain string `json:"domain" binding:"required"`
}

type ProgressSnapshot struct {
	OverallCompletion float64 `json:"overall_completion"`
	CurrentStreak     int     `json:"current_streak"`
	WeeklyMinutes     int     `json:"weekly_minutes"`
}

type Planner struct {
	FocusArea    string   `json:"focus_area"`
	WeeklyTarget int      `json:"weekly_target"`
	Tasks        []string `json:"tasks"`
}

type PlannerUpdateRequest struct {
	FocusArea    string   `json:"focus_area"`
	WeeklyTarget int      `json:"weekly_target"`
	Tasks        []string `json:"tasks"`
}

type NotificationItem struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Message   string `json:"message"`
	IsRead    bool   `json:"is_read"`
	CreatedAt string `json:"created_at"`
}

type AdminUser struct {
	ID     string `json:"id"`
	Email  string `json:"email"`
	Status string `json:"status"`
}

type UpdateUserStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

type AnalyticsSnapshot struct {
	TotalUsers      int `json:"total_users"`
	ActiveUsers     int `json:"active_users"`
	TotalCourses    int `json:"total_courses"`
	TotalActivities int `json:"total_activities"`
}

type AIUsageSnapshot struct {
	TotalRequests int `json:"total_requests"`
	TokenUsage    int `json:"token_usage"`
}

type BillingPlan struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Currency    string  `json:"currency"`
	Description string  `json:"description"`
}

type SubscribeRequest struct {
	PlanID string `json:"plan_id" binding:"required"`
}

type BillingHistoryItem struct {
	ID        string  `json:"id"`
	PlanName  string  `json:"plan_name"`
	Amount    float64 `json:"amount"`
	Status    string  `json:"status"`
	CreatedAt string  `json:"created_at"`
}

type AuthWorkflowUsecase interface {
	Refresh(req TokenRefreshRequest) (map[string]string, error)
	Logout(userID uuid.UUID) error
	VerifyEmail(req VerifyEmailRequest) error
	ForgotPassword(req ForgotPasswordRequest) error
	ResetPassword(req ResetPasswordRequest) error
}

type UserInsightsUsecase interface {
	GetProgress(userID uuid.UUID) ([]UserProgress, error)
	GetStats(userID uuid.UUID) (*UserStats, error)
	GetActivities(userID uuid.UUID) ([]UserActivityItem, error)
}

type CourseUsecase interface {
	ListCourses() ([]Course, error)
	CreateCourse(req UpsertCourseRequest) (*Course, error)
	GetCourse(id string) (*Course, error)
	UpdateCourse(id string, req UpsertCourseRequest) (*Course, error)
	DeleteCourse(id string) error
	ListCourseModules(courseID string) ([]CourseModule, error)
	CreateModule(req UpsertModuleRequest) (*CourseModule, error)
	UpdateModule(id string, req UpsertModuleRequest) (*CourseModule, error)
	DeleteModule(id string) error
	ListModuleLessons(moduleID string) ([]Lesson, error)
	CreateLesson(req UpsertLessonRequest) (*Lesson, error)
	UpdateLesson(id string, req UpsertLessonRequest) (*Lesson, error)
	DeleteLesson(id string) error
}

type ActivityUsecase interface {
	GetActivity(id string) (*Activity, error)
	CreateActivity(req UpsertActivityRequest) (*Activity, error)
	UpdateActivity(id string, req UpsertActivityRequest) (*Activity, error)
	DeleteActivity(id string) error
	SubmitActivity(id string, userID uuid.UUID, req SubmitActivityRequest) (*Submission, error)
	ListActivitySubmissions(id string) ([]Submission, error)
	GetSubmission(id string) (*Submission, error)
}

type WritingExtrasUsecase interface {
	GetWritingByID(userID uuid.UUID, id string) (map[string]any, error)
	EvaluateWriting(req WritingEvaluationRequest) (map[string]any, error)
}

type SpeakingExtrasUsecase interface {
	StartSession(userID uuid.UUID) (*SpeakingSession, error)
	StopSession(userID uuid.UUID) (*SpeakingSession, error)
	GetSession(userID uuid.UUID, id string) (*SpeakingSession, error)
	CheckPronunciation(req PronunciationRequest) (*PronunciationResult, error)
}

type VocabularyExtrasUsecase interface {
	UpdateWord(id string, req UpdateWordRequest) (map[string]any, error)
	DeleteWord(id string) error
	ListVocabularyHistory(userID uuid.UUID) ([]VocabularyHistoryItem, error)
}

type ListeningUsecase interface {
	ListLessons() ([]ListeningLesson, error)
	GetLesson(id string) (*ListeningLesson, error)
	SubmitLesson(id string, req ListeningSubmissionRequest) (map[string]any, error)
}

type AIUsecase interface {
	Chat(req AIChatRequest) (map[string]any, error)
	EvaluateWriting(req WritingEvaluationRequest) (map[string]any, error)
	EvaluateSpeaking(req AIChatRequest) (map[string]any, error)
	GenerateQuestion(req AIQuestionRequest) (map[string]any, error)
}

type ProgressUsecase interface {
	GetOverall(userID uuid.UUID) (*ProgressSnapshot, error)
	GetCourseProgress(userID uuid.UUID, courseID string) (map[string]any, error)
	GetActivityProgress(userID uuid.UUID, activityID string) (map[string]any, error)
}

type PlannerUsecase interface {
	GetPlanner(userID uuid.UUID) (*Planner, error)
	GeneratePlanner(userID uuid.UUID) (*Planner, error)
	UpdatePlanner(userID uuid.UUID, req PlannerUpdateRequest) (*Planner, error)
}

type NotificationUsecase interface {
	ListNotifications(userID uuid.UUID) ([]NotificationItem, error)
	MarkAsRead(userID uuid.UUID, id string) error
}

type AdminUsecase interface {
	ListUsers() ([]AdminUser, error)
	UpdateUserStatus(id string, req UpdateUserStatusRequest) (*AdminUser, error)
	ListCourses() ([]Course, error)
	CreateCourse(req UpsertCourseRequest) (*Course, error)
	UpdateCourse(id string, req UpsertCourseRequest) (*Course, error)
	DeleteCourse(id string) error
	GetAnalytics() (*AnalyticsSnapshot, error)
	GetAIUsage() (*AIUsageSnapshot, error)
}

type BillingUsecase interface {
	ListPlans() ([]BillingPlan, error)
	Subscribe(userID uuid.UUID, req SubscribeRequest) (map[string]any, error)
	ListBillingHistory(userID uuid.UUID) ([]BillingHistoryItem, error)
}
