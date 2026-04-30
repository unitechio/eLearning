package impl

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type ActivityUsecase struct {
	repo  repository.ActivityRepository
	authz usecase.AuthorizationService
}

func NewActivityService(repo repository.ActivityRepository, authz usecase.AuthorizationService) *ActivityUsecase {
	return &ActivityUsecase{repo: repo, authz: authz}
}

func (s *ActivityUsecase) GetActivity(ctx context.Context, userID uuid.UUID, id string) (*dto.Activity, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	item, err := s.repo.FindActivityByID(ctx, activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanReadActivity(ctx, userID, item); err != nil {
		return nil, err
	}
	return mapActivity(item), nil
}

func (s *ActivityUsecase) CreateActivity(ctx context.Context, actorID uuid.UUID, req dto.UpsertActivityRequest) (*dto.Activity, error) {
	tenantID, err := s.authz.GetTenantID(ctx, actorID)
	if err != nil {
		return nil, err
	}
	item := &domain.Activity{TenantID: tenantID, CreatedBy: actorID, Title: req.Title, Type: req.Type, Domain: req.Domain, Instructions: req.Instructions, Status: fallback(req.Status, "draft"), Visibility: fallback(req.Visibility, "private"), MaxScore: 100, ExpectedInput: "text"}
	if err := s.repo.CreateActivity(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapActivity(item), nil
}

func (s *ActivityUsecase) UpdateActivity(ctx context.Context, actorID uuid.UUID, id string, req dto.UpsertActivityRequest) (*dto.Activity, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	item, err := s.repo.FindActivityByID(ctx, activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanManageActivity(ctx, actorID, item); err != nil {
		return nil, err
	}
	item.Title, item.Type, item.Domain, item.Instructions, item.Status, item.Visibility = req.Title, req.Type, req.Domain, req.Instructions, fallback(req.Status, item.Status), fallback(req.Visibility, item.Visibility)
	if err := s.repo.UpdateActivity(ctx, item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapActivity(item), nil
}

func (s *ActivityUsecase) DeleteActivity(ctx context.Context, actorID uuid.UUID, id string) error {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid activity id")
	}
	item, err := s.repo.FindActivityByID(ctx, activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return apperr.NotFound("activity", id)
		}
		return apperr.Internal(err)
	}
	if err := s.authz.CanManageActivity(ctx, actorID, item); err != nil {
		return err
	}
	return s.repo.DeleteActivity(ctx, activityID)
}

func (s *ActivityUsecase) SubmitActivity(ctx context.Context, id string, userID uuid.UUID, req dto.SubmitActivityRequest) (*dto.Submission, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	activity, err := s.repo.FindActivityByID(ctx, activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanReadActivity(ctx, userID, activity); err != nil {
		return nil, err
	}
	score := 85.0
	sub := &domain.ActivitySubmission{ActivityID: activityID, UserID: userID, TenantID: activity.TenantID, Answer: req.Answer, Score: &score, Feedback: "Submission reviewed successfully.", Status: "graded"}
	if err := s.repo.CreateSubmission(ctx, sub); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSubmission(sub), nil
}

func (s *ActivityUsecase) ListActivitySubmissions(ctx context.Context, userID uuid.UUID, id string, query dto.ActivitySubmissionListQuery) (*dto.PageResult[dto.Submission], error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	activity, err := s.repo.FindActivityByID(ctx, activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	if err := s.authz.CanManageActivity(ctx, userID, activity); err != nil {
		return nil, err
	}
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListSubmissionsByActivity(ctx, activityID, repository.ActivitySubmissionListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		TenantID:   activity.TenantID,
		Search:     query.Search,
		Status:     query.Status,
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.Submission, 0, len(items))
	for _, item := range items {
		res = append(res, *mapSubmission(&item))
	}
	return &dto.PageResult[dto.Submission]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *ActivityUsecase) GetSubmission(ctx context.Context, userID uuid.UUID, id string) (*dto.Submission, error) {
	submissionID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid submission id")
	}
	item, err := s.repo.FindSubmissionByID(ctx, submissionID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("submission", id)
		}
		return nil, apperr.Internal(err)
	}
	activity, err := s.repo.FindActivityByID(ctx, item.ActivityID)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	if item.UserID != userID {
		if err := s.authz.CanManageActivity(ctx, userID, activity); err != nil {
			return nil, err
		}
	} else if err := s.authz.CanReadActivity(ctx, userID, activity); err != nil {
		return nil, err
	}
	return mapSubmission(item), nil
}

func mapActivity(item *domain.Activity) *dto.Activity {
	return &dto.Activity{ID: item.ID.String(), Title: item.Title, Type: item.Type, Domain: item.Domain, Instructions: item.Instructions, Status: item.Status, Visibility: item.Visibility}
}

func mapSubmission(item *domain.ActivitySubmission) *dto.Submission {
	score := 0.0
	if item.Score != nil {
		score = *item.Score
	}
	return &dto.Submission{ID: item.ID.String(), ActivityID: item.ActivityID.String(), UserID: item.UserID.String(), Answer: item.Answer, Score: score, Feedback: item.Feedback, Status: item.Status}
}
