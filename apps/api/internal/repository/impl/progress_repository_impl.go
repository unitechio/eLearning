package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type ProgressRepository struct{ db *gorm.DB }

func NewProgressRepository(db *gorm.DB) *ProgressRepository { return &ProgressRepository{db: db} }

func (r *ProgressRepository) ListCourseProgressByUser(userID uuid.UUID) ([]repository.CourseProgressView, error) {
	type row struct {
		CourseID         uuid.UUID
		CourseTitle      string
		CompletedLessons int64
		TotalLessons     int64
		AverageScore     float64
	}
	var rows []row
	err := r.db.Table("courses c").
		Select("c.id as course_id, c.title as course_title, count(distinct l.id) as total_lessons, count(distinct up.lesson_id) as completed_lessons, coalesce(avg(up.score),0) as average_score").
		Joins("left join units u on u.course_id = c.id").
		Joins("left join lessons l on l.unit_id = u.id").
		Joins("left join user_progresses up on up.lesson_id = l.id and up.user_id = ?", userID).
		Group("c.id, c.title").
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}
	items := make([]repository.CourseProgressView, 0, len(rows))
	for _, row := range rows {
		items = append(items, repository.CourseProgressView{
			CourseID:         row.CourseID,
			CourseTitle:      row.CourseTitle,
			CompletedLessons: row.CompletedLessons,
			TotalLessons:     row.TotalLessons,
			AverageScore:     row.AverageScore,
		})
	}
	return items, nil
}

func (r *ProgressRepository) GetAverageScoreByUser(userID uuid.UUID) (float64, error) {
	var avg float64
	err := r.db.Model(&domain.UserProgress{}).Where("user_id = ?", userID).Select("coalesce(avg(score), 0)").Scan(&avg).Error
	return avg, err
}

func (r *ProgressRepository) GetCompletedCoursesCountByUser(userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Table("courses c").
		Joins("join units u on u.course_id = c.id").
		Joins("join lessons l on l.unit_id = u.id").
		Joins("join user_progresses up on up.lesson_id = l.id and up.user_id = ?", userID).
		Group("c.id").
		Having("count(distinct up.lesson_id) >= count(distinct l.id)").
		Count(&count).Error
	return count, err
}
func (r *ProgressRepository) ListRecentProgressByUser(userID uuid.UUID, limit int) ([]domain.UserProgress, error) {
	var items []domain.UserProgress
	err := r.db.Where("user_id = ?", userID).Order("updated_at desc").Limit(limit).Find(&items).Error
	return items, err
}
func (r *ProgressRepository) GetCourseProgress(userID, courseID uuid.UUID) (*repository.CourseProgressView, error) {
	items, err := r.ListCourseProgressByUser(userID)
	if err != nil {
		return nil, err
	}
	for _, item := range items {
		if item.CourseID == courseID {
			return &item, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}
func (r *ProgressRepository) GetLessonProgressByUser(userID uuid.UUID) ([]domain.UserProgress, error) {
	var items []domain.UserProgress
	err := r.db.Where("user_id = ?", userID).Find(&items).Error
	return items, err
}
