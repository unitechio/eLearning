package handler

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/unitechio/eLearning/apps/api/internal/service"
)

type AuthWorkflowHandler struct{ svc service.AuthWorkflowService }
type UserInsightsHandler struct{ svc service.UserInsightsService }
type CourseHandler struct{ svc service.CourseService }
type ActivityHandler struct{ svc service.ActivityService }
type WritingExtrasHandler struct{ svc service.WritingExtrasService }
type SpeakingExtrasHandler struct{ svc service.SpeakingExtrasService }
type VocabularyExtrasHandler struct {
	svc service.VocabularyExtrasService
}
type ListeningHandler struct{ svc service.ListeningService }
type AIHandler struct{ svc service.AIService }
type ProgressHandler struct{ svc service.ProgressService }
type PlannerHandler struct{ svc service.PlannerService }
type NotificationHandler struct{ svc service.NotificationService }
type EngagementHandler struct{ svc service.EngagementService }
type PracticeHandler struct{ svc service.PracticeService }
type AdminHandler struct {
	adminSvc  service.AdminService
	courseSvc service.CourseService
}
type BillingHandler struct{ svc service.BillingService }
type RealtimeHandler struct{ upgrader websocket.Upgrader }

func NewAuthWorkflowHandler(svc service.AuthWorkflowService) *AuthWorkflowHandler {
	return &AuthWorkflowHandler{svc: svc}
}

func NewUserInsightsHandler(svc service.UserInsightsService) *UserInsightsHandler {
	return &UserInsightsHandler{svc: svc}
}

func NewCourseHandler(svc service.CourseService) *CourseHandler { return &CourseHandler{svc: svc} }

func NewActivityHandler(svc service.ActivityService) *ActivityHandler {
	return &ActivityHandler{svc: svc}
}

func NewWritingExtrasHandler(svc service.WritingExtrasService) *WritingExtrasHandler {
	return &WritingExtrasHandler{svc: svc}
}

func NewSpeakingExtrasHandler(svc service.SpeakingExtrasService) *SpeakingExtrasHandler {
	return &SpeakingExtrasHandler{svc: svc}
}

func NewVocabularyExtrasHandler(svc service.VocabularyExtrasService) *VocabularyExtrasHandler {
	return &VocabularyExtrasHandler{svc: svc}
}

func NewListeningHandler(svc service.ListeningService) *ListeningHandler {
	return &ListeningHandler{svc: svc}
}

func NewAIHandler(svc service.AIService) *AIHandler { return &AIHandler{svc: svc} }

func NewProgressHandler(svc service.ProgressService) *ProgressHandler {
	return &ProgressHandler{svc: svc}
}

func NewPlannerHandler(svc service.PlannerService) *PlannerHandler { return &PlannerHandler{svc: svc} }

func NewNotificationHandler(svc service.NotificationService) *NotificationHandler {
	return &NotificationHandler{svc: svc}
}

func NewEngagementHandler(svc service.EngagementService) *EngagementHandler {
	return &EngagementHandler{svc: svc}
}

func NewPracticeHandler(svc service.PracticeService) *PracticeHandler {
	return &PracticeHandler{svc: svc}
}

func NewAdminHandler(adminSvc service.AdminService, courseSvc service.CourseService) *AdminHandler {
	return &AdminHandler{adminSvc: adminSvc, courseSvc: courseSvc}
}

func NewBillingHandler(svc service.BillingService) *BillingHandler { return &BillingHandler{svc: svc} }

func NewRealtimeHandler() *RealtimeHandler {
	return &RealtimeHandler{
		upgrader: websocket.Upgrader{
			// Route-level auth is handled upstream; origin is validated by the host app/network edge.
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}
}
