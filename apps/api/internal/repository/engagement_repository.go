package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
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
	ListXPByUser(userID uuid.UUID, filter Pagination) ([]model.XPPoint, int64, error)
	AddXP(point *model.XPPoint) error
	FindStreakByUser(userID uuid.UUID) (*model.Streak, error)
	SaveStreak(streak *model.Streak) error
}
