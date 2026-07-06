package usecase

import (
	"context"
	"mime/multipart"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

type IELTSUsecase interface {
	ListContent(ctx context.Context, filter dto.IELTSContentFilter) ([]domain.IELTSContentItem, int64, error)
	GetContent(ctx context.Context, slug string) (*domain.IELTSContentItem, error)
	GetContentByID(ctx context.Context, id uint) (*domain.IELTSContentItem, error)
	GetAnswerKey(ctx context.Context, slug string) ([]domain.IELTSQuestion, error)
	GetVocabulary(ctx context.Context, slug string) ([]domain.IELTSVocabularyItem, error)
	StartAttempt(ctx context.Context, userID uuid.UUID, slug string, req dto.IELTSStartAttemptRequest, audit dto.IeltsAuditContext) (*domain.IELTSPracticeAttempt, error)
	SubmitAttempt(ctx context.Context, userID uuid.UUID, attemptID uint, req dto.IELTSSubmitAttemptRequest, audit dto.IeltsAuditContext) (*dto.IELTSAttemptResult, error)
	ListProgress(ctx context.Context, userID uuid.UUID, filter dto.IELTSProgressFilter) ([]domain.IELTSLearningProgress, int64, error)
	CreateContent(ctx context.Context, req dto.IELTSContentRequest, audit dto.IeltsAuditContext) (*domain.IELTSContentItem, error)
	UpdateContent(ctx context.Context, id uint, req dto.IELTSContentRequest, audit dto.IeltsAuditContext) (*domain.IELTSContentItem, error)
	DeleteContent(ctx context.Context, id uint, audit dto.IeltsAuditContext) error
	ImportContent(ctx context.Context, file *multipart.FileHeader, audit dto.IeltsAuditContext) (*dto.IELTSImportResult, error)
	ImportPDF(ctx context.Context, file *multipart.FileHeader, audit dto.IeltsAuditContext) (*dto.IELTSPDFImportResult, error)
	UpdateReview(ctx context.Context, userID uuid.UUID, id uint, req dto.IELTSReviewRequest, audit dto.IeltsAuditContext) (*domain.IELTSContentItem, error)
	CreatePassage(ctx context.Context, contentID uint, req dto.IELTSPassageRequest, audit dto.IeltsAuditContext) (*domain.IELTSPassage, error)
	UpdatePassage(ctx context.Context, id uint, req dto.IELTSPassageRequest, audit dto.IeltsAuditContext) (*domain.IELTSPassage, error)
	DeletePassage(ctx context.Context, id uint, audit dto.IeltsAuditContext) error
	CreateQuestionGroup(ctx context.Context, contentID uint, req dto.IELTSQuestionGroupRequest, audit dto.IeltsAuditContext) (*domain.IELTSQuestionGroup, error)
	UpdateQuestionGroup(ctx context.Context, id uint, req dto.IELTSQuestionGroupRequest, audit dto.IeltsAuditContext) (*domain.IELTSQuestionGroup, error)
	DeleteQuestionGroup(ctx context.Context, id uint, audit dto.IeltsAuditContext) error
	CreateQuestion(ctx context.Context, contentID uint, req dto.IELTSQuestionRequest, audit dto.IeltsAuditContext) (*domain.IELTSQuestion, error)
	UpdateQuestion(ctx context.Context, id uint, req dto.IELTSQuestionRequest, audit dto.IeltsAuditContext) (*domain.IELTSQuestion, error)
	DeleteQuestion(ctx context.Context, id uint, audit dto.IeltsAuditContext) error
	CreateVocabulary(ctx context.Context, contentID uint, req dto.IELTSVocabularyRequest, audit dto.IeltsAuditContext) (*domain.IELTSVocabularyItem, error)
	UpdateVocabulary(ctx context.Context, id uint, req dto.IELTSVocabularyRequest, audit dto.IeltsAuditContext) (*domain.IELTSVocabularyItem, error)
	DeleteVocabulary(ctx context.Context, id uint, audit dto.IeltsAuditContext) error
	CreateRelatedPost(ctx context.Context, contentID uint, req dto.IELTSRelatedPostRequest, audit dto.IeltsAuditContext) (*domain.IELTSRelatedPost, error)
	UpdateRelatedPost(ctx context.Context, id uint, req dto.IELTSRelatedPostRequest, audit dto.IeltsAuditContext) (*domain.IELTSRelatedPost, error)
	DeleteRelatedPost(ctx context.Context, id uint, audit dto.IeltsAuditContext) error
	ListAttempts(ctx context.Context, userID uuid.UUID, filter dto.IELTSAttemptFilter) ([]domain.IELTSPracticeAttempt, int64, error)
	UploadAsset(ctx context.Context, userID uuid.UUID, contentID uint, kind string, file *multipart.FileHeader, audit dto.IeltsAuditContext) (*dto.IELTSAssetUploadResponse, error)
	UpdateProgress(ctx context.Context, userID uuid.UUID, contentID uint, req dto.IELTSProgressUpdateRequest, audit dto.IeltsAuditContext) (*domain.IELTSLearningProgress, error)
	StartMockTest(ctx context.Context, userID uuid.UUID, req dto.IELTSMockStartRequest, audit dto.IeltsAuditContext) (*domain.IELTSMockTestSession, error)
	SubmitMockTest(ctx context.Context, userID uuid.UUID, sessionID uint, audit dto.IeltsAuditContext) (*domain.IELTSMockTestSession, error)
}
