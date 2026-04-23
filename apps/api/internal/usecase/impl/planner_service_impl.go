package impl

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type PlannerUsecase struct{ repo repository.PlannerRepository }

func NewPlannerService(repo repository.PlannerRepository) *PlannerUsecase {
	return &PlannerUsecase{repo: repo}
}

func (s *PlannerUsecase) GetPlanner(userID uuid.UUID) (*dto.Planner, error) {
	item, err := s.repo.FindByUserID(userID)
	if err != nil {
		if isNotFoundErr(err) {
			return &dto.Planner{FocusArea: "academy-english", WeeklyTarget: 3, Tasks: []string{}}, nil
		}
		return nil, apperr.Internal(err)
	}
	return mapPlanner(item), nil
}

func (s *PlannerUsecase) GeneratePlanner(userID uuid.UUID) (*dto.Planner, error) {
	req := dto.PlannerUpdateRequest{FocusArea: "academy-english", WeeklyTarget: 5, Tasks: []string{"Vocabulary review", "Writing task", "Speaking practice"}}
	return s.UpdatePlanner(userID, req)
}

func (s *PlannerUsecase) UpdatePlanner(userID uuid.UUID, req dto.PlannerUpdateRequest) (*dto.Planner, error) {
	item, err := s.repo.FindByUserID(userID)
	if err != nil && !isNotFoundErr(err) {
		return nil, apperr.Internal(err)
	}
	if item == nil {
		item = &domain.StudyPlanner{UserID: userID, TenantID: uuid.Nil}
	}
	item.FocusArea = fallback(req.FocusArea, "academy-english")
	if req.WeeklyTarget > 0 {
		item.WeeklyTarget = req.WeeklyTarget
	}
	rawTasks, _ := json.Marshal(req.Tasks)
	item.Tasks = rawTasks
	if err := s.repo.Save(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapPlanner(item), nil
}

func mapPlanner(item *domain.StudyPlanner) *dto.Planner {
	var tasks []string
	_ = json.Unmarshal(item.Tasks, &tasks)
	return &dto.Planner{FocusArea: item.FocusArea, WeeklyTarget: item.WeeklyTarget, Tasks: tasks}
}
