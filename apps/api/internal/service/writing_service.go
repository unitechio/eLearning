package service

import (
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/model"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type SubmitRequest struct {
	PromptText string `json:"prompt" binding:"required"`
	Response   string `json:"response" binding:"required,min=50"`
}

type HistoryResponse struct {
	Items []model.WritingSubmission `json:"items"`
	Meta  response.Meta             `json:"meta"`
}

type WritingService interface {
	Submit(userID uuid.UUID, req SubmitRequest) (*model.WritingSubmission, error)
	GetHistory(userID uuid.UUID, page, pageSize int) (*HistoryResponse, error)
	GetSubmissionByID(userID, submissionID uuid.UUID) (*model.WritingSubmission, error)
}
