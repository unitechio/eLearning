package db

import (
	"log"

	"github.com/owner/eenglish/api/internal/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Initialize(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return db, nil
}

func AutoMigrate(db *gorm.DB) {
	log.Println("Migrating database...")
	
	// Create uuid-ossp extension
	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
	
	err := db.AutoMigrate(
		&model.Tenant{},
		&model.User{},
		&model.UserProfile{},
		&model.Role{},
		&model.RefreshToken{},
		&model.Course{},
		&model.Unit{},
		&model.Lesson{},
		&model.UserProgress{},
		&model.VocabularyWord{},
		&model.UserVocabularyProgress{},
		&model.SpeakingAttempt{},
		&model.WritingSubmission{},
		&model.Streak{},
		&model.XPPoint{},
	)
	
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	
	log.Println("Migration completed successfully!")
}
