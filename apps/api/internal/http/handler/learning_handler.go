package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type WritingExtrasHandler struct {
	svc usecase.WritingExtrasService
}

type SpeakingExtrasHandler struct {
	svc usecase.SpeakingExtrasService
}

type VocabularyExtrasHandler struct {
	svc usecase.VocabularyExtrasService
}

type ListeningHandler struct {
	svc usecase.ListeningService
}

type AIHandler struct {
	svc usecase.AIService
}

func NewWritingExtrasHandler(svc usecase.WritingExtrasService) *WritingExtrasHandler {
	return &WritingExtrasHandler{svc: svc}
}

func NewSpeakingExtrasHandler(svc usecase.SpeakingExtrasService) *SpeakingExtrasHandler {
	return &SpeakingExtrasHandler{svc: svc}
}

func NewVocabularyExtrasHandler(svc usecase.VocabularyExtrasService) *VocabularyExtrasHandler {
	return &VocabularyExtrasHandler{svc: svc}
}

func NewListeningHandler(svc usecase.ListeningService) *ListeningHandler {
	return &ListeningHandler{svc: svc}
}

func NewAIHandler(svc usecase.AIService) *AIHandler {
	return &AIHandler{svc: svc}
}

// GetByID godoc
// @Summary      Get writing item by id
// @Tags         writing
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Writing ID"
// @Success      200  {object}  response.Envelope
// @Router       /writing/{id} [get]
func (h *WritingExtrasHandler) GetByID(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.GetWritingByID(requestContext(c), userID, c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "writing submission fetched", item)
}

// Evaluate godoc
// @Summary      Evaluate writing text
// @Tags         writing
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.WritingEvaluationRequest  true  "Writing evaluation payload"
// @Success      200   {object}  response.Envelope
// @Router       /writing/evaluate [post]
func (h *WritingExtrasHandler) Evaluate(c *gin.Context) {
	var req dto.WritingEvaluationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.EvaluateWriting(requestContext(c), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "writing evaluated", item)
}

// StartSession godoc
// @Summary      Start speaking session
// @Tags         speaking
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.SpeakingSession}
// @Router       /speaking/session/start [post]
func (h *SpeakingExtrasHandler) StartSession(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.StartSession(requestContext(c), userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "speaking session started", item)
}

// StopSession godoc
// @Summary      Stop speaking session
// @Tags         speaking
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.SpeakingSession}
// @Router       /speaking/session/stop [post]
func (h *SpeakingExtrasHandler) StopSession(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.StopSession(requestContext(c), userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "speaking session stopped", item)
}

// GetSession godoc
// @Summary      Get speaking session by id
// @Tags         speaking
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Session ID"
// @Success      200  {object}  response.Envelope{data=dto.SpeakingSession}
// @Router       /speaking/session/{id} [get]
func (h *SpeakingExtrasHandler) GetSession(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.GetSession(requestContext(c), userID, c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "speaking session fetched", item)
}

// Pronunciation godoc
// @Summary      Analyze pronunciation
// @Tags         speaking
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.PronunciationRequest  true  "Pronunciation payload"
// @Success      200   {object}  response.Envelope{data=dto.PronunciationResult}
// @Router       /speaking/pronunciation [post]
func (h *SpeakingExtrasHandler) Pronunciation(c *gin.Context) {
	var req dto.PronunciationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.CheckPronunciation(requestContext(c), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "pronunciation analyzed", item)
}

// UpdateWord godoc
// @Summary      Update vocabulary word
// @Tags         vocabulary
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                   true  "Word ID"
// @Param        body  body      dto.UpdateWordRequest  true  "Word payload"
// @Success      200   {object}  response.Envelope
// @Router       /vocabulary/words/{id} [put]
func (h *VocabularyExtrasHandler) UpdateWord(c *gin.Context) {
	var req dto.UpdateWordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.UpdateWord(requestContext(c), c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "word updated", item)
}

