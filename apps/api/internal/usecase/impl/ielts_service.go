package impl

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	storage "github.com/unitechio/eLearning/apps/api/internal/infrastructure/filestorage"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/utils/constants"
	"gorm.io/datatypes"
)

// IELTSServiceDeps groups the optional and required dependencies for IELTSService.
// Using a deps struct makes it impossible to accidentally call the wrong constructor
// variant and makes it obvious which fields are optional.
type IELTSServiceDeps struct {
	Repo         repository.IELTSRepository // required
	Cache        *redis.Client              // optional — set to nil to disable caching
	AssetStorage *storage.MinioStorage      // optional — set to nil to disable asset uploads
}

type IELTSService struct {
	repo         repository.IELTSRepository
	cache        *redis.Client
	assetStorage *storage.MinioStorage
}

// NewIELTSService constructs an IELTSService from its dependencies.
// Cache and AssetStorage are optional; set to nil to disable those features.
func NewIELTSService(deps IELTSServiceDeps) *IELTSService {
	return &IELTSService{
		repo:         deps.Repo,
		cache:        deps.Cache,
		assetStorage: deps.AssetStorage,
	}
}

func (s *IELTSService) ListContent(ctx context.Context, filter dto.IELTSContentFilter) ([]domain.IELTSContentItem, int64, error) {
	cacheKey := "ielts:content:list:" + string(marshalJSON(filter, "{}"))
	var cached struct {
		Items []domain.IELTSContentItem `json:"items"`
		Total int64                     `json:"total"`
	}
	if s.getCache(ctx, cacheKey, &cached) {
		return cached.Items, cached.Total, nil
	}
	items, total, err := s.repo.ListContent(ctx, filter)
	if err == nil {
		s.setCache(ctx, cacheKey, struct {
			Items []domain.IELTSContentItem `json:"items"`
			Total int64                     `json:"total"`
		}{Items: items, Total: total}, 2*time.Minute)
	}
	return items, total, err
}

func (s *IELTSService) GetContent(ctx context.Context, slug string) (*domain.IELTSContentItem, error) {
	cacheKey := "ielts:content:detail:" + slug
	var cached domain.IELTSContentItem
	if s.getCache(ctx, cacheKey, &cached) {
		return &cached, nil
	}
	item, err := s.repo.GetContentBySlug(ctx, slug)
	if err == nil {
		s.setCache(ctx, cacheKey, item, 5*time.Minute)
	}
	return item, err
}

func (s *IELTSService) GetContentByID(ctx context.Context, id uint) (*domain.IELTSContentItem, error) {
	cacheKey := "ielts:content:detail:id:" + strconv.FormatUint(uint64(id), 10)
	var cached domain.IELTSContentItem
	if s.getCache(ctx, cacheKey, &cached) {
		return &cached, nil
	}
	item, err := s.repo.GetContentByID(ctx, id)
	if err == nil {
		s.setCache(ctx, cacheKey, item, 5*time.Minute)
	}
	return item, err
}

func (s *IELTSService) GetAnswerKey(ctx context.Context, slug string) ([]domain.IELTSQuestion, error) {
	cacheKey := "ielts:content:answers:" + slug
	var cached []domain.IELTSQuestion
	if s.getCache(ctx, cacheKey, &cached) {
		return cached, nil
	}
	item, err := s.repo.GetContentBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	items, err := s.repo.ListAnswerQuestions(ctx, item.ID)
	if err == nil {
		s.setCache(ctx, cacheKey, items, 5*time.Minute)
	}
	return items, err
}

func (s *IELTSService) GetVocabulary(ctx context.Context, slug string) ([]domain.IELTSVocabularyItem, error) {
	cacheKey := "ielts:content:vocab:" + slug
	var cached []domain.IELTSVocabularyItem
	if s.getCache(ctx, cacheKey, &cached) {
		return cached, nil
	}
	item, err := s.repo.GetContentBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	items, err := s.repo.ListVocabulary(ctx, item.ID)
	if err == nil {
		s.setCache(ctx, cacheKey, items, 5*time.Minute)
	}
	return items, err
}

func (s *IELTSService) StartAttempt(ctx context.Context, userID uuid.UUID, slug string, req dto.IELTSStartAttemptRequest, audit dto.IeltsAuditContext) (*domain.IELTSPracticeAttempt, error) {
	start := time.Now()
	item, err := s.repo.GetContentBySlug(ctx, slug)
	if err != nil {
		s.writeAudit(ctx, audit, 1001, constants.WsAuditStatusFailed, req, map[string]string{"error": err.Error()}, start)
		return nil, err
	}
	mode := req.Mode
	if mode == "" {
		mode = item.ContentType
	}
	limit := req.TimeLimitSeconds
	if limit <= 0 {
		limit = item.DurationSeconds
	}
	attempt := &domain.IELTSPracticeAttempt{
		UserID:           userID,
		ContentItemID:    item.ID,
		Mode:             mode,
		Status:           constants.IELTSAttemptStarted,
		StartedAt:        start,
		TimeLimitSeconds: limit,
		TotalQuestions:   item.QuestionCount,
		Stats:            jsonOrDefault(req.Metadata, "{}"),
	}
	if err := s.repo.CreateAttempt(ctx, attempt); err != nil {
		s.writeAudit(ctx, audit, 1001, constants.WsAuditStatusFailed, req, map[string]string{"error": err.Error()}, start)
		return nil, err
	}
	s.writeAudit(ctx, audit, domain.AuditCodeStartAttempt, constants.WsAuditStatusSuccess, req, attempt, start)
	return attempt, nil
}

