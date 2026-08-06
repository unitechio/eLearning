package main

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Printf("Warning: .env file not found: %v", err)
	}

	host := os.Getenv("DB_HOST")
	portStr := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	sslMode := os.Getenv("DB_SSLMODE")

	if sslMode == "" {
		sslMode = "disable"
	}

	port, err := strconv.Atoi(portStr)
	if err != nil {
		port = 5432
	}

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s", user, pass, host, port, dbName, sslMode)
	fmt.Printf("Connecting to %s@%s:%d/%s...\n", user, host, port, dbName)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("Migrating all structs together...")
	err = db.AutoMigrate(
		&domain.User{},
		&domain.Customer{},
		&domain.Role{},
		&domain.Permission{},
		&domain.UserRole{},
		&domain.RolePermission{},
		&domain.UserPermission{},
		&domain.OTP{},
		&domain.RefreshToken{},
		&domain.Session{},
		&domain.LoginAttempt{},
		&domain.Environment{},
		&domain.FeatureFlag{},
		&domain.VocabularyWord{},
		&domain.UserVocabularyProgress{},
		&domain.WritingSubmission{},
		&domain.Course{},
		&domain.Unit{},
		&domain.Lesson{},
		&domain.Voucher{},
		&domain.UserProgress{},
		&domain.Activity{},
		&domain.ActivitySubmission{},
		&domain.SpeakingSession{},
		&domain.ListeningLesson{},
		&domain.StudyPlanner{},
		&domain.BillingPlan{},
		&domain.BillingSubscription{},
		&domain.BillingHistory{},
		&domain.BillingInvoice{},
		&domain.PaymentTransaction{},
		&domain.Streak{},
		&domain.XPPoint{},
		&domain.PracticeSession{},
		&domain.PronunciationHistory{},
		&domain.DictionaryHistory{},
		&domain.VocabularySet{},
		&domain.VocabularySetWord{},
		&domain.IELTSContentItem{},
		&domain.IELTSPassage{},
		&domain.IELTSQuestionGroup{},
		&domain.IELTSQuestion{},
		&domain.IELTSVocabularyItem{},
		&domain.IELTSRelatedPost{},
		&domain.IELTSPracticeAttempt{},
		&domain.IELTSLearningProgress{},
		&domain.IELTSMockTestSession{},
		&domain.LMSStudentDashboard{},
		&domain.LMSCourseEnrollment{},
		&domain.SupportTicket{},
		&domain.SupportTicketComment{},
		&domain.WsAudit{},
	)
	if err != nil {
		fmt.Printf("FAIL: Migration of all structs failed: %v\n", err)
		return
	}

	fmt.Println("Migration of all structs succeeded!")
}
