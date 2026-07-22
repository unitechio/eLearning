package bootstrap

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/http/handler"
	"github.com/unitechio/eLearning/apps/api/internal/http/middleware"
	"github.com/unitechio/eLearning/apps/api/internal/http/route"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/cache"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	storage "github.com/unitechio/eLearning/apps/api/internal/infrastructure/filestorage"
	mailinfra "github.com/unitechio/eLearning/apps/api/internal/infrastructure/mail"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	repoimpl "github.com/unitechio/eLearning/apps/api/internal/repository/impl"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	svcimpl "github.com/unitechio/eLearning/apps/api/internal/usecase/impl"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/tts"
)

type Application struct {
	Logger *slog.Logger
	Server *http.Server
}

func BuildApplication(cfg *config.Config) (*Application, error) {
	logger := newLogger(cfg)

	dbInstance, err := database.InitDatabases(cfg.Database)
	if err != nil {
		return nil, fmt.Errorf("connect database: %w", err)
	}
	if err := database.AutoMigrate(dbInstance); err != nil {
		return nil, fmt.Errorf("migrate database: %w", err)
	}
	if err := database.SeedData(dbInstance); err != nil {
		logger.Warn("seed database failed", slog.String("error", err.Error()))
	}
	if err := cache.Init(&cfg.Cache); err != nil {
		logger.Warn("redis unavailable; continuing without cache", slog.String("error", err.Error()))
	}
	var assetStorage *storage.MinioStorage
	if minioStorage, err := storage.NewMinioStorage(cfg.Minio); err != nil {
		logger.Warn("minio unavailable; ielts asset upload disabled", slog.String("error", err.Error()))
	} else {
		assetStorage = minioStorage
	}

	userRepo := repoimpl.NewUserRepository(dbInstance)
	roleRepo := repoimpl.NewRoleRepository(dbInstance)
	courseRepo := repoimpl.NewCourseRepository(dbInstance)
	activityRepo := repoimpl.NewActivityRepository(dbInstance)
	progressRepo := repoimpl.NewProgressRepository(dbInstance)
	plannerRepo := repoimpl.NewPlannerRepository(dbInstance)
	notificationRepo := repoimpl.NewNotificationRepository(dbInstance)
	billingRepo := repoimpl.NewBillingRepository(dbInstance)
	permissionRepo := repoimpl.NewPermissionRepository(dbInstance)
	vocabularyRepo := repoimpl.NewVocabularyRepository(dbInstance)
	writingRepo := repoimpl.NewWritingRepository(dbInstance)
	speakingRepo := repoimpl.NewSpeakingRepository(dbInstance)
	listeningRepo := repoimpl.NewListeningRepository(dbInstance)
	engagementRepo := repoimpl.NewEngagementRepository(dbInstance)
	practiceRepo := repoimpl.NewPracticeRepository(dbInstance)
	ieltsRepo := repoimpl.NewIELTSRepository(dbInstance)
	lmsRepo := repoimpl.NewLMSRepository(dbInstance)
	postRepo := repoimpl.NewPostRepository(dbInstance)
	supportRepo := repoimpl.NewSupportRepository(dbInstance)
	authRepo := repoimpl.NewAuthRepository(dbInstance)
	sessionRepo := repoimpl.NewSessionRepository(dbInstance)
	loginAttemptRepo := repoimpl.NewLoginAttemptRepository(dbInstance)
	environmentRepo := repository.NewEnvironmentRepository(dbInstance)
	featureFlagRepo := repoimpl.NewFeatureFlagRepository(dbInstance)
	systemSettingRepo := repoimpl.NewSystemSettingRepository(dbInstance)
	licenseRepo := repoimpl.NewLicenseRepository(dbInstance)
	auditRepo := repoimpl.NewAuditRepository(dbInstance)
	emailRepo := repoimpl.NewEmailRepository(dbInstance)
	emailTemplateRepo := repoimpl.NewTemplateRepository(dbInstance)
	userSettingsRepo := repository.NewUserSettingsRepository(dbInstance)

	llmSvc := ai.NewLLMService()
	sttSvc := ai.NewSTTService()
	authorizationSvc := svcimpl.NewAuthorizationService(userRepo, billingRepo)
	permissionSvc := usecase.NewPermissionUsecase(permissionRepo)
	roleSvc := usecase.NewRoleUsecase(roleRepo)
	courseSvc := svcimpl.NewCourseService(courseRepo, authorizationSvc)
	activitySvc := svcimpl.NewActivityService(activityRepo, authorizationSvc)
	userInsightsSvc := svcimpl.NewUserInsightsService(progressRepo, activityRepo)
	progressSvc := svcimpl.NewProgressService(progressRepo)
	plannerSvc := svcimpl.NewPlannerService(plannerRepo)
	notificationSvc := svcimpl.NewNotificationService(notificationRepo)
	adminSvc := svcimpl.NewAdminService(userRepo, courseRepo, progressRepo, activityRepo)
	billingSvc := svcimpl.NewBillingService(billingRepo, userRepo)
	engagementSvc := svcimpl.NewEngagementService(engagementRepo, progressRepo, activityRepo, billingRepo)
	practiceSvc := svcimpl.NewPracticeService(practiceRepo, vocabularyRepo, llmSvc)
	ieltsSvc := svcimpl.NewIELTSServiceWithDependencies(ieltsRepo, cache.GetClient(), assetStorage)
	lmsSvc := svcimpl.NewLMSService(lmsRepo, authorizationSvc)
	postSvc := svcimpl.NewPostService(postRepo)
	supportSvc := svcimpl.NewSupportService(supportRepo)
	writingExtrasSvc := svcimpl.NewWritingExtrasService(writingRepo, llmSvc)
	speakingExtrasSvc := svcimpl.NewSpeakingExtrasService(speakingRepo, llmSvc)
	vocabularyExtrasSvc := svcimpl.NewVocabularyExtrasService(vocabularyRepo)
	listeningSvc := svcimpl.NewListeningService(listeningRepo)
	writingSvc := svcimpl.NewWritingService(writingRepo, llmSvc)
	speakingSvc := svcimpl.NewSpeakingService(sttSvc, llmSvc)
	academyAISvc := svcimpl.NewAIService(llmSvc)
	vocabularySvc := svcimpl.NewVocabularyService(vocabularyRepo)
	userSvc := svcimpl.NewUserService(userRepo)
	emailProvider := mailProvider(cfg)
	emailRenderer := mailinfra.NewRenderer(emailTemplateRepo, mailBaseContext(cfg))
	defaultFrom := cfg.Email.FromEmail
	if defaultFrom == "" {
		defaultFrom = cfg.Mail.Company.Email
	}
	if defaultFrom == "" {
		defaultFrom = "noreply@eenglish.local"
	}
	emailSvc := svcimpl.NewMailUsecase(emailRepo, emailTemplateRepo, emailProvider, emailRenderer, defaultFrom)
	svcimpl.SetMailer(emailSvc)
	authSvc := svcimpl.NewAuthService(userRepo, authRepo, sessionRepo, loginAttemptRepo, &cfg.JWT)
	environmentSvc := svcimpl.NewEnvironmentUsecase(environmentRepo)
	featureFlagSvc := svcimpl.NewFeatureFlagUsecase(featureFlagRepo)
	systemSettingSvc := usecase.NewSystemSettingUsecase(systemSettingRepo)
	licenseSvc := svcimpl.NewLicenseUsecase(licenseRepo)
	auditSvc := svcimpl.NewAuditUsecase(auditRepo)
	userSettingsSvc := svcimpl.NewUserSettingsUsecase(userSettingsRepo)
	ttsSvc := tts.NewPiperTTS()

	handlers := route.Handlers{
		Auth:             handler.NewAuthHandler(authSvc),
		AuthWorkflow:     handler.NewAuthWorkflowHandler(authSvc),
		User:             handler.NewUserHandler(userSvc),
		UserInsights:     handler.NewUserInsightsHandler(userInsightsSvc),
		UserSettings:     handler.NewUserSettingsHandler(userSettingsSvc),
		Speaking:         handler.NewSpeakingHandler(speakingSvc),
		SpeakingExtras:   handler.NewSpeakingExtrasHandler(speakingExtrasSvc),
		Vocabulary:       handler.NewVocabularyHandler(vocabularySvc),
		VocabularyExtras: handler.NewVocabularyExtrasHandler(vocabularyExtrasSvc),
		Writing:          handler.NewWritingHandler(writingSvc),
		WritingExtras:    handler.NewWritingExtrasHandler(writingExtrasSvc),
		Course:           handler.NewCourseHandler(courseSvc),
		Activity:         handler.NewActivityHandler(activitySvc),
		Listening:        handler.NewListeningHandler(listeningSvc),
		AI:               handler.NewAIHandler(academyAISvc),
		Progress:         handler.NewProgressHandler(progressSvc),
		Planner:          handler.NewPlannerHandler(plannerSvc),
		Notification:     handler.NewNotificationHandler(notificationSvc),
		Engagement:       handler.NewEngagementHandler(engagementSvc),
		Practice:         handler.NewPracticeHandler(practiceSvc),
		IELTS:            handler.NewIELTSHandler(ieltsSvc),
		LMS:              handler.NewLMSHandler(lmsSvc),
		Post:             handler.NewPostHandler(postSvc),
		Support:          handler.NewSupportHandler(supportSvc),
		Admin:            handler.NewAdminHandler(adminSvc),
		Billing:          handler.NewBillingHandler(billingSvc),
		Environment:      handler.NewEnvironmentHandler(environmentSvc),
		FeatureFlag:      handler.NewFeatureFlagHandler(featureFlagSvc),
		SystemSetting:    handler.NewSystemSettingHandler(systemSettingSvc),
		License:          handler.NewLicenseHandler(licenseSvc),
		Audit:            handler.NewAuditHandler(auditSvc),
		Email:            handler.NewEmailHandler(emailSvc),
		Authorization:    handler.NewAuthorizationHandler(authorizationSvc, permissionSvc),
		Role:             handler.NewRoleHandler(roleSvc),
		Permission:       handler.NewPermissionHandler(permissionSvc),
		Realtime:         handler.NewRealtimeHandler(),
		Media:            handler.NewMediaHandler(assetStorage),
		TTS:              handler.NewTTSHandler(ttsSvc),
		Document:         handler.NewDocumentHandler(assetStorage),
	}

	router := newRouter(cfg, logger, handlers, route.Guards{
		Admin:      middleware.RequireRoles(authorizationSvc, "admin", "super_admin"),
		Instructor: middleware.RequireRoles(authorizationSvc, "instructor", "admin", "super_admin"),
		Premium:    middleware.RequireFeature(authorizationSvc, "premium"),
	})
	server := &http.Server{
		Addr:         resolveAddress(cfg),
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	return &Application{Logger: logger, Server: server}, nil
}

func newLogger(cfg *config.Config) *slog.Logger {
	var handler slog.Handler
	if cfg.Log.Format == "json" {
		handler = slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
	} else {
		handler = slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
	}
	logger := slog.New(handler)
	slog.SetDefault(logger)
	return logger
}

func newRouter(cfg *config.Config, logger *slog.Logger, handlers route.Handlers, guards route.Guards) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	r.Use(middleware.RequestID())
	r.Use(middleware.Logger(logger))
	r.Use(middleware.ErrorHandler(logger))
	r.Use(gin.Recovery())
	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.CorsMiddleware(cfg.CORS))
	if cfg.RateLimit.Enabled {
		r.Use(middleware.RateLimit(cfg.RateLimit.RequestsPerMin))
	}

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	route.SetupRoutes(r, cfg, handlers, guards)

	return r
}

