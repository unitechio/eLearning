package handler

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type PracticeHandler struct {
	svc usecase.PracticeService
}

func NewPracticeHandler(svc usecase.PracticeService) *PracticeHandler {
	return &PracticeHandler{svc: svc}
}

// PracticeModes godoc
// @Summary      Get practice modes
// @Tags         practice
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=dto.PracticeModesResponse}
// @Router       /practice/modes [get]
func (h *PracticeHandler) PracticeModes(c *gin.Context) {
	item, err := h.svc.GetModes(requestContext(c))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "practice modes fetched", item)
}

// PracticeStart godoc
// @Summary      Start practice session
// @Tags         practice
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.PracticeStartRequest  true  "Practice start payload"
// @Success      200   {object}  response.Envelope{data=dto.PracticeSessionItem}
// @Router       /practice/start [post]
// @Router       /practice/dictation/start [post]
// @Router       /practice/shadowing/start [post]
func (h *PracticeHandler) PracticeStart(c *gin.Context) {
	var req dto.PracticeStartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	if req.Mode == "" {
		switch {
		case strings.Contains(c.FullPath(), "/dictation/"):
			req.Mode = "dictation"
		case strings.Contains(c.FullPath(), "/shadowing/"):
			req.Mode = "shadowing"
		default:
			req.Mode = "practice"
		}
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.Start(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "practice session started", item)
}

// PracticeSubmit godoc
// @Summary      Submit practice session
// @Tags         practice
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.PracticeSubmitRequest  true  "Practice submit payload"
// @Success      200   {object}  response.Envelope{data=dto.PracticeSessionItem}
// @Router       /practice/submit [post]
// @Router       /practice/dictation/submit [post]
// @Router       /practice/shadowing/submit [post]
func (h *PracticeHandler) PracticeSubmit(c *gin.Context) {
	var req dto.PracticeSubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.Submit(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "practice session submitted", item)
}

// AnalyzeWord godoc
// @Summary      Analyze word pronunciation
// @Tags         pronunciation
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.PronunciationAnalyzeWordRequest  true  "Word payload"
// @Success      200   {object}  response.Envelope{data=dto.PronunciationHistoryItem}
// @Router       /pronunciation/analyze-word [post]
func (h *PracticeHandler) AnalyzeWord(c *gin.Context) {
	var req dto.PronunciationAnalyzeWordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.AnalyzeWord(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "word pronunciation analyzed", item)
}

// AnalyzeSentence godoc
// @Summary      Analyze sentence pronunciation
// @Tags         pronunciation
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.PronunciationAnalyzeSentenceRequest  true  "Sentence payload"
// @Success      200   {object}  response.Envelope{data=dto.PronunciationHistoryItem}
// @Router       /pronunciation/analyze-sentence [post]
func (h *PracticeHandler) AnalyzeSentence(c *gin.Context) {
	var req dto.PronunciationAnalyzeSentenceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.AnalyzeSentence(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "sentence pronunciation analyzed", item)
}

// PronunciationHistory godoc
// @Summary      Get pronunciation history
// @Tags         pronunciation
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        kind       query     string  false  "word or sentence"
// @Success      200        {object}  response.Envelope{data=[]dto.PronunciationHistoryItem}
// @Router       /pronunciation/history [get]
func (h *PracticeHandler) PronunciationHistory(c *gin.Context) {
	var query dto.PronunciationHistoryQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	res, err := h.svc.ListPronunciationHistory(requestContext(c), userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "pronunciation history fetched", res.Items, &res.Meta)
}

// DictionaryLookup godoc
// @Summary      Lookup dictionary entry
// @Tags         dictionary
// @Security     BearerAuth
// @Produce      json
// @Param        word  query     string  true  "Word to lookup"
// @Success      200   {object}  response.Envelope{data=dto.DictionaryLookupResponse}
// @Router       /dictionary/lookup [get]
func (h *PracticeHandler) DictionaryLookup(c *gin.Context) {
	var query dto.DictionaryLookupQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.LookupDictionary(requestContext(c), userID, query.Word)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "dictionary entry fetched", item)
}

// DictionarySave godoc
// @Summary      Save dictionary word
// @Tags         dictionary
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.DictionarySaveRequest  true  "Word payload"
// @Success      200   {object}  response.Envelope{data=dto.DictionaryLookupResponse}
// @Router       /dictionary/save [post]
func (h *PracticeHandler) DictionarySave(c *gin.Context) {
	var req dto.DictionarySaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.SaveDictionaryWord(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "dictionary word saved", item)
}

