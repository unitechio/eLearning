package impl

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"gorm.io/gorm"
)

type SpeakingRepository struct {
	db *gorm.DB
}

func NewSpeakingRepository(db *gorm.DB) *SpeakingRepository {
	return &SpeakingRepository{db: db}
}

func (r *SpeakingRepository) CreateSession(session *model.SpeakingSession) error {
	return r.db.Create(session).Error
}

func (r *SpeakingRepository) FindSessionByIDForUser(id, userID uuid.UUID) (*model.SpeakingSession, error) {
	var item model.SpeakingSession
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *SpeakingRepository) FindLatestActiveSessionByUser(userID uuid.UUID) (*model.SpeakingSession, error) {
	var item model.SpeakingSession
	if err := r.db.Where("user_id = ? AND status = ?", userID, "started").Order("started_at desc").First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *SpeakingRepository) UpdateSession(session *model.SpeakingSession) error {
	return r.db.Save(session).Error
}
