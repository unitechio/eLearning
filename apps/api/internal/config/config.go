package config

import (
	"io"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Server    ServerConfig   `validate:"required"`
	Database  DatabaseConfig `validate:"required"`
	Auth      AuthConfig     `validate:"required"`
	JWT       JWTConfig
	CORS      CORSConfig
	Email     EmailConfig
	Storage   StorageConfig
	Cache     RedisConfig
	Minio     MinioConfig
	RateLimit RateLimitConfig
	ELK       ELKConfig
	Log       LoggingConfig
}

type ServerConfig struct {
	Host            string        `example:"0.0.0.0"`
	Port            string        `validate:"required" example:":8080"`
	Mode            string        `validate:"oneof=debug release test" example:"release"`
	ReadTimeout     time.Duration `example:"30s"`
	WriteTimeout    time.Duration `example:"30s"`
	IdleTimeout     time.Duration
	TLS             bool
	CertFile        string
	KeyFile         string
	GRPCPort        string        `example:":50051"` // gRPC agent server port
	ShutdownTimeout time.Duration `example:"10s"`
}

type DatabaseConfig struct {
	Host            string `validate:"required" example:"localhost"`
	Port            int    `validate:"required" example:"5432"`
	User            string `validate:"required" example:"einfra"`
	Password        string `validate:"required" example:"password"`
	Database        string `validate:"required" example:"einfra_crm"`
	SSLMode         string `example:"disable"`
	Debug           bool   `example:"false"`
	MaxOpenConns    int    `example:"25"`
	MaxIdleConns    int    `example:"5"`
	ConnMaxLifetime int    `example:"300"` // seconds
	AutoMigrate     bool   `example:"true"`
	LogLevel        string
	LogColorful     bool
	LogDestination  io.Writer
}

type EmailConfig struct {
	Host       string
	Port       int
	UserName   string
	Password   string
	FromName   string
	FromEmail  string
	UseSSL     bool
	UseMSGraph bool
}

type JWTConfig struct {
	Secret               string
	AccessExpiry         time.Duration
	ExpirationHours      int
	RefreshExpiration    time.Duration
	Issuer               string
	MaxSessionsPerUser   int
	TokenCleanupInterval time.Duration
}

// StorageConfig holds the file storage configuration
type StorageConfig struct {
	ImagePath  string   `example:"./uploads/images"`
	MaxSizeMB  int      `example:"10"`
	AllowedExt []string `example:"jpg,png,gif"`
}

