package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
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
	ListLeaderboardSince(ctx context.Context, since time.Time, limit int) ([]LeaderboardMetricRow, error)
	GetLeaderboardEntrySince(ctx context.Context, userID uuid.UUID, since time.Time) (*LeaderboardMetricRow, error)
	ListXPByUser(ctx context.Context, userID uuid.UUID, filter dto.Pagination) ([]domain.XPPoint, int64, error)
	AddXP(ctx context.Context, point *domain.XPPoint) error
	FindStreakByUser(ctx context.Context, userID uuid.UUID) (*domain.Streak, error)
	SaveStreak(ctx context.Context, streak *domain.Streak) error
}
