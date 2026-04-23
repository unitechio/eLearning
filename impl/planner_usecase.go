package impl

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type PlannerUsecase struct{ repo repository.PlannerRepository }

func NewPlannerUsecase(repo repository.PlannerRepository) *PlannerUsecase {
	return &PlannerUsecase{repo: repo}
}

func (u *PlannerUsecase) GetPlanner(userID uuid.UUID) (*usecase.Planner, error) {
	item, err := u.repo.FindByUserID(userID)
	if err != nil {
		if isNotFoundErr(err) {
			return &usecase.Planner{FocusArea: "english", WeeklyTarget: 3, Tasks: []string{}}, nil
		}
		return nil, apperr.Internal(err)
	}
	return mapPlanner(item), nil
}
func (u *PlannerUsecase) GeneratePlanner(userID uuid.UUID) (*usecase.Planner, error) {
	req := usecase.PlannerUpdateRequest{FocusArea: "academy-english", WeeklyTarget: 5, Tasks: []string{"Vocabulary review", "Writing task", "Speaking practice"}}
	return u.UpdatePlanner(userID, req)
}
func (u *PlannerUsecase) UpdatePlanner(userID uuid.UUID, req usecase.PlannerUpdateRequest) (*usecase.Planner, error) {
	item, err := u.repo.FindByUserID(userID)
	if err != nil && !isNotFoundErr(err) {
		return nil, apperr.Internal(err)
	}
	if item == nil {
		item = &domain.StudyPlanner{UserID: userID, TenantID: uuid.Nil}
	}
	item.FocusArea = req.FocusArea
	item.WeeklyTarget = req.WeeklyTarget
	rawTasks, _ := json.Marshal(req.Tasks)
	item.Tasks = rawTasks
	if err := u.repo.Save(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapPlanner(item), nil
}

func mapPlanner(item *domain.StudyPlanner) *usecase.Planner {
	var tasks []string
	_ = json.Unmarshal(item.Tasks, &tasks)
	return &usecase.Planner{FocusArea: item.FocusArea, WeeklyTarget: item.WeeklyTarget, Tasks: tasks}
}
