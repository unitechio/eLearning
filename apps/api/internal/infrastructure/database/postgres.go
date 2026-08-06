package database

import (
	"fmt"
	"log"
	"net/url"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)



func InitDatabases(cfg config.DatabaseConfig) (*gorm.DB, error) {
	dsn := buildDSN(cfg.Host, cfg.User, cfg.Password, cfg.Port, cfg.Database, cfg.SSLMode)

	var gormLogger logger.Interface
	if cfg.Debug {
		gormLogger = logger.Default.LogMode(logger.Info)
	} else {
		gormLogger = logger.Default.LogMode(logger.Silent)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:                 gormLogger,
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
	})

	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}

	sqlDB.SetMaxIdleConns(cfg.MaxIdleConns)
	sqlDB.SetMaxOpenConns(cfg.MaxOpenConns)
	sqlDB.SetConnMaxLifetime(time.Duration(cfg.ConnMaxLifetime) * time.Second)
	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Printf("Connected to PostgreSQL database: %s", cfg.User)
	return db, nil
}

// Paginate is a GORM scope for pagination
func Paginate(page, pageSize int) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if page <= 0 {
			page = 1
		}
		if pageSize <= 0 {
			pageSize = 10
		}

		offset := (page - 1) * pageSize
		return db.Offset(offset).Limit(pageSize)
	}
}

// buildDSN is kept for reference but main flow uses cfg.DB.DSN directly.
func buildDSN(host, user, pass string, port int, dbName, sslMode string) string {
	encodedPassword := url.QueryEscape(pass)
	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s", user, encodedPassword, host, port, dbName, sslMode)
}
