package config

import (
	"os"
)

type Config struct {
	Port         string
	DBString     string
	RedisURL     string
	JWTSecret    string
}

func LoadConfig() Config {
	return Config{
		Port:      getEnv("PORT", "8080"),
		DBString:  getEnv("DB_DSN", "host=localhost user=postgres password=password dbname=eenglish port=5432 sslmode=disable"),
		RedisURL:  getEnv("REDIS_URL", "localhost:6379"),
		JWTSecret: getEnv("JWT_SECRET", "supersecret-dev-key"),
	}
}

func getEnv(key, defaultVal string) string {
	if val, exists := os.LookupEnv(key); exists {
		return val
	}
	return defaultVal
}