type RedisConfig struct {
	Host         string `example:"localhost"`
	Port         int    `example:"6379"`
	Password     string
	DB           int `example:"0"`
	PoolSize     int `example:"10"`
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

type CORSConfig struct {
	AllowedOrigins   []string
	AllowedMethods   []string
	AllowedHeaders   []string
	ExposedHeaders   []string
	AllowCredentials bool
	MaxAge           time.Duration
}

// RateLimitConfig holds rate limiting configuration
type RateLimitConfig struct {
	Enabled        bool `example:"true"`
	RequestsPerMin int  `example:"100"`
	Burst          int  `example:"20"`
}

// MinioConfig holds MinIO configuration
type MinioConfig struct {
	Endpoint        string `example:"localhost:9000"`
	AccessKeyID     string `example:"minioadmin"`
	SecretAccessKey string
	UseSSL          bool   `example:"false"`
	BucketName      string `example:"einfra-crm"`
}

// EncryptionConfig holds encryption configuration for sensitive data
type EncryptionConfig struct {
	Key     string `validate:"required"`
	Version int    `example:"1"`
}

// AuthConfig holds the authentication configuration
type AuthConfig struct {
	JWTSecret              string `validate:"required"`
	JWTExpiration          int    `example:"3600"`   // seconds
	RefreshTokenExpiry     int    `example:"604800"` // 7 days in seconds
	PasswordMinLength      int    `example:"8"`
	PasswordRequireSpecial bool   `example:"true"`
	Google                 GoogleOAuthConfig
	Azure                  AzureOAuthConfig
}

type AzureOAuthConfig struct {
	ClientID     string   `example:"azure-client-id"`
	ClientSecret string   `example:"azure-client-secret"`
	RedirectURL  string   `example:"http://localhost:8080/auth/azure/callback"`
	Scopes       []string `example:"User.Read"`
	Tenant       string   `example:"azure-tenant-id"`
}

type GoogleOAuthConfig struct {
	ClientID     string   `example:"google-client-id"`
	ClientSecret string   `example:"google-client-secret"`
	RedirectURL  string   `example:"http://localhost:8080/auth/google/callback"`
	Scopes       []string `example:"email,profile"`
}

// LoggingConfig holds logging configuration
type LoggingConfig struct {
	Level      string `validate:"oneof=debug info warn error fatal" example:"info"`
	Format     string `validate:"oneof=json text" example:"json"`
	Output     string `example:"stdout"`
	FilePath   string `example:"./logs/app.log"`
	MaxSizeMB  int    `example:"100"`
	MaxBackups int    `example:"3"`
	MaxAgeDays int    `example:"28"`
	Compress   bool   `example:"true"`
}

type ELKConfig struct {
	ElasticAPMEndpoint string
}

func LoadConfig(configPath string) (*Config, error) {
	if err := godotenv.Load(configPath); err != nil {
		if !os.IsNotExist(err) {
			return nil, err
		}
	}

	config := &Config{
		Server: ServerConfig{
			Host:         getEnv("SERVER_HOST", "0.0.0.0"),
			Port:         getEnv("SERVER_PORT", "8080"),
			ReadTimeout:  getEnvAsDuration("SERVER_READ_TIMEOUT", 15*time.Second),
			WriteTimeout: getEnvAsDuration("SERVER_WRITE_TIMEOUT", 15*time.Second),
			IdleTimeout:  getEnvAsDuration("SERVER_IDLE_TIMEOUT", 60*time.Second),
			TLS:          getEnvAsBool("SERVER_TLS", false),
			CertFile:     getEnv("SERVER_CERT_FILE", ""),
			KeyFile:      getEnv("SERVER_KEY_FILE", ""),
		},

		Database: DatabaseConfig{
			Host:            getEnv("DB_HOST", "localhost"),
			Port:            getEnvAsInt("DB_PORT", 1521),
			User:            getEnv("DB_USER", ""),
			Password:        getEnv("DB_PASSWORD", ""),
			Database:        getEnvAny([]string{"DB_DATABASE", "DB_NAME"}, ""),
			SSLMode:         getEnvAny([]string{"DB_SSL_MODE", "DB_SSLMODE"}, "disable"),
			MaxIdleConns:    getEnvAsInt("DB_MAX_IDLE_CONNS", 10),
			MaxOpenConns:    getEnvAsInt("DB_MAX_OPEN_CONNS", 100),
			ConnMaxLifetime: getEnvAsInt("DB_CONN_MAX_LIFETIME", 300),
			LogLevel:        getEnv("DB_LOG_LEVEL", "info"),
			LogColorful:     getEnvAsBool("DB_LOG_COLORFUL", true),
			LogDestination:  os.Stdout,
		},

		JWT: JWTConfig{
			Secret:               getEnv("JWT_SECRET", "your-jwt-secret-key"),
			AccessExpiry:         getEnvAsDuration("JWT_ACCESS_TOKEN_EXPIRE", 15*time.Minute),
			ExpirationHours:      getEnvAsInt("JWT_EXPIRATION_HOURS", 1),
			RefreshExpiration:    getEnvAsDuration("JWT_REFRESH_EXPIRATION", 168*time.Hour),
			Issuer:               getEnv("JWT_ISSUER", "EOFFICE_CRM_BE"),
			MaxSessionsPerUser:   getEnvAsInt("JWT_MAX_SESSIONS_PER_USER", 5),
			TokenCleanupInterval: getEnvAsDuration("JWT_TOKEN_CLEANUP_INTERVAL", 1*time.Hour),
		},

		Storage: StorageConfig{
			ImagePath:  getEnv("STORAGE_IMAGE_PATH", "./uploads/images"),
			MaxSizeMB:  getEnvAsInt("STORAGE_MAX_SIZE_MB", 10),
			AllowedExt: getSliceEnv("STORAGE_ALLOWED_EXT", []string{"jpg", "jpeg", "png", "gif", "webp"}),
		},

		Cache: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnvAsInt("REDIS_PORT", 6379),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvAsInt("REDIS_DB", 0),
			PoolSize: getEnvAsInt("REDIS_POOL_SIZE", 10),
		},

		Minio: MinioConfig{
			Endpoint:        getEnv("MINIO_ENDPOINT", "localhost:9000"),
			AccessKeyID:     getEnvAny([]string{"MINIO_ACCESS_KEY_ID", "MINIO_ACCESS_KEY"}, "minioadmin"),
			SecretAccessKey: getEnvAny([]string{"MINIO_SECRET_ACCESS_KEY", "MINIO_SECRET_KEY"}, "minioadmin"),
			UseSSL:          getEnvAsBool("MINIO_USE_SSL", false),
			BucketName:      getEnvAny([]string{"MINIO_BUCKET_NAME", "MINIO_BUCKET"}, "einfra-crm"),
		},

		Email: EmailConfig{
			Host:       getEnv("SMTP_HOST", ""),
			Port:       getEnvAsInt("SMTP_PORT", 587),
			UserName:   getEnv("SMTP_USERNAME", ""),
			Password:   getEnv("SMTP_PASSWORD", ""),
			FromName:   getEnv("SMTP_FROM_NAME", ""),
			FromEmail:  getEnv("SMTP_FROM_EMAIL", ""),
			UseSSL:     getEnvAsBool("SMTP_USE_SSL", false),
			UseMSGraph: getEnvAsBool("SMTP_USE_MSGRAPH", false),
		},

		RateLimit: RateLimitConfig{
			Enabled:        getEnvAsBool("RATE_LIMIT_ENABLED", true),
			RequestsPerMin: getEnvAsIntAny([]string{"RATE_LIMIT_REQUESTS_PER_MIN", "RATE_LIMIT_REQUESTS"}, 100),
			Burst:          getEnvAsInt("RATE_LIMIT_BURST", 20),
		},
		CORS: CORSConfig{
			AllowedOrigins:   getSliceEnv("CORS_ALLOWED_ORIGINS", []string{"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}),
			AllowedMethods:   getSliceEnv("CORS_ALLOWED_METHODS", []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}),
			AllowedHeaders:   getSliceEnv("CORS_ALLOWED_HEADERS", []string{"Origin", "Content-Type", "Authorization", "X-Request-ID"}),
			ExposedHeaders:   getSliceEnv("CORS_EXPOSED_HEADERS", []string{"X-Request-ID"}),
			AllowCredentials: getEnvAsBool("CORS_ALLOW_CREDENTIALS", true),
			MaxAge:           getEnvAsDuration("CORS_MAX_AGE", 12*time.Hour),
		},
		ELK: ELKConfig{
			ElasticAPMEndpoint: getEnv("ELK_ELASTIC_APM_ENDPOINT", ""),
		},
		Log: LoggingConfig{
			Level:  getEnv("LOG_LEVEL", "info"),
			Format: getEnv("LOG_FORMAT", "json"),
			Output: getEnv("LOG_OUTPUT", "stdout"),
		},
	}

	return config, nil
}
