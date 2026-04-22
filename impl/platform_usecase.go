package impl

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
)

type PlatformUsecase struct{}

func NewPlatformUsecase() *PlatformUsecase { return &PlatformUsecase{} }

func (u *PlatformUsecase) now() string { return time.Now().UTC().Format(time.RFC3339) }
func (u *PlatformUsecase) id(prefix string) string {
	return fmt.Sprintf("%s_%s", prefix, uuid.NewString())
}

func (u *PlatformUsecase) Refresh(req usecase.TokenRefreshRequest) (map[string]string, error) {
	return map[string]string{"access_token": "refreshed-token", "refresh_token": req.RefreshToken}, nil
}
func (u *PlatformUsecase) Logout(userID uuid.UUID) error                          { return nil }
func (u *PlatformUsecase) VerifyEmail(req usecase.VerifyEmailRequest) error       { return nil }
func (u *PlatformUsecase) ForgotPassword(req usecase.ForgotPasswordRequest) error { return nil }
func (u *PlatformUsecase) ResetPassword(req usecase.ResetPasswordRequest) error   { return nil }

func (u *PlatformUsecase) GetProgress(userID uuid.UUID) ([]usecase.UserProgress, error) {
	return []usecase.UserProgress{{CourseID: "english-b2", CourseTitle: "English B2", CompletionRate: 67.5, CompletedLessons: 27, TotalLessons: 40, LastActivityAtUTC: u.now()}}, nil
}
func (u *PlatformUsecase) GetStats(userID uuid.UUID) (*usecase.UserStats, error) {
	return &usecase.UserStats{TotalStudyMinutes: 1240, CurrentStreak: 12, CompletedCourses: 3, AverageScore: 82.4}, nil
}
func (u *PlatformUsecase) GetActivities(userID uuid.UUID) ([]usecase.UserActivityItem, error) {
	return []usecase.UserActivityItem{{ID: u.id("activity"), Type: "writing", Title: "Task 2 Essay", Description: "Submitted writing essay", OccurredAt: u.now()}}, nil
}

func (u *PlatformUsecase) ListCourses() ([]usecase.Course, error) {
	return []usecase.Course{{ID: "course-english-1", Title: "English Foundations", Description: "Build communication and exam readiness.", Domain: "english", Level: "intermediate", Status: "published"}}, nil
}
func (u *PlatformUsecase) CreateCourse(req usecase.UpsertCourseRequest) (*usecase.Course, error) {
	return &usecase.Course{ID: u.id("course"), Title: req.Title, Description: req.Description, Domain: req.Domain, Level: req.Level, Status: req.Status}, nil
}
func (u *PlatformUsecase) GetCourse(id string) (*usecase.Course, error) {
	return &usecase.Course{ID: id, Title: "English Foundations", Description: "Build communication and exam readiness.", Domain: "english", Level: "intermediate", Status: "published"}, nil
}
func (u *PlatformUsecase) UpdateCourse(id string, req usecase.UpsertCourseRequest) (*usecase.Course, error) {
	return &usecase.Course{ID: id, Title: req.Title, Description: req.Description, Domain: req.Domain, Level: req.Level, Status: req.Status}, nil
}
func (u *PlatformUsecase) DeleteCourse(id string) error { return nil }
func (u *PlatformUsecase) ListCourseModules(courseID string) ([]usecase.CourseModule, error) {
	return []usecase.CourseModule{{ID: u.id("module"), CourseID: courseID, Title: "Grammar Core", Order: 1}}, nil
}
func (u *PlatformUsecase) CreateModule(req usecase.UpsertModuleRequest) (*usecase.CourseModule, error) {
	return &usecase.CourseModule{ID: u.id("module"), CourseID: req.CourseID, Title: req.Title, Order: req.Order}, nil
}
func (u *PlatformUsecase) UpdateModule(id string, req usecase.UpsertModuleRequest) (*usecase.CourseModule, error) {
	return &usecase.CourseModule{ID: id, CourseID: req.CourseID, Title: req.Title, Order: req.Order}, nil
}
func (u *PlatformUsecase) DeleteModule(id string) error { return nil }
func (u *PlatformUsecase) ListModuleLessons(moduleID string) ([]usecase.Lesson, error) {
	return []usecase.Lesson{{ID: u.id("lesson"), ModuleID: moduleID, Title: "Lesson 1", Content: "Intro content", Order: 1}}, nil
}
func (u *PlatformUsecase) CreateLesson(req usecase.UpsertLessonRequest) (*usecase.Lesson, error) {
	return &usecase.Lesson{ID: u.id("lesson"), ModuleID: req.ModuleID, Title: req.Title, Content: req.Content, Order: req.Order}, nil
}
func (u *PlatformUsecase) UpdateLesson(id string, req usecase.UpsertLessonRequest) (*usecase.Lesson, error) {
	return &usecase.Lesson{ID: id, ModuleID: req.ModuleID, Title: req.Title, Content: req.Content, Order: req.Order}, nil
}
func (u *PlatformUsecase) DeleteLesson(id string) error { return nil }

