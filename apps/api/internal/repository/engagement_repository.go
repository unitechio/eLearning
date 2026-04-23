package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type LeaderboardMetricRow struct {
	UserID      uuid.UUID
	Email       string
	FirstName   string
	LastName    string
	XP          int
	TimeSpent   int
	CurrentRank int
}

type EngagementRepository interface {
	ListLeaderboardSince(since time.Time, limit int) ([]LeaderboardMetricRow, error)
	GetLeaderboardEntrySince(userID uuid.UUID, since time.Time) (*LeaderboardMetricRow, error)
	ListXPByUser(userID uuid.UUID, filter Pagination) ([]domain.XPPoint, int64, error)
	AddXP(point *domain.XPPoint) error
	FindStreakByUser(userID uuid.UUID) (*domain.Streak, error)
	SaveStreak(streak *domain.Streak) error
}
