package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type VocabularyHandler struct {
	svc service.VocabularyService
}

func NewVocabularyHandler(svc service.VocabularyUsecase) *VocabularyHandler {
	return &VocabularyHandler{svc: svc}
}

// GetDueWords godoc
// @Summary      Get vocabulary cards due for review
// @Tags         vocabulary
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]domain.UserVocabularyProgress}
// @Failure      401  {object}  response.Envelope
// @Router       /vocabulary/due [get]
// @Router       /vocabulary/reviews/due [get]
func (h *VocabularyHandler) GetDueWords(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}

	items, err := h.svc.GetDueWords(userID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "due words fetched", items)
}

// SubmitReview godoc
// @Summary      Submit a vocabulary review result
// @Tags         vocabulary
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      service.ReviewRequest  true  "Review payload"
// @Success      200   {object}  response.Envelope{data=domain.UserVocabularyProgress}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /vocabulary/review [post]
// @Router       /vocabulary/reviews [post]
func (h *VocabularyHandler) SubmitReview(c *gin.Context) {
	var req service.ReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}

	progress, err := h.svc.SubmitReview(userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "review submitted", progress)
}

// GetAllWords godoc
// @Summary      List vocabulary words
// @Tags         vocabulary
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope{data=[]domain.VocabularyWord}
// @Failure      401  {object}  response.Envelope
// @Router       /vocabulary/words [get]
func (h *VocabularyHandler) GetAllWords(c *gin.Context) {
	words, err := h.svc.GetAllWords()
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "words fetched", words)
}

// GetWord godoc
// @Summary      Get a vocabulary word by id
// @Tags         vocabulary
// @Security     BearerAuth
// @Produce      json
// @Param        wordId  path      string  true  "Word ID"
// @Success      200     {object}  response.Envelope{data=domain.VocabularyWord}
// @Failure      400     {object}  response.Envelope
// @Failure      401     {object}  response.Envelope
// @Failure      404     {object}  response.Envelope
// @Router       /vocabulary/words/{wordId} [get]
func (h *VocabularyHandler) GetWord(c *gin.Context) {
	wordID, err := uuid.Parse(c.Param("wordId"))
	if err != nil {
		response.Fail(c, 400, "invalid word id")
		return
	}

	word, err := h.svc.GetWordByID(wordID)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "word fetched", word)
}

// CreateWord godoc
// @Summary      Create a vocabulary word
// @Tags         vocabulary
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      service.CreateWordRequest  true  "Word payload"
// @Success      201   {object}  response.Envelope{data=domain.VocabularyWord}
// @Failure      400   {object}  response.Envelope
// @Failure      401   {object}  response.Envelope
// @Router       /vocabulary/words [post]
func (h *VocabularyHandler) CreateWord(c *gin.Context) {
	var req service.CreateWordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}

	word, err := h.svc.CreateWord(userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "word created", word)
}
