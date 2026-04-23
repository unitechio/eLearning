package usecase

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type EngagementService interface {
	GetLeaderboard(userID uuid.UUID, query dto.LeaderboardQuery) ([]dto.LeaderboardEntry, error)
	GetMyLeaderboardStanding(userID uuid.UUID, query dto.LeaderboardQuery) (*dto.LeaderboardEntry, error)
	GetHeatmap(userID uuid.UUID, query dto.HeatmapQuery) ([]dto.HeatmapPoint, error)
	GetDailyActivity(userID uuid.UUID, query dto.DailyActivityQuery) ([]dto.DailyActivityPoint, error)
	GetXPHistory(userID uuid.UUID, query dto.PaginationQuery) (*dto.PageResult[dto.XPHistoryItem], error)
	GetTimeSpent(userID uuid.UUID) (*dto.TimeSpentSnapshot, error)
	GetGamificationProfile(userID uuid.UUID) (*dto.GamificationProfile, error)
	AddXP(userID uuid.UUID, req dto.AddXPRequest) (*dto.GamificationProfile, error)
	GetStreak(userID uuid.UUID) (map[string]any, error)
	GetAchievements(userID uuid.UUID) ([]dto.Achievement, error)
	GetRecommendations(userID uuid.UUID) ([]dto.RecommendationItem, error)
	GetNextLesson(userID uuid.UUID) (map[string]any, error)
	GetLearningPattern(userID uuid.UUID) (*dto.LearningPattern, error)
	GetWeakPoints(userID uuid.UUID) ([]dto.WeakPoint, error)
	GetImprovement(userID uuid.UUID) ([]dto.ImprovementInsight, error)
	GetPremiumFeatures(userID uuid.UUID) ([]dto.PremiumFeature, error)
	UnlockPremiumFeature(userID uuid.UUID, req dto.PremiumUnlockRequest) (map[string]any, error)
}
