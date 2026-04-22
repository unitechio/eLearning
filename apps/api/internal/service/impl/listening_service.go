package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type ListeningService struct {
	repo repository.ListeningRepository
}

func NewListeningService(repo repository.ListeningRepository) *ListeningService {
	return &ListeningService{repo: repo}
}

func (s *ListeningService) ListLessons(query dto.ListeningLessonListQuery) (*dto.PageResult[dto.ListeningLesson], error) {
	query.PaginationQuery = query.PaginationQuery.Normalize()
	items, total, err := s.repo.ListLessons(repository.ListeningLessonListFilter{
		Pagination: repository.Pagination{Page: query.Page, PageSize: query.PageSize},
		Search:     query.Search,
		Domain:     "english",
	})
	if err != nil {
		return nil, apperr.Internal(err)
	}
	res := make([]dto.ListeningLesson, 0, len(items))
	for _, item := range items {
		res = append(res, dto.ListeningLesson{
			ID:          item.ID.String(),
			Title:       item.Title,
			Description: item.Description,
			AudioURL:    item.AudioURL,
		})
	}
	return &dto.PageResult[dto.ListeningLesson]{Items: res, Meta: buildMeta(query.PaginationQuery, total)}, nil
}

func (s *ListeningService) GetLesson(id string) (*dto.ListeningLesson, error) {
	lessonID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid listening lesson id")
	}
	item, err := s.repo.FindLessonByID(lessonID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("listening lesson", id)
		}
		return nil, apperr.Internal(err)
	}
	return &dto.ListeningLesson{ID: item.ID.String(), Title: item.Title, Description: item.Description, AudioURL: item.AudioURL}, nil
}

func (s *ListeningService) SubmitLesson(id string, req dto.ListeningSubmissionRequest) (map[string]any, error) {
	lessonID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid listening lesson id")
	}
	item, err := s.repo.FindLessonByID(lessonID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("listening lesson", id)
		}
		return nil, apperr.Internal(err)
	}
	score := 0
	if len(req.Answers) > 0 {
		score = 80 + len(req.Answers)%20
	}
	return map[string]any{
		"lesson_id":  item.ID.String(),
		"title":      item.Title,
		"score":      score,
		"answers":    req.Answers,
		"transcript": item.Transcript,
		"submitted":  true,
	}, nil
}