func (u *PlatformUsecase) GetActivity(id string) (*usecase.Activity, error) {
	return &usecase.Activity{ID: id, Title: "Essay Drill", Type: "writing", Domain: "english", Instructions: "Write 250 words", Status: "active"}, nil
}
func (u *PlatformUsecase) CreateActivity(req usecase.UpsertActivityRequest) (*usecase.Activity, error) {
	return &usecase.Activity{ID: u.id("activity"), Title: req.Title, Type: req.Type, Domain: req.Domain, Instructions: req.Instructions, Status: req.Status}, nil
}
func (u *PlatformUsecase) UpdateActivity(id string, req usecase.UpsertActivityRequest) (*usecase.Activity, error) {
	return &usecase.Activity{ID: id, Title: req.Title, Type: req.Type, Domain: req.Domain, Instructions: req.Instructions, Status: req.Status}, nil
}
func (u *PlatformUsecase) DeleteActivity(id string) error { return nil }
func (u *PlatformUsecase) SubmitActivity(id string, userID uuid.UUID, req usecase.SubmitActivityRequest) (*usecase.Submission, error) {
	return &usecase.Submission{ID: u.id("submission"), ActivityID: id, UserID: userID.String(), Answer: req.Answer, Score: 85, Feedback: "Strong response.", Status: "graded"}, nil
}
func (u *PlatformUsecase) ListActivitySubmissions(id string) ([]usecase.Submission, error) {
	return []usecase.Submission{{ID: u.id("submission"), ActivityID: id, UserID: uuid.NewString(), Answer: "Sample answer", Score: 80, Feedback: "Solid attempt", Status: "graded"}}, nil
}
func (u *PlatformUsecase) GetSubmission(id string) (*usecase.Submission, error) {
	return &usecase.Submission{ID: id, ActivityID: "activity-1", UserID: uuid.NewString(), Answer: "Sample answer", Score: 80, Feedback: "Solid attempt", Status: "graded"}, nil
}

func (u *PlatformUsecase) GetWritingByID(userID uuid.UUID, id string) (map[string]any, error) {
	return map[string]any{"id": id, "user_id": userID.String(), "status": "graded"}, nil
}
func (u *PlatformUsecase) EvaluateWriting(req usecase.WritingEvaluationRequest) (map[string]any, error) {
	return map[string]any{"score": 7.5, "feedback": "Clear structure and good argument flow."}, nil
}

func (u *PlatformUsecase) StartSession(userID uuid.UUID) (*usecase.SpeakingSession, error) {
	return &usecase.SpeakingSession{ID: u.id("speaking_session"), Status: "started", StartedAt: u.now()}, nil
}
func (u *PlatformUsecase) StopSession(userID uuid.UUID) (*usecase.SpeakingSession, error) {
	return &usecase.SpeakingSession{ID: u.id("speaking_session"), Status: "stopped", StartedAt: u.now(), StoppedAt: u.now()}, nil
}
func (u *PlatformUsecase) GetSession(userID uuid.UUID, id string) (*usecase.SpeakingSession, error) {
	return &usecase.SpeakingSession{ID: id, Status: "started", StartedAt: u.now()}, nil
}
func (u *PlatformUsecase) CheckPronunciation(req usecase.PronunciationRequest) (*usecase.PronunciationResult, error) {
	return &usecase.PronunciationResult{Accuracy: 91.2, Feedback: "Pronunciation is clear with minor stress issues."}, nil
}

func (u *PlatformUsecase) UpdateWord(id string, req usecase.UpdateWordRequest) (map[string]any, error) {
	return map[string]any{"id": id, "word": req.Word, "definition": req.Definition}, nil
}
func (u *PlatformUsecase) DeleteWord(id string) error { return nil }
func (u *PlatformUsecase) ListVocabularyHistory(userID uuid.UUID) ([]usecase.VocabularyHistoryItem, error) {
	return []usecase.VocabularyHistoryItem{{ID: u.id("review"), WordID: "word-1", Result: "correct", ReviewedAt: u.now()}}, nil
}

func (u *PlatformUsecase) ListLessons() ([]usecase.ListeningLesson, error) {
	return []usecase.ListeningLesson{{ID: "listening-1", Title: "Daily Conversation", Description: "Practice everyday listening.", AudioURL: "https://example.com/audio.mp3"}}, nil
}
func (u *PlatformUsecase) GetLesson(id string) (*usecase.ListeningLesson, error) {
	return &usecase.ListeningLesson{ID: id, Title: "Daily Conversation", Description: "Practice everyday listening.", AudioURL: "https://example.com/audio.mp3"}, nil
}
func (u *PlatformUsecase) SubmitLesson(id string, req usecase.ListeningSubmissionRequest) (map[string]any, error) {
	return map[string]any{"lesson_id": id, "score": 88, "answers": req.Answers}, nil
}

