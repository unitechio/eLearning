package impl

import (
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"gorm.io/gorm"
)

type VocabularyRepository struct {
	db *gorm.DB
}

func NewVocabularyRepository(db *gorm.DB) *VocabularyRepository {
	return &VocabularyRepository{db: db}
}

func (r *VocabularyRepository) FindDueProgressByUser(userID uuid.UUID, limit int) ([]domain.UserVocabularyProgress, error) {
	var items []domain.UserVocabularyProgress
	err := r.db.Preload("Word").
		Where("user_id = ? AND next_review_date <= ?", userID, time.Now()).
		Order("next_review_date ASC").
		Limit(limit).
		Find(&items).Error
	return items, err
}

func (r *VocabularyRepository) FindProgressByUserAndWord(userID, wordID uuid.UUID) (*domain.UserVocabularyProgress, error) {
	var progress domain.UserVocabularyProgress
	if err := r.db.Preload("Word").
		Where("user_id = ? AND word_id = ?", userID, wordID).
		First(&progress).Error; err != nil {
		return nil, err
	}
	return &progress, nil
}

func (r *VocabularyRepository) ListWords() ([]domain.VocabularyWord, error) {
	var words []domain.VocabularyWord
	if err := r.db.Order("word ASC").Find(&words).Error; err != nil {
		return nil, err
	}
	return words, nil
}

func (r *VocabularyRepository) FindWordByID(id uuid.UUID) (*domain.VocabularyWord, error) {
	var word domain.VocabularyWord
	if err := r.db.Where("id = ?", id).First(&word).Error; err != nil {
		return nil, err
	}
	return &word, nil
}

func (r *VocabularyRepository) CreateWord(word *domain.VocabularyWord) error {
	return r.db.Create(word).Error
}

func (r *VocabularyRepository) UpdateWord(word *domain.VocabularyWord) error {
	return r.db.Save(word).Error
}

func (r *VocabularyRepository) DeleteWord(id uuid.UUID) error {
	return r.db.Delete(&domain.VocabularyWord{}, "id = ?", id).Error
}

func (r *VocabularyRepository) ListProgressHistoryByUser(userID uuid.UUID, limit int) ([]domain.UserVocabularyProgress, error) {
	var items []domain.UserVocabularyProgress
	err := r.db.Preload("Word").
		Where("user_id = ? AND last_review_date IS NOT NULL", userID).
		Order("last_review_date desc").
		Limit(limit).
		Find(&items).Error
	return items, err
}

func (r *VocabularyRepository) SaveProgress(progress *domain.UserVocabularyProgress) error {
	return r.db.Save(progress).Error
}
