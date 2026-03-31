package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/owner/eenglish/api/internal/config"
	"github.com/owner/eenglish/api/internal/db"
	"github.com/owner/eenglish/api/internal/middleware"
	"github.com/owner/eenglish/api/internal/module/auth"
	"github.com/owner/eenglish/api/internal/module/speaking"
	"github.com/owner/eenglish/api/internal/module/user"
	"github.com/owner/eenglish/api/internal/pkg/ai"
)

func main() {
	_ = godotenv.Load()
	cfg := config.LoadConfig()

	// Initialize DB
	database, err := db.Initialize(cfg.DBString)
	if err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}
	
	// auto migrate for demo
	db.AutoMigrate(database)

	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Configurable in prod
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.Use(middleware.ErrorHandler())
	r.Use(middleware.Logger())

	// Init Repos
	userRepo := user.NewRepository(database)
	
	// Init Services
	userService := user.NewService(userRepo)
	authService := auth.NewService(userRepo, cfg.JWTSecret)

	sttService := ai.NewSTTService()
	llmService := ai.NewLLMService()
	speakingService := speaking.NewService(sttService, llmService)

	// Init Handlers
	userHandler := user.NewHandler(userService)
	authHandler := auth.NewHandler(authService)
	speakingHandler := speaking.NewHandler(speakingService)

	apiGroup := r.Group("/api/v1")
	{
		// Public
		authRoutes := apiGroup.Group("/auth")
		{
			authRoutes.POST("/register", authHandler.Register)
			authRoutes.POST("/login", authHandler.Login)
		}

		// Protected
		protected := apiGroup.Group("/")
		protected.Use(middleware.JWTAuth(cfg.JWTSecret))
		{
			userRoutes := protected.Group("/users")
			{
				userRoutes.GET("/me", userHandler.GetMe)
				// other protected routes
			}

			speakingRoutes := protected.Group("/speaking")
			{
				speakingRoutes.POST("/analyze", speakingHandler.Analyze)
			}
		}
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	log.Printf("Starting server on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
