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

	models := []struct {
		name string
		val  interface{}
	}{
		// Batch 1
		{"User", &domain.User{}},
		{"Customer", &domain.Customer{}},
		{"Role", &domain.Role{}},
		{"Permission", &domain.Permission{}},
		{"UserRole", &domain.UserRole{}},
		{"RolePermission", &domain.RolePermission{}},
		{"UserPermission", &domain.UserPermission{}},
		{"OTP", &domain.OTP{}},
		{"RefreshToken", &domain.RefreshToken{}},
		{"Session", &domain.Session{}},
		{"LoginAttempt", &domain.LoginAttempt{}},
		{"Environment", &domain.Environment{}},
		{"FeatureFlag", &domain.FeatureFlag{}},
		{"VocabularyWord", &domain.VocabularyWord{}},
		{"UserVocabularyProgress", &domain.UserVocabularyProgress{}},
		{"WritingSubmission", &domain.WritingSubmission{}},
		{"Course", &domain.Course{}},
		{"Unit", &domain.Unit{}},
		{"Lesson", &domain.Lesson{}},
		{"Voucher", &domain.Voucher{}},
		{"UserProgress", &domain.UserProgress{}},
		{"Activity", &domain.Activity{}},
		{"ActivitySubmission", &domain.ActivitySubmission{}},
		{"SpeakingSession", &domain.SpeakingSession{}},
		{"ListeningLesson", &domain.ListeningLesson{}},
		{"StudyPlanner", &domain.StudyPlanner{}},
		{"BillingPlan", &domain.BillingPlan{}},
		{"BillingSubscription", &domain.BillingSubscription{}},
		{"BillingHistory", &domain.BillingHistory{}},
		{"BillingInvoice", &domain.BillingInvoice{}},
		{"PaymentTransaction", &domain.PaymentTransaction{}},
		{"Streak", &domain.Streak{}},
		{"XPPoint", &domain.XPPoint{}},
		{"PracticeSession", &domain.PracticeSession{}},
		{"PronunciationHistory", &domain.PronunciationHistory{}},
		{"DictionaryHistory", &domain.DictionaryHistory{}},
		{"VocabularySet", &domain.VocabularySet{}},
		{"VocabularySetWord", &domain.VocabularySetWord{}},
		{"IELTSContentItem", &domain.IELTSContentItem{}},
		{"IELTSPassage", &domain.IELTSPassage{}},
		{"IELTSQuestionGroup", &domain.IELTSQuestionGroup{}},
		{"IELTSQuestion", &domain.IELTSQuestion{}},
		{"IELTSVocabularyItem", &domain.IELTSVocabularyItem{}},
		{"IELTSRelatedPost", &domain.IELTSRelatedPost{}},
		{"IELTSPracticeAttempt", &domain.IELTSPracticeAttempt{}},
		{"IELTSLearningProgress", &domain.IELTSLearningProgress{}},
		{"IELTSMockTestSession", &domain.IELTSMockTestSession{}},
		{"LMSStudentDashboard", &domain.LMSStudentDashboard{}},
		{"LMSCourseEnrollment", &domain.LMSCourseEnrollment{}},
		{"SupportTicket", &domain.SupportTicket{}},
		{"SupportTicketComment", &domain.SupportTicketComment{}},
		{"WsAudit", &domain.WsAudit{}},

		// Batch 2 (Authorization)
		{"Module", &domain.Module{}},
		{"Department", &domain.Department{}},
		{"Service", &domain.Service{}},
		{"Scope", &domain.Scope{}},
		{"EnhancedPermission", &domain.EnhancedPermission{}},
		{"RoleEnhancedPermission", &domain.RoleEnhancedPermission{}},
		{"UserEnhancedPermission", &domain.UserEnhancedPermission{}},

		// Batch 3 (Content)
		{"Post", &domain.Post{}},
		{"Media", &domain.Media{}},
		{"PostMedia", &domain.PostMedia{}},
		{"Category", &domain.Category{}},
		{"Tag", &domain.Tag{}},
		{"PostSchedule", &domain.PostSchedule{}},

		// Batch 4 (System)
		{"AuditLog", &domain.AuditLog{}},
		{"SystemSetting", &domain.SystemSetting{}},
		{"Notification", &domain.Notification{}},
		{"ActivityLog", &domain.ActivityLog{}},
		{"EmailTemplate", &domain.EmailTemplate{}},
		{"EmailLog", &domain.EmailLog{}},
		{"UserSettings", &domain.UserSettings{}},
		{"Document", &domain.Document{}},
		{"DocumentPermission", &domain.DocumentPermission{}},
		{"DocumentComment", &domain.DocumentComment{}},
		{"DocumentVersion", &domain.DocumentVersion{}},
	}

	for _, m := range models {
		fmt.Printf("Migrating %s...\n", m.name)
		err := db.AutoMigrate(m.val)
		if err != nil {
			fmt.Printf("FAIL: Migrating %s failed: %v\n", m.name, err)
		} else {
			fmt.Printf("SUCCESS: Migrating %s done\n", m.name)
		}
	}

	fmt.Println("All done successfully!")
}
