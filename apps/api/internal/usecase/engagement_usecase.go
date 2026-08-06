package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type EngagementService interface {
	GetLeaderboard(ctx context.Context, userID uuid.UUID, query dto.LeaderboardQuery) ([]dto.LeaderboardEntry, error)
	GetMyLeaderboardStanding(ctx context.Context, userID uuid.UUID, query dto.LeaderboardQuery) (*dto.LeaderboardEntry, error)
	GetHeatmap(ctx context.Context, userID uuid.UUID, query dto.HeatmapQuery) ([]dto.HeatmapPoint, error)
	GetDailyActivity(ctx context.Context, userID uuid.UUID, query dto.DailyActivityQuery) ([]dto.DailyActivityPoint, error)
	GetXPHistory(ctx context.Context, userID uuid.UUID, query dto.PaginationQuery) (*dto.PageResult[dto.XPHistoryItem], error)
	GetTimeSpent(ctx context.Context, userID uuid.UUID) (*dto.TimeSpentSnapshot, error)
	GetGamificationProfile(ctx context.Context, userID uuid.UUID) (*dto.GamificationProfile, error)
	AddXP(ctx context.Context, userID uuid.UUID, req dto.AddXPRequest) (*dto.GamificationProfile, error)
	GetStreak(ctx context.Context, userID uuid.UUID) (map[string]any, error)
	GetAchievements(ctx context.Context, userID uuid.UUID) ([]dto.Achievement, error)
	GetRecommendations(ctx context.Context, userID uuid.UUID) ([]dto.RecommendationItem, error)
	GetNextLesson(ctx context.Context, userID uuid.UUID) (map[string]any, error)
	GetLearningPattern(ctx context.Context, userID uuid.UUID) (*dto.LearningPattern, error)
	GetWeakPoints(ctx context.Context, userID uuid.UUID) ([]dto.WeakPoint, error)
	GetImprovement(ctx context.Context, userID uuid.UUID) ([]dto.ImprovementInsight, error)
	GetPremiumFeatures(ctx context.Context, userID uuid.UUID) ([]dto.PremiumFeature, error)
	UnlockPremiumFeature(ctx context.Context, userID uuid.UUID, req dto.PremiumUnlockRequest) (map[string]any, error)
}
