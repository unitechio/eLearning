package route

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/http/handler"
	"github.com/unitechio/eLearning/apps/api/internal/http/middleware"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
	"github.com/unitechio/eLearning/apps/api/pkg/utils/constants"
)

type Handlers struct {
	Auth             *handler.AuthHandler
	AuthWorkflow     *handler.AuthWorkflowHandler
	User             *handler.UserHandler
	UserInsights     *handler.UserInsightsHandler
	Speaking         *handler.SpeakingHandler
	SpeakingExtras   *handler.SpeakingExtrasHandler
	Vocabulary       *handler.VocabularyHandler
	VocabularyExtras *handler.VocabularyExtrasHandler
	Writing          *handler.WritingHandler
	WritingExtras    *handler.WritingExtrasHandler
	Course           *handler.CourseHandler
	Activity         *handler.ActivityHandler
	Listening        *handler.ListeningHandler
	AI               *handler.AIHandler
	Progress         *handler.ProgressHandler
	Planner          *handler.PlannerHandler
	Notification     *handler.NotificationHandler
	Engagement       *handler.EngagementHandler
	Practice         *handler.PracticeHandler
	Admin            *handler.AdminHandler
	Billing          *handler.BillingHandler
	Realtime         *handler.RealtimeHandler
}

type Guards struct {
	Admin      gin.HandlerFunc
	Instructor gin.HandlerFunc
	Premium    gin.HandlerFunc
}

