package handler

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	storage "github.com/unitechio/eLearning/apps/api/internal/infrastructure/filestorage"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

// DocumentHandler handles document and media file uploads.
type DocumentHandler struct {
	storage *storage.MinioStorage
}

// NewDocumentHandler creates a new DocumentHandler.
func NewDocumentHandler(s *storage.MinioStorage) *DocumentHandler {
	return &DocumentHandler{storage: s}
}

// Upload godoc
// @Summary      Upload a document or media file
// @Description  Uploads a file (PDF, audio, image, video) to the media storage. Returns the file URL and metadata.
//
//	Supported types: .pdf, .mp3, .wav, .ogg, .mp4, .webm, .png, .jpg, .jpeg, .webp, .gif, .svg
//
// @Tags         admin-documents
// @Security     BearerAuth
// @Accept       multipart/form-data
// @Produce      json
// @Param        file    formData  file    true   "File to upload"
// @Param        folder  formData  string  false  "Storage entity type / folder (e.g. ielts, assignments, thumbnails)"
// @Success      201  {object}  response.Envelope{data=DocumentUploadResponse}
// @Failure      400  {object}  response.Envelope
// @Failure      413  {object}  response.Envelope "File too large (max 100MB)"
// @Failure      503  {object}  response.Envelope "Storage not configured"
// @Router       /admin/documents/upload [post]
func (h *DocumentHandler) Upload(c *gin.Context) {
	if h.storage == nil {
		response.Fail(c, 503, "storage not configured")
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		response.Fail(c, 400, "file is required")
		return
	}

	const maxSize = 100 * 1024 * 1024 // 100MB
	if file.Size > maxSize {
		response.Fail(c, 413, "file too large (max 100MB)")
		return
	}

	folder := c.PostForm("folder")
	if folder == "" {
		folder = "documents"
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	objectName, err := h.storage.UploadFileWithUUID(ctx, file, folder, userID)
	if err != nil {
		_ = c.Error(fmt.Errorf("upload failed: %w", err))
		return
	}

	serveURL := fmt.Sprintf("/api/v1/public/media/serve?key=%s", objectName)
	response.Created(c, "document uploaded", DocumentUploadResponse{
		URL:        serveURL,
		Key:        objectName,
		FileName:   file.Filename,
		SizeBytes:  file.Size,
		UploadedBy: userID.String(),
		UploadedAt: time.Now().UTC().Format(time.RFC3339),
	})
}

// UploadPublicAsset godoc
// @Summary      Upload a public media asset (thumbnail, audio, image)
// @Description  Uploads an asset to public storage for use in IELTS content, courses, etc.
// @Tags         admin-documents
// @Security     BearerAuth
// @Accept       multipart/form-data
// @Produce      json
// @Param        file    formData  file    true   "File to upload (image, audio, pdf)"
// @Param        folder  formData  string  false  "Sub-folder: thumbnails, audio, pdf"
// @Success      201  {object}  response.Envelope{data=DocumentUploadResponse}
// @Failure      400  {object}  response.Envelope
// @Failure      413  {object}  response.Envelope "File too large (max 50MB)"
// @Router       /admin/documents/upload-public [post]
func (h *DocumentHandler) UploadPublicAsset(c *gin.Context) {
	if h.storage == nil {
		response.Fail(c, 503, "storage not configured")
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		response.Fail(c, 400, "file is required")
		return
	}

	const maxSize = 50 * 1024 * 1024 // 50MB
	if file.Size > maxSize {
		response.Fail(c, 413, "file too large (max 50MB)")
		return
	}

	folder := c.PostForm("folder")
	if folder == "" {
		folder = "public/assets"
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	objectName, err := h.storage.UploadFileWithUUID(ctx, file, folder, userID)
	if err != nil {
		_ = c.Error(fmt.Errorf("upload failed: %w", err))
		return
	}

	// Public assets are served via the media handler
	serveURL := fmt.Sprintf("/api/v1/public/media/serve?key=%s", objectName)
	thumbnailURL := fmt.Sprintf("/api/v1/public/media/thumbnail?key=%s&w=800&h=600", objectName)

	response.Created(c, "public asset uploaded", DocumentUploadResponse{
		URL:          serveURL,
		ThumbnailURL: thumbnailURL,
		Key:          objectName,
		FileName:     file.Filename,
		SizeBytes:    file.Size,
		UploadedBy:   userID.String(),
		UploadedAt:   time.Now().UTC().Format(time.RFC3339),
	})
}

// DocumentUploadResponse is returned after a successful file upload.
type DocumentUploadResponse struct {
	// URL is the full serving URL for the uploaded file
	URL string `json:"url" example:"/api/v1/public/media/serve?key=documents/abc.pdf"`
	// ThumbnailURL optional thumbnail URL (for images)
	ThumbnailURL string `json:"thumbnail_url,omitempty" example:"/api/v1/public/media/thumbnail?key=abc.jpg&w=400&h=300"`
	// Key is the storage object key (use with media serve endpoint)
	Key string `json:"key" example:"documents/user-id/20240101_120000_report.pdf"`
	// FileName original filename
	FileName string `json:"file_name" example:"my-document.pdf"`
	// SizeBytes file size in bytes
	SizeBytes int64 `json:"size_bytes" example:"102400"`
	// UploadedBy user UUID who uploaded
	UploadedBy string `json:"uploaded_by" example:"550e8400-e29b-41d4-a716-446655440000"`
	// UploadedAt RFC3339 timestamp
	UploadedAt string `json:"uploaded_at" example:"2024-01-01T12:00:00Z"`
}
