package impl

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type IELTSRepository struct {
	db *gorm.DB
}

func NewIELTSRepository(db *gorm.DB) *IELTSRepository {
	return &IELTSRepository{db: db}
}

func (r *IELTSRepository) ListContent(ctx context.Context, filter dto.IELTSContentFilter) ([]domain.IELTSContentItem, int64, error) {
	var items []domain.IELTSContentItem
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.IELTSContentItem{})
	query = applyIELTSContentFilter(query, filter)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	filter.PaginationQuery = filter.PaginationQuery.Normalize()
	offset := (filter.Page - 1) * filter.PageSize
	if err := query.Order("published_at DESC NULLS LAST, created_at DESC").
		Offset(offset).
		Limit(filter.PageSize).
		Find(&items).Error; err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

func (r *IELTSRepository) GetContentBySlug(ctx context.Context, slug string) (*domain.IELTSContentItem, error) {
	var item domain.IELTSContentItem
	err := r.db.WithContext(ctx).
		Preload("Passages", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, passage_no ASC") }).
		Preload("Groups", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, question_from ASC") }).
		Preload("Groups.Questions", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, question_no ASC") }).
		Preload("Vocabulary", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, term ASC") }).
		Preload("RelatedPosts", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, id ASC") }).
		Preload("RelatedPosts.Post").
		First(&item, "slug = ?", slug).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("ielts content not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *IELTSRepository) GetContentByID(ctx context.Context, id uint) (*domain.IELTSContentItem, error) {
	var item domain.IELTSContentItem
	err := r.db.WithContext(ctx).
		Preload("Passages", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, passage_no ASC") }).
		Preload("Groups", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, question_from ASC") }).
		Preload("Groups.Questions", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, question_no ASC") }).
		Preload("Vocabulary", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, term ASC") }).
		Preload("RelatedPosts", func(db *gorm.DB) *gorm.DB { return db.Order("sort_order ASC, id ASC") }).
		Preload("RelatedPosts.Post").
		First(&item, "id = ?", id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("ielts content not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *IELTSRepository) CreateContent(ctx context.Context, item *domain.IELTSContentItem) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *IELTSRepository) UpdateContent(ctx context.Context, item *domain.IELTSContentItem) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *IELTSRepository) DeleteContent(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.IELTSContentItem{}, "id = ?", id).Error
}

func (r *IELTSRepository) ImportBundle(ctx context.Context, content *domain.IELTSContentItem, passages []domain.IELTSPassage, groups []domain.IELTSQuestionGroup, questions []domain.IELTSQuestion, vocabulary []domain.IELTSVocabularyItem) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(content).Error; err != nil {
			return err
		}
		for i := range passages {
			passages[i].ContentItemID = content.ID
		}
		if len(passages) > 0 {
			if err := tx.Create(&passages).Error; err != nil {
				return err
			}
		}
		for i := range groups {
			groups[i].ContentItemID = content.ID
		}
		if len(groups) > 0 {
			if err := tx.Create(&groups).Error; err != nil {
				return err
			}
		}
		groupNoToID := map[uint]uint{}
		for _, group := range groups {
			groupNoToID[uint(group.GroupNo)] = group.ID
		}
		for i := range questions {
			questions[i].ContentItemID = content.ID
			if mappedID, ok := groupNoToID[questions[i].GroupID]; ok {
				questions[i].GroupID = mappedID
			}
		}
		if len(questions) > 0 {
			if err := tx.Create(&questions).Error; err != nil {
				return err
			}
		}
		for i := range vocabulary {
			vocabulary[i].ContentItemID = content.ID
		}
		if len(vocabulary) > 0 {
			if err := tx.Create(&vocabulary).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *IELTSRepository) CreatePassage(ctx context.Context, item *domain.IELTSPassage) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *IELTSRepository) UpdatePassage(ctx context.Context, item *domain.IELTSPassage) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *IELTSRepository) DeletePassage(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.IELTSPassage{}, "id = ?", id).Error
}

func (r *IELTSRepository) GetPassage(ctx context.Context, id uint) (*domain.IELTSPassage, error) {
	var item domain.IELTSPassage
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("ielts passage not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *IELTSRepository) CreateQuestionGroup(ctx context.Context, item *domain.IELTSQuestionGroup) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *IELTSRepository) UpdateQuestionGroup(ctx context.Context, item *domain.IELTSQuestionGroup) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *IELTSRepository) DeleteQuestionGroup(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.IELTSQuestionGroup{}, "id = ?", id).Error
}

func (r *IELTSRepository) GetQuestionGroup(ctx context.Context, id uint) (*domain.IELTSQuestionGroup, error) {
	var item domain.IELTSQuestionGroup
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("ielts question group not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *IELTSRepository) CreateQuestion(ctx context.Context, item *domain.IELTSQuestion) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *IELTSRepository) UpdateQuestion(ctx context.Context, item *domain.IELTSQuestion) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *IELTSRepository) DeleteQuestion(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.IELTSQuestion{}, "id = ?", id).Error
}

func (r *IELTSRepository) GetQuestion(ctx context.Context, id uint) (*domain.IELTSQuestion, error) {
	var item domain.IELTSQuestion
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("ielts question not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *IELTSRepository) CreateVocabulary(ctx context.Context, item *domain.IELTSVocabularyItem) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *IELTSRepository) UpdateVocabulary(ctx context.Context, item *domain.IELTSVocabularyItem) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *IELTSRepository) DeleteVocabulary(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.IELTSVocabularyItem{}, "id = ?", id).Error
}

func (r *IELTSRepository) GetVocabularyItem(ctx context.Context, id uint) (*domain.IELTSVocabularyItem, error) {
	var item domain.IELTSVocabularyItem
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("ielts vocabulary item not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *IELTSRepository) ListVocabulary(ctx context.Context, contentID uint) ([]domain.IELTSVocabularyItem, error) {
	var items []domain.IELTSVocabularyItem
	err := r.db.WithContext(ctx).
		Where("content_item_id = ?", contentID).
		Order("sort_order ASC, term ASC").
		Find(&items).Error
	return items, err
}

func (r *IELTSRepository) CreateRelatedPost(ctx context.Context, item *domain.IELTSRelatedPost) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *IELTSRepository) UpdateRelatedPost(ctx context.Context, item *domain.IELTSRelatedPost) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *IELTSRepository) DeleteRelatedPost(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.IELTSRelatedPost{}, "id = ?", id).Error
}

func (r *IELTSRepository) GetRelatedPost(ctx context.Context, id uint) (*domain.IELTSRelatedPost, error) {
	var item domain.IELTSRelatedPost
	if err := r.db.WithContext(ctx).First(&item, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("ielts related post not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *IELTSRepository) ListRelatedPosts(ctx context.Context, contentID uint) ([]domain.IELTSRelatedPost, error) {
	var items []domain.IELTSRelatedPost
	err := r.db.WithContext(ctx).
		Preload("Post").
		Where("content_item_id = ?", contentID).
		Order("sort_order ASC, id ASC").
		Find(&items).Error
	return items, err
}

func (r *IELTSRepository) ListAnswerQuestions(ctx context.Context, contentID uint) ([]domain.IELTSQuestion, error) {
	var items []domain.IELTSQuestion
	err := r.db.WithContext(ctx).
		Where("content_item_id = ?", contentID).
		Order("question_no ASC").
		Find(&items).Error
	return items, err
}

func (r *IELTSRepository) CreateAttempt(ctx context.Context, attempt *domain.IELTSPracticeAttempt) error {
	return r.db.WithContext(ctx).Create(attempt).Error
}

func (r *IELTSRepository) GetAttempt(ctx context.Context, id uint, userID uuid.UUID) (*domain.IELTSPracticeAttempt, error) {
	var attempt domain.IELTSPracticeAttempt
	err := r.db.WithContext(ctx).First(&attempt, "id = ? AND user_id = ?", id, userID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("ielts attempt not found")
		}
		return nil, err
	}
	return &attempt, nil
}

func (r *IELTSRepository) ListAttempts(ctx context.Context, userID uuid.UUID, filter dto.IELTSAttemptFilter) ([]domain.IELTSPracticeAttempt, int64, error) {
	var items []domain.IELTSPracticeAttempt
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.IELTSPracticeAttempt{}).Where("user_id = ?", userID)
	if filter.Status != "" {
		query = query.Where("ielts_practice_attempts.status = ?", filter.Status)
	}
	if filter.Skill != "" || filter.ContentType != "" {
		query = query.Joins("JOIN ielts_content_items ON ielts_content_items.id = ielts_practice_attempts.content_item_id")
		if filter.Skill != "" {
			query = query.Where("ielts_content_items.skill = ?", filter.Skill)
		}
		if filter.ContentType != "" {
			query = query.Where("ielts_content_items.content_type = ?", filter.ContentType)
		}
	}
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	filter.PaginationQuery = filter.PaginationQuery.Normalize()
	offset := (filter.Page - 1) * filter.PageSize
	if err := query.Preload("ContentItem").
		Order("ielts_practice_attempts.updated_at DESC").
		Offset(offset).
		Limit(filter.PageSize).
		Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *IELTSRepository) UpdateAttempt(ctx context.Context, attempt *domain.IELTSPracticeAttempt) error {
	return r.db.WithContext(ctx).Save(attempt).Error
}

func (r *IELTSRepository) CreateMockSession(ctx context.Context, session *domain.IELTSMockTestSession) error {
	return r.db.WithContext(ctx).Create(session).Error
}

func (r *IELTSRepository) GetMockSession(ctx context.Context, id uint, userID uuid.UUID) (*domain.IELTSMockTestSession, error) {
	var item domain.IELTSMockTestSession
	if err := r.db.WithContext(ctx).First(&item, "id = ? AND user_id = ?", id, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("ielts mock test session not found")
		}
		return nil, err
	}
	return &item, nil
}

func (r *IELTSRepository) UpdateMockSession(ctx context.Context, session *domain.IELTSMockTestSession) error {
	return r.db.WithContext(ctx).Save(session).Error
}

func (r *IELTSRepository) UpsertProgress(ctx context.Context, progress *domain.IELTSLearningProgress) error {
	return r.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns: []clause.Column{{Name: "user_id"}, {Name: "content_item_id"}},
			DoUpdates: clause.AssignmentColumns([]string{
				"status", "completed_questions", "total_questions", "last_question_no", "learned_at", "updated_at",
			}),
		}).
		Create(progress).Error
}

func (r *IELTSRepository) ListProgress(ctx context.Context, userID uuid.UUID, filter dto.IELTSProgressFilter) ([]domain.IELTSLearningProgress, int64, error) {
	var items []domain.IELTSLearningProgress
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.IELTSLearningProgress{}).Where("user_id = ?", userID)
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Skill != "" || filter.ContentType != "" {
		query = query.Joins("JOIN ielts_content_items ON ielts_content_items.id = ielts_learning_progress.content_item_id")
		if filter.Skill != "" {
			query = query.Where("ielts_content_items.skill = ?", filter.Skill)
		}
		if filter.ContentType != "" {
			query = query.Where("ielts_content_items.content_type = ?", filter.ContentType)
		}
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	filter.PaginationQuery = filter.PaginationQuery.Normalize()
	offset := (filter.Page - 1) * filter.PageSize
	if err := query.Order("updated_at DESC").Offset(offset).Limit(filter.PageSize).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *IELTSRepository) WriteWsAudit(ctx context.Context, audit *domain.WsAudit) error {
	return r.db.WithContext(ctx).Create(audit).Error
}

func (r *IELTSRepository) CreateMedia(ctx context.Context, media *domain.Media) error {
	return r.db.WithContext(ctx).Create(media).Error
}

func applyIELTSContentFilter(query *gorm.DB, filter dto.IELTSContentFilter) *gorm.DB {
	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		query = query.Where("title ILIKE ? OR subtitle ILIKE ? OR description ILIKE ?", like, like, like)
	}
	if filter.Module != "" {
		query = query.Where("module = ?", filter.Module)
	}
	if filter.Skill != "" {
		query = query.Where("skill = ?", filter.Skill)
	}
	if filter.ContentType != "" {
		query = query.Where("content_type = ?", filter.ContentType)
	}
	if filter.Part != "" {
		query = query.Where("part = ?", filter.Part)
	}
	if filter.TestKind != "" {
		query = query.Where("test_kind = ?", filter.TestKind)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Level != "" {
		query = query.Where("level = ?", filter.Level)
	}
	return query
}
