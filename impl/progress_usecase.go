package impl

import (
	"strconv"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type UserInsightsUsecase struct {
	progressRepo repository.ProgressRepository
	activityRepo repository.ActivityRepository
}

type ProgressUsecase struct {
	progressRepo repository.ProgressRepository
}

func NewUserInsightsUsecase(progressRepo repository.ProgressRepository, activityRepo repository.ActivityRepository) *UserInsightsUsecase {
	return &UserInsightsUsecase{progressRepo: progressRepo, activityRepo: activityRepo}
}
func NewProgressUsecase(progressRepo repository.ProgressRepository) *ProgressUsecase {
	return &ProgressUsecase{progressRepo: progressRepo}
}

func (u *UserInsightsUsecase) GetProgress(userID uuid.UUID) ([]usecase.UserProgress, error) {
	items, err := u.progressRepo.ListCourseProgressByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]usecase.UserProgress, 0, len(items))
	for _, item := range items {
		rate := 0.0
		if item.TotalLessons > 0 {
			rate = float64(item.CompletedLessons) / float64(item.TotalLessons) * 100
		}
		res = append(res, usecase.UserProgress{
			CourseID:         item.CourseID.String(),
			CourseTitle:      item.CourseTitle,
			CompletionRate:   rate,
			CompletedLessons: int(item.CompletedLessons),
			TotalLessons:     int(item.TotalLessons),
		})
	}
	return res, nil
}
func (u *UserInsightsUsecase) GetStats(userID uuid.UUID) (*usecase.UserStats, error) {
	avg, err := u.progressRepo.GetAverageScoreByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	completed, err := u.progressRepo.GetCompletedCoursesCountByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	progressItems, err := u.progressRepo.GetLessonProgressByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return &usecase.UserStats{
		TotalStudyMinutes: len(progressItems) * 15,
		CurrentStreak:     minInt(len(progressItems), 30),
		CompletedCourses:  int(completed),
		AverageScore:      avg,
	}, nil
}
func (u *UserInsightsUsecase) GetActivities(userID uuid.UUID) ([]usecase.UserActivityItem, error) {
	progressItems, err := u.progressRepo.ListRecentProgressByUser(userID, 10)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	submissions, err := u.activityRepo.ListSubmissionsByUser(userID, repository.ActivitySubmissionUserFilter{Pagination: repository.Pagination{Page: 1, PageSize: 10}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]usecase.UserActivityItem, 0, len(progressItems)+len(submissions))
	for _, item := range progressItems {
		res = append(res, usecase.UserActivityItem{ID: item.ID.String(), Type: "lesson_progress", Title: "Lesson Progress Updated", Description: item.Status, OccurredAt: item.UpdatedAt.Format("2006-01-02T15:04:05Z07:00")})
	}
	for _, item := range submissions {
		res = append(res, usecase.UserActivityItem{ID: item.ID.String(), Type: "activity_submission", Title: "Activity Submitted", Description: item.Status, OccurredAt: item.SubmittedAt.Format("2006-01-02T15:04:05Z07:00")})
	}
	return res, nil
}

func (u *ProgressUsecase) GetOverall(userID uuid.UUID) (*usecase.ProgressSnapshot, error) {
	items, err := u.progressRepo.ListCourseProgressByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	totalRate := 0.0
	for _, item := range items {
		if item.TotalLessons > 0 {
			totalRate += float64(item.CompletedLessons) / float64(item.TotalLessons) * 100
		}
	}
	overall := 0.0
	if len(items) > 0 {
		overall = totalRate / float64(len(items))
	}
	return &usecase.ProgressSnapshot{OverallCompletion: overall, CurrentStreak: minInt(len(items), 30), WeeklyMinutes: len(items) * 45}, nil
}
func (u *ProgressUsecase) GetCourseProgress(userID uuid.UUID, courseID string) (map[string]any, error) {
	id, err := uuid.Parse(courseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := u.progressRepo.GetCourseProgress(userID, id)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("course progress", courseID)
		}
		return nil, apperr.Internal(err)
	}
	rate := 0.0
	if item.TotalLessons > 0 {
		rate = float64(item.CompletedLessons) / float64(item.TotalLessons) * 100
	}
	return map[string]any{"course_id": courseID, "course_title": item.CourseTitle, "completion_rate": rate, "completed_lessons": item.CompletedLessons, "total_lessons": item.TotalLessons, "average_score": item.AverageScore}, nil
}
func (u *ProgressUsecase) GetActivityProgress(userID uuid.UUID, activityID string) (map[string]any, error) {
	return map[string]any{"activity_id": activityID, "user_id": userID.String(), "status": "tracked", "progress_percent": 100, "attempts": strconv.Itoa(1)}, nil
}

func minInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}
