package usecase

type AnalyzeResult struct {
	Transcript     string  `json:"transcript"`
	Score          float64 `json:"score"`
	Feedback       string  `json:"feedback"`
	ImprovedAnswer string  `json:"improved_answer"`
}

type SpeakingService interface {
	AnalyzeAudio(audioData []byte) (*AnalyzeResult, error)
}
