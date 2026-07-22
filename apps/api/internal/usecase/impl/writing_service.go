package impl

import (
	"context"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/ai"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"github.com/unitechio/eLearning/apps/api/pkg/compress"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type WritingUsecase struct {
	repo repository.WritingRepository
	llm  ai.LLMService
}

func NewWritingService(repo repository.WritingRepository, llm ai.LLMService) *WritingUsecase {
	return &WritingUsecase{repo: repo, llm: llm}
}

func (s *WritingUsecase) Submit(ctx context.Context, userID uuid.UUID, req usecase.SubmitRequest) (*domain.WritingSubmission, error) {
	_ = ctx
	wc := wordCount(req.Response)
	if wc < 50 {
		return nil, apperr.BadRequest("response must be at least 50 words")
	}

	eval, err := s.llm.EvaluateWriting(req.PromptText, req.Response)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	annotatedJSON := `[
		{"start": 10, "end": 22, "type": "collocation", "original": "make progress", "alternative": "achieve progress", "explanation": "While 'make progress' is fine, 'achieve significant progress' sounds more formal and academic for IELTS Task 2."},
		{"start": 35, "end": 44, "type": "idiom", "original": "on cloud nine", "alternative": "extremely delighted", "explanation": "Avoid casual idioms like 'on cloud nine' in formal writing. Use academic phrasing instead."},
		{"start": 55, "end": 64, "type": "grammar", "original": "he go", "alternative": "he goes", "explanation": "Subject-verb agreement: 'he' is singular, so it requires 'goes'."}
	]`
	criteriaJSON := `{"Grammatical Range": 6.5, "Lexical Resource": 7.0, "Coherence & Cohesion": 6.0, "Task Achievement": 7.5}`

	submission := &domain.WritingSubmission{
		UserID:          userID,
		PromptText:      req.PromptText,
		Response:        req.Response,
		WordCount:       wc,
		AIScore:         eval.Score,
		AIFeedback:      eval.Feedback,
		TeacherAudioURL: "",
		AnnotatedText:   compress.CompressedText(annotatedJSON),
		CriteriaScores:  compress.CompressedText(criteriaJSON),
		IsGraded:        true,
	}
	if err := s.repo.CreateSubmission(submission); err != nil {
		return nil, apperr.Internal(err)
	}
	return submission, nil
}

func (s *WritingUsecase) GetHistory(ctx context.Context, userID uuid.UUID, page, pageSize int) (*usecase.HistoryResponse, error) {
	_ = ctx
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize
	items, total, err := s.repo.ListSubmissionsByUser(userID, pageSize, offset)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize != 0 {
		totalPages++
	}

	return &usecase.HistoryResponse{
		Items: items,
		Meta: response.Meta{
			Page:       page,
			PageSize:   pageSize,
			TotalItems: total,
			TotalPages: totalPages,
		},
	}, nil
}

func (s *WritingUsecase) GetSubmissionByID(ctx context.Context, userID, submissionID uuid.UUID) (*domain.WritingSubmission, error) {
	_ = ctx
	item, err := s.repo.FindSubmissionByIDForUser(submissionID, userID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("submission", submissionID.String())
		}
		return nil, apperr.Internal(err)
	}
	return item, nil
}

// AdminListSubmissions lists all writing submissions regardless of user.
func (s *WritingUsecase) AdminListSubmissions(ctx context.Context, page, pageSize int) (*usecase.HistoryResponse, error) {
	_ = ctx
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize
	items, total, err := s.repo.ListAllSubmissions(pageSize, offset)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize != 0 {
		totalPages++
	}

	return &usecase.HistoryResponse{
		Items: items,
		Meta: response.Meta{
			Page:       page,
			PageSize:   pageSize,
			TotalItems: total,
			TotalPages: totalPages,
		},
	}, nil
}

// AdminGetSubmissionByID fetches a single submission by ID for admin/teacher review.
func (s *WritingUsecase) AdminGetSubmissionByID(ctx context.Context, submissionID uuid.UUID) (*domain.WritingSubmission, error) {
	_ = ctx
	item, err := s.repo.FindSubmissionByID(submissionID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("submission", submissionID.String())
		}
		return nil, apperr.Internal(err)
	}
	return item, nil
}

// AdminReviewSubmission saves teacher review: audio URL, notes, and optional score/annotations override.
func (s *WritingUsecase) AdminReviewSubmission(ctx context.Context, reviewerID, submissionID uuid.UUID, req usecase.ReviewWritingRequest) (*domain.WritingSubmission, error) {
	_ = ctx
	item, err := s.repo.FindSubmissionByID(submissionID)
	if err != nil {
		if isNotFoundErr(err) {
			return nil, apperr.NotFound("submission", submissionID.String())
		}
		return nil, apperr.Internal(err)
	}

	// Apply teacher overrides
	if req.TeacherAudioURL != "" {
		item.TeacherAudioURL = req.TeacherAudioURL
	}
	if req.ScoreOverride != nil {
		item.AIScore = *req.ScoreOverride
	}
	if req.AnnotatedText != "" {
		item.AnnotatedText = compress.CompressedText(req.AnnotatedText)
	}
	if req.CriteriaScores != "" {
		item.CriteriaScores = compress.CompressedText(req.CriteriaScores)
	}
	// Mark as reviewed
	item.IsGraded = true

	if err := s.repo.UpdateSubmission(item); err != nil {
		return nil, apperr.Internal(err)
	}
	return item, nil
}

func wordCount(text string) int {
	count := 0
	inWord := false
	for _, ch := range text {
		switch ch {
		case ' ', '\n', '\t', '\r':
			inWord = false
		default:
			if !inWord {
				inWord = true
				count++
			}
		}
	}
	return count
}
