package impl

import (
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
)

type SpeakingExtrasService struct {
	repo repository.SpeakingRepository
	llm  ai.LLMService
}

func NewSpeakingExtrasService(repo repository.SpeakingRepository, llm ai.LLMService) *SpeakingExtrasService {
	return &SpeakingExtrasService{repo: repo, llm: llm}
}

func (s *SpeakingExtrasService) StartSession(userID uuid.UUID) (*dto.SpeakingSession, error) {
	session := &model.SpeakingSession{
		UserID:     userID,
		TenantID:   uuid.Nil,
		Status:     "started",
		PromptText: "Academy English speaking practice",
		StartedAt:  time.Now().UTC(),
	}
	if err := s.repo.CreateSession(session); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSpeakingSession(session), nil
}

func (s *SpeakingExtrasService) StopSession(userID uuid.UUID) (*dto.SpeakingSession, error) {
	session, err := s.repo.FindLatestActiveSessionByUser(userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("speaking session", "active")
		}
		return nil, apperr.Internal(err)
	}
	transcript := session.Transcript
	if transcript == "" {
		transcript = "This is my academy english speaking practice response."
	}
	eval, err := s.llm.EvaluateSpeaking(transcript)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	now := time.Now().UTC()
	session.Status = "stopped"
	session.Transcript = transcript
	session.Feedback = eval.Feedback
	session.Accuracy = &eval.Score
	session.StoppedAt = &now
	if err := s.repo.UpdateSession(session); err != nil {
		return nil, apperr.Internal(err)
	}
	return mapSpeakingSession(session), nil
}

func (s *SpeakingExtrasService) GetSession(userID uuid.UUID, id string) (*dto.SpeakingSession, error) {
	sessionID, err := uuid.Parse(id)
	if err != nil {
		return nil, apperr.BadRequest("invalid session id")
	}
	item, err := s.repo.FindSessionByIDForUser(sessionID, userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("speaking session", id)
		}
		return nil, apperr.Internal(err)
	}
	return mapSpeakingSession(item), nil
}

func (s *SpeakingExtrasService) CheckPronunciation(req dto.PronunciationRequest) (*dto.PronunciationResult, error) {
	eval, err := s.llm.EvaluateSpeaking(req.Text)
	if err != nil {
		return nil, apperr.Internal(err)
	}
	return &dto.PronunciationResult{Accuracy: eval.Score, Feedback: eval.Feedback}, nil
}

func mapSpeakingSession(item *model.SpeakingSession) *dto.SpeakingSession {
	res := &dto.SpeakingSession{
		ID:        item.ID.String(),
		Status:    item.Status,
		StartedAt: item.StartedAt.Format(time.RFC3339),
	}
	if item.StoppedAt != nil {
		res.StoppedAt = item.StoppedAt.Format(time.RFC3339)
	}
	return res
}
