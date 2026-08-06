package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type IELTSContentItem struct {
	BaseModel
	Slug            string         `gorm:"uniqueIndex;size:240;not null" json:"slug"`
	Title           string         `gorm:"size:500;not null" json:"title"`
	Subtitle        string         `gorm:"size:500" json:"subtitle"`
	Description     string         `gorm:"type:text" json:"description"`
	Module          string         `gorm:"size:50;not null;index" json:"module"`
	Skill           string         `gorm:"size:50;not null;index" json:"skill"`
	ContentType     string         `gorm:"size:80;not null;index" json:"content_type"`
	Part            string         `gorm:"size:80;index" json:"part"`
	TestKind        string         `gorm:"size:80;index" json:"test_kind"`
	Status          string         `gorm:"size:40;not null;default:'draft';index" json:"status"`
	ReviewStatus    string         `gorm:"size:40;not null;default:'draft';index" json:"review_status"`
	ReviewNote      string         `gorm:"type:text" json:"review_note"`
	ReviewedBy      *uuid.UUID     `gorm:"type:uuid;index" json:"reviewed_by,omitempty"`
	ReviewedAt      *time.Time     `gorm:"index" json:"reviewed_at,omitempty"`
	Level           string         `gorm:"size:40;index" json:"level"`
	ThumbnailURL    string         `gorm:"size:1000" json:"thumbnail_url"`
	PreviewImageURL string         `gorm:"size:1000" json:"preview_image_url"`
	AudioURL        string         `gorm:"size:1000" json:"audio_url"`
	PDFURL          string         `gorm:"size:1000" json:"pdf_url"`
	SourceURL       string         `gorm:"size:1000" json:"source_url"`
	QuestionCount   int            `gorm:"default:0;index" json:"question_count"`
	DurationSeconds int            `gorm:"default:0" json:"duration_seconds"`
	ViewCount       int64          `gorm:"default:0" json:"view_count"`
	Tags            datatypes.JSON `gorm:"type:jsonb;default:'[]'" json:"tags"`
	Metadata        datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"metadata"`
	PublishedAt     *time.Time     `gorm:"index" json:"published_at"`

	Passages     []IELTSPassage        `gorm:"foreignKey:ContentItemID" json:"passages,omitempty"`
	Groups       []IELTSQuestionGroup  `gorm:"foreignKey:ContentItemID" json:"question_groups,omitempty"`
	Vocabulary   []IELTSVocabularyItem `gorm:"foreignKey:ContentItemID" json:"vocabulary,omitempty"`
	RelatedPosts []IELTSRelatedPost    `gorm:"foreignKey:ContentItemID" json:"related_posts,omitempty"`
}

func (IELTSContentItem) TableName() string { return "ielts_content_items" }

type IELTSPassage struct {
	BaseModel
	ContentItemID uint   `gorm:"not null;index" json:"content_item_id"`
	PassageNo     int    `gorm:"not null;index" json:"passage_no"`
	Title         string `gorm:"size:500" json:"title"`
	Body          string `gorm:"type:text;not null" json:"body"`
	SortOrder     int    `gorm:"default:0;index" json:"sort_order"`
}

func (IELTSPassage) TableName() string { return "ielts_passages" }

type IELTSQuestionGroup struct {
	BaseModel
	ContentItemID uint                    `gorm:"not null;index" json:"content_item_id"`
	PassageID     *uint                   `gorm:"index" json:"passage_id,omitempty"`
	GroupNo       int                     `gorm:"not null;index" json:"group_no"`
	QuestionFrom  int                     `gorm:"not null;index" json:"question_from"`
	QuestionTo    int                     `gorm:"not null;index" json:"question_to"`
	QuestionType  string                  `gorm:"size:120;not null;index" json:"question_type"`
	Instruction   string         `gorm:"type:text" json:"instruction"`
	Payload       datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"payload"`
	SortOrder     int            `gorm:"default:0;index" json:"sort_order"`
	Questions     []IELTSQuestion `gorm:"foreignKey:GroupID" json:"questions,omitempty"`
}

func (IELTSQuestionGroup) TableName() string { return "ielts_question_groups" }

type IELTSQuestion struct {
	BaseModel
	ContentItemID uint           `gorm:"not null;index" json:"content_item_id"`
	GroupID       uint           `gorm:"not null;index" json:"group_id"`
	QuestionNo    int            `gorm:"not null;index" json:"question_no"`
	Prompt        string         `gorm:"type:text" json:"prompt"`
	Answer        string         `gorm:"type:text" json:"answer"`
	Options       datatypes.JSON `gorm:"type:jsonb;default:'[]'" json:"options"`
	Explanation   datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"explanation"`
	Payload       datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"payload"`
	SortOrder     int                     `gorm:"default:0;index" json:"sort_order"`
}

func (IELTSQuestion) TableName() string { return "ielts_questions" }

type IELTSVocabularyItem struct {
	BaseModel
	ContentItemID uint   `gorm:"not null;index" json:"content_item_id"`
	Term          string `gorm:"size:300;not null;index" json:"term"`
	IPA           string `gorm:"size:300" json:"ipa"`
	PartOfSpeech  string `gorm:"size:80" json:"part_of_speech"`
	Meaning       string `gorm:"type:text" json:"meaning"`
	Example       string `gorm:"type:text" json:"example"`
	ImageURL      string `gorm:"size:1000" json:"image_url"`
	AudioURL      string `gorm:"size:1000" json:"audio_url"`
	SortOrder     int    `gorm:"default:0;index" json:"sort_order"`
}