func resolveAddress(cfg *config.Config) string {
	port := cfg.Server.Port
	if port == "" {
		port = "8080"
	}
	if cfg.Server.Host != "" && cfg.Server.Host != "0.0.0.0" {
		return cfg.Server.Host + ":" + port
	}
	return ":" + port
}

func mailProvider(cfg *config.Config) mailinfra.Provider {
	if cfg.Email.Host == "" {
		return mailinfra.NewNoopProvider()
	}
	return mailinfra.NewSMTPProvider(cfg.Email)
}

func mailBaseContext(cfg *config.Config) mailinfra.BaseContext {
	return mailinfra.BaseContext{
		AppName:        cfg.Mail.Branding.AppName,
		AppURL:         cfg.Mail.Branding.AppURL,
		LogoURL:        cfg.Mail.Branding.LogoURL,
		LogoText:       cfg.Mail.Branding.LogoText,
		CompanyName:    cfg.Mail.Company.Name,
		CompanyAddress: cfg.Mail.Company.Address,
		CompanyPhone:   cfg.Mail.Company.Phone,
		CompanyEmail:   cfg.Mail.Company.Email,
		SupportEmail:   cfg.Mail.Company.Email,
		SupportURL:     cfg.Mail.Support.Support,
		HelpCenterURL:  cfg.Mail.Support.HelpCenter,
		PrivacyURL:     cfg.Mail.Support.Privacy,
		TermsURL:       cfg.Mail.Support.Terms,
		FacebookURL:    cfg.Mail.Social.Facebook,
		YoutubeURL:     cfg.Mail.Social.Youtube,
		LinkedInURL:    cfg.Mail.Social.LinkedIn,
	}
}
