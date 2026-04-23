package handler

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
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

func NewAuthWorkflowHandler(svc service.AuthWorkflowUsecase) *AuthWorkflowHandler {
	return &AuthWorkflowHandler{svc: svc}
}

func NewUserInsightsHandler(svc service.UserInsightsUsecase) *UserInsightsHandler {
	return &UserInsightsHandler{svc: svc}
}

func NewCourseHandler(svc service.CourseUsecase) *CourseHandler { return &CourseHandler{svc: svc} }

func NewActivityHandler(svc service.ActivityUsecase) *ActivityHandler {
	return &ActivityHandler{svc: svc}
}

func NewWritingExtrasHandler(svc service.WritingExtrasUsecase) *WritingExtrasHandler {
	return &WritingExtrasHandler{svc: svc}
}

func NewSpeakingExtrasHandler(svc service.SpeakingExtrasUsecase) *SpeakingExtrasHandler {
	return &SpeakingExtrasHandler{svc: svc}
}

func NewVocabularyExtrasHandler(svc service.VocabularyExtrasUsecase) *VocabularyExtrasHandler {
	return &VocabularyExtrasHandler{svc: svc}
}

func NewListeningHandler(svc service.ListeningUsecase) *ListeningHandler {
	return &ListeningHandler{svc: svc}
}

func NewAIHandler(svc service.AIUsecase) *AIHandler { return &AIHandler{svc: svc} }

func NewProgressHandler(svc service.ProgressUsecase) *ProgressHandler {
	return &ProgressHandler{svc: svc}
}

func NewPlannerHandler(svc service.PlannerUsecase) *PlannerHandler { return &PlannerHandler{svc: svc} }

func NewNotificationHandler(svc service.NotificationUsecase) *NotificationHandler {
	return &NotificationHandler{svc: svc}
}

func NewEngagementHandler(svc service.EngagementUsecase) *EngagementHandler {
	return &EngagementHandler{svc: svc}
}

func NewPracticeHandler(svc service.PracticeUsecase) *PracticeHandler {
	return &PracticeHandler{svc: svc}
}

func NewAdminHandler(adminSvc service.AdminService, courseSvc service.CourseUsecase) *AdminHandler {
	return &AdminHandler{adminSvc: adminSvc, courseSvc: courseSvc}
}

func NewBillingHandler(svc service.BillingUsecase) *BillingHandler { return &BillingHandler{svc: svc} }

func NewRealtimeHandler() *RealtimeHandler {
	return &RealtimeHandler{
		upgrader: websocket.Upgrader{
			// Route-level auth is handled upstream; origin is validated by the host app/network edge.
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}
}
