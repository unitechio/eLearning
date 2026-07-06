package dto

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type IELTSContentFilter struct {
	PaginationQuery
	Search      string `form:"q"`
	Module      string `form:"module"`
	Skill       string `form:"skill"`
	ContentType string `form:"content_type"`
	Part        string `form:"part"`
	TestKind    string `form:"test_kind"`
	Status      string `form:"status"`
	Level       string `form:"level"`
}

type IELTSContentRequest struct {
	Slug            string         `json:"slug" binding:"required"`
	Title           string         `json:"title" binding:"required"`
	Subtitle        string         `json:"subtitle"`
	Description     string         `json:"description"`
	Module          string         `json:"module" binding:"required"`
	Skill           string         `json:"skill" binding:"required"`
	ContentType     string         `json:"content_type" binding:"required"`
	Part            string         `json:"part"`
	TestKind        string         `json:"test_kind"`
	Status          string         `json:"status"`
	ReviewStatus    string         `json:"review_status"`
	ReviewNote      string         `json:"review_note"`
	Level           string         `json:"level"`
	ThumbnailURL    string         `json:"thumbnail_url"`
	PreviewImageURL string         `json:"preview_image_url"`
	AudioURL        string         `json:"audio_url"`
	PDFURL          string         `json:"pdf_url"`
	SourceURL       string         `json:"source_url"`
	QuestionCount   int            `json:"question_count"`
	DurationSeconds int            `json:"duration_seconds"`
	Tags            datatypes.JSON `json:"tags"`
	Metadata        datatypes.JSON `json:"metadata"`
	PublishedAt     *time.Time     `json:"published_at"`
}

type IELTSImportBundle struct {
	Content    IELTSContentRequest         `json:"content"`
	Passages   []IELTSPassageRequest       `json:"passages"`
	Groups     []IELTSQuestionGroupRequest `json:"groups"`
	Questions  []IELTSQuestionRequest      `json:"questions"`
	Vocabulary []IELTSVocabularyRequest    `json:"vocabulary"`
}

type IELTSImportResult struct {
	ContentID       uint `json:"content_id"`
	PassageCount    int  `json:"passage_count"`
	GroupCount      int  `json:"group_count"`
	QuestionCount   int  `json:"question_count"`
	VocabularyCount int  `json:"vocabulary_count"`
}

type IELTSPDFImportPage struct {
	PageNo       int    `json:"page_no"`
	Title        string `json:"title"`
	Text         string `json:"text"`
	TextLength   int    `json:"text_length"`
	ImageCount   int    `json:"image_count"`
	RequiresOCR  bool   `json:"requires_ocr"`
	HasTextLayer bool   `json:"has_text_layer"`
}

type IELTSPDFImportResult struct {
	FileName           string                `json:"file_name"`
	Title              string                `json:"title"`
	PageCount          int                   `json:"page_count"`
	ExtractedText      string                `json:"extracted_text"`
	ExtractedChars     int                   `json:"extracted_chars"`
	RequiresOCR        bool                  `json:"requires_ocr"`
	HasExtractableText bool                  `json:"has_extractable_text"`
	Pages              []IELTSPDFImportPage  `json:"pages"`
	SuggestedContent   IELTSContentRequest   `json:"suggested_content"`
	SuggestedPassages  []IELTSPassageRequest `json:"suggested_passages"`
}

type IELTSReviewRequest struct {
	Action string `json:"action" binding:"required"`
	Note   string `json:"note"`
}

type IELTSPassageRequest struct {
	PassageNo int    `json:"passage_no" binding:"required"`
	Title     string `json:"title"`
	Body      string `json:"body" binding:"required"`
	SortOrder int    `json:"sort_order"`
}

