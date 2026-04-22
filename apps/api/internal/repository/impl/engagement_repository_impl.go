package impl

import (
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type EngagementRepository struct {
	db *gorm.DB
}

func NewEngagementRepository(db *gorm.DB) *EngagementRepository {
	return &EngagementRepository{db: db}
}

func (r *EngagementRepository) ListLeaderboardSince(since time.Time, limit int) ([]repository.LeaderboardMetricRow, error) {
	type row struct {
		UserID    uuid.UUID
		Email     string
		FirstName string
		LastName  string
		XP        int
		TimeSpent int
	}
	var rows []row
	err := r.db.Table("users u").
		Select(`
			u.id as user_id,
			u.email,
			u.first_name,
			u.last_name,
			coalesce(sum(distinct xp.amount), 0) as xp,
			coalesce(count(distinct up.id) * 15 + count(distinct asb.id) * 10, 0) as time_spent`).
		Joins("left join xp_points xp on xp.user_id = u.id and xp.created_at >= ?", since).
		Joins("left join user_progresses up on up.user_id = u.id and up.updated_at >= ?", since).
		Joins("left join activity_submissions asb on asb.user_id = u.id and asb.submitted_at >= ?", since).
		Group("u.id, u.email, u.first_name, u.last_name").
		Order("xp desc, time_spent desc, u.created_at asc").
		Limit(limit).
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}
	res := make([]repository.LeaderboardMetricRow, 0, len(rows))
	for idx, row := range rows {
		res = append(res, repository.LeaderboardMetricRow{
			UserID:      row.UserID,
			Email:       row.Email,
			FirstName:   row.FirstName,
			LastName:    row.LastName,
			XP:          row.XP,
			TimeSpent:   row.TimeSpent,
			CurrentRank: idx + 1,
		})
	}
	return res, nil
}

func (r *EngagementRepository) GetLeaderboardEntrySince(userID uuid.UUID, since time.Time) (*repository.LeaderboardMetricRow, error) {
	rows, err := r.ListLeaderboardSince(since, 1000)
	if err != nil {
		return nil, err
	}
	for _, row := range rows {
		if row.UserID == userID {
			item := row
			return &item, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func (r *EngagementRepository) ListXPByUser(userID uuid.UUID, filter repository.Pagination) ([]model.XPPoint, int64, error) {
	var items []model.XPPoint
	var total int64
	q := r.db.Model(&model.XPPoint{}).Where("user_id = ?", userID)
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *EngagementRepository) AddXP(point *model.XPPoint) error {
	return r.db.Create(point).Error
}

func (r *EngagementRepository) FindStreakByUser(userID uuid.UUID) (*model.Streak, error) {
	var item model.Streak
	if err := r.db.Where("user_id = ?", userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *EngagementRepository) SaveStreak(streak *model.Streak) error {
	return r.db.Save(streak).Error
}
