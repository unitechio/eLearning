package dto

type WritingEvaluationRequest struct {
	Prompt string `json:"prompt" binding:"required"`
	Text   string `json:"text" binding:"required"`
}

type SpeakingSession struct {
	ID        string `json:"id"`
	Status    string `json:"status"`
	StartedAt string `json:"started_at"`
	StoppedAt string `json:"stopped_at,omitempty"`
}

type PronunciationRequest struct {
	Text string `json:"text" binding:"required"`
}

type PronunciationResult struct {
	Accuracy float64 `json:"accuracy"`
	Feedback string  `json:"feedback"`
}

type UpdateWordRequest struct {
	Word         string  `json:"word" binding:"required"`
	Definition   string  `json:"definition" binding:"required"`
	PartOfSpeech *string `json:"part_of_speech,omitempty"`
	Phonetic     *string `json:"phonetic,omitempty"`
	Level        *string `json:"level,omitempty"`
	Example      *string `json:"example,omitempty"`
}

type VocabularyHistoryItem struct {
	ID         string `json:"id"`
	WordID     string `json:"word_id"`
	Result     string `json:"result"`
	ReviewedAt string `json:"reviewed_at"`
}

type VocabularyHistoryQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Result string `form:"result"`
}

type ListeningLesson struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	AudioURL    string `json:"audio_url"`
}

type ListeningLessonListQuery struct {
	PaginationQuery
	Search string `form:"q"`
}

type ListeningSubmissionRequest struct {
	Answers []string `json:"answers" binding:"required"`
}

type AIChatRequest struct {
	Message string `json:"message" binding:"required"`
	Domain  string `json:"domain"`
}

type AIQuestionRequest struct {
	Topic  string `json:"topic" binding:"required"`
	Domain string `json:"domain" binding:"required"`
}