// DictionaryHistory godoc
// @Summary      Get dictionary history
// @Tags         dictionary
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int   false  "Page number"
// @Param        page_size  query     int   false  "Page size"
// @Param        q          query     string false "Search by word or meaning"
// @Param        saved      query     bool  false  "Filter by saved state"
// @Success      200        {object}  response.Envelope{data=[]dto.DictionaryLookupResponse}
// @Router       /dictionary/history [get]
func (h *PracticeHandler) DictionaryHistory(c *gin.Context) {
	var query dto.DictionaryHistoryQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	res, err := h.svc.ListDictionaryHistory(requestContext(c), userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "dictionary history fetched", res.Items, &res.Meta)
}

// ReadingLookup godoc
// @Summary      Inline reading lookup
// @Tags         reading
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.ReadingLookupRequest  true  "Reading lookup payload"
// @Success      200   {object}  response.Envelope{data=dto.DictionaryLookupResponse}
// @Router       /reading/lookup [post]
func (h *PracticeHandler) ReadingLookup(c *gin.Context) {
	var req dto.ReadingLookupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.ReadingLookup(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "reading lookup fetched", item)
}

// ReadingSaveWord godoc
// @Summary      Save reading word
// @Tags         reading
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.ReadingSaveWordRequest  true  "Reading save payload"
// @Success      200   {object}  response.Envelope{data=dto.DictionaryLookupResponse}
// @Router       /reading/save-word [post]
func (h *PracticeHandler) ReadingSaveWord(c *gin.Context) {
	var req dto.ReadingSaveWordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.ReadingSaveWord(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "reading word saved", item)
}

// VocabularySets godoc
// @Summary      List vocabulary sets
// @Tags         vocab-sets
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by set name"
// @Param        domain     query     string  false  "Filter by domain"
// @Success      200        {object}  response.Envelope{data=[]dto.VocabularySetItem}
// @Router       /vocab/sets [get]
func (h *PracticeHandler) VocabularySets(c *gin.Context) {
	var query dto.VocabularySetListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	res, err := h.svc.ListVocabularySets(requestContext(c), userID, query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "vocabulary sets fetched", res.Items, &res.Meta)
}

// CreateVocabularySet godoc
// @Summary      Create vocabulary set
// @Tags         vocab-sets
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.VocabularySetRequest  true  "Vocabulary set payload"
// @Success      201   {object}  response.Envelope{data=dto.VocabularySetItem}
// @Router       /vocab/sets [post]
func (h *PracticeHandler) CreateVocabularySet(c *gin.Context) {
	var req dto.VocabularySetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.CreateVocabularySet(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "vocabulary set created", item)
}

// GetVocabularySet godoc
// @Summary      Get vocabulary set by id
// @Tags         vocab-sets
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Set ID"
// @Success      200  {object}  response.Envelope{data=dto.VocabularySetItem}
// @Router       /vocab/sets/{id} [get]
func (h *PracticeHandler) GetVocabularySet(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.GetVocabularySet(requestContext(c), userID, c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "vocabulary set fetched", item)
}

// AddWordToSet godoc
// @Summary      Add word to vocabulary set
// @Tags         vocab-sets
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                      true  "Set ID"
// @Param        body  body      dto.VocabularySetAddWordRequest  true  "Word payload"
// @Success      200   {object}  response.Envelope{data=dto.VocabularySetItem}
// @Router       /vocab/sets/{id}/add-word [post]
func (h *PracticeHandler) AddWordToSet(c *gin.Context) {
	var req dto.VocabularySetAddWordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.AddWordToSet(requestContext(c), userID, c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "word added to set", item)
}

// StreamResponse godoc
// @Summary      Get premium AI stream response
// @Tags         ai
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AIStreamRequest  true  "AI stream payload"
// @Success      200   {object}  response.Envelope
// @Router       /ai/stream-response [post]
func (h *PracticeHandler) StreamResponse(c *gin.Context) {
	var req dto.AIStreamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.StreamResponse(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "ai stream response generated", item)
}

// PronunciationFeedback godoc
// @Summary      Get premium AI pronunciation feedback
// @Tags         ai
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AIStreamRequest  true  "Pronunciation feedback payload"
// @Success      200   {object}  response.Envelope
// @Router       /ai/pronunciation-feedback [post]
func (h *PracticeHandler) PronunciationFeedback(c *gin.Context) {
	var req dto.AIStreamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.PronunciationFeedback(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "pronunciation feedback generated", item)
}

// ContextCorrection godoc
// @Summary      Get premium AI context correction
// @Tags         ai
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.AIStreamRequest  true  "Context correction payload"
// @Success      200   {object}  response.Envelope
// @Router       /ai/context-correction [post]
func (h *PracticeHandler) ContextCorrection(c *gin.Context) {
	var req dto.AIStreamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.ContextCorrection(requestContext(c), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "context correction generated", item)
}