func (s *IELTSService) SubmitAttempt(ctx context.Context, userID uuid.UUID, attemptID uint, req dto.IELTSSubmitAttemptRequest, audit dto.IeltsAuditContext) (*dto.IELTSAttemptResult, error) {
	start := time.Now()
	attempt, err := s.repo.GetAttempt(ctx, attemptID, userID)
	if err != nil {
		s.writeAudit(ctx, audit, 1002, constants.WsAuditStatusFailed, req, map[string]string{"error": err.Error()}, start)
		return nil, err
	}
	questions, err := s.repo.ListAnswerQuestions(ctx, attempt.ContentItemID)
	if err != nil {
		s.writeAudit(ctx, audit, domain.AuditCodeSubmitAttempt, constants.WsAuditStatusFailed, req, map[string]string{"error": err.Error()}, start)
		return nil, err
	}
	result := scoreAnswers(req.Answers, questions)
	content, _ := s.repo.GetContentByID(ctx, attempt.ContentItemID)
	if content != nil {
		if content.Skill == constants.IELTSSkillWriting || content.Skill == constants.IELTSSkillSpeaking {
			result.BandScore = ieltsProductiveBand(content.Skill, req.ManualScore, req.CriteriaScores)
		} else {
			result.BandScore = ieltsBandFromRaw(content.Skill, result.CorrectCount, result.TotalQuestions)
		}
		result.Score = result.BandScore
	}
	now := time.Now()
	attempt.Status = constants.IELTSAttemptSubmitted
	attempt.SubmittedAt = &now
	attempt.ElapsedSeconds = req.ElapsedSeconds
	attempt.TotalQuestions = result.TotalQuestions
	attempt.CorrectCount = result.CorrectCount
	attempt.WrongCount = result.WrongCount
	attempt.SkippedCount = result.SkippedCount
	attempt.Score = result.Score
	attempt.Answers = jsonOrDefault(req.Answers, "{}")
	attempt.Stats = mergeAttemptStats(result.Stats, req.CriteriaScores, req.ManualScore)
	if err := s.repo.UpdateAttempt(ctx, attempt); err != nil {
		s.writeAudit(ctx, audit, domain.AuditCodeSubmitAttempt, constants.WsAuditStatusFailed, req, map[string]string{"error": err.Error()}, start)
		return nil, err
	}
	result.ID = attempt.ID
	progress := &domain.IELTSLearningProgress{
		UserID:             userID,
		ContentItemID:      attempt.ContentItemID,
		Status:             "completed",
		CompletedQuestions: result.CorrectCount + result.WrongCount,
		TotalQuestions:     result.TotalQuestions,
		LastQuestionNo:     lastQuestionNo(questions),
		LearnedAt:          &now,
	}
	_ = s.repo.UpsertProgress(ctx, progress)
	s.writeAudit(ctx, audit, domain.AuditCodeSubmitAttempt, constants.WsAuditStatusSuccess, req, result, start)
	return result, nil
}

func (s *IELTSService) ListProgress(ctx context.Context, userID uuid.UUID, filter dto.IELTSProgressFilter) ([]domain.IELTSLearningProgress, int64, error) {
	return s.repo.ListProgress(ctx, userID, filter)
}

func (s *IELTSService) CreateContent(ctx context.Context, req dto.IELTSContentRequest, audit dto.IeltsAuditContext) (*domain.IELTSContentItem, error) {
	start := time.Now()
	item := contentFromRequest(req)
	if err := s.repo.CreateContent(ctx, item); err != nil {
		s.writeAudit(ctx, audit, domain.AuditCodeCreateContent, constants.WsAuditStatusFailed, req, map[string]string{"error": err.Error()}, start)
		return nil, err
	}
	s.writeAudit(ctx, audit, domain.AuditCodeCreateContent, constants.WsAuditStatusSuccess, req, item, start)
	s.invalidateContentCache(ctx)
	return item, nil
}

