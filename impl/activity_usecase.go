package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type ActivityUsecase struct{ repo repository.ActivityRepository }

func NewActivityUsecase(repo repository.ActivityRepository) *ActivityUsecase {
	return &ActivityUsecase{repo: repo}
}

func (u *ActivityUsecase) GetActivity(id string) (*usecase.Activity, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	item, err := u.repo.FindActivityByID(activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	return mapActivity(item), nil
}
func (u *ActivityUsecase) CreateActivity(req usecase.UpsertActivityRequest) (*usecase.Activity, error) {
	item := &domain.Activity{TenantID: uuid.Nil, Title: req.Title, Type: req.Type, Domain: req.Domain, Instructions: req.Instructions, Status: fallback(req.Status, "draft"), MaxScore: 100, ExpectedInput: "text"}
	if err := u.repo.CreateActivity(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapActivity(item), nil
}
func (u *ActivityUsecase) UpdateActivity(id string, req usecase.UpsertActivityRequest) (*usecase.Activity, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	item, err := u.repo.FindActivityByID(activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	item.Title, item.Type, item.Domain, item.Instructions, item.Status = req.Title, req.Type, req.Domain, req.Instructions, fallback(req.Status, item.Status)
	if err := u.repo.UpdateActivity(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapActivity(item), nil
}
func (u *ActivityUsecase) DeleteActivity(id string) error {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return apperr.BadRequest("invalid activity id")
	}
	return u.repo.DeleteActivity(activityID)
}
func (u *ActivityUsecase) SubmitActivity(id string, userID uuid.UUID, req usecase.SubmitActivityRequest) (*usecase.Submission, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	activity, err := u.repo.FindActivityByID(activityID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("activity", id)
		}
		return nil, apperr.Internal(err)
	}
	score := 85.0
	sub := &domain.ActivitySubmission{ActivityID: activityID, UserID: userID, TenantID: activity.TenantID, Answer: req.Answer, Score: &score, Feedback: "Submission reviewed successfully.", Status: "graded"}
	if err := u.repo.CreateSubmission(sub); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSubmission(sub), nil
}
func (u *ActivityUsecase) ListActivitySubmissions(id string) ([]usecase.Submission, error) {
	activityID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid activity id")
	}
	items, _, err := u.repo.ListSubmissionsByActivity(activityID, repository.ActivitySubmissionListFilter{Pagination: repository.Pagination{Page: 1, PageSize: 100}})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]usecase.Submission, 0, len(items))
	for _, item := range items {
		res = append(res, *mapSubmission(&item))
	}
	return res, nil
}
func (u *ActivityUsecase) GetSubmission(id string) (*usecase.Submission, error) {
	submissionID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid submission id")
	}
	item, err := u.repo.FindSubmissionByID(submissionID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("submission", id)
		}
		return nil, apperr.Internal(err)
	}
	return mapSubmission(item), nil
}

func mapActivity(item *domain.Activity) *usecase.Activity {
	return &usecase.Activity{ID: item.ID.String(), Title: item.Title, Type: item.Type, Domain: item.Domain, Instructions: item.Instructions, Status: item.Status}
}
func mapSubmission(item *domain.ActivitySubmission) *usecase.Submission {
	score := 0.0
	if item.Score != nil {
		score = *item.Score
	}
	return &usecase.Submission{ID: item.ID.String(), ActivityID: item.ActivityID.String(), UserID: item.UserID.String(), Answer: item.Answer, Score: score, Feedback: item.Feedback, Status: item.Status}
}