type IELTSQuestionGroupRequest struct {
	PassageID    *uint          `json:"passage_id"`
	GroupNo      int            `json:"group_no" binding:"required"`
	QuestionFrom int            `json:"question_from" binding:"required"`
	QuestionTo   int            `json:"question_to" binding:"required"`
	QuestionType string         `json:"question_type" binding:"required"`
	Instruction  string         `json:"instruction"`
	Payload      datatypes.JSON `json:"payload"`
	SortOrder    int            `json:"sort_order"`
}

type IELTSQuestionRequest struct {
	GroupID     uint           `json:"group_id" binding:"required"`
	QuestionNo  int            `json:"question_no" binding:"required"`
	Prompt      string         `json:"prompt"`
	Answer      string         `json:"answer"`
	Options     datatypes.JSON `json:"options"`
	Explanation datatypes.JSON `json:"explanation"`
	Payload     datatypes.JSON `json:"payload"`
	SortOrder   int            `json:"sort_order"`
}

type IELTSVocabularyRequest struct {
	Term         string `json:"term" binding:"required"`
	IPA          string `json:"ipa"`
	PartOfSpeech string `json:"part_of_speech"`
	Meaning      string `json:"meaning"`
	Example      string `json:"example"`
	ImageURL     string `json:"image_url"`
	AudioURL     string `json:"audio_url"`
	SortOrder    int    `json:"sort_order"`
}

type IELTSRelatedPostRequest struct {
	PostID    uint   `json:"post_id" binding:"required"`
	Title     string `json:"title"`
	SortOrder int    `json:"sort_order"`
}

type IELTSAssetUploadResponse struct {
	MediaID      uint   `json:"media_id"`
	Kind         string `json:"kind"`
	Bucket       string `json:"bucket"`
	ObjectKey    string `json:"object_key"`
	URL          string `json:"url"`
	FileName     string `json:"file_name"`
	OriginalName string `json:"original_name"`
	FileSize     int64  `json:"file_size"`
	MimeType     string `json:"mime_type"`
}

type IELTSStartAttemptRequest struct {
	Mode             string         `json:"mode"`
	TimeLimitSeconds int            `json:"time_limit_seconds"`
	Metadata         datatypes.JSON `json:"metadata"`
}

type IELTSSubmitAttemptRequest struct {
	Answers        datatypes.JSON `json:"answers" binding:"required"`
	ElapsedSeconds int            `json:"elapsed_seconds"`
	ManualScore    float64        `json:"manual_score"`
	CriteriaScores datatypes.JSON `json:"criteria_scores"`
}

type IELTSAttemptResult struct {
	ID             uint           `json:"id"`
	Status         string         `json:"status"`
	CorrectCount   int            `json:"correct_count"`
	WrongCount     int            `json:"wrong_count"`
	SkippedCount   int            `json:"skipped_count"`
	TotalQuestions int            `json:"total_questions"`
	Score          float64        `json:"score"`
	BandScore      float64        `json:"band_score"`
	Stats          datatypes.JSON `json:"stats"`
	Answers        datatypes.JSON `json:"answers"`
}

type IELTSMockStartRequest struct {
	ReadingSlug   string `json:"reading_slug"`
	ListeningSlug string `json:"listening_slug"`
	WritingSlug   string `json:"writing_slug"`
	SpeakingSlug  string `json:"speaking_slug"`
}

type IELTSProgressFilter struct {
	PaginationQuery
	Skill       string `form:"skill"`
	ContentType string `form:"content_type"`
	Status      string `form:"status"`
}

type IELTSAttemptFilter struct {
	PaginationQuery
	Skill       string `form:"skill"`
	ContentType string `form:"content_type"`
	Status      string `form:"status"`
}

type IELTSProgressUpdateRequest struct {
	Status             string `json:"status" binding:"required"`
	CompletedQuestions int    `json:"completed_questions"`
	TotalQuestions     int    `json:"total_questions"`
	LastQuestionNo     int    `json:"last_question_no"`
}

type IeltsAuditContext struct {
	UserID           uuid.UUID
	ActionUserName   string
	URI              string
	IP               string
	RequestID        string
	SourceAppID      string
	DestinationAppID string
}
