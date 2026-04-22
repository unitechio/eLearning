package dto

type LeaderboardQuery struct {
	Type   string `form:"type"`
	Metric string `form:"metric"`
	Limit  int    `form:"limit"`
}

type LeaderboardEntry struct {
	Rank        int    `json:"rank"`
	UserID      string `json:"user_id"`
	DisplayName string `json:"display_name"`
	XP          int    `json:"xp"`
	TimeSpent   int    `json:"time_spent"`
	IsCurrent   bool   `json:"is_current"`
}

type HeatmapQuery struct {
	Range string `form:"range"`
}

type DailyActivityQuery struct {
	Range string `form:"range"`
}

type HeatmapPoint struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}

type DailyActivityPoint struct {
	Date          string `json:"date"`
	XP            int    `json:"xp"`
	TimeSpent     int    `json:"time_spent"`
	CompletedLabs int    `json:"completed_labs"`
}

type XPHistoryItem struct {
	ID        string `json:"id"`
	Amount    int    `json:"amount"`
	Reason    string `json:"reason"`
	CreatedAt string `json:"created_at"`
}

type TimeSpentSnapshot struct {
	MinutesToday int `json:"minutes_today"`
	MinutesWeek  int `json:"minutes_week"`
	MinutesMonth int `json:"minutes_month"`
}

type GamificationProfile struct {
	TotalXP        int    `json:"total_xp"`
	CurrentStreak  int    `json:"current_streak"`
	LongestStreak  int    `json:"longest_streak"`
	Level          int    `json:"level"`
	NextLevelAtXP  int    `json:"next_level_at_xp"`
	CurrentBadge   string `json:"current_badge"`
	AchievementPct int    `json:"achievement_pct"`
}

type AddXPRequest struct {
	Amount int    `json:"amount" binding:"required"`
	Reason string `json:"reason" binding:"required"`
}

type Achievement struct {
	Code        string `json:"code"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Unlocked    bool   `json:"unlocked"`
}

type RecommendationItem struct {
	Type        string `json:"type"`
	Title       string `json:"title"`
	Description string `json:"description"`
	RefID       string `json:"ref_id"`
}

type LearningPattern struct {
	PreferredTime string   `json:"preferred_time"`
	PreferredDays []string `json:"preferred_days"`
	StrongestMode string   `json:"strongest_mode"`
}

type WeakPoint struct {
	Area  string  `json:"area"`
	Score float64 `json:"score"`
	Note  string  `json:"note"`
}

type ImprovementInsight struct {
	Metric string  `json:"metric"`
	Value  float64 `json:"value"`
	Trend  string  `json:"trend"`
}

type PremiumFeature struct {
	Code        string `json:"code"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Unlocked    bool   `json:"unlocked"`
}

type PremiumUnlockRequest struct {
	FeatureCode string `json:"feature_code" binding:"required"`
}
