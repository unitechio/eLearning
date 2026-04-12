// @title           eEnglish IELTS API
// @version         1.0
// @description     Production-ready REST API for the eEnglish IELTS AI platform.
// @termsOfService  http://swagger.io/terms/

// @contact.name   eEnglish Team
// @contact.email  support@eenglish.io

// @license.name  MIT

// @host      localhost:8080
// @BasePath  /api/v1

// @securityDefinitions.apikey  BearerAuth
// @in                          header
// @name                        Authorization
// @description                 Type "Bearer" followed by a space and JWT token.

package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "github.com/unitechio/eLearning/apps/api/docs"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/middleware"
	"github.com/unitechio/eLearning/apps/api/internal/module/auth"
	"github.com/unitechio/eLearning/apps/api/internal/module/speaking"
	"github.com/unitechio/eLearning/apps/api/internal/module/user"
	"github.com/unitechio/eLearning/apps/api/internal/module/vocabulary"
	"github.com/unitechio/eLearning/apps/api/internal/module/writing"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	pkglogger "github.com/unitechio/eLearning/apps/api/pkg/logger"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

func main() {
	cfg := config.Load()

	logger := pkglogger.New(pkglogger.Config{
		Level: cfg.Log.Level,
		JSON:  cfg.Log.Format == "json",
	})
	slog.SetDefault(logger)

	database, err := db.Open(cfg.DB.DSN)
	if err != nil {
		logger.Error("failed to connect to database", slog.String("error", err.Error()))
		panic(err)
	}
	if err := db.Migrate(database); err != nil {
		logger.Error("failed to migrate database", slog.String("error", err.Error()))
		panic(err)
	}
	logger.Info("database connected and migrated")

	// Repositories
	userRepo := user.NewRepository(database)
	vocabRepo := vocabulary.NewRepository(database)
	writingRepo := writing.NewRepository(database)

	// Services
	userSvc := user.NewService(userRepo)
	authSvc := auth.NewService(userRepo, &cfg.JWT)
	sttSvc := ai.NewSTTService()
	llmSvc := ai.NewLLMService()
	speakingSvc := speaking.NewService(sttSvc, llmSvc)
	vocabSvc := vocabulary.NewService(vocabRepo)
	writingSvc := writing.NewService(writingRepo, llmSvc)

	// Handlers
	userH := user.NewHandler(userSvc)
	authH := auth.NewHandler(authSvc)
	speakingH := speaking.NewHandler(speakingSvc)
	vocabH := vocabulary.NewHandler(vocabSvc)
	writingH := writing.NewHandler(writingSvc)

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	// Global middleware
	r.Use(middleware.RequestID())
	r.Use(middleware.Logger(logger))
	r.Use(middleware.ErrorHandler(logger))
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Request-ID"},
		ExposeHeaders:    []string{"X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.Use(middleware.RateLimit(100))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		response.OK(c, "healthy", gin.H{"time": time.Now().UTC()})
	})

	// Swagger UI
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	v1 := r.Group("/api/v1")
	{
		// Public
		a := v1.Group("/auth")
		{
			a.POST("/register", authH.Register)
			a.POST("/login", authH.Login)
		}

		// Protected
		protected := v1.Group("/", middleware.JWTAuth(cfg.JWT.Secret))
		{
			u := protected.Group("/users")
			{
				u.GET("/me", userH.GetMe)
				u.PUT("/me", userH.UpdateMe)
			}

			s := protected.Group("/speaking")
			{
				s.POST("/analyze", speakingH.Analyze)
			}

			voc := protected.Group("/vocabulary")
			{
				voc.GET("/due", vocabH.GetDueWords)
				voc.POST("/review", vocabH.SubmitReview)
				voc.GET("/words", vocabH.GetAllWords)
			}

			w := protected.Group("/writing")
			{
				w.POST("/submit", writingH.Submit)
				w.GET("/history", writingH.GetHistory)
			}
		}
	}

	addr := fmt.Sprintf(":%s", cfg.Server.Port)
	logger.Info("server starting", slog.String("addr", addr))

	srv := &http.Server{
		Addr:         addr,
		Handler:      r,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		logger.Error("server error", slog.String("error", err.Error()))
		panic(err)
	}
}
