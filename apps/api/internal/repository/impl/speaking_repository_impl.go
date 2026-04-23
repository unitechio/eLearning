package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"gorm.io/gorm"
)

type SpeakingRepository struct {
	db *gorm.DB
}

func NewSpeakingRepository(db *gorm.DB) *SpeakingRepository {
	return &SpeakingRepository{db: db}
}

func (r *SpeakingRepository) CreateSession(session *domain.SpeakingSession) error {
	return r.db.Create(session).Error
}

func (r *SpeakingRepository) FindSessionByIDForUser(id, userID uuid.UUID) (*domain.SpeakingSession, error) {
	var item domain.SpeakingSession
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *SpeakingRepository) FindLatestActiveSessionByUser(userID uuid.UUID) (*domain.SpeakingSession, error) {
	var item domain.SpeakingSession
	if err := r.db.Where("user_id = ? AND status = ?", userID, "started").Order("started_at desc").First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *SpeakingRepository) UpdateSession(session *domain.SpeakingSession) error {
	return r.db.Save(session).Error
}
