package impl

import (
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type PracticeRepository struct {
	db *gorm.DB
}

func NewPracticeRepository(db *gorm.DB) *PracticeRepository {
	return &PracticeRepository{db: db}
}

func (r *PracticeRepository) CreateSession(session *domain.PracticeSession) error {
	return r.db.Create(session).Error
}

func (r *PracticeRepository) FindSessionByIDForUser(id, userID uuid.UUID) (*domain.PracticeSession, error) {
	var item domain.PracticeSession
	if err := r.db.Where("id = ? and user_id = ?", id, userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *PracticeRepository) SaveSession(session *domain.PracticeSession) error {
	return r.db.Save(session).Error
}

func (r *PracticeRepository) CreatePronunciationHistory(item *domain.PronunciationHistory) error {
	return r.db.Create(item).Error
}

func (r *PracticeRepository) ListPronunciationHistory(userID uuid.UUID, filter repository.PronunciationHistoryFilter) ([]domain.PronunciationHistory, int64, error) {
	var items []domain.PronunciationHistory
	var total int64
	q := r.db.Model(&domain.PronunciationHistory{}).Where("user_id = ?", userID)
	if filter.Kind != "" {
		q = q.Where("kind = ?", filter.Kind)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *PracticeRepository) CreateDictionaryHistory(item *domain.DictionaryHistory) error {
	return r.db.Create(item).Error
}

func (r *PracticeRepository) FindLatestDictionaryHistoryByWord(userID uuid.UUID, word string) (*domain.DictionaryHistory, error) {
	var item domain.DictionaryHistory
	if err := r.db.Where("user_id = ? and lower(word) = ?", userID, strings.ToLower(word)).
		Order("created_at desc").
		First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *PracticeRepository) ListDictionaryHistory(userID uuid.UUID, filter repository.DictionaryHistoryFilter) ([]domain.DictionaryHistory, int64, error) {
	var items []domain.DictionaryHistory
	var total int64
	q := r.db.Model(&domain.DictionaryHistory{}).Where("user_id = ?", userID)
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(word) like ? or lower(meaning) like ? or lower(example) like ?", like, like, like)
	}
	if filter.Saved != nil {
		q = q.Where("saved = ?", *filter.Saved)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *PracticeRepository) CreateVocabularySet(item *domain.VocabularySet) error {
	return r.db.Create(item).Error
}

func (r *PracticeRepository) FindVocabularySetByIDForUser(id, userID uuid.UUID) (*domain.VocabularySet, error) {
	var item domain.VocabularySet
	if err := r.db.Where("id = ? and user_id = ?", id, userID).First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *PracticeRepository) ListVocabularySets(userID uuid.UUID, filter repository.VocabularySetFilter) ([]domain.VocabularySet, int64, error) {
	var items []domain.VocabularySet
	var total int64
	q := r.db.Model(&domain.VocabularySet{}).Where("user_id = ?", userID)
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(name) like ? or lower(description) like ?", like, like)
	}
	if filter.Domain != "" {
		q = q.Where("domain = ?", filter.Domain)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := q.Order("created_at desc").Scopes(database.Paginate(filter.Page, filter.PageSize)).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *PracticeRepository) AddWordToSet(item *domain.VocabularySetWord) error {
	return r.db.Where("set_id = ? and word_id = ?", item.SetID, item.WordID).FirstOrCreate(item).Error
}

func (r *PracticeRepository) ListVocabularySetWords(setID uuid.UUID) ([]domain.VocabularyWord, error) {
	var items []domain.VocabularyWord
	err := r.db.Table("vocabulary_words vw").
		Select("vw.*").
		Joins("join vocabulary_set_words vsw on vsw.word_id = vw.id").
		Where("vsw.set_id = ?", setID).
		Order("vw.word asc").
		Scan(&items).Error
	return items, err
}
