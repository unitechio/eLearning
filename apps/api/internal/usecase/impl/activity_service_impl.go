package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type ActivityUsecase struct{ repo repository.ActivityRepository }

func NewActivityService(repo repository.ActivityRepository) *ActivityUsecase {
	return &ActivityUsecase{repo: repo}
}

func (s *ActivityUsecase) GetActivity(id string) (*dto.Activity, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	item, err := s.repo.FindActivityByID(activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	return mapActivity(item), nil
}

func (s *ActivityUsecase) CreateActivity(req dto.UpsertActivityRequest) (*dto.Activity, error) {
	item := &domain.Activity{TenantID: uuid.Nil, Title: req.Title, Type: req.Type, Domain: req.Domain, Instructions: req.Instructions, Status: fallback(req.Status, "draft"), MaxScore: 100, ExpectedInput: "text"}
	if err := s.repo.CreateActivity(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapActivity(item), nil
}

func (s *ActivityUsecase) UpdateActivity(id string, req dto.UpsertActivityRequest) (*dto.Activity, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	item, err := s.repo.FindActivityByID(activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	item.Title, item.Type, item.Domain, item.Instructions, item.Status = req.Title, req.Type, req.Domain, req.Instructions, fallback(req.Status, item.Status)
	if err := s.repo.UpdateActivity(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapActivity(item), nil
}

func (s *ActivityUsecase) DeleteActivity(id string) error {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid activity id")
	}
	return s.repo.DeleteActivity(activityID)
}

func (s *ActivityUsecase) SubmitActivity(id string, userID uuid.UUID, req dto.SubmitActivityRequest) (*dto.Submission, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	activity, err := s.repo.FindActivityByID(activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	score := 85.0
	sub := &domain.ActivitySubmission{ActivityID: activityID, UserID: userID, TenantID: activity.TenantID, Answer: req.Answer, Score: &score, Feedback: "Submission reviewed successfully.", Status: "graded"}
	if err := s.repo.CreateSubmission(sub); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSubmission(sub), nil
}

func (s *ActivityUsecase) ListActivitySubmissions(id string, query dto.ActivitySubmissionListQuery) (*dto.PageResult[dto.Submission], error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListSubmissionsByActivity(activityID, repository.ActivitySubmissionListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
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

func (s *ActivityUsecase) GetSubmission(id string) (*dto.Submission, error) {
	submissionID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid submission id")
	}
	item, err := s.repo.FindSubmissionByID(submissionID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("submission", id)
		}
		return nil, apperr.Internal(err)
	}
	return mapSubmission(item), nil
}

func mapActivity(item *domain.Activity) *dto.Activity {
	return &dto.Activity{ID: item.ID.String(), Title: item.Title, Type: item.Type, Domain: item.Domain, Instructions: item.Instructions, Status: item.Status}
}

func mapSubmission(item *domain.ActivitySubmission) *dto.Submission {
	score := 0.0
	if item.Score != nil {
		score = *item.Score
	}
	return &dto.Submission{ID: item.ID.String(), ActivityID: item.ActivityID.String(), UserID: item.UserID.String(), Answer: item.Answer, Score: score, Feedback: item.Feedback, Status: item.Status}
}