func (s *IELTSService) UpdateContent(ctx context.Context, id uint, req dto.IELTSContentRequest, audit dto.IeltsAuditContext) (*domain.IELTSContentItem, error) {
	start := time.Now()
	item, err := s.repo.GetContentByID(ctx, id)
	if err != nil {
		s.writeAudit(ctx, audit, 1102, constants.WsAuditStatusFailed, req, map[string]string{"error": err.Error()}, start)
		return nil, err
	}
	updated := contentFromRequest(req)
	updated.ID = item.ID
	updated.CreatedAt = item.CreatedAt
	if err := s.repo.UpdateContent(ctx, updated); err != nil {
		s.writeAudit(ctx, audit, domain.AuditCodeUpdateContent, constants.WsAuditStatusFailed, req, map[string]string{"error": err.Error()}, start)
		return nil, err
	}
	s.writeAudit(ctx, audit, domain.AuditCodeUpdateContent, constants.WsAuditStatusSuccess, req, updated, start)
	s.invalidateContentCache(ctx)
	return updated, nil
}

func (s *IELTSService) DeleteContent(ctx context.Context, id uint, audit dto.IeltsAuditContext) error {
	start := time.Now()
	err := s.repo.DeleteContent(ctx, id)
	if err != nil {
		s.auditMutation(ctx, audit, domain.AuditCodeDeleteContent, map[string]uint{"id": id}, map[string]string{"error": err.Error()}, err, start)
		return err
	}
	s.auditMutation(ctx, audit, domain.AuditCodeDeleteContent, map[string]uint{"id": id}, map[string]bool{"deleted": true}, nil, start)
	s.invalidateContentCache(ctx)
	return nil
}

func (s *IELTSService) ImportContent(ctx context.Context, file *multipart.FileHeader, audit dto.IeltsAuditContext) (*dto.IELTSImportResult, error) {
	start := time.Now()
	bundle, err := parseIELTSImportFile(file)
	if err != nil {
		s.auditMutation(ctx, audit, domain.AuditCodeImportContent, map[string]string{"filename": file.Filename}, nil, err, start)
		return nil, err
	}
	content := contentFromRequest(bundle.Content)
	passages := make([]domain.IELTSPassage, 0, len(bundle.Passages))
	for _, item := range bundle.Passages {
		passages = append(passages, domain.IELTSPassage{PassageNo: item.PassageNo, Title: item.Title, Body: item.Body, SortOrder: item.SortOrder})
	}
	groups := make([]domain.IELTSQuestionGroup, 0, len(bundle.Groups))
	for _, item := range bundle.Groups {
		groups = append(groups, *questionGroupFromRequest(0, item))
	}
	questions := make([]domain.IELTSQuestion, 0, len(bundle.Questions))
	for _, item := range bundle.Questions {
		questions = append(questions, *questionFromRequest(0, item))
	}
	vocabulary := make([]domain.IELTSVocabularyItem, 0, len(bundle.Vocabulary))
	for _, item := range bundle.Vocabulary {
		vocabulary = append(vocabulary, *vocabularyFromRequest(0, item))
	}
	if err := s.repo.ImportBundle(ctx, content, passages, groups, questions, vocabulary); err != nil {
		s.auditMutation(ctx, audit, domain.AuditCodeImportContent, bundle.Content, nil, err, start)
		return nil, err
	}
	res := &dto.IELTSImportResult{ContentID: content.ID, PassageCount: len(passages), GroupCount: len(groups), QuestionCount: len(questions), VocabularyCount: len(vocabulary)}
	s.invalidateContentCache(ctx)
	s.auditMutation(ctx, audit, domain.AuditCodeImportContent, bundle.Content, res, nil, start)
	return res, nil
}

func (s *IELTSService) ImportPDF(ctx context.Context, file *multipart.FileHeader, audit dto.IeltsAuditContext) (*dto.IELTSPDFImportResult, error) {
	start := time.Now()
	result, err := parseIELTSPDFFile(file)
	s.auditMutation(ctx, audit, domain.AuditCodeImportContentPDF, map[string]string{"filename": file.Filename}, result, err, start)
	return result, err
}

func (s *IELTSService) UpdateReview(ctx context.Context, userID uuid.UUID, id uint, req dto.IELTSReviewRequest, audit dto.IeltsAuditContext) (*domain.IELTSContentItem, error) {
	start := time.Now()
	item, err := s.repo.GetContentByID(ctx, id)
	if err == nil {
		now := time.Now()
		item.ReviewStatus = req.Action
		item.ReviewNote = req.Note
		item.ReviewedBy = &userID
		item.ReviewedAt = &now
		switch req.Action {
		case "approved", "published":
			item.Status = constants.IELTSStatusPublished
			item.PublishedAt = &now
		case "rejected":
			item.Status = constants.IELTSStatusDraft
		case "archived":
			item.Status = constants.IELTSStatusArchived
		}
		err = s.repo.UpdateContent(ctx, item)
	}
	s.invalidateContentCache(ctx)
	s.auditMutation(ctx, audit, domain.AuditCodeReviewContent, req, item, err, start)
	return item, err
}

