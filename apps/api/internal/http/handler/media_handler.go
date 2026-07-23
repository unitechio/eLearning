package handler

import (
	"bytes"
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/disintegration/imaging"
	"github.com/gin-gonic/gin"
	storage "github.com/unitechio/eLearning/apps/api/internal/infrastructure/filestorage"
	imgProc "github.com/unitechio/eLearning/apps/api/pkg/image"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type MediaHandler struct {
	storage      *storage.MinioStorage
	imgProcessor *imgProc.Processor
}

func NewMediaHandler(s *storage.MinioStorage) *MediaHandler {
	return &MediaHandler{
		storage:      s,
		imgProcessor: imgProc.NewProcessor(),
	}
}

// Serve serves original media files with 1-year client caching
// Serve godoc
// @Summary      Serve original media file
// @Description  Downloads a file from internal MinIO storage and streams it to the client with aggressive browser caching.
// @Tags         media
// @Produce      octet-stream
// @Param        key     query  string  true   "Storage key of the file"
// @Param        bucket  query  string  false  "Bucket name override"
// @Success      200  {file}    binary
// @Failure      400  {object}  response.Envelope
// @Failure      404  {object}  response.Envelope
// @Router       /public/media/serve [get]
func (h *MediaHandler) Serve(c *gin.Context) {
	if h.storage == nil {
		response.Fail(c, 503, "storage not configured")
		return
	}

	bucket := c.Query("bucket")
	key := c.Query("key")
	if key == "" {
		response.Fail(c, 400, "key is required")
		return
	}
	if bucket == "" {
		bucket = "eenglish" // fallback default bucket
	}

	ctx, cancel := context.WithTimeout(requestContext(c), 15*time.Second)
	defer cancel()

	data, err := h.storage.DownloadFile(ctx, key)
	if err != nil {
		response.Fail(c, 404, "file not found")
		return
	}

	contentType := h.detectContentType(key)
	c.Header("Cache-Control", "public, max-age=31536000, immutable")
	c.Data(http.StatusOK, contentType, data)
}

// ServeThumbnail crop/resizes images on-the-fly and caches them in the browser
// ServeThumbnail godoc
// @Summary      Serve optimized webp thumbnail on-the-fly
// @Description  Decodes an image, resizes it to the target dimensions using Lanczos filter, encodes it to WebP format, and streams it.
// @Tags         media
// @Produce      image/webp
// @Param        key     query  string  true   "Storage key of the original image"
// @Param        w       query  int     false  "Width (default 400)"
// @Param        h       query  int     false  "Height (default 300)"
// @Success      200  {file}    binary
// @Failure      400  {object}  response.Envelope
// @Failure      404  {object}  response.Envelope
// @Router       /public/media/thumbnail [get]
func (h *MediaHandler) ServeThumbnail(c *gin.Context) {
	if h.storage == nil {
		response.Fail(c, 503, "storage not configured")
		return
	}

	key := c.Query("key")
	if key == "" {
		response.Fail(c, 400, "key is required")
		return
	}

	widthStr := c.DefaultQuery("w", "400")
	heightStr := c.DefaultQuery("h", "300")
	width, _ := strconv.Atoi(widthStr)
	height, _ := strconv.Atoi(heightStr)

	ctx, cancel := context.WithTimeout(requestContext(c), 20*time.Second)
	defer cancel()

	data, err := h.storage.DownloadFile(ctx, key)
	if err != nil {
		response.Fail(c, 404, "file not found")
		return
	}

	// Dynamic resizing
	srcReader := bytes.NewReader(data)
	img, _, err := h.imgProcessor.DecodeImage(srcReader)
	if err != nil {
		// If decoding fails, return original data
		c.Header("Cache-Control", "public, max-age=31536000, immutable")
		c.Data(http.StatusOK, h.detectContentType(key), data)
		return
	}

	// Resize and crop to make a perfect thumbnail
	resizedImg := imaging.Thumbnail(img, width, height, imaging.Lanczos)
	optimizedBuf, err := h.imgProcessor.EncodeWebP(resizedImg, 80)
	if err != nil {
		c.Header("Cache-Control", "public, max-age=31536000, immutable")
		c.Data(http.StatusOK, h.detectContentType(key), data)
		return
	}

	c.Header("Cache-Control", "public, max-age=31536000, immutable")
	c.Data(http.StatusOK, "image/webp", optimizedBuf.Bytes())
}

func (h *MediaHandler) detectContentType(filename string) string {
	ext := strings.ToLower(filename)
	if strings.HasSuffix(ext, ".pdf") {
		return "application/pdf"
	}
	if strings.HasSuffix(ext, ".mp3") {
		return "audio/mpeg"
	}
	if strings.HasSuffix(ext, ".wav") {
		return "audio/wav"
	}
	if strings.HasSuffix(ext, ".png") {
		return "image/png"
	}
	if strings.HasSuffix(ext, ".jpg") || strings.HasSuffix(ext, ".jpeg") {
		return "image/jpeg"
	}
	if strings.HasSuffix(ext, ".webp") {
		return "image/webp"
	}
	return "application/octet-stream"
}
