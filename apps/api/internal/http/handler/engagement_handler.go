package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

// Leaderboard godoc
// @Summary      Get leaderboard
// @Tags         leaderboard
// @Security     BearerAuth
// @Produce      json
// @Param        type    query     string  false  "weekly or monthly"
// @Param        metric  query     string  false  "xp or time"
// @Param        limit   query     int     false  "Result limit"
// @Success      200     {object}  response.Envelope{data=[]dto.LeaderboardEntry}
// @Router       /leaderboard [get]
func (h *EngagementHandler) Leaderboard(c *gin.Context) {
	var query dto.LeaderboardQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	items, err := h.svc.GetLeaderboard(userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "leaderboard fetched", items)
}

// MyLeaderboard godoc
// @Summary      Get my leaderboard standing
// @Tags         leaderboard
// @Security     BearerAuth
// @Produce      json
// @Param        type    query     string  false  "weekly or monthly"
// @Param        metric  query     string  false  "xp or time"
// @Success      200     {object}  response.Envelope{data=dto.LeaderboardEntry}
// @Router       /leaderboard/me [get]
func (h *EngagementHandler) MyLeaderboard(c *gin.Context) {
	var query dto.LeaderboardQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.GetMyLeaderboardStanding(userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "leaderboard standing fetched", item)
}

// Heatmap godoc
// @Summary      Get activity heatmap
// @Tags         activity-tracking
// @Security     BearerAuth
// @Produce      json
// @Param        range  query     string  false  "7d, 30d, 3m, 6m"
// @Success      200    {object}  response.Envelope{data=[]dto.HeatmapPoint}
// @Router       /activity/heatmap [get]
func (h *EngagementHandler) Heatmap(c *gin.Context) {
	var query dto.HeatmapQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	items, err := h.svc.GetHeatmap(userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "activity heatmap fetched", items)
}

// DailyActivity godoc
// @Summary      Get daily activity stats
// @Tags         activity-tracking
// @Security     BearerAuth
// @Produce      json
// @Param        range  query     string  false  "7d, 30d, 3m"
// @Success      200    {object}  response.Envelope{data=[]dto.DailyActivityPoint}
// @Router       /activity/daily [get]
func (h *EngagementHandler) DailyActivity(c *gin.Context) {
	var query dto.DailyActivityQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	items, err := h.svc.GetDailyActivity(userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "daily activity fetched", items)
}

// XPHistory godoc
// @Summary      Get XP history
// @Tags         activity-tracking
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int  false  "Page number"
// @Param        page_size  query     int  false  "Page size"
// @Success      200        {object}  response.Envelope{data=[]dto.XPHistoryItem}
// @Router       /activity/xp [get]
func (h *EngagementHandler) XPHistory(c *gin.Context) {
	var query dto.PaginationQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	res, err := h.svc.GetXPHistory(userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "xp history fetched", res.Items, &res.Meta)
}

// TimeSpent godoc
// @Summary      Get time spent summary
// @Tags         activity-tracking
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.TimeSpentSnapshot}
// @Router       /activity/time-spent [get]
func (h *EngagementHandler) TimeSpent(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.GetTimeSpent(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "time spent fetched", item)
}

// GamificationProfile godoc
// @Summary      Get gamification profile
// @Tags         gamification
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.GamificationProfile}
// @Router       /gamification/profile [get]
func (h *EngagementHandler) GamificationProfile(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.GetGamificationProfile(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "gamification profile fetched", item)
}

// AddXP godoc
// @Summary      Add XP for current user
// @Tags         gamification
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AddXPRequest  true  "XP payload"
// @Success      200   {object}  response.Envelope{data=dto.GamificationProfile}
// @Router       /gamification/xp/add [post]
// @Router       /gamification/xp [post]
func (h *EngagementHandler) AddXP(c *gin.Context) {
	var req dto.AddXPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.AddXP(userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "xp added", item)
}

// Streak godoc
// @Summary      Get streak summary
// @Tags         gamification
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope
// @Router       /gamification/streak [get]
func (h *EngagementHandler) Streak(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.GetStreak(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "streak fetched", item)
}

// Achievements godoc
// @Summary      Get achievements
// @Tags         gamification
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]dto.Achievement}
// @Router       /gamification/achievements [get]
func (h *EngagementHandler) Achievements(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	items, err := h.svc.GetAchievements(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "achievements fetched", items)
}

// Recommendations godoc
// @Summary      Get recommendations
// @Tags         recommendations
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]dto.RecommendationItem}
// @Router       /recommendations [get]
func (h *EngagementHandler) Recommendations(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	items, err := h.svc.GetRecommendations(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "recommendations fetched", items)
}

// NextLesson godoc
// @Summary      Get next recommended lesson
// @Tags         recommendations
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope
// @Router       /recommendations/next [get]
// @Router       /recommendations/next-lesson [get]
func (h *EngagementHandler) NextLesson(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.GetNextLesson(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "next lesson fetched", item)
}

// LearningPattern godoc
// @Summary      Get learning pattern analytics
// @Tags         analytics
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.LearningPattern}
// @Router       /analytics/learning-pattern [get]
func (h *EngagementHandler) LearningPattern(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.GetLearningPattern(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "learning pattern fetched", item)
}

// WeakPoints godoc
// @Summary      Get weak points analytics
// @Tags         analytics
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]dto.WeakPoint}
// @Router       /analytics/weak-points [get]
func (h *EngagementHandler) WeakPoints(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	items, err := h.svc.GetWeakPoints(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "weak points fetched", items)
}

// Improvement godoc
// @Summary      Get improvement analytics
// @Tags         analytics
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]dto.ImprovementInsight}
// @Router       /analytics/improvement [get]
func (h *EngagementHandler) Improvement(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	items, err := h.svc.GetImprovement(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "improvement analytics fetched", items)
}

// PremiumFeatures godoc
// @Summary      Get premium feature list
// @Tags         premium
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]dto.PremiumFeature}
// @Router       /premium/features [get]
func (h *EngagementHandler) PremiumFeatures(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	items, err := h.svc.GetPremiumFeatures(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "premium features fetched", items)
}

// PremiumUnlock godoc
// @Summary      Unlock premium feature
// @Tags         premium
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.PremiumUnlockRequest  true  "Premium feature payload"
// @Success      200   {object}  response.Envelope
// @Router       /premium/unlock [post]
func (h *EngagementHandler) PremiumUnlock(c *gin.Context) {
	var req dto.PremiumUnlockRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.UnlockPremiumFeature(userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "premium unlock prepared", item)
}