func SetupRoutes(r *gin.Engine, cfg *config.Config, h Handlers, guards Guards) {
	r.GET("/health", func(c *gin.Context) {
		response.OK(c, "healthy", gin.H{"service": "api"})
	})

	ws := r.Group("/ws")
	{
		ws.GET("/speaking", h.Realtime.SpeakingWS)
		ws.GET("/ai-chat", h.Realtime.AIChatWS)
	}

	v1 := r.Group(constants.RequestMappingV1)
	{
		authRoutes := v1.Group("/auth")
		{
			authRoutes.POST("/register", h.Auth.Register)
			authRoutes.POST("/login", h.Auth.Login)
			authRoutes.POST("/refresh", h.AuthWorkflow.Refresh)
			authRoutes.POST("/verify-email", h.AuthWorkflow.VerifyEmail)
			authRoutes.POST("/forgot-password", h.AuthWorkflow.ForgotPassword)
			authRoutes.POST("/reset-password", h.AuthWorkflow.ResetPassword)
		}

		protected := v1.Group("/", middleware.JWTAuth(cfg.JWT.Secret))
		{
			protected.POST("/auth/logout", h.AuthWorkflow.Logout)

			users := protected.Group("/users")
			{
				users.GET("/me", h.User.GetMe)
				users.PUT("/me", h.User.UpdateMe)
				users.GET("/progress", h.UserInsights.GetProgress)
				users.GET("/stats", h.UserInsights.GetStats)
				users.GET("/activities", h.UserInsights.GetActivities)
			}

			courses := protected.Group("/courses")
			{
				courses.GET("", h.Course.ListCourses)
				courses.POST("", guards.Instructor, h.Course.CreateCourse)
				courses.GET("/:id", h.Course.GetCourse)
				courses.PUT("/:id", guards.Instructor, h.Course.UpdateCourse)
				courses.DELETE("/:id", guards.Instructor, h.Course.DeleteCourse)
				courses.GET("/:id/modules", h.Course.ListCourseModules)
			}

			modules := protected.Group("/modules")
			{
				modules.POST("", guards.Instructor, h.Course.CreateModule)
				modules.PUT("/:id", guards.Instructor, h.Course.UpdateModule)
				modules.DELETE("/:id", guards.Instructor, h.Course.DeleteModule)
				modules.GET("/:id/lessons", h.Course.ListModuleLessons)
			}

			lessons := protected.Group("/lessons")
			{
				lessons.POST("", guards.Instructor, h.Course.CreateLesson)
				lessons.PUT("/:id", guards.Instructor, h.Course.UpdateLesson)
				lessons.DELETE("/:id", guards.Instructor, h.Course.DeleteLesson)
			}

			activities := protected.Group("/activities")
			{
				activities.GET("/:id", h.Activity.GetActivity)
				activities.POST("", guards.Instructor, h.Activity.CreateActivity)
				activities.PUT("/:id", guards.Instructor, h.Activity.UpdateActivity)
				activities.DELETE("/:id", guards.Instructor, h.Activity.DeleteActivity)
				activities.POST("/:id/submit", h.Activity.SubmitActivity)
				activities.GET("/:id/submissions", h.Activity.ListSubmissions)
			}
			protected.GET("/submissions/:id", h.Activity.GetSubmission)

			writing := protected.Group("/writing")
			{
				writing.POST("/submit", h.Writing.Submit)
				writing.GET("/history", h.Writing.GetHistory)
				writing.GET("/:id", h.WritingExtras.GetByID)
				writing.POST("/evaluate", h.WritingExtras.Evaluate)
				writing.POST("/submissions", h.Writing.Submit)
				writing.GET("/submissions", h.Writing.GetHistory)
				writing.GET("/submissions/:submissionId", h.Writing.GetSubmission)
			}

			speaking := protected.Group("/speaking")
			{
				speaking.POST("/analyze", h.Speaking.Analyze)
				speaking.POST("/session/start", h.SpeakingExtras.StartSession)
				speaking.POST("/session/stop", h.SpeakingExtras.StopSession)
				speaking.GET("/session/:id", h.SpeakingExtras.GetSession)
				speaking.POST("/pronunciation", h.SpeakingExtras.Pronunciation)
			}

			vocabulary := protected.Group("/vocabulary")
			{
				vocabulary.GET("/due", h.Vocabulary.GetDueWords)
				vocabulary.POST("/review", h.Vocabulary.SubmitReview)
				vocabulary.GET("/words", h.Vocabulary.GetAllWords)
				vocabulary.POST("/words", h.Vocabulary.CreateWord)
				vocabulary.GET("/words/:wordId", h.Vocabulary.GetWord)
				vocabulary.PUT("/words/:id", h.VocabularyExtras.UpdateWord)
				vocabulary.DELETE("/words/:id", h.VocabularyExtras.DeleteWord)
				vocabulary.GET("/review/due", h.Vocabulary.GetDueWords)
				vocabulary.GET("/reviews/due", h.Vocabulary.GetDueWords)
				vocabulary.POST("/reviews", h.Vocabulary.SubmitReview)
				vocabulary.GET("/history", h.VocabularyExtras.History)
			}

			listening := protected.Group("/listening")
			{
				listening.GET("/lessons", h.Listening.ListLessons)
				listening.GET("/:id", h.Listening.GetLesson)
				listening.POST("/:id/submit", h.Listening.Submit)
			}

			aiRoutes := protected.Group("/ai")
			{
				aiRoutes.POST("/chat", h.AI.Chat)
				aiRoutes.POST("/evaluate-writing", h.AI.EvaluateWriting)
				aiRoutes.POST("/evaluate-speaking", h.AI.EvaluateSpeaking)
				aiRoutes.POST("/generate-question", h.AI.GenerateQuestion)
				aiRoutes.POST("/stream-response", guards.Premium, h.Practice.StreamResponse)
				aiRoutes.POST("/pronunciation-feedback", guards.Premium, h.Practice.PronunciationFeedback)
				aiRoutes.POST("/context-correction", guards.Premium, h.Practice.ContextCorrection)
			}

			progress := protected.Group("/progress")
			{
				progress.GET("", h.Progress.Overall)
				progress.GET("/course/:id", h.Progress.Course)
				progress.GET("/activity/:id", h.Progress.Activity)
			}

			planner := protected.Group("/planner")
			{
				planner.GET("", h.Planner.Get)
				planner.POST("/generate", h.Planner.Generate)
				planner.PUT("/update", h.Planner.Update)
			}

			notifications := protected.Group("/notifications")
			{
				notifications.GET("", h.Notification.List)
				notifications.PUT("/:id/read", h.Notification.Read)
			}

			protected.GET("/leaderboard", h.Engagement.Leaderboard)
			protected.GET("/leaderboard/me", h.Engagement.MyLeaderboard)
			protected.GET("/activity/heatmap", h.Engagement.Heatmap)
			protected.GET("/activity/daily", h.Engagement.DailyActivity)
			protected.GET("/activity/xp", h.Engagement.XPHistory)
			protected.GET("/activity/time-spent", h.Engagement.TimeSpent)
			protected.GET("/gamification/profile", h.Engagement.GamificationProfile)
			protected.POST("/gamification/xp", h.Engagement.AddXP)
			protected.POST("/gamification/xp/add", h.Engagement.AddXP)
			protected.GET("/gamification/streak", h.Engagement.Streak)
			protected.GET("/gamification/achievements", h.Engagement.Achievements)
			protected.GET("/recommendations", h.Engagement.Recommendations)
			protected.GET("/recommendations/next", h.Engagement.NextLesson)
			protected.GET("/recommendations/next-lesson", h.Engagement.NextLesson)
			protected.GET("/analytics/learning-pattern", h.Engagement.LearningPattern)
			protected.GET("/analytics/weak-points", h.Engagement.WeakPoints)
			protected.GET("/analytics/improvement", h.Engagement.Improvement)
			protected.GET("/premium/features", h.Engagement.PremiumFeatures)
			protected.POST("/premium/unlock", h.Engagement.PremiumUnlock)

			practice := protected.Group("/practice")
			{
				practice.GET("/modes", h.Practice.PracticeModes)
				practice.POST("/start", h.Practice.PracticeStart)
				practice.POST("/submit", h.Practice.PracticeSubmit)
				practice.POST("/dictation/start", h.Practice.PracticeStart)
				practice.POST("/dictation/submit", h.Practice.PracticeSubmit)
				practice.POST("/shadowing/start", h.Practice.PracticeStart)
				practice.POST("/shadowing/submit", h.Practice.PracticeSubmit)
			}

			pronunciation := protected.Group("/pronunciation")
			{
				pronunciation.POST("/analyze-word", h.Practice.AnalyzeWord)
				pronunciation.POST("/analyze-sentence", h.Practice.AnalyzeSentence)
				pronunciation.GET("/history", h.Practice.PronunciationHistory)
			}

			dictionary := protected.Group("/dictionary")
			{
				dictionary.GET("/lookup", h.Practice.DictionaryLookup)
				dictionary.POST("/save", h.Practice.DictionarySave)
				dictionary.GET("/history", h.Practice.DictionaryHistory)
			}

			reading := protected.Group("/reading")
			{
				reading.POST("/lookup", h.Practice.ReadingLookup)
				reading.POST("/save-word", h.Practice.ReadingSaveWord)
			}

			vocabSets := protected.Group("/vocab")
			{
				vocabSets.GET("/sets", h.Practice.VocabularySets)
				vocabSets.POST("/sets", h.Practice.CreateVocabularySet)
				vocabSets.GET("/sets/:id", h.Practice.GetVocabularySet)
				vocabSets.POST("/sets/:id/add-word", h.Practice.AddWordToSet)
			}

			admin := protected.Group("/admin", guards.Admin)
			{
				admin.GET("/users", h.Admin.ListUsers)
				admin.PUT("/users/:id/status", h.Admin.UpdateUserStatus)
				admin.GET("/courses", h.Admin.ListCourses)
				admin.POST("/courses", h.Admin.CreateCourse)
				admin.PUT("/courses/:id", h.Admin.UpdateCourse)
				admin.DELETE("/courses/:id", h.Admin.DeleteCourse)
				admin.GET("/analytics", h.Admin.Analytics)
				admin.GET("/ai-usage", h.Admin.AIUsage)
			}

			billing := protected.Group("/billing")
			{
				billing.GET("/plans", h.Billing.Plans)
				billing.POST("/subscribe", h.Billing.Subscribe)
				billing.GET("/history", h.Billing.History)
			}
		}
	}
}
