package dto

type PracticeModesResponse struct {
	Modes []string `json:"modes"`
}

type PracticeStartRequest struct {
	Mode    string `json:"mode"`
	SubMode string `json:"sub_mode"`
	Prompt  string `json:"prompt"`
}

type PracticeSubmitRequest struct {
	SessionID string `json:"session_id" binding:"required"`
	Answer    string `json:"answer" binding:"required"`
}

type PracticeSessionItem struct {
	ID           string  `json:"id"`
	Mode         string  `json:"mode"`
	SubMode      string  `json:"sub_mode"`
	Status       string  `json:"status"`
	Prompt       string  `json:"prompt"`
	ExpectedText string  `json:"expected_text,omitempty"`
	Score        float64 `json:"score,omitempty"`
	Feedback     string  `json:"feedback,omitempty"`
	StartedAt    string  `json:"started_at"`
	SubmittedAt  string  `json:"submitted_at,omitempty"`
}

type PronunciationAnalyzeWordRequest struct {
	Word string `json:"word" binding:"required"`
}

type PronunciationAnalyzeSentenceRequest struct {
	Sentence string `json:"sentence" binding:"required"`
}

type PronunciationHistoryQuery struct {
	PaginationQuery
	Kind string `form:"kind"`
}

type PronunciationHistoryItem struct {
	ID        string  `json:"id"`
	Kind      string  `json:"kind"`
	Source    string  `json:"source"`
	Accuracy  float64 `json:"accuracy"`
	Feedback  string  `json:"feedback"`
	CreatedAt string  `json:"created_at"`
}

type DictionaryLookupQuery struct {
	Word string `form:"word" binding:"required"`
}

type DictionaryLookupResponse struct {
	Word        string `json:"word"`
	Meaning     string `json:"meaning"`
	IPA         string `json:"ipa"`
	Audio       string `json:"audio"`
	WordType    string `json:"word_type"`
	Collocation string `json:"collocation"`
	Example     string `json:"example"`
	Saved       bool   `json:"saved"`
}

type DictionarySaveRequest struct {
	Word string `json:"word" binding:"required"`
}

type DictionaryHistoryQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Saved  *bool  `form:"saved"`
}

type ReadingLookupRequest struct {
	Word    string `json:"word" binding:"required"`
	Context string `json:"context"`
}

type ReadingSaveWordRequest struct {
	Word string `json:"word" binding:"required"`
}

type VocabularySetListQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Domain string `form:"domain"`
}

type VocabularySetRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Domain      string `json:"domain"`
}

type VocabularySetItem struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Domain      string   `json:"domain"`
	Words       []string `json:"words,omitempty"`
}

type VocabularySetAddWordRequest struct {
	WordID string `json:"word_id" binding:"required"`
}

type AIStreamRequest struct {
	Message string `json:"message" binding:"required"`
	Context string `json:"context"`
}