// DeleteWord godoc
// @Summary      Delete vocabulary word
// @Tags         vocabulary
// @Security     BearerAuth
// @Param        id  path  string  true  "Word ID"
// @Success      204
// @Router       /vocabulary/words/{id} [delete]
func (h *VocabularyExtrasHandler) DeleteWord(c *gin.Context) {
	if err := h.svc.DeleteWord(requestContext(c), c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.NoContent(c)
}

// History godoc
// @Summary      Get vocabulary review history
// @Tags         vocabulary
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by word or definition"
// @Param        result     query     string  false  "Filter by result"
// @Success      200  {object}  response.Envelope{data=[]dto.VocabularyHistoryItem}
// @Router       /vocabulary/history [get]
func (h *VocabularyExtrasHandler) History(c *gin.Context) {
	var query dto.VocabularyHistoryQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	res, err := h.svc.ListVocabularyHistory(requestContext(c), userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "vocabulary history fetched", res.Items, &res.Meta)
}

// ListLessons godoc
// @Summary      List listening lessons
// @Tags         listening
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search title, description or transcript"
// @Success      200  {object}  response.Envelope{data=[]dto.ListeningLesson}
// @Router       /listening/lessons [get]
func (h *ListeningHandler) ListLessons(c *gin.Context) {
	var query dto.ListeningLessonListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.ListLessons(requestContext(c), query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "listening lessons fetched", res.Items, &res.Meta)
}

// GetLesson godoc
// @Summary      Get listening lesson by id
// @Tags         listening
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Listening lesson ID"
// @Success      200  {object}  response.Envelope{data=dto.ListeningLesson}
// @Router       /listening/{id} [get]
func (h *ListeningHandler) GetLesson(c *gin.Context) {
	item, err := h.svc.GetLesson(requestContext(c), c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "listening lesson fetched", item)
}

// Submit godoc
// @Summary      Submit listening answers
// @Tags         listening
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                             true  "Listening lesson ID"
// @Param        body  body      dto.ListeningSubmissionRequest  true  "Listening submission payload"
// @Success      200   {object}  response.Envelope
// @Router       /listening/{id}/submit [post]
func (h *ListeningHandler) Submit(c *gin.Context) {
	var req dto.ListeningSubmissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.SubmitLesson(requestContext(c), c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "listening lesson submitted", item)
}

// Chat godoc
// @Summary      Chat with AI coach
// @Tags         ai
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AIChatRequest  true  "AI chat payload"
// @Success      200   {object}  response.Envelope
// @Router       /ai/chat [post]
func (h *AIHandler) Chat(c *gin.Context) {
	var req dto.AIChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.Chat(requestContext(c), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "ai chat response generated", item)
}

// EvaluateWriting godoc
// @Summary      Evaluate writing with AI
// @Tags         ai
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.WritingEvaluationRequest  true  "AI writing evaluation payload"
// @Success      200   {object}  response.Envelope
// @Router       /ai/evaluate-writing [post]
func (h *AIHandler) EvaluateWriting(c *gin.Context) {
	var req dto.WritingEvaluationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.EvaluateWriting(requestContext(c), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "ai writing evaluation generated", item)
}

// EvaluateSpeaking godoc
// @Summary      Evaluate speaking with AI
// @Tags         ai
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AIChatRequest  true  "AI speaking evaluation payload"
// @Success      200   {object}  response.Envelope
// @Router       /ai/evaluate-speaking [post]
func (h *AIHandler) EvaluateSpeaking(c *gin.Context) {
	var req dto.AIChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.EvaluateSpeaking(requestContext(c), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "ai speaking evaluation generated", item)
}

// GenerateQuestion godoc
// @Summary      Generate question with AI
// @Tags         ai
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AIQuestionRequest  true  "AI question payload"
// @Success      200   {object}  response.Envelope
// @Router       /ai/generate-question [post]
func (h *AIHandler) GenerateQuestion(c *gin.Context) {
	var req dto.AIQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.GenerateQuestion(requestContext(c), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "ai question generated", item)
}