func (u *PlatformUsecase) Chat(req usecase.AIChatRequest) (map[string]any, error) {
	return map[string]any{"reply": "AI coach response", "domain": req.Domain}, nil
}
func (u *PlatformUsecase) EvaluateSpeaking(req usecase.AIChatRequest) (map[string]any, error) {
	return map[string]any{"score": 7.0, "feedback": "Fluency is good, grammar needs polish."}, nil
}
func (u *PlatformUsecase) GenerateQuestion(req usecase.AIQuestionRequest) (map[string]any, error) {
	return map[string]any{"question": fmt.Sprintf("Explain %s in %s", req.Topic, req.Domain)}, nil
}

func (u *PlatformUsecase) GetOverall(userID uuid.UUID) (*usecase.ProgressSnapshot, error) {
	return &usecase.ProgressSnapshot{OverallCompletion: 72.5, CurrentStreak: 10, WeeklyMinutes: 320}, nil
}
func (u *PlatformUsecase) GetCourseProgress(userID uuid.UUID, courseID string) (map[string]any, error) {
	return map[string]any{"course_id": courseID, "completion_rate": 72.5}, nil
}
func (u *PlatformUsecase) GetActivityProgress(userID uuid.UUID, activityID string) (map[string]any, error) {
	return map[string]any{"activity_id": activityID, "status": "completed"}, nil
}

func (u *PlatformUsecase) GetPlanner(userID uuid.UUID) (*usecase.Planner, error) {
	return &usecase.Planner{FocusArea: "writing", WeeklyTarget: 5, Tasks: []string{"Essay practice", "Vocabulary review"}}, nil
}
func (u *PlatformUsecase) GeneratePlanner(userID uuid.UUID) (*usecase.Planner, error) {
	return &usecase.Planner{FocusArea: "speaking", WeeklyTarget: 4, Tasks: []string{"Part 2 speaking", "Pronunciation drills"}}, nil
}
func (u *PlatformUsecase) UpdatePlanner(userID uuid.UUID, req usecase.PlannerUpdateRequest) (*usecase.Planner, error) {
	return &usecase.Planner{FocusArea: req.FocusArea, WeeklyTarget: req.WeeklyTarget, Tasks: req.Tasks}, nil
}

func (u *PlatformUsecase) ListNotifications(userID uuid.UUID) ([]usecase.NotificationItem, error) {
	return []usecase.NotificationItem{{ID: u.id("notification"), Title: "Reminder", Message: "Time for practice", IsRead: false, CreatedAt: u.now()}}, nil
}
func (u *PlatformUsecase) MarkAsRead(userID uuid.UUID, id string) error { return nil }

func (u *PlatformUsecase) ListUsers() ([]usecase.AdminUser, error) {
	return []usecase.AdminUser{{ID: uuid.NewString(), Email: "student@academy.local", Status: "active"}}, nil
}
func (u *PlatformUsecase) UpdateUserStatus(id string, req usecase.UpdateUserStatusRequest) (*usecase.AdminUser, error) {
	return &usecase.AdminUser{ID: id, Email: "student@academy.local", Status: req.Status}, nil
}
func (u *PlatformUsecase) GetAnalytics() (*usecase.AnalyticsSnapshot, error) {
	return &usecase.AnalyticsSnapshot{TotalUsers: 120, ActiveUsers: 87, TotalCourses: 14, TotalActivities: 230}, nil
}
func (u *PlatformUsecase) GetAIUsage() (*usecase.AIUsageSnapshot, error) {
	return &usecase.AIUsageSnapshot{TotalRequests: 1540, TokenUsage: 780000}, nil
}

func (u *PlatformUsecase) ListPlans() ([]usecase.BillingPlan, error) {
	return []usecase.BillingPlan{{ID: "basic", Name: "Basic", Price: 9.99, Currency: "USD", Description: "Starter plan"}}, nil
}
func (u *PlatformUsecase) Subscribe(userID uuid.UUID, req usecase.SubscribeRequest) (map[string]any, error) {
	return map[string]any{"plan_id": req.PlanID, "user_id": userID.String(), "status": "subscribed"}, nil
}
func (u *PlatformUsecase) listBillingHistory(userID uuid.UUID) ([]usecase.BillingHistoryItem, error) {
	return []usecase.BillingHistoryItem{{ID: u.id("invoice"), PlanName: "Basic", Amount: 9.99, Status: "paid", CreatedAt: u.now()}}, nil
}

func (u *PlatformUsecase) ListBillingHistory(userID uuid.UUID) ([]usecase.BillingHistoryItem, error) {
	return u.listBillingHistory(userID)
}
