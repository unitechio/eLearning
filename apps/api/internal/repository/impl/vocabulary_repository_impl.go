package impl

import (
	"context"
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

func (r *VocabularyRepository) FindDueProgressByUser(ctx context.Context, userID uuid.UUID, limit int) ([]domain.UserVocabularyProgress, error) {
	var items []domain.UserVocabularyProgress
	err := r.db.WithContext(ctx).Preload("Word").
		Where("user_id = ? AND next_review_date <= ?", userID, time.Now()).
		Order("next_review_date ASC").
		Limit(limit).
		Find(&items).Error
	return items, err
}

func (r *VocabularyRepository) FindProgressByUserAndWord(ctx context.Context, userID, wordID uuid.UUID) (*domain.UserVocabularyProgress, error) {
	var progress domain.UserVocabularyProgress
	if err := r.db.WithContext(ctx).Preload("Word").
		Where("user_id = ? AND word_id = ?", userID, wordID).
		First(&progress).Error; err != nil {
		return nil, err
	}
	return &progress, nil
}

func (r *VocabularyRepository) ListWords(ctx context.Context) ([]domain.VocabularyWord, error) {
	var words []domain.VocabularyWord
	if err := r.db.WithContext(ctx).Order("word ASC").Find(&words).Error; err != nil {
		return nil, err
	}
	return words, nil
}

func (r *VocabularyRepository) FindWordByID(ctx context.Context, id uuid.UUID) (*domain.VocabularyWord, error) {
	var word domain.VocabularyWord
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&word).Error; err != nil {
		return nil, err
	}
	return &word, nil
}

func (r *VocabularyRepository) CreateWord(ctx context.Context, word *domain.VocabularyWord) error {
	return r.db.WithContext(ctx).Create(word).Error
}

func (r *VocabularyRepository) UpdateWord(ctx context.Context, word *domain.VocabularyWord) error {
	return r.db.WithContext(ctx).Save(word).Error
}

func (r *VocabularyRepository) DeleteWord(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.VocabularyWord{}, "id = ?", id).Error
}

func (r *VocabularyRepository) ListProgressHistoryByUser(ctx context.Context, userID uuid.UUID, limit int) ([]domain.UserVocabularyProgress, error) {
	var items []domain.UserVocabularyProgress
	err := r.db.WithContext(ctx).Preload("Word").
		Where("user_id = ? AND last_review_date IS NOT NULL", userID).
		Order("last_review_date desc").
		Limit(limit).
		Find(&items).Error
	return items, err
}

func (r *VocabularyRepository) SaveProgress(ctx context.Context, progress *domain.UserVocabularyProgress) error {
	return r.db.WithContext(ctx).Save(progress).Error
}
