package handler

import (
	"encoding/csv"
	"fmt"
	"log/slog"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/usecase"
	storage "github.com/unitechio/eLearning/apps/api/internal/infrastructure/filestorage"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type DocumentHandler struct {
	storage *storage.MinioStorage
	svc     usecase.DocumentUsecase
	logger  *slog.Logger
}

func NewDocumentHandler(s *storage.MinioStorage, svc usecase.DocumentUsecase, logger *slog.Logger) *DocumentHandler {
	if logger == nil {
		logger = slog.Default()
	}
	return &DocumentHandler{
		storage: s,
		svc:     svc,
		logger:  logger,
	}
}

// Upload handles legacy direct file uploads
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

// UploadPublicAsset handles legacy public file uploads
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

// Create uploads a new document with an initial version
func (h *DocumentHandler) Create(c *gin.Context) {
	rid, _ := c.Get("RequestID")
	log := h.logger.With(slog.String("request_id", fmt.Sprintf("%v", rid)), slog.String("handler", "Document.Create"))

	title := c.PostForm("title")
	if title == "" {
		response.Fail(c, 400, "title is required")
		return
	}

	description := c.PostForm("description")
	visibility := c.PostForm("visibility")
	if visibility == "" {
		visibility = domain.VisibilityPrivate
	}

	var folderID *uint
	if fIDStr := c.PostForm("folder_id"); fIDStr != "" {
		if val, err := strconv.ParseUint(fIDStr, 10, 32); err == nil {
			uVal := uint(val)
			folderID = &uVal
		}
	}

	file, err := c.FormFile("file")
	if err != nil {
		log.Warn("form file missing", slog.String("error", err.Error()))
		response.Fail(c, 400, "file is required")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	log.Info("creating document",
		slog.String("title", title),
		slog.String("filename", file.Filename),
		slog.Int64("size", file.Size),
		slog.String("mime", file.Header.Get("Content-Type")),
		slog.String("user_id", userID.String()),
	)

	fileReader, err := file.Open()
	if err != nil {
		log.Error("failed to open uploaded file", slog.String("error", err.Error()))
		response.Fail(c, 500, "failed to open file")
		return
	}
	defer fileReader.Close()

	ctx := requestContext(c)
	doc, err := h.svc.CreateDocument(ctx, title, description, folderID, visibility, userID, file.Filename, fileReader, file.Size, file.Header.Get("Content-Type"))
	if err != nil {
		log.Error("CreateDocument failed",
			slog.String("error", err.Error()),
			slog.String("title", title),
			slog.String("filename", file.Filename),
			slog.String("user_id", userID.String()),
		)
		_ = c.Error(fmt.Errorf("CreateDocument: %w", err))
		response.Fail(c, 500, err.Error())
		return
	}

	log.Info("document created successfully", slog.Uint64("doc_id", uint64(doc.ID)))
	response.Created(c, "document created successfully", doc)
}

// List lists all documents with optional filters and sorting
func (h *DocumentHandler) List(c *gin.Context) {
	rid, _ := c.Get("RequestID")
	log := h.logger.With(slog.String("request_id", fmt.Sprintf("%v", rid)), slog.String("handler", "Document.List"))

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	var filter domain.DocumentFilter

	if fIDStr := c.Query("folder_id"); fIDStr != "" {
		if fIDStr == "null" {
			filter.FolderNull = true
		} else if val, err := strconv.ParseUint(fIDStr, 10, 32); err == nil {
			uVal := uint(val)
			filter.FolderID = &uVal
		}
	}

	filter.Status = c.Query("status")
	filter.Visibility = c.Query("visibility")
	filter.MimeType = c.Query("mime_type")
	filter.Search = c.Query("search")
	filter.SortBy = c.Query("sort_by")

	if favStr := c.Query("is_favorite"); favStr != "" {
		val := favStr == "true"
		filter.IsFavorite = &val
	}

	if startStr := c.Query("start_date"); startStr != "" {
		if t, err := time.Parse(time.RFC3339, startStr); err == nil {
			filter.StartDate = &t
		} else if t, err := time.Parse("2006-01-02", startStr); err == nil {
			filter.StartDate = &t
		}
	}

	if endStr := c.Query("end_date"); endStr != "" {
		if t, err := time.Parse(time.RFC3339, endStr); err == nil {
			t = t.Add(24 * time.Hour - time.Second)
			filter.EndDate = &t
		} else if t, err := time.Parse("2006-01-02", endStr); err == nil {
			t = t.Add(24 * time.Hour - time.Second)
			filter.EndDate = &t
		}
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	filter.Limit = limit
	filter.Offset = offset

	ctx := requestContext(c)
	docs, total, err := h.svc.ListDocuments(ctx, filter, userID)
	if err != nil {
		log.Error("ListDocuments failed",
			slog.String("error", err.Error()),
			slog.String("user_id", userID.String()),
			slog.String("status", filter.Status),
			slog.String("sort_by", filter.SortBy),
		)
		_ = c.Error(fmt.Errorf("ListDocuments: %w", err))
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "documents retrieved successfully", gin.H{
		"items": docs,
		"total": total,
		"limit": limit,
		"offset": offset,
	})
}

// GetByID gets a document's details
func (h *DocumentHandler) GetByID(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	doc, err := h.svc.GetDocumentByID(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "document retrieved successfully", doc)
}

// Update updates document metadata
func (h *DocumentHandler) Update(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	var req struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		FolderID    *uint  `json:"folder_id"`
		Visibility  string `json:"visibility"`
		IsFavorite  bool   `json:"is_favorite"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	doc, err := h.svc.UpdateDocument(ctx, uint(idVal), req.Title, req.Description, req.FolderID, req.Visibility, req.IsFavorite, userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "document updated successfully", doc)
}

// Delete soft deletes a document
func (h *DocumentHandler) Delete(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	err = h.svc.DeleteDocument(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "document deleted successfully", nil)
}

// Restore restores a soft deleted document
func (h *DocumentHandler) Restore(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	err = h.svc.RestoreDocument(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "document restored successfully", nil)
}

// PermanentDelete permanently deletes a document and its files
func (h *DocumentHandler) PermanentDelete(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	err = h.svc.PermanentDeleteDocument(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "document permanently deleted", nil)
}

// CreateVersion uploads a new version of an existing document
func (h *DocumentHandler) CreateVersion(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	changeSummary := c.PostForm("change_summary")
	file, err := c.FormFile("file")
	if err != nil {
		response.Fail(c, 400, "file is required")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	fileReader, err := file.Open()
	if err != nil {
		response.Fail(c, 500, "failed to open file")
		return
	}
	defer fileReader.Close()

	ctx := requestContext(c)
	version, err := h.svc.CreateVersion(ctx, uint(idVal), changeSummary, userID, file.Filename, fileReader, file.Size, file.Header.Get("Content-Type"))
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.Created(c, "new version uploaded", version)
}

// GetVersions lists versions of a document
func (h *DocumentHandler) GetVersions(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	versions, err := h.svc.GetVersions(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "versions retrieved successfully", versions)
}

// Share shares a document
func (h *DocumentHandler) Share(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	var req struct {
		SubjectType string `json:"subject_type"` // "user", "role"
		SubjectID   string `json:"subject_id"`
		Permission  string `json:"permission"`   // viewer, editor
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	perm, err := h.svc.ShareDocument(ctx, uint(idVal), req.SubjectType, req.SubjectID, req.Permission, userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "document shared successfully", perm)
}

// RevokeAccess revokes sharing access
func (h *DocumentHandler) RevokeAccess(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	permIDVal, err := strconv.ParseUint(c.Param("permissionId"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid permission ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	err = h.svc.RevokeAccess(ctx, uint(idVal), uint(permIDVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "access revoked", nil)
}

// GetPermissions gets permissions for a document
func (h *DocumentHandler) GetPermissions(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	perms, err := h.svc.GetPermissions(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "permissions retrieved", perms)
}

// Favorite favorites a document
func (h *DocumentHandler) Favorite(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	_, err = h.svc.UpdateDocument(ctx, uint(idVal), "", "", nil, "", true, userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "added to favorites", nil)
}

// Unfavorite unfavorites a document
func (h *DocumentHandler) Unfavorite(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	_, err = h.svc.UpdateDocument(ctx, uint(idVal), "", "", nil, "", false, userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "removed from favorites", nil)
}

// GetActivities gets document activities
func (h *DocumentHandler) GetActivities(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	acts, err := h.svc.GetActivities(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "activity history retrieved", acts)
}

// Download gets download URL
func (h *DocumentHandler) Download(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	url, err := h.svc.GetDownloadURL(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "download URL generated", gin.H{"url": url})
}

// Preview gets preview URL
func (h *DocumentHandler) Preview(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	url, err := h.svc.GetPreviewURL(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "preview URL generated", gin.H{"url": url})
}

// GetStats gets library stats
func (h *DocumentHandler) GetStats(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	stats, err := h.svc.GetStats(ctx, nil, userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "statistics retrieved", stats)
}

// Export exports document meta to CSV
func (h *DocumentHandler) Export(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	docs, _, err := h.svc.ListDocuments(ctx, domain.DocumentFilter{Limit: 10000}, userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	c.Header("Content-Disposition", "attachment; filename=document_library_export.csv")
	c.Header("Content-Type", "text/csv")

	writer := csv.NewWriter(c.Writer)
	defer writer.Flush()

	_ = writer.Write([]string{"ID", "Title", "Description", "Owner", "Visibility", "Status", "Created At"})
	for _, doc := range docs {
		ownerEmail := "System"
		if doc.Owner != nil {
			ownerEmail = doc.Owner.Email
		}
		_ = writer.Write([]string{
			strconv.FormatUint(uint64(doc.ID), 10),
			doc.Title,
			doc.Description,
			ownerEmail,
			doc.Visibility,
			doc.Status,
			doc.CreatedAt.Format(time.RFC3339),
		})
	}
}

// CreateFolder creates a folder
func (h *DocumentHandler) CreateFolder(c *gin.Context) {
	var req struct {
		Name     string `json:"name"`
		ParentID *uint  `json:"parent_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	folder, err := h.svc.CreateFolder(ctx, req.Name, req.ParentID, userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.Created(c, "folder created successfully", folder)
}

// UpdateFolder updates folder metadata
func (h *DocumentHandler) UpdateFolder(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	var req struct {
		Name     string `json:"name"`
		ParentID *uint  `json:"parent_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	folder, err := h.svc.UpdateFolder(ctx, uint(idVal), req.Name, req.ParentID, userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "folder updated", folder)
}

// DeleteFolder deletes folder
func (h *DocumentHandler) DeleteFolder(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	err = h.svc.DeleteFolder(ctx, uint(idVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "folder deleted", nil)
}

// ListFolders lists folders
func (h *DocumentHandler) ListFolders(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	var parentID *uint
	if pIDStr := c.Query("parent_id"); pIDStr != "" {
		if val, err := strconv.ParseUint(pIDStr, 10, 32); err == nil {
			uVal := uint(val)
			parentID = &uVal
		}
	}

	ctx := requestContext(c)
	folders, err := h.svc.ListFolders(ctx, userID, parentID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "folders retrieved", folders)
}

// Attach attaches a document to an LMS Resource
func (h *DocumentHandler) Attach(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	var req struct {
		ResourceType string `json:"resource_type"` // course, lesson, assignment
		ResourceID   uint   `json:"resource_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	err = h.svc.AttachToResource(ctx, uint(idVal), req.ResourceType, req.ResourceID, userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "attached successfully", nil)
}

// Detach detaches a document from an LMS Resource
func (h *DocumentHandler) Detach(c *gin.Context) {
	idVal, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid ID")
		return
	}

	resourceType := c.Query("resource_type")
	resourceIDVal, err := strconv.ParseUint(c.Query("resource_id"), 10, 32)
	if err != nil {
		response.Fail(c, 400, "invalid resource ID")
		return
	}

	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}

	ctx := requestContext(c)
	err = h.svc.DetachFromResource(ctx, uint(idVal), resourceType, uint(resourceIDVal), userID)
	if err != nil {
		response.Fail(c, 500, err.Error())
		return
	}

	response.OK(c, "detached successfully", nil)
}

type DocumentUploadResponse struct {
	URL          string `json:"url" example:"/api/v1/public/media/serve?key=documents/abc.pdf"`
	ThumbnailURL string `json:"thumbnail_url,omitempty" example:"/api/v1/public/media/thumbnail?key=abc.jpg&w=400&h=300"`
	Key          string `json:"key" example:"documents/user-id/20240101_120000_report.pdf"`
	FileName     string `json:"file_name" example:"my-document.pdf"`
	SizeBytes    int64  `json:"size_bytes" example:"102400"`
	UploadedBy   string `json:"uploaded_by" example:"550e8400-e29b-41d4-a716-446655440000"`
	UploadedAt   string `json:"uploaded_at" example:"2024-01-01T12:00:00Z"`
}
