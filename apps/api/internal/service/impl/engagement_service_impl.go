package impl

import (
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type EngagementService struct {
	repo         repository.EngagementRepository
	progressRepo repository.ProgressRepository
	activityRepo repository.ActivityRepository
	billingRepo  repository.BillingRepository
}

func NewEngagementService(repo repository.EngagementRepository, progressRepo repository.ProgressRepository, activityRepo repository.ActivityRepository, billingRepo repository.BillingRepository) *EngagementService {
	return &EngagementService{repo: repo, progressRepo: progressRepo, activityRepo: activityRepo, billingRepo: billingRepo}
}

func (s *EngagementService) GetLeaderboard(userID uuid.UUID, query dto.LeaderboardQuery) ([]dto.LeaderboardEntry, error) {
	rows, err := s.repo.ListLeaderboardSince(resolveLeaderboardStart(query.Type), normalizeLimit(query.Limit))
	if err != nil {
		return nil, apperr.Internal(err)
	}
	entries := make([]dto.LeaderboardEntry, 0, len(rows))
	for _, row := range rows {
		display := strings.TrimSpace(strings.TrimSpace(row.FirstName + " " + row.LastName))
		if display == "" {
			display = row.Email
		}
		entries = append(entries, dto.LeaderboardEntry{
			Rank:        row.CurrentRank,
			UserID:      row.UserID.String(),
			DisplayName: display,
			XP:          row.XP,
			TimeSpent:   row.TimeSpent,
			IsCurrent:   row.UserID == userID,
		})
	}
	if strings.EqualFold(query.Metric, "time") {
		sort.SliceStable(entries, func(i, j int) bool { return entries[i].TimeSpent > entries[j].TimeSpent })
		for i := range entries {
			entries[i].Rank = i + 1
		}
	}
	return entries, nil
}

func (s *EngagementService) GetMyLeaderboardStanding(userID uuid.UUID, query dto.LeaderboardQuery) (*dto.LeaderboardEntry, error) {
	entry, err := s.repo.GetLeaderboardEntrySince(userID, resolveLeaderboardStart(query.Type))
	if err != nil {
		if isNotFoundErr(err) {
			return &dto.LeaderboardEntry{Rank: 0, UserID: userID.String(), DisplayName: "You"}, nil
		}
		return nil, apperr.Internal(err)
	}
	display := strings.TrimSpace(strings.TrimSpace(entry.FirstName + " " + entry.LastName))
	if display == "" {
		display = entry.Email
	}
	return &dto.LeaderboardEntry{Rank: entry.CurrentRank, UserID: entry.UserID.String(), DisplayName: display, XP: entry.XP, TimeSpent: entry.TimeSpent, IsCurrent: true}, nil
}

func (s *EngagementService) GetHeatmap(userID uuid.UUID, query dto.HeatmapQuery) ([]dto.HeatmapPoint, error) {
	days := resolveDays(query.Range, 180)
	progressItems, err := s.progressRepo.ListRecentProgressByUser(userID, 1000)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	submissions, err := s.activityRepo.ListSubmissionsByUser(userID, repository.ActivitySubmissionUserFilter{Pagination: repository.Pagination{Page: 1, PageSize: 1000}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	buckets := map[string]int{}
	start := time.Now().UTC().AddDate(0, 0, -days+1)
	for _, item := range progressItems {
		if item.UpdatedAt.Before(start) {
			continue
		}
		buckets[item.UpdatedAt.UTC().Format("2006-01-02")]++
	}
	for _, item := range submissions {
		if item.SubmittedAt.Before(start) {
			continue
		}
		buckets[item.SubmittedAt.UTC().Format("2006-01-02")]++
	}
	res := make([]dto.HeatmapPoint, 0, days)
	for i := 0; i < days; i++ {
		date := start.AddDate(0, 0, i).Format("2006-01-02")
		res = append(res, dto.HeatmapPoint{Date: date, Count: buckets[date]})
	}
	return res, nil
}

func (s *EngagementService) GetDailyActivity(userID uuid.UUID, query dto.DailyActivityQuery) ([]dto.DailyActivityPoint, error) {
	heatmap, err := s.GetHeatmap(userID, dto.HeatmapQuery{Range: query.Range})
	if err != nil {
		return nil, err
	}
	xpItems, _, err := s.repo.ListXPByUser(userID, repository.Pagination{Page: 1, PageSize: 1000})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	xpByDay := map[string]int{}
	start := time.Now().UTC().AddDate(0, 0, -resolveDays(query.Range, 30)+1)
	for _, item := range xpItems {
		if item.CreatedAt.Before(start) {
			continue
		}
		xpByDay[item.CreatedAt.UTC().Format("2006-01-02")] += item.Amount
	}
	res := make([]dto.DailyActivityPoint, 0, len(heatmap))
	for _, item := range heatmap {
		res = append(res, dto.DailyActivityPoint{Date: item.Date, XP: xpByDay[item.Date], TimeSpent: item.Count * 15, CompletedLabs: item.Count})
	}
	return res, nil
}

func (s *EngagementService) GetXPHistory(userID uuid.UUID, query dto.PaginationQuery) (*dto.PageResult[dto.XPHistoryItem], error) {
	query = query.Normalize()
	items, total, err := s.repo.ListXPByUser(userID, repository.Pagination{Page: query.Page, PageSize: query.PageSize})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.XPHistoryItem, 0, len(items))
	for _, item := range items {
		res = append(res, dto.XPHistoryItem{ID: item.ID.String(), Amount: item.Amount, Reason: item.Reason, CreatedAt: item.CreatedAt.Format(time.RFC3339)})
	}
	return &dto.PageResult[dto.XPHistoryItem]{Items: res, Meta: buildMeta(query, total)}, nil
}

func (s *EngagementService) GetTimeSpent(userID uuid.UUID) (*dto.TimeSpentSnapshot, error) {
	daily, err := s.GetDailyActivity(userID, dto.DailyActivityQuery{Range: "30d"})
	if err != nil {
		return nil, err
	}
	var today, week, month int
	todayKey := time.Now().UTC().Format("2006-01-02")
	for idx, item := range daily {
		month += item.TimeSpent
		if item.Date == todayKey {
			today = item.TimeSpent
		}
		if idx >= len(daily)-7 {
			week += item.TimeSpent
		}
	}
	return &dto.TimeSpentSnapshot{MinutesToday: today, MinutesWeek: week, MinutesMonth: month}, nil
}

func (s *EngagementService) GetGamificationProfile(userID uuid.UUID) (*dto.GamificationProfile, error) {
	totalXP, err := s.totalXP(userID)
	if err != nil {
		return nil, err
	}
	streak, err := s.ensureStreak(userID)
	if err != nil {
		return nil, err
	}
	level := totalXP/250 + 1
	achievements, err := s.GetAchievements(userID)
	if err != nil {
		return nil, err
	}
	unlocked := 0
	for _, item := range achievements {
		if item.Unlocked {
			unlocked++
		}
	}
	pct := 0
	if len(achievements) > 0 {
		pct = unlocked * 100 / len(achievements)
	}
	badge := "Starter"
	if totalXP >= 1000 {
		badge = "Fluent Climber"
	} else if totalXP >= 500 {
		badge = "Consistency Builder"
	}
	return &dto.GamificationProfile{
		TotalXP:        totalXP,
		CurrentStreak:  streak.CurrentStreak,
		LongestStreak:  streak.LongestStreak,
		Level:          level,
		NextLevelAtXP:  level * 250,
		CurrentBadge:   badge,
		AchievementPct: pct,
	}, nil
}

func (s *EngagementService) AddXP(userID uuid.UUID, req dto.AddXPRequest) (*dto.GamificationProfile, error) {
	if req.Amount <= 0 {
		return nil, apperr.BadRequest("xp amount must be greater than zero")
	}
	if err := s.repo.AddXP(&model.XPPoint{UserID: userID, TenantID: uuid.Nil, Amount: req.Amount, Reason: req.Reason}); err != nil {
		return nil, apperr.Internal(err)
	}
	streak, err := s.ensureStreak(userID)
	if err != nil {
		return nil, err
	}
	now := time.Now().UTC()
	if streak.LastActivityDate == nil || streak.LastActivityDate.Format("2006-01-02") != now.Format("2006-01-02") {
		if streak.LastActivityDate != nil && streak.LastActivityDate.AddDate(0, 0, 1).Format("2006-01-02") == now.Format("2006-01-02") {
			streak.CurrentStreak++
		} else {
			streak.CurrentStreak = 1
		}
		if streak.CurrentStreak > streak.LongestStreak {
			streak.LongestStreak = streak.CurrentStreak
		}
		streak.LastActivityDate = &now
		if err := s.repo.SaveStreak(streak); err != nil {
			return nil, apperr.Internal(err)
		}
	}
	return s.GetGamificationProfile(userID)
}

func (s *EngagementService) GetStreak(userID uuid.UUID) (map[string]any, error) {
	streak, err := s.ensureStreak(userID)
	if err != nil {
		return nil, err
	}
	return map[string]any{"current_streak": streak.CurrentStreak, "longest_streak": streak.LongestStreak, "last_activity": formatDatePtr(streak.LastActivityDate)}, nil
}

func (s *EngagementService) GetAchievements(userID uuid.UUID) ([]dto.Achievement, error) {
	profile, err := s.GetGamificationProfile(userID)
	if err != nil {
		return nil, err
	}
	return []dto.Achievement{
		{Code: "first_xp", Title: "First Steps", Description: "Earn your first XP", Unlocked: profile.TotalXP > 0},
		{Code: "streak_7", Title: "Week Warrior", Description: "Reach a 7-day streak", Unlocked: profile.CurrentStreak >= 7},
		{Code: "xp_500", Title: "Growth Mindset", Description: "Reach 500 XP", Unlocked: profile.TotalXP >= 500},
		{Code: "xp_1000", Title: "Academy Ace", Description: "Reach 1000 XP", Unlocked: profile.TotalXP >= 1000},
	}, nil
}

func (s *EngagementService) GetRecommendations(userID uuid.UUID) ([]dto.RecommendationItem, error) {
	weakPoints, err := s.GetWeakPoints(userID)
	if err != nil {
		return nil, err
	}
	items := []dto.RecommendationItem{
		{Type: "practice", Title: "Vocabulary review", Description: "Reinforce recently learned words due today.", RefID: "vocabulary-review"},
		{Type: "practice", Title: "Speaking drill", Description: "Run a 3-minute speaking shadowing session.", RefID: "practice-shadowing"},
	}
	if len(weakPoints) > 0 {
		items = append(items, dto.RecommendationItem{Type: "focus", Title: "Target weak point", Description: weakPoints[0].Note, RefID: weakPoints[0].Area})
	}
	return items, nil
}

func (s *EngagementService) GetNextLesson(userID uuid.UUID) (map[string]any, error) {
	items, err := s.progressRepo.ListCourseProgressByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if len(items) == 0 {
		return map[string]any{"title": "Starter lesson", "domain": "english", "reason": "No course progress found yet"}, nil
	}
	sort.Slice(items, func(i, j int) bool {
		return float64(items[i].CompletedLessons)/float64(maxInt64(items[i].TotalLessons, 1)) <
			float64(items[j].CompletedLessons)/float64(maxInt64(items[j].TotalLessons, 1))
	})
	item := items[0]
	return map[string]any{
		"course_id":    item.CourseID.String(),
		"course_title": item.CourseTitle,
		"reason":       "Lowest completion rate currently needs attention",
	}, nil
}

func (s *EngagementService) GetLearningPattern(userID uuid.UUID) (*dto.LearningPattern, error) {
	progressItems, err := s.progressRepo.ListRecentProgressByUser(userID, 200)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if len(progressItems) == 0 {
		return &dto.LearningPattern{PreferredTime: "evening", PreferredDays: []string{"monday", "wednesday", "friday"}, StrongestMode: "mixed"}, nil
	}
	dayCount := map[string]int{}
	hourCount := map[string]int{}
	for _, item := range progressItems {
		dayCount[strings.ToLower(item.UpdatedAt.Weekday().String())]++
		slot := "evening"
		hour := item.UpdatedAt.Hour()
		switch {
		case hour < 12:
			slot = "morning"
		case hour < 18:
			slot = "afternoon"
		}
		hourCount[slot]++
	}
	return &dto.LearningPattern{
		PreferredTime: maxKey(hourCount),
		PreferredDays: topDays(dayCount, 3),
		StrongestMode: "english-practice",
	}, nil
}

func (s *EngagementService) GetWeakPoints(userID uuid.UUID) ([]dto.WeakPoint, error) {
	avg, err := s.progressRepo.GetAverageScoreByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	points := []dto.WeakPoint{
		{Area: "writing", Score: maxFloat(10-avg, 1), Note: "Writing arguments need stronger support and clearer transitions."},
		{Area: "speaking", Score: maxFloat(9.5-avg, 1), Note: "Speaking fluency can improve by reducing hesitation and fillers."},
		{Area: "vocabulary", Score: maxFloat(8.5-avg, 1), Note: "Vocabulary recall needs spaced review on weak words."},
	}
	sort.Slice(points, func(i, j int) bool { return points[i].Score > points[j].Score })
	return points, nil
}

func (s *EngagementService) GetImprovement(userID uuid.UUID) ([]dto.ImprovementInsight, error) {
	profile, err := s.GetGamificationProfile(userID)
	if err != nil {
		return nil, err
	}
	return []dto.ImprovementInsight{
		{Metric: "xp", Value: float64(profile.TotalXP), Trend: "up"},
		{Metric: "streak", Value: float64(profile.CurrentStreak), Trend: "up"},
		{Metric: "consistency", Value: float64(profile.AchievementPct), Trend: "stable"},
	}, nil
}

func (s *EngagementService) GetPremiumFeatures(userID uuid.UUID) ([]dto.PremiumFeature, error) {
	items := []dto.PremiumFeature{
		{Code: "ai_stream", Title: "AI stream response", Description: "Realtime premium AI coaching"},
		{Code: "speaking_realtime", Title: "Realtime speaking coach", Description: "Deep pronunciation and fluency feedback"},
		{Code: "vocab_pro", Title: "Vocabulary Pro", Description: "Advanced vocab set and memory tracking"},
	}
	hasPremium, err := s.hasPremium(userID)
	if err != nil {
		return nil, err
	}
	for idx := range items {
		items[idx].Unlocked = hasPremium
	}
	return items, nil
}

func (s *EngagementService) UnlockPremiumFeature(userID uuid.UUID, req dto.PremiumUnlockRequest) (map[string]any, error) {
	plans, _, err := s.billingRepo.ListPlans(repository.BillingPlanListFilter{Pagination: repository.Pagination{Page: 1, PageSize: 10}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if len(plans) == 0 {
		return nil, apperr.NotFound("billing plan", "premium")
	}
	return map[string]any{
		"feature_code": req.FeatureCode,
		"status":       "ready_to_subscribe",
		"suggested_plan": map[string]any{
			"id":    plans[len(plans)-1].ID.String(),
			"code":  plans[len(plans)-1].Code,
			"name":  plans[len(plans)-1].Name,
			"price": plans[len(plans)-1].Price,
		},
	}, nil
}

func (s *EngagementService) totalXP(userID uuid.UUID) (int, error) {
	items, _, err := s.repo.ListXPByUser(userID, repository.Pagination{Page: 1, PageSize: 1000})
	if err != nil {
		return 0, apperr.Internal(err)
	}
	total := 0
	for _, item := range items {
		total += item.Amount
	}
	return total, nil
}

func (s *EngagementService) ensureStreak(userID uuid.UUID) (*model.Streak, error) {
	item, err := s.repo.FindStreakByUser(userID)
	if err == nil {
		return item, nil
	}
	if !isNotFoundErr(err) {
		return nil, apperr.Internal(err)
	}
	item = &model.Streak{UserID: userID, TenantID: uuid.Nil, CurrentStreak: 0, LongestStreak: 0}
	if err := s.repo.SaveStreak(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return item, nil
}

func (s *EngagementService) hasPremium(userID uuid.UUID) (bool, error) {
	items, total, err := s.billingRepo.ListHistoryByUserID(userID, repository.BillingHistoryListFilter{Pagination: repository.Pagination{Page: 1, PageSize: 1}, Status: "paid"})
	if err != nil {
		return false, apperr.Internal(err)
	}
	return total > 0 && len(items) > 0, nil
}

func resolveLeaderboardStart(kind string) time.Time {
	now := time.Now().UTC()
	if strings.EqualFold(kind, "monthly") {
		return now.AddDate(0, -1, 0)
	}
	return now.AddDate(0, 0, -7)
}

func normalizeLimit(limit int) int {
	if limit <= 0 {
		return 10
	}
	if limit > 100 {
		return 100
	}
	return limit
}

func resolveDays(input string, fallbackDays int) int {
	switch strings.ToLower(strings.TrimSpace(input)) {
	case "7d":
		return 7
	case "30d":
		return 30
	case "90d", "3m":
		return 90
	case "180d", "6m":
		return 180
	default:
		return fallbackDays
	}
}

func maxKey(items map[string]int) string {
	bestKey := ""
	bestValue := -1
	for key, value := range items {
		if value > bestValue {
			bestKey, bestValue = key, value
		}
	}
	if bestKey == "" {
		return "evening"
	}
	return bestKey
}

func topDays(items map[string]int, limit int) []string {
	type pair struct {
		Key   string
		Value int
	}
	res := make([]pair, 0, len(items))
	for key, value := range items {
		res = append(res, pair{Key: key, Value: value})
	}
	sort.Slice(res, func(i, j int) bool { return res[i].Value > res[j].Value })
	if len(res) > limit {
		res = res[:limit]
	}
	out := make([]string, 0, len(res))
	for _, item := range res {
		out = append(out, item.Key)
	}
	return out
}

func formatDatePtr(item *time.Time) string {
	if item == nil {
		return ""
	}
	return item.UTC().Format("2006-01-02")
}

func maxFloat(a, b float64) float64 {
	if a > b {
		return a
	}
	return b
}

func maxInt64(a, b int64) int64 {
	if a > b {
		return a
	}
	return b
}
