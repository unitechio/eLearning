package impl

import (
	"sort"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type UserInsightsUsecase struct {
	progressRepo repository.ProgressRepository
	activityRepo repository.ActivityRepository
}

type ProgressUsecase struct {
	progressRepo repository.ProgressRepository
}

func NewUserInsightsService(progressRepo repository.ProgressRepository, activityRepo repository.ActivityRepository) *UserInsightsUsecase {
	return &UserInsightsUsecase{progressRepo: progressRepo, activityRepo: activityRepo}
}

func NewProgressService(progressRepo repository.ProgressRepository) *ProgressUsecase {
	return &ProgressUsecase{progressRepo: progressRepo}
}

func (s *UserInsightsUsecase) GetProgress(userID uuid.UUID) ([]dto.UserProgress, error) {
	items, err := s.progressRepo.ListCourseProgressByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.UserProgress, 0, len(items))
	for _, item := range items {
		rate := 0.0
		if item.TotalLessons > 0 {
			rate = float64(item.CompletedLessons) / float64(item.TotalLessons) * 100
		}
		lastActivityAt := ""
		if item.LastActivityAt != nil {
			lastActivityAt = item.LastActivityAt.UpdatedAt.Format("2006-01-02T15:04:05Z07:00")
		}
		res = append(res, dto.UserProgress{
			CourseID:          item.CourseID.String(),
			CourseTitle:       item.CourseTitle,
			CompletionRate:    rate,
			CompletedLessons:  int(item.CompletedLessons),
			TotalLessons:      int(item.TotalLessons),
			LastActivityAtUTC: lastActivityAt,
		})
	}
	return res, nil
}

func (s *UserInsightsUsecase) GetStats(userID uuid.UUID) (*dto.UserStats, error) {
	avg, err := s.progressRepo.GetAverageScoreByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	completed, err := s.progressRepo.GetCompletedCoursesCountByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	progressItems, err := s.progressRepo.GetLessonProgressByUser(userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.UserStats{
		TotalStudyMinutes: len(progressItems) * 15,
		CurrentStreak:     minInt(len(progressItems), 30),
		CompletedCourses:  int(completed),
		AverageScore:      avg,
	}, nil
}

func (s *UserInsightsUsecase) GetActivities(userID uuid.UUID, query dto.UserActivityListQuery) (*dto.PageResult[dto.UserActivityItem], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	progressItems, err := s.progressRepo.ListRecentProgressByUser(userID, 100)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	submissions, err := s.activityRepo.ListSubmissionsByUser(userID, repository.ActivitySubmissionUserFilter{
		Pagination: repository.Pagination{Page: 1, PageSize: 100},
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	items := make([]dto.UserActivityItem, 0, len(progressItems)+len(submissions))
	for _, item := range progressItems {
		items = append(items, dto.UserActivityItem{
			ID:          item.ID.String(),
			Type:        "lesson_progress",
			Title:       "Lesson Progress Updated",
			Description: item.Status,
			OccurredAt:  item.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	for _, item := range submissions {
		items = append(items, dto.UserActivityItem{
			ID:          item.ID.String(),
			Type:        "activity_submission",
			Title:       "Activity Submitted",
			Description: item.Status,
			OccurredAt:  item.SubmittedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	sort.Slice(items, func(i, j int) bool { return items[i].OccurredAt > items[j].OccurredAt })
	filtered := make([]dto.UserActivityItem, 0, len(items))
	for _, item := range items {
		if query.Type != "" && !strings.EqualFold(item.Type, query.Type) {
			continue
		}
		if !containsQuery(query.Search, item.Title, item.Description, item.Type) {
			continue
		}
		filtered = append(filtered, item)
	}
	total := int64(len(filtered))
	start := (query.Page - 1) * query.PageSize
	if start > len(filtered) {
		start = len(filtered)
	}
	end := start + query.PageSize
	if end > len(filtered) {
		end = len(filtered)
	}
	return &dto.PageResult[dto.UserActivityItem]{Items: filtered[start:end], Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *ProgressUsecase) GetOverall(userID uuid.UUID) (*dto.ProgressSnapshot, error) {
	items, err := s.progressRepo.ListCourseProgressByUser(userID)
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
	return &dto.ProgressSnapshot{OverallCompletion: overall, CurrentStreak: minInt(len(items), 30), WeeklyMinutes: len(items) * 45}, nil
}

func (s *ProgressUsecase) GetCourseProgress(userID uuid.UUID, courseID string) (map[string]any, error) {
	id, err := uuid.Parse(courseID)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	item, err := s.progressRepo.GetCourseProgress(userID, id)
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
	return map[string]any{
		"course_id":         courseID,
		"course_title":      item.CourseTitle,
		"completion_rate":   rate,
		"completed_lessons": item.CompletedLessons,
		"total_lessons":     item.TotalLessons,
		"average_score":     item.AverageScore,
	}, nil
}

func (s *ProgressUsecase) GetActivityProgress(userID uuid.UUID, activityID string) (map[string]any, error) {
	return map[string]any{"activity_id": activityID, "user_id": userID.String(), "status": "tracked", "progress_percent": 100, "attempts": strconv.Itoa(1)}, nil
}

func minInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}