func (IELTSVocabularyItem) TableName() string { return "ielts_vocabulary_items" }

type IELTSRelatedPost struct {
	BaseModel
	ContentItemID uint   `gorm:"not null;index:idx_ielts_related_content_post,unique" json:"content_item_id"`
	PostID        uint   `gorm:"not null;index:idx_ielts_related_content_post,unique" json:"post_id"`
	Title         string `gorm:"size:500" json:"title"`
	SortOrder     int    `gorm:"default:0;index" json:"sort_order"`
	Post          *Post  `gorm:"foreignKey:PostID" json:"post,omitempty"`
}

func (IELTSRelatedPost) TableName() string { return "ielts_related_posts" }

type IELTSPracticeAttempt struct {
	BaseModel
	UserID           uuid.UUID         `gorm:"type:uuid;not null;index" json:"user_id"`
	ContentItemID    uint              `gorm:"not null;index" json:"content_item_id"`
	Mode             string            `gorm:"size:60;not null;index" json:"mode"`
	Status           string            `gorm:"size:40;not null;default:'started';index" json:"status"`
	StartedAt        time.Time         `gorm:"not null;index" json:"started_at"`
	SubmittedAt      *time.Time        `gorm:"index" json:"submitted_at"`
	TimeLimitSeconds int               `gorm:"default:0" json:"time_limit_seconds"`
	ElapsedSeconds   int               `gorm:"default:0" json:"elapsed_seconds"`
	TotalQuestions   int               `gorm:"default:0" json:"total_questions"`
	CorrectCount     int               `gorm:"default:0" json:"correct_count"`
	WrongCount       int               `gorm:"default:0" json:"wrong_count"`
	SkippedCount     int               `gorm:"default:0" json:"skipped_count"`
	Score            float64           `gorm:"default:0" json:"score"`
	Answers          datatypes.JSON    `gorm:"type:jsonb;default:'{}'" json:"answers"`
	Stats            datatypes.JSON    `gorm:"type:jsonb;default:'{}'" json:"stats"`
	ContentItem      *IELTSContentItem `gorm:"foreignKey:ContentItemID" json:"content_item,omitempty"`
}

func (IELTSPracticeAttempt) TableName() string { return "ielts_practice_attempts" }

type IELTSLearningProgress struct {
	BaseModel
	UserID             uuid.UUID  `gorm:"type:uuid;not null;index:idx_ielts_progress_user_content,unique" json:"user_id"`
	ContentItemID      uint       `gorm:"not null;index:idx_ielts_progress_user_content,unique" json:"content_item_id"`
	Status             string     `gorm:"size:40;not null;default:'not_started';index" json:"status"`
	CompletedQuestions int        `gorm:"default:0" json:"completed_questions"`
	TotalQuestions     int        `gorm:"default:0" json:"total_questions"`
	LastQuestionNo     int        `gorm:"default:0" json:"last_question_no"`
	LearnedAt          *time.Time `json:"learned_at"`
}

func (IELTSLearningProgress) TableName() string { return "ielts_learning_progress" }

type IELTSMockTestSession struct {
	BaseModel
	UserID             uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`
	Status             string         `gorm:"size:40;not null;default:'started';index" json:"status"`
	StartedAt          time.Time      `gorm:"not null;index" json:"started_at"`
	SubmittedAt        *time.Time     `gorm:"index" json:"submitted_at"`
	ReadingAttemptID   *uint          `gorm:"index" json:"reading_attempt_id,omitempty"`
	ListeningAttemptID *uint          `gorm:"index" json:"listening_attempt_id,omitempty"`
	WritingAttemptID   *uint          `gorm:"index" json:"writing_attempt_id,omitempty"`
	SpeakingAttemptID  *uint          `gorm:"index" json:"speaking_attempt_id,omitempty"`
	OverallBand        float64        `gorm:"default:0" json:"overall_band"`
	ComponentScores    datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"component_scores"`
}

func (IELTSMockTestSession) TableName() string { return "ielts_mock_test_sessions" }

type WsAudit struct {
	ID                    uint      `gorm:"primarykey;autoIncrement" json:"ws_audit_id"`
	WsCallType            string    `gorm:"size:80;index" json:"ws_call_type"`
	ActTypeID             int64     `gorm:"index" json:"act_type_id"`
	RequestTime           time.Time `gorm:"index" json:"request_time"`
	ActionUserName        string    `gorm:"size:255;index" json:"action_user_name"`
	WsURI                 string    `gorm:"size:1000;index" json:"ws_uri"`
	SourceAppID           string    `gorm:"size:120;index" json:"source_app_id"`
	IPPC                  string    `gorm:"size:80" json:"ip_pc"`
	DestinationAppID      string    `gorm:"size:120;index" json:"destination_app_id"`
	Status                string    `gorm:"size:40;index" json:"status"`
	FinishTime            int64     `json:"finish_time"`
	MsgRequest            datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"msg_request,omitempty"`
	MsgResponse           datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"msg_response,omitempty"`
	RequestInID           string    `gorm:"size:120;index" json:"request_in_id"`
	RequestOutID          string    `gorm:"size:120;index" json:"request_out_id"`
	RequestTimeMilisecond int64     `gorm:"index" json:"request_time_milisecond"`
	CreatedAt             time.Time `json:"created_at"`
}

func (WsAudit) TableName() string { return "ws_audit" }
