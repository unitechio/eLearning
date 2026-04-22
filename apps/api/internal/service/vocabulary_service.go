package service

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
)

type ReviewRequest struct {
	WordID  uuid.UUID `json:"word_id" binding:"required"`
	Correct bool      `json:"correct"`
}

type CreateWordRequest struct {
	Word         string  `json:"word" binding:"required,min=1,max=100"`
	Definition   string  `json:"definition" binding:"required"`
	PartOfSpeech *string `json:"part_of_speech,omitempty"`
	Phonetic     *string `json:"phonetic,omitempty"`
	Level        *string `json:"level,omitempty"`
	Example      *string `json:"example,omitempty"`
}

type VocabularyService interface {
	GetDueWords(userID uuid.UUID) ([]model.UserVocabularyProgress, error)
	SubmitReview(userID uuid.UUID, req ReviewRequest) (*model.UserVocabularyProgress, error)
	GetAllWords() ([]model.VocabularyWord, error)
	GetWordByID(id uuid.UUID) (*model.VocabularyWord, error)
	CreateWord(tenantID uuid.UUID, req CreateWordRequest) (*model.VocabularyWord, error)
}
