package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type IELTSRepository interface {
	ListContent(ctx context.Context, filter dto.IELTSContentFilter) ([]domain.IELTSContentItem, int64, error)
	GetContentBySlug(ctx context.Context, slug string) (*domain.IELTSContentItem, error)
	GetContentByID(ctx context.Context, id uint) (*domain.IELTSContentItem, error)
	CreateContent(ctx context.Context, item *domain.IELTSContentItem) error
	UpdateContent(ctx context.Context, item *domain.IELTSContentItem) error
	DeleteContent(ctx context.Context, id uint) error
	ImportBundle(ctx context.Context, content *domain.IELTSContentItem, passages []domain.IELTSPassage, groups []domain.IELTSQuestionGroup, questions []domain.IELTSQuestion, vocabulary []domain.IELTSVocabularyItem) error
	CreatePassage(ctx context.Context, item *domain.IELTSPassage) error
	UpdatePassage(ctx context.Context, item *domain.IELTSPassage) error
	DeletePassage(ctx context.Context, id uint) error
	GetPassage(ctx context.Context, id uint) (*domain.IELTSPassage, error)
	CreateQuestionGroup(ctx context.Context, item *domain.IELTSQuestionGroup) error
	UpdateQuestionGroup(ctx context.Context, item *domain.IELTSQuestionGroup) error
	DeleteQuestionGroup(ctx context.Context, id uint) error
	GetQuestionGroup(ctx context.Context, id uint) (*domain.IELTSQuestionGroup, error)
	CreateQuestion(ctx context.Context, item *domain.IELTSQuestion) error
	UpdateQuestion(ctx context.Context, item *domain.IELTSQuestion) error
	DeleteQuestion(ctx context.Context, id uint) error
	GetQuestion(ctx context.Context, id uint) (*domain.IELTSQuestion, error)
	CreateVocabulary(ctx context.Context, item *domain.IELTSVocabularyItem) error
	UpdateVocabulary(ctx context.Context, item *domain.IELTSVocabularyItem) error
	DeleteVocabulary(ctx context.Context, id uint) error
	GetVocabularyItem(ctx context.Context, id uint) (*domain.IELTSVocabularyItem, error)
	ListVocabulary(ctx context.Context, contentID uint) ([]domain.IELTSVocabularyItem, error)
	CreateRelatedPost(ctx context.Context, item *domain.IELTSRelatedPost) error
	UpdateRelatedPost(ctx context.Context, item *domain.IELTSRelatedPost) error
	DeleteRelatedPost(ctx context.Context, id uint) error
	GetRelatedPost(ctx context.Context, id uint) (*domain.IELTSRelatedPost, error)
	ListRelatedPosts(ctx context.Context, contentID uint) ([]domain.IELTSRelatedPost, error)
	ListAnswerQuestions(ctx context.Context, contentID uint) ([]domain.IELTSQuestion, error)
	CreateAttempt(ctx context.Context, attempt *domain.IELTSPracticeAttempt) error
	GetAttempt(ctx context.Context, id uint, userID uuid.UUID) (*domain.IELTSPracticeAttempt, error)
	ListAttempts(ctx context.Context, userID uuid.UUID, filter dto.IELTSAttemptFilter) ([]domain.IELTSPracticeAttempt, int64, error)
	UpdateAttempt(ctx context.Context, attempt *domain.IELTSPracticeAttempt) error
	CreateMockSession(ctx context.Context, session *domain.IELTSMockTestSession) error
	GetMockSession(ctx context.Context, id uint, userID uuid.UUID) (*domain.IELTSMockTestSession, error)
	UpdateMockSession(ctx context.Context, session *domain.IELTSMockTestSession) error
	UpsertProgress(ctx context.Context, progress *domain.IELTSLearningProgress) error
	ListProgress(ctx context.Context, userID uuid.UUID, filter dto.IELTSProgressFilter) ([]domain.IELTSLearningProgress, int64, error)
	WriteWsAudit(ctx context.Context, audit *domain.WsAudit) error
	CreateMedia(ctx context.Context, media *domain.Media) error
}
