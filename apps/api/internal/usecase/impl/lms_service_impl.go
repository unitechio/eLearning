package impl

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"gorm.io/datatypes"
)

type LMSService struct {
	repo  repository.LMSRepository
	authz usecase.AuthorizationService
}

func NewLMSService(repo repository.LMSRepository, authz usecase.AuthorizationService) *LMSService {
	return &LMSService{repo: repo, authz: authz}
}

func (s *LMSService) GetMyDashboard(ctx context.Context, userID uuid.UUID) (*dto.LMSDashboardResponse, error) {
	return s.getDashboard(ctx, userID)
}

func (s *LMSService) GetUserDashboard(ctx context.Context, userID string) (*dto.LMSDashboardResponse, error) {
	parsed, err := uuid.Parse(userID)
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	return s.getDashboard(ctx, parsed)
}

func (s *LMSService) UpsertDashboard(ctx context.Context, actorID uuid.UUID, userID string, req dto.UpsertLMSDashboardRequest) (*dto.LMSDashboardResponse, error) {
	targetUserID, err := uuid.Parse(userID)
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	tenantID, err := s.authz.GetTenantID(ctx, actorID)
	if err != nil {
		return nil, err
	}
	item := &domain.LMSStudentDashboard{
		TenantID:         tenantID,
		UserID:           targetUserID,
		HeroTitle:        req.HeroTitle,
		HeroDescription:  req.HeroDescription,
		CurrentStreak:    req.CurrentStreak,
		LongestStreak:    req.LongestStreak,
		EstimatedBand:    req.EstimatedBand,
		TargetBand:       req.TargetBand,
		OverallProgress:  req.OverallProgress,
		AttendanceRate:   req.AttendanceRate,
		PracticeRate:     req.PracticeRate,
		AssignmentRate:   req.AssignmentRate,
		ActiveCourses:    req.ActiveCourses,
		UpcomingCourses:  req.UpcomingCourses,
		CompletedCourses: req.CompletedCourses,
		StudyDays:        req.StudyDays,
		PracticeSets:     req.PracticeSets,
		AssignmentsDone:  req.AssignmentsDone,
		Toolkit:          fallbackJSON(req.Toolkit),
		SkillPlan:        fallbackJSON(req.SkillPlan),
		ScoreBreakdown:   fallbackJSON(req.ScoreBreakdown),
		FourSkills:       fallbackJSON(req.FourSkills),
		AIFeatures:       fallbackJSON(req.AIFeatures),
		HighlightCards:   fallbackJSON(req.HighlightCards),
		CurrentFocus:     req.CurrentFocus,
		CurrentFocusNote: req.CurrentFocusNote,
	}
	if existing, err := s.repo.GetDashboardByUser(ctx, targetUserID); err == nil {
		item.UUIDModel = existing.UUIDModel
	}
	if err := s.repo.UpsertDashboard(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return s.getDashboard(ctx, targetUserID)
}

func (s *LMSService) CreateEnrollment(ctx context.Context, actorID uuid.UUID, userID string, req dto.UpsertLMSEnrollmentRequest) (*dto.LMSEnrollmentItem, error) {
	targetUserID, err := uuid.Parse(userID)
	if err != nil {
		return nil, apperr.BadRequest("invalid user id")
	}
	tenantID, err := s.authz.GetTenantID(ctx, actorID)
	if err != nil {
		return nil, err
	}
	item, err := enrollmentFromRequest(targetUserID, tenantID, req)
	if err != nil {
		return nil, err
	}
	if err := s.repo.CreateEnrollment(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapEnrollment(*item)
	return &res, nil
}

func (s *LMSService) UpdateEnrollment(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertLMSEnrollmentRequest) (*dto.LMSEnrollmentItem, error) {
	enrollmentID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid enrollment id")
	}
	item, err := s.repo.FindEnrollmentByID(ctx, enrollmentID)
	if err != nil {
		return nil, apperr.NotFound("lms enrollment", id)
	}
	courseID, err := parseOptionalUUID(req.CourseID)
	if err != nil {
		return nil, err
	}
	item.CourseID = courseID
	item.Title = req.Title
	item.Track = req.Track
	item.Status = fallback(req.Status, item.Status)
	item.ProgressPercent = req.ProgressPercent
	item.AttendancePercent = req.AttendancePercent
	item.PracticePercent = req.PracticePercent
	item.AssignmentPercent = req.AssignmentPercent
	item.ScheduleLabel = req.ScheduleLabel
	item.TimeRange = req.TimeRange
	item.CenterName = req.CenterName
	item.RoomName = req.RoomName
	item.InstructorName = req.InstructorName
	item.CurrentLesson = req.CurrentLesson
	item.NextLesson = req.NextLesson
	item.CertificateName = req.CertificateName
	item.CertificateURL = req.CertificateURL
	item.Metrics = fallbackJSON(req.Metrics)
	item.SortOrder = req.SortOrder
	if err := s.repo.UpdateEnrollment(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	res := mapEnrollment(*item)
	return &res, nil
}

func (s *LMSService) DeleteEnrollment(ctx context.Context, actorID uuid.UUID, id string) error {
	enrollmentID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid enrollment id")
	}
	if err := s.repo.DeleteEnrollment(ctx, enrollmentID); err != nil {
		return apperr.Internal(err)
	}
	return nil
}

func (s *LMSService) getDashboard(ctx context.Context, userID uuid.UUID) (*dto.LMSDashboardResponse, error) {
	dashboard, _ := s.repo.GetDashboardByUser(ctx, userID)
	enrollments, err := s.repo.ListEnrollmentsByUser(ctx, userID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	items := make([]dto.LMSEnrollmentItem, 0, len(enrollments))
	activeCourses := 0
	upcomingCourses := 0
	completedCourses := 0
	for _, item := range enrollments {
		items = append(items, mapEnrollment(item))
		switch item.Status {
		case "completed":
			completedCourses++
		case "upcoming":
			upcomingCourses++
		default:
			activeCourses++
		}
	}
	if dashboard == nil {
		dashboard = &domain.LMSStudentDashboard{
			UserID:           userID,
			HeroTitle:        "Theo doi tien do hoc tap IELTS",
			HeroDescription:  "Tong hop diem danh, luyen tap, assignment, mock test va cac khoa hoc cua hoc vien.",
			Toolkit:          datatypes.JSON([]byte("[]")),
			SkillPlan:        datatypes.JSON([]byte("[]")),
			ScoreBreakdown:   datatypes.JSON([]byte("[]")),
			FourSkills:       datatypes.JSON([]byte("[]")),
			AIFeatures:       datatypes.JSON([]byte("[]")),
			HighlightCards:   datatypes.JSON([]byte("[]")),
			ActiveCourses:    activeCourses,
			UpcomingCourses:  upcomingCourses,
			CompletedCourses: completedCourses,
		}
	} else {
		dashboard.ActiveCourses = activeCourses
		dashboard.UpcomingCourses = upcomingCourses
		dashboard.CompletedCourses = completedCourses
	}
	return &dto.LMSDashboardResponse{
		UserID:      userID.String(),
		Dashboard:   mapDashboard(*dashboard),
		Enrollments: items,
	}, nil
}

func mapDashboard(item domain.LMSStudentDashboard) dto.LMSDashboardData {
	return dto.LMSDashboardData{
		HeroTitle:        item.HeroTitle,
		HeroDescription:  item.HeroDescription,
		CurrentStreak:    item.CurrentStreak,
		LongestStreak:    item.LongestStreak,
		EstimatedBand:    item.EstimatedBand,
		TargetBand:       item.TargetBand,
		OverallProgress:  item.OverallProgress,
		AttendanceRate:   item.AttendanceRate,
		PracticeRate:     item.PracticeRate,
		AssignmentRate:   item.AssignmentRate,
		ActiveCourses:    item.ActiveCourses,
		UpcomingCourses:  item.UpcomingCourses,
		CompletedCourses: item.CompletedCourses,
		StudyDays:        item.StudyDays,
		PracticeSets:     item.PracticeSets,
		AssignmentsDone:  item.AssignmentsDone,
		Toolkit:          fallbackJSON(item.Toolkit),
		SkillPlan:        fallbackJSON(item.SkillPlan),
		ScoreBreakdown:   fallbackJSON(item.ScoreBreakdown),
		FourSkills:       fallbackJSON(item.FourSkills),
		AIFeatures:       fallbackJSON(item.AIFeatures),
		HighlightCards:   fallbackJSON(item.HighlightCards),
		CurrentFocus:     item.CurrentFocus,
		CurrentFocusNote: item.CurrentFocusNote,
	}
}

func mapEnrollment(item domain.LMSCourseEnrollment) dto.LMSEnrollmentItem {
	courseID := ""
	if item.CourseID != nil {
		courseID = item.CourseID.String()
	}
	return dto.LMSEnrollmentItem{
		ID:                item.ID.String(),
		UserID:            item.UserID.String(),
		CourseID:          courseID,
		Title:             item.Title,
		Track:             item.Track,
		Status:            item.Status,
		ProgressPercent:   item.ProgressPercent,
		AttendancePercent: item.AttendancePercent,
		PracticePercent:   item.PracticePercent,
		AssignmentPercent: item.AssignmentPercent,
		ScheduleLabel:     item.ScheduleLabel,
		TimeRange:         item.TimeRange,
		CenterName:        item.CenterName,
		RoomName:          item.RoomName,
		InstructorName:    item.InstructorName,
		CurrentLesson:     item.CurrentLesson,
		NextLesson:        item.NextLesson,
		CertificateName:   item.CertificateName,
		CertificateURL:    item.CertificateURL,
		Metrics:           fallbackJSON(item.Metrics),
		SortOrder:         item.SortOrder,
	}
}

func enrollmentFromRequest(userID, tenantID uuid.UUID, req dto.UpsertLMSEnrollmentRequest) (*domain.LMSCourseEnrollment, error) {
	courseID, err := parseOptionalUUID(req.CourseID)
	if err != nil {
		return nil, err
	}
	return &domain.LMSCourseEnrollment{
		TenantID:          tenantID,
		UserID:            userID,
		CourseID:          courseID,
		Title:             req.Title,
		Track:             req.Track,
		Status:            fallback(req.Status, "in_progress"),
		ProgressPercent:   req.ProgressPercent,
		AttendancePercent: req.AttendancePercent,
		PracticePercent:   req.PracticePercent,
		AssignmentPercent: req.AssignmentPercent,
		ScheduleLabel:     req.ScheduleLabel,
		TimeRange:         req.TimeRange,
		CenterName:        req.CenterName,
		RoomName:          req.RoomName,
		InstructorName:    req.InstructorName,
		CurrentLesson:     req.CurrentLesson,
		NextLesson:        req.NextLesson,
		CertificateName:   req.CertificateName,
		CertificateURL:    req.CertificateURL,
		Metrics:           fallbackJSON(req.Metrics),
		SortOrder:         req.SortOrder,
	}, nil
}

func parseOptionalUUID(value string) (*uuid.UUID, error) {
	if value == "" {
		return nil, nil
	}
	id, err := uuid.Parse(value)
	if err != nil {
		return nil, apperr.BadRequest("invalid course id")
	}
	return &id, nil
}

func fallbackJSON(value datatypes.JSON) datatypes.JSON {
	if len(value) == 0 {
		return datatypes.JSON([]byte("[]"))
	}
	return value
}