func (s *IELTSService) CreatePassage(ctx context.Context, contentID uint, req dto.IELTSPassageRequest, audit dto.IeltsAuditContext) (*domain.IELTSPassage, error) {
	start := time.Now()
	item := &domain.IELTSPassage{ContentItemID: contentID, PassageNo: req.PassageNo, Title: req.Title, Body: req.Body, SortOrder: req.SortOrder}
	err := s.repo.CreatePassage(ctx, item)
	s.auditMutation(ctx, audit, domain.AuditCodeCreatePassage, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) UpdatePassage(ctx context.Context, id uint, req dto.IELTSPassageRequest, audit dto.IeltsAuditContext) (*domain.IELTSPassage, error) {
	start := time.Now()
	item, err := s.repo.GetPassage(ctx, id)
	if err == nil {
		item.PassageNo = req.PassageNo
		item.Title = req.Title
		item.Body = req.Body
		item.SortOrder = req.SortOrder
		err = s.repo.UpdatePassage(ctx, item)
	}
	s.auditMutation(ctx, audit, domain.AuditCodeUpdatePassage, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) DeletePassage(ctx context.Context, id uint, audit dto.IeltsAuditContext) error {
	start := time.Now()
	err := s.repo.DeletePassage(ctx, id)
	s.auditMutation(ctx, audit, domain.AuditCodeDeletePassage, map[string]uint{"id": id}, map[string]bool{"deleted": err == nil}, err, start)
	s.invalidateContentCache(ctx)
	return err
}

func (s *IELTSService) CreateQuestionGroup(ctx context.Context, contentID uint, req dto.IELTSQuestionGroupRequest, audit dto.IeltsAuditContext) (*domain.IELTSQuestionGroup, error) {
	start := time.Now()
	item := questionGroupFromRequest(contentID, req)
	err := s.repo.CreateQuestionGroup(ctx, item)
	s.auditMutation(ctx, audit, domain.AuditCodeCreateQuestionGroup, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) UpdateQuestionGroup(ctx context.Context, id uint, req dto.IELTSQuestionGroupRequest, audit dto.IeltsAuditContext) (*domain.IELTSQuestionGroup, error) {
	start := time.Now()
	item, err := s.repo.GetQuestionGroup(ctx, id)
	if err == nil {
		updated := questionGroupFromRequest(item.ContentItemID, req)
		updated.ID = item.ID
		updated.CreatedAt = item.CreatedAt
		err = s.repo.UpdateQuestionGroup(ctx, updated)
		item = updated
	}
	s.auditMutation(ctx, audit, domain.AuditCodeUpdateQuestionGroup, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) DeleteQuestionGroup(ctx context.Context, id uint, audit dto.IeltsAuditContext) error {
	start := time.Now()
	err := s.repo.DeleteQuestionGroup(ctx, id)
	s.auditMutation(ctx, audit, domain.AuditCodeDeleteQuestionGroup, map[string]uint{"id": id}, map[string]bool{"deleted": err == nil}, err, start)
	s.invalidateContentCache(ctx)
	return err
}

func (s *IELTSService) CreateQuestion(ctx context.Context, contentID uint, req dto.IELTSQuestionRequest, audit dto.IeltsAuditContext) (*domain.IELTSQuestion, error) {
	start := time.Now()
	item := questionFromRequest(contentID, req)
	err := s.repo.CreateQuestion(ctx, item)
	s.auditMutation(ctx, audit, domain.AuditCodeCreateQuestion, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) UpdateQuestion(ctx context.Context, id uint, req dto.IELTSQuestionRequest, audit dto.IeltsAuditContext) (*domain.IELTSQuestion, error) {
	start := time.Now()
	item, err := s.repo.GetQuestion(ctx, id)
	if err == nil {
		updated := questionFromRequest(item.ContentItemID, req)
		updated.ID = item.ID
		updated.CreatedAt = item.CreatedAt
		err = s.repo.UpdateQuestion(ctx, updated)
		item = updated
	}
	s.auditMutation(ctx, audit, domain.AuditCodeUpdateQuestion, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) DeleteQuestion(ctx context.Context, id uint, audit dto.IeltsAuditContext) error {
	start := time.Now()
	err := s.repo.DeleteQuestion(ctx, id)
	s.auditMutation(ctx, audit, domain.AuditCodeDeleteQuestion, map[string]uint{"id": id}, map[string]bool{"deleted": err == nil}, err, start)
	s.invalidateContentCache(ctx)
	return err
}

func (s *IELTSService) CreateVocabulary(ctx context.Context, contentID uint, req dto.IELTSVocabularyRequest, audit dto.IeltsAuditContext) (*domain.IELTSVocabularyItem, error) {
	start := time.Now()
	item := vocabularyFromRequest(contentID, req)
	err := s.repo.CreateVocabulary(ctx, item)
	s.auditMutation(ctx, audit, domain.AuditCodeCreateVocabulary, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) UpdateVocabulary(ctx context.Context, id uint, req dto.IELTSVocabularyRequest, audit dto.IeltsAuditContext) (*domain.IELTSVocabularyItem, error) {
	start := time.Now()
	item, err := s.repo.GetVocabularyItem(ctx, id)
	if err == nil {
		updated := vocabularyFromRequest(item.ContentItemID, req)
		updated.ID = item.ID
		updated.CreatedAt = item.CreatedAt
		err = s.repo.UpdateVocabulary(ctx, updated)
		item = updated
	}
	s.auditMutation(ctx, audit, domain.AuditCodeUpdateVocabulary, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) DeleteVocabulary(ctx context.Context, id uint, audit dto.IeltsAuditContext) error {
	start := time.Now()
	err := s.repo.DeleteVocabulary(ctx, id)
	s.auditMutation(ctx, audit, domain.AuditCodeDeleteVocabulary, map[string]uint{"id": id}, map[string]bool{"deleted": err == nil}, err, start)
	s.invalidateContentCache(ctx)
	return err
}

func (s *IELTSService) CreateRelatedPost(ctx context.Context, contentID uint, req dto.IELTSRelatedPostRequest, audit dto.IeltsAuditContext) (*domain.IELTSRelatedPost, error) {
	start := time.Now()
	item := &domain.IELTSRelatedPost{ContentItemID: contentID, PostID: req.PostID, Title: req.Title, SortOrder: req.SortOrder}
	err := s.repo.CreateRelatedPost(ctx, item)
	s.auditMutation(ctx, audit, domain.AuditCodeCreateRelatedPost, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) UpdateRelatedPost(ctx context.Context, id uint, req dto.IELTSRelatedPostRequest, audit dto.IeltsAuditContext) (*domain.IELTSRelatedPost, error) {
	start := time.Now()
	item, err := s.repo.GetRelatedPost(ctx, id)
	if err == nil {
		item.PostID = req.PostID
		item.Title = req.Title
		item.SortOrder = req.SortOrder
		err = s.repo.UpdateRelatedPost(ctx, item)
	}
	s.auditMutation(ctx, audit, domain.AuditCodeUpdateRelatedPost, req, item, err, start)
	s.invalidateContentCache(ctx)
	return item, err
}

func (s *IELTSService) DeleteRelatedPost(ctx context.Context, id uint, audit dto.IeltsAuditContext) error {
	start := time.Now()
	err := s.repo.DeleteRelatedPost(ctx, id)
	s.auditMutation(ctx, audit, domain.AuditCodeDeleteRelatedPost, map[string]uint{"id": id}, map[string]bool{"deleted": err == nil}, err, start)
	s.invalidateContentCache(ctx)
	return err
}

func (s *IELTSService) ListAttempts(ctx context.Context, userID uuid.UUID, filter dto.IELTSAttemptFilter) ([]domain.IELTSPracticeAttempt, int64, error) {
	return s.repo.ListAttempts(ctx, userID, filter)
}

func (s *IELTSService) UploadAsset(ctx context.Context, userID uuid.UUID, contentID uint, kind string, file *multipart.FileHeader, audit dto.IeltsAuditContext) (*dto.IELTSAssetUploadResponse, error) {
	start := time.Now()
	if s.assetStorage == nil {
		err := fmt.Errorf("ielts asset storage is not configured")
		s.auditMutation(ctx, audit, 1601, map[string]any{"content_id": contentID, "kind": kind}, nil, err, start)
		return nil, err
	}
	uploaded, err := s.assetStorage.UploadTypedAsset(ctx, file, kind, "ielts", contentID, userID)
	if err != nil {
		s.auditMutation(ctx, audit, domain.AuditCodeUploadAsset, map[string]any{"content_id": contentID, "kind": kind}, nil, err, start)
		return nil, err
	}
	mediaType := mediaTypeFromKind(kind)
	media := &domain.Media{
		FileName:     uploaded.FileName,
		OriginalName: uploaded.OriginalName,
		FilePath:     uploaded.ObjectKey,
		FileSize:     uploaded.FileSize,
		MimeType:     uploaded.MimeType,
		Type:         mediaType,
		UploadedBy:   userID,
		Bucket:       uploaded.Bucket,
		ObjectKey:    uploaded.ObjectKey,
		URL:          uploaded.URL,
	}
	if err := s.repo.CreateMedia(ctx, media); err != nil {
		s.auditMutation(ctx, audit, domain.AuditCodeUploadAsset, map[string]any{"content_id": contentID, "kind": kind}, nil, err, start)
		return nil, err
	}
	res := &dto.IELTSAssetUploadResponse{
		MediaID:      media.ID,
		Kind:         kind,
		Bucket:       uploaded.Bucket,
		ObjectKey:    uploaded.ObjectKey,
		URL:          uploaded.URL,
		FileName:     uploaded.FileName,
		OriginalName: uploaded.OriginalName,
		FileSize:     uploaded.FileSize,
		MimeType:     uploaded.MimeType,
	}
	s.auditMutation(ctx, audit, domain.AuditCodeUploadAsset, map[string]any{"content_id": contentID, "kind": kind}, res, nil, start)
	return res, nil
}

func (s *IELTSService) UpdateProgress(ctx context.Context, userID uuid.UUID, contentID uint, req dto.IELTSProgressUpdateRequest, audit dto.IeltsAuditContext) (*domain.IELTSLearningProgress, error) {
	start := time.Now()
	var learnedAt *time.Time
	if req.Status == "completed" || req.Status == "learned" {
		now := time.Now()
		learnedAt = &now
	}
	progress := &domain.IELTSLearningProgress{
		UserID:             userID,
		ContentItemID:      contentID,
		Status:             req.Status,
		CompletedQuestions: req.CompletedQuestions,
		TotalQuestions:     req.TotalQuestions,
		LastQuestionNo:     req.LastQuestionNo,
		LearnedAt:          learnedAt,
	}
	err := s.repo.UpsertProgress(ctx, progress)
	s.auditMutation(ctx, audit, domain.AuditCodeUpdateProgress, req, progress, err, start)
	return progress, err
}

func (s *IELTSService) StartMockTest(ctx context.Context, userID uuid.UUID, req dto.IELTSMockStartRequest, audit dto.IeltsAuditContext) (*domain.IELTSMockTestSession, error) {
	start := time.Now()
	session := &domain.IELTSMockTestSession{UserID: userID, Status: constants.IELTSAttemptStarted, StartedAt: start, ComponentScores: datatypes.JSON([]byte("{}"))}
	slugs := []struct {
		slug string
		set  func(uint)
	}{
		{req.ReadingSlug, func(id uint) { session.ReadingAttemptID = &id }},
		{req.ListeningSlug, func(id uint) { session.ListeningAttemptID = &id }},
		{req.WritingSlug, func(id uint) { session.WritingAttemptID = &id }},
		{req.SpeakingSlug, func(id uint) { session.SpeakingAttemptID = &id }},
	}
	for _, item := range slugs {
		if item.slug == "" {
			continue
		}
		attempt, err := s.createAttemptBySlug(ctx, userID, item.slug)
		if err != nil {
			s.auditMutation(ctx, audit, 2001, req, nil, err, start)
			return nil, err
		}
		item.set(attempt.ID)
	}
	if err := s.repo.CreateMockSession(ctx, session); err != nil {
		s.auditMutation(ctx, audit, domain.AuditCodeStartMockTest, req, nil, err, start)
		return nil, err
	}
	s.auditMutation(ctx, audit, domain.AuditCodeStartMockTest, req, session, nil, start)
	return session, nil
}

func (s *IELTSService) SubmitMockTest(ctx context.Context, userID uuid.UUID, sessionID uint, audit dto.IeltsAuditContext) (*domain.IELTSMockTestSession, error) {
	start := time.Now()
	session, err := s.repo.GetMockSession(ctx, sessionID, userID)
	if err != nil {
		s.auditMutation(ctx, audit, domain.AuditCodeSubmitMockTest, map[string]uint{"session_id": sessionID}, nil, err, start)
		return nil, err
	}
	scores := map[string]float64{}
	for _, item := range []struct {
		key string
		id  *uint
	}{
		{"reading", session.ReadingAttemptID},
		{"listening", session.ListeningAttemptID},
		{"writing", session.WritingAttemptID},
		{"speaking", session.SpeakingAttemptID},
	} {
		if item.id == nil {
			continue
		}
		attempt, err := s.repo.GetAttempt(ctx, *item.id, userID)
		if err == nil {
			scores[item.key] = attempt.Score
		}
	}
	session.OverallBand = overallBand(scores["reading"], scores["listening"], scores["writing"], scores["speaking"])
	session.ComponentScores = marshalJSON(scores, "{}")
	session.Status = constants.IELTSAttemptSubmitted
	now := time.Now()
	session.SubmittedAt = &now
	err = s.repo.UpdateMockSession(ctx, session)
	s.auditMutation(ctx, audit, domain.AuditCodeSubmitMockTest, map[string]uint{"session_id": sessionID}, session, err, start)
	return session, err
}

func (s *IELTSService) ListMockSessions(ctx context.Context, filter dto.IELTSMockSessionFilter) ([]domain.IELTSMockTestSession, int64, error) {
	return s.repo.ListMockSessions(ctx, filter)
}

func (s *IELTSService) createAttemptBySlug(ctx context.Context, userID uuid.UUID, slug string) (*domain.IELTSPracticeAttempt, error) {
	content, err := s.repo.GetContentBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	attempt := &domain.IELTSPracticeAttempt{
		UserID:           userID,
		ContentItemID:    content.ID,
		Mode:             content.ContentType,
		Status:           constants.IELTSAttemptStarted,
		StartedAt:        time.Now(),
		TimeLimitSeconds: content.DurationSeconds,
		TotalQuestions:   content.QuestionCount,
		Stats:            datatypes.JSON([]byte("{}")),
	}
	if err := s.repo.CreateAttempt(ctx, attempt); err != nil {
		return nil, err
	}
	return attempt, nil
}

func contentFromRequest(req dto.IELTSContentRequest) *domain.IELTSContentItem {
	status := req.Status
	if status == "" {
		status = constants.IELTSStatusDraft
	}
	return &domain.IELTSContentItem{
		Slug:            req.Slug,
		Title:           req.Title,
		Subtitle:        req.Subtitle,
		Description:     req.Description,
		Module:          req.Module,
		Skill:           req.Skill,
		ContentType:     req.ContentType,
		Part:            req.Part,
		TestKind:        req.TestKind,
		Status:          status,
		ReviewStatus:    firstString(req.ReviewStatus, "draft"),
		ReviewNote:      req.ReviewNote,
		Level:           req.Level,
		ThumbnailURL:    req.ThumbnailURL,
		PreviewImageURL: req.PreviewImageURL,
		AudioURL:        req.AudioURL,
		PDFURL:          req.PDFURL,
		SourceURL:       req.SourceURL,
		QuestionCount:   req.QuestionCount,
		DurationSeconds: req.DurationSeconds,
		Tags:            jsonOrDefault(req.Tags, "[]"),
		Metadata:        jsonOrDefault(req.Metadata, "{}"),
		PublishedAt:     req.PublishedAt,
	}
}

func firstString(value string, fallback string) string {
	if value != "" {
		return value
	}
	return fallback
}

func questionGroupFromRequest(contentID uint, req dto.IELTSQuestionGroupRequest) *domain.IELTSQuestionGroup {
	return &domain.IELTSQuestionGroup{
		ContentItemID: contentID,
		PassageID:     req.PassageID,
		GroupNo:       req.GroupNo,
		QuestionFrom:  req.QuestionFrom,
		QuestionTo:    req.QuestionTo,
		QuestionType:  req.QuestionType,
		Instruction:   req.Instruction,
		Payload:       jsonOrDefault(req.Payload, "{}"),
		SortOrder:     req.SortOrder,
	}
}

func questionFromRequest(contentID uint, req dto.IELTSQuestionRequest) *domain.IELTSQuestion {
	return &domain.IELTSQuestion{
		ContentItemID: contentID,
		GroupID:       req.GroupID,
		QuestionNo:    req.QuestionNo,
		Prompt:        req.Prompt,
		Answer:        req.Answer,
		Options:       jsonOrDefault(req.Options, "[]"),
		Explanation:   jsonOrDefault(req.Explanation, "{}"),
		Payload:       jsonOrDefault(req.Payload, "{}"),
		SortOrder:     req.SortOrder,
	}
}

func vocabularyFromRequest(contentID uint, req dto.IELTSVocabularyRequest) *domain.IELTSVocabularyItem {
	return &domain.IELTSVocabularyItem{
		ContentItemID: contentID,
		Term:          req.Term,
		IPA:           req.IPA,
		PartOfSpeech:  req.PartOfSpeech,
		Meaning:       req.Meaning,
		Example:       req.Example,
		ImageURL:      req.ImageURL,
		AudioURL:      req.AudioURL,
		SortOrder:     req.SortOrder,
	}
}

func mediaTypeFromKind(kind string) domain.MediaType {
	switch kind {
	case "audio":
		return domain.MediaTypeAudio
	case "pdf":
		return domain.MediaTypeDocument
	case "content-image", "thumbnail", "vocab-image":
		return domain.MediaTypeImage
	default:
		return domain.MediaTypeOther
	}
}

func scoreAnswers(answersJSON datatypes.JSON, questions []domain.IELTSQuestion) *dto.IELTSAttemptResult {
	answerMap := map[string]string{}
	_ = json.Unmarshal(answersJSON, &answerMap)

	correct := 0
	wrong := 0
	skipped := 0
	type questionStat struct {
		QuestionNo int    `json:"question_no"`
		Answer     string `json:"answer"`
		UserAnswer string `json:"user_answer"`
		Correct    bool   `json:"correct"`
		Skipped    bool   `json:"skipped"`
	}
	stats := make([]questionStat, 0, len(questions))
	for _, q := range questions {
		key := strconv.Itoa(q.QuestionNo)
		userAnswer := strings.TrimSpace(answerMap[key])
		expected := strings.TrimSpace(q.Answer)
		if userAnswer == "" {
			skipped++
			stats = append(stats, questionStat{QuestionNo: q.QuestionNo, Answer: expected, Skipped: true})
			continue
		}
		ok := normalizeAnswer(userAnswer) == normalizeAnswer(expected)
		if ok {
			correct++
		} else {
			wrong++
		}
		stats = append(stats, questionStat{QuestionNo: q.QuestionNo, Answer: expected, UserAnswer: userAnswer, Correct: ok})
	}
	total := len(questions)
	score := 0.0
	if total > 0 {
		score = math.Round((float64(correct)/float64(total))*100) / 10
	}
	return &dto.IELTSAttemptResult{
		Status:         constants.IELTSAttemptSubmitted,
		CorrectCount:   correct,
		WrongCount:     wrong,
		SkippedCount:   skipped,
		TotalQuestions: total,
		Score:          score,
		Answers:        jsonOrDefault(answersJSON, "{}"),
		Stats:          marshalJSON(stats, "[]"),
	}
}

func normalizeAnswer(value string) string {
	return strings.Join(strings.Fields(strings.ToLower(value)), " ")
}

func lastQuestionNo(questions []domain.IELTSQuestion) int {
	maxNo := 0
	for _, q := range questions {
		if q.QuestionNo > maxNo {
			maxNo = q.QuestionNo
		}
	}
	return maxNo
}

func jsonOrDefault(value datatypes.JSON, fallback string) datatypes.JSON {
	if len(value) == 0 || !json.Valid(value) {
		return datatypes.JSON([]byte(fallback))
	}
	return value
}

func marshalJSON(value any, fallback string) datatypes.JSON {
	raw, err := json.Marshal(value)
	if err != nil {
		return datatypes.JSON([]byte(fallback))
	}
	return datatypes.JSON(raw)
}

func mergeAttemptStats(base datatypes.JSON, criteriaScores datatypes.JSON, manualScore float64) datatypes.JSON {
	payload := map[string]any{"question_stats": json.RawMessage(jsonOrDefault(base, "[]"))}
	if len(criteriaScores) > 0 && json.Valid(criteriaScores) {
		payload["criteria_scores"] = json.RawMessage(criteriaScores)
	}
	if manualScore > 0 {
		payload["manual_score"] = manualScore
	}
	return marshalJSON(payload, "{}")
}

func (s *IELTSService) writeAudit(ctx context.Context, audit dto.IeltsAuditContext, actTypeID domain.IELTSAuditCode, status string, req any, resp any, start time.Time) {
	actionUser := audit.ActionUserName
	if actionUser == "" && audit.UserID != uuid.Nil {
		actionUser = audit.UserID.String()
	}
	if actionUser == "" {
		actionUser = "SYSTEM"
	}
	sourceApp := audit.SourceAppID
	if sourceApp == "" {
		sourceApp = "web"
	}
	destinationApp := audit.DestinationAppID
	if destinationApp == "" {
		destinationApp = "api"
	}
	item := &domain.WsAudit{
		WsCallType:            constants.WsAuditCallTypeIELTS,
		ActTypeID:             int64(actTypeID),
		RequestTime:           start,
		ActionUserName:        actionUser,
		WsURI:                 audit.URI,
		SourceAppID:           sourceApp,
		IPPC:                  audit.IP,
		DestinationAppID:      destinationApp,
		Status:                status,
		FinishTime:            time.Since(start).Milliseconds(),
		MsgRequest:            datatypes.JSON(marshalJSON(req, "{}")),
		MsgResponse:           datatypes.JSON(marshalJSON(resp, "{}")),
		RequestInID:           audit.RequestID,
		RequestOutID:          uuid.NewString(),
		RequestTimeMilisecond: start.UnixMilli(),
	}
	_ = s.repo.WriteWsAudit(ctx, item)
}

func (s *IELTSService) auditMutation(ctx context.Context, audit dto.IeltsAuditContext, actTypeID domain.IELTSAuditCode, req any, resp any, err error, start time.Time) {
	status := constants.WsAuditStatusSuccess
	if err != nil {
		status = constants.WsAuditStatusFailed
		resp = map[string]string{"error": err.Error()}
	}
	s.writeAudit(ctx, audit, actTypeID, status, req, resp, start)
}

func (s *IELTSService) getCache(ctx context.Context, key string, target any) bool {
	if s.cache == nil {
		return false
	}
	raw, err := s.cache.Get(ctx, key).Bytes()
	if err != nil {
		return false
	}
	return json.Unmarshal(raw, target) == nil
}

func (s *IELTSService) setCache(ctx context.Context, key string, value any, ttl time.Duration) {
	if s.cache == nil {
		return
	}
	raw, err := json.Marshal(value)
	if err != nil {
		return
	}
	_ = s.cache.Set(ctx, key, raw, ttl).Err()
}

func (s *IELTSService) invalidateContentCache(ctx context.Context) {
	if s.cache == nil {
		return
	}
	keys, err := s.cache.Keys(ctx, "ielts:content:*").Result()
	if err == nil && len(keys) > 0 {
		_ = s.cache.Del(ctx, keys...).Err()
	}
}
