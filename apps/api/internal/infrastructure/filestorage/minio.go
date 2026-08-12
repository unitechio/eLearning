package storage

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	imgProc "github.com/unitechio/eLearning/apps/api/pkg/image"
)

type IStorage interface {
	UploadFile(ctx context.Context, file *multipart.FileHeader, entityType string, entityID uint) (string, error)
	UploadFileWithUUID(ctx context.Context, file *multipart.FileHeader, entityType string, entityID uuid.UUID) (string, error)
	UploadFileFromBytes(ctx context.Context, content []byte, filename string, entityType string, entityID uint) (string, error)
	DownloadFile(ctx context.Context, storagePath string) ([]byte, error)
	DownloadToTemp(ctx context.Context, storagePath string) (string, error)
	DeleteFile(ctx context.Context, storagePath string) error
	GetFileURL(ctx context.Context, storagePath string, expiry time.Duration) (string, error)
	IsAllowedFileType(filename string) bool
	CleanupTempFile(tempPath string) error
	CheckFileExists(filePath string) bool
	AddFileToForm(ctx context.Context, writer *multipart.Writer, fieldName, filePath string) error
}

type MinioStorage struct {
	client       *minio.Client
	bucketName   string
	buckets      map[string]string
	imgProcessor *imgProc.Processor
}

type UploadedAsset struct {
	Bucket       string
	ObjectKey    string
	URL          string
	FileName     string
	OriginalName string
	FileSize     int64
	MimeType     string
}

func NewMinioStorage(cfg config.MinioConfig) (*MinioStorage, error) {
	if cfg.Endpoint == "" {
		return nil, fmt.Errorf("minio endpoint is required")
	}
	if cfg.AccessKeyID == "" {
		return nil, fmt.Errorf("minio access key ID is required")
	}
	if cfg.SecretAccessKey == "" {
		return nil, fmt.Errorf("minio secret access key is required")
	}
	if cfg.BucketName == "" {
		return nil, fmt.Errorf("minio bucket name is required")
	}

	client, err := minio.New(cfg.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.AccessKeyID, cfg.SecretAccessKey, ""),
		Secure: cfg.UseSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create minio client: %w", err)
	}

	storage := &MinioStorage{
		client:       client,
		bucketName:   cfg.BucketName,
		imgProcessor: imgProc.NewProcessor(),
		buckets: map[string]string{
			"default":       cfg.BucketName,
			"content-image": firstNonEmpty(cfg.ContentBucket, cfg.BucketName),
			"thumbnail":     firstNonEmpty(cfg.ContentBucket, cfg.BucketName),
			"audio":         firstNonEmpty(cfg.AudioBucket, cfg.BucketName),
			"pdf":           firstNonEmpty(cfg.PDFBucket, cfg.BucketName),
			"vocab-image":   firstNonEmpty(cfg.VocabBucket, cfg.BucketName),
		},
	}
	for _, bucket := range uniqueBuckets(storage.buckets) {
		if err := storage.EnsureBucket(context.Background(), bucket); err != nil {
			return nil, err
		}
		log.Printf("MinIO bucket ready: %s", bucket)
	}
	return storage, nil
}

func (s *MinioStorage) EnsureBucket(ctx context.Context, bucket string) error {
	if bucket == "" {
		return fmt.Errorf("bucket is required")
	}
	exists, err := s.client.BucketExists(ctx, bucket)
	if err != nil {
		return fmt.Errorf("failed to check bucket '%s': %w", bucket, err)
	}
	if exists {
		return nil
	}
	if err := s.client.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
		return fmt.Errorf("failed to create bucket '%s': %w", bucket, err)
	}
	return nil
}

func (s *MinioStorage) optimizeImageIfApplicable(file *multipart.FileHeader, src io.ReadSeeker) (io.Reader, int64, string, string) {
	contentType := s.getContentType(file)
	if !strings.HasPrefix(contentType, "image/") || contentType == "image/svg+xml" || contentType == "image/webp" || contentType == "image/gif" {
		return src, file.Size, contentType, file.Filename
	}

	img, format, err := s.imgProcessor.DecodeImage(src)
	if err == nil {
		optimizedBuf, err := s.imgProcessor.OptimizeImageByFormat(img, "webp", 1920, 1920, 85)
		if err == nil {
			if format == "jpeg" || format == "jpg" || format == "png" || format == "bmp" {
				finalFilename := strings.TrimSuffix(file.Filename, filepath.Ext(file.Filename)) + ".webp"
				return optimizedBuf, int64(optimizedBuf.Len()), "image/webp", finalFilename
			}
		}
	}
	src.Seek(0, 0)
	return src, file.Size, contentType, file.Filename
}

func (s *MinioStorage) UploadTypedAsset(ctx context.Context, file *multipart.FileHeader, kind string, entityType string, entityID uint, uploadedBy uuid.UUID) (*UploadedAsset, error) {
	if file == nil {
		return nil, fmt.Errorf("file is required")
	}
	if entityType == "" {
		return nil, fmt.Errorf("entity type is required")
	}
	bucket := s.bucketForKind(kind)
	if bucket == "" {
		return nil, fmt.Errorf("unsupported asset kind: %s", kind)
	}
	if !allowedAssetFileType(file.Filename, kind) {
		return nil, fmt.Errorf("file type not allowed for %s: %s", kind, filepath.Ext(file.Filename))
	}
	src, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer func() {
		if closeErr := src.Close(); closeErr != nil {
			log.Printf("Warning: failed to close file: %v", closeErr)
		}
	}()

	uploadReader, uploadSize, contentType, finalFilename := s.optimizeImageIfApplicable(file, src)
	objectKey := s.generateTypedObjectName(entityType, kind, entityID, finalFilename)

	if _, err := s.client.PutObject(ctx, bucket, objectKey, uploadReader, uploadSize, minio.PutObjectOptions{
		ContentType: contentType,
		UserMetadata: map[string]string{
			"entity-type":   entityType,
			"entity-id":     fmt.Sprintf("%d", entityID),
			"asset-kind":    kind,
			"uploaded-by":   uploadedBy.String(),
			"original-name": finalFilename,
			"upload-time":   time.Now().UTC().Format(time.RFC3339),
		},
	}); err != nil {
		return nil, fmt.Errorf("failed to upload typed asset: %w", err)
	}
	url, _ := s.client.PresignedGetObject(ctx, bucket, objectKey, 24*time.Hour, nil)
	return &UploadedAsset{
		Bucket:       bucket,
		ObjectKey:    objectKey,
		URL:          url.String(),
		FileName:     filepath.Base(objectKey),
		OriginalName: finalFilename,
		FileSize:     uploadSize,
		MimeType:     contentType,
	}, nil
}

func (s *MinioStorage) UploadFile(ctx context.Context, file *multipart.FileHeader, entityType string, entityID uint) (string, error) {
	if file == nil {
		return "", fmt.Errorf("file is required")
	}
	if entityType == "" {
		return "", fmt.Errorf("entity type is required")
	}
	if entityID == 0 {
		return "", fmt.Errorf("entity ID is required")
	}

	if !s.IsAllowedFileType(file.Filename) {
		return "", fmt.Errorf("file type not allowed: %s", filepath.Ext(file.Filename))
	}

	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer func() {
		if closeErr := src.Close(); closeErr != nil {
			log.Printf("Warning: failed to close file: %v", closeErr)
		}
	}()

	uploadReader, uploadSize, contentType, finalFilename := s.optimizeImageIfApplicable(file, src)
	objectName := s.generateObjectName(entityType, entityID, finalFilename)

	uploadInfo, err := s.client.PutObject(ctx, s.bucketName, objectName, uploadReader, uploadSize, minio.PutObjectOptions{
		ContentType: contentType,
		UserMetadata: map[string]string{
			"entity-type":   entityType,
			"entity-id":     fmt.Sprintf("%d", entityID),
			"original-name": finalFilename,
			"upload-time":   time.Now().UTC().Format(time.RFC3339),
		},
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to minio: %w", err)
	}

	log.Printf("File uploaded successfully: %s (Size: %d, ETag: %s)",
		objectName, uploadInfo.Size, uploadInfo.ETag)

	return objectName, nil
}

func (s *MinioStorage) CheckFileExists(filePath string) bool {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := s.client.StatObject(ctx, s.bucketName, filePath, minio.StatObjectOptions{})
	return err == nil
}

// DownloadFile downloads a file from MinIO storage
func (s *MinioStorage) DownloadFile(ctx context.Context, storagePath string) ([]byte, error) {
	if storagePath == "" {
		return nil, fmt.Errorf("storage path is required")
	}

	// Get object from MinIO
	obj, err := s.client.GetObject(ctx, s.bucketName, storagePath, minio.GetObjectOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to get object from minio: %w", err)
	}
	defer func() {
		if closeErr := obj.Close(); closeErr != nil {
			log.Printf("Warning: failed to close object: %v", closeErr)
		}
	}()

	// Read file content
	buffer := new(bytes.Buffer)
	if _, err := io.Copy(buffer, obj); err != nil {
		return nil, fmt.Errorf("failed to read file content: %w", err)
	}

	return buffer.Bytes(), nil
}

// DownloadToTemp downloads a file from MinIO storage to a temporary location
func (s *MinioStorage) DownloadToTemp(ctx context.Context, storagePath string) (string, error) {
	if storagePath == "" {
		return "", fmt.Errorf("storage path is required")
	}

	// Get object from MinIO
	obj, err := s.client.GetObject(ctx, s.bucketName, storagePath, minio.GetObjectOptions{})
	if err != nil {
		return "", fmt.Errorf("failed to get object from minio: %w", err)
	}
	defer func() {
		if closeErr := obj.Close(); closeErr != nil {
			log.Printf("Warning: failed to close object: %v", closeErr)
		}
	}()

	// Get object info to determine file extension
	objInfo, err := obj.Stat()
	if err != nil {
		return "", fmt.Errorf("failed to get object info: %w", err)
	}

	// Extract original filename and extension from storage path
	originalName := filepath.Base(storagePath)
	ext := filepath.Ext(originalName)

	// Create temporary file with proper extension
	tempDir := os.TempDir()
	tempFileName := fmt.Sprintf("minio_temp_%s_%s%s",
		uuid.New().String()[:8],
		time.Now().Format("20060102_150405"),
		ext)
	tempPath := filepath.Join(tempDir, tempFileName)

	// Create temporary file
	tempFile, err := os.Create(tempPath)
	if err != nil {
		return "", fmt.Errorf("failed to create temporary file: %w", err)
	}
	defer func() {
		if closeErr := tempFile.Close(); closeErr != nil {
			log.Printf("Warning: failed to close temp file: %v", closeErr)
		}
	}()

	// Copy content from MinIO object to temporary file
	bytesWritten, err := io.Copy(tempFile, obj)
	if err != nil {
		// Clean up temp file on error
		err := os.Remove(tempPath)
		if err != nil {
			return "", err
		}
		return "", fmt.Errorf("failed to copy file content to temp location: %w", err)
	}

	// Verify file size
	if bytesWritten != objInfo.Size {
		// Clean up temp file on error
		err := os.Remove(tempPath)
		if err != nil {
			return "", err
		}
		return "", fmt.Errorf("file size mismatch: expected %d, got %d", objInfo.Size, bytesWritten)
	}

	log.Printf("File downloaded to temp location: %s (Size: %d bytes)", tempPath, bytesWritten)
	return tempPath, nil
}

func (s *MinioStorage) CleanupTempFile(tempPath string) error {
	if tempPath == "" {
		return fmt.Errorf("temp path is required")
	}

	tempDir := os.TempDir()
	if !strings.HasPrefix(tempPath, tempDir) {
		return fmt.Errorf("path is not in temp directory: %s", tempPath)
	}

	err := os.Remove(tempPath)
	if err != nil {
		if os.IsNotExist(err) {
			log.Printf("Temp file already removed: %s", tempPath)
			return nil
		}
		return fmt.Errorf("failed to remove temp file: %w", err)
	}

	return nil
}

func (s *MinioStorage) DeleteFile(ctx context.Context, storagePath string) error {
	if storagePath == "" {
		return fmt.Errorf("storage path is required")
	}

	err := s.client.RemoveObject(ctx, s.bucketName, storagePath, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to delete file from minio: %w", err)
	}

	log.Printf("File deleted successfully: %s", storagePath)
	return nil
}

// GetFileURL generates a presigned URL for file access (alias for GetPresignedURL)
func (s *MinioStorage) GetFileURL(ctx context.Context, storagePath string, expiry time.Duration) (string, error) {
	return s.GetPresignedURL(ctx, storagePath, expiry)
}

// GetPresignedURL generates a presigned URL for file access
func (s *MinioStorage) GetPresignedURL(ctx context.Context, storagePath string, expiry time.Duration) (string, error) {
	if storagePath == "" {
		return "", fmt.Errorf("storage path is required")
	}

	if expiry <= 0 {
		expiry = 24 * time.Hour
	}

	// Validate that the object exists first
	_, err := s.client.StatObject(ctx, s.bucketName, storagePath, minio.StatObjectOptions{})
	if err != nil {
		return "", fmt.Errorf("file not found in storage: %w", err)
	}

	// Generate presigned URL for GET operation
	url, err := s.client.PresignedGetObject(ctx, s.bucketName, storagePath, expiry, nil)
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	log.Printf("Generated presigned URL for: %s (expires in %v)", storagePath, expiry)
	return url.String(), nil
}

// GetPresignedUploadURL generates a presigned URL for file upload
func (s *MinioStorage) GetPresignedUploadURL(ctx context.Context, objectName string, expiry time.Duration) (string, error) {
	if objectName == "" {
		return "", fmt.Errorf("object name is required")
	}

	if expiry <= 0 {
		expiry = 1 * time.Hour // Default 1 hour for uploads
	}

	// Generate presigned URL for PUT operation
	url, err := s.client.PresignedPutObject(ctx, s.bucketName, objectName, expiry)
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned upload URL: %w", err)
	}

	log.Printf("Generated presigned upload URL for: %s (expires in %v)", objectName, expiry)
	return url.String(), nil
}

// IsAllowedFileType checks if the file type is allowed
// IsAllowedFileType reports whether the file extension of filename is in the
// canonical allowed-document-extension list defined in domain.AllowedDocumentExtensions.
func (s *MinioStorage) IsAllowedFileType(filename string) bool {
	if filename == "" {
		return false
	}
	ext := strings.ToLower(filepath.Ext(filename))
	return domain.AllowedDocumentExtensions[ext]
}

// generateObjectName creates a unique object name with proper structure
func (s *MinioStorage) generateObjectName(entityType string, entityID uint, filename string) string {
	// Clean filename
	safeFilename := strings.ReplaceAll(filename, " ", "_")
	safeFilename = strings.ReplaceAll(safeFilename, "/", "_")

	// Generate UUID for uniqueness
	uniqueID := uuid.New().String()

	// Get file extension
	ext := filepath.Ext(safeFilename)
	nameWithoutExt := strings.TrimSuffix(safeFilename, ext)

	// Create timestamp
	timestamp := time.Now().Format("20060102_150405")

	// Generate object name: entityType/entityID/timestamp_uuid_filename.ext
	objectName := fmt.Sprintf("%s/%d/%s_%s_%s%s",
		strings.ToLower(entityType),
		entityID,
		timestamp,
		uniqueID[:8], // Use first 8 characters of UUID
		nameWithoutExt,
		ext,
	)

	return objectName
}

// getContentType determines the content type based on file extension
func (s *MinioStorage) getContentType(file *multipart.FileHeader) string {
	// Try to get content type from header first
	contentType := file.Header.Get("Content-Type")
	if contentType != "" && contentType != "application/octet-stream" {
		return contentType
	}

	// Determine by file extension
	ext := strings.ToLower(filepath.Ext(file.Filename))
	contentTypes := map[string]string{
		// Documents
		".pdf":  "application/pdf",
		".doc":  "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".txt":  "text/plain",
		".rtf":  "application/rtf",
		".odt":  "application/vnd.oasis.opendocument.text",

		// Spreadsheets
		".xls":  "application/vnd.ms-excel",
		".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		".csv":  "text/csv",
		".ods":  "application/vnd.oasis.opendocument.spreadsheet",

		// Presentations
		".ppt":  "application/vnd.ms-powerpoint",
		".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		".odp":  "application/vnd.oasis.opendocument.presentation",

		// Text/Code files
		".md":   "text/markdown",
		".json": "application/json",
		".xml":  "application/xml",
		".log":  "text/plain",
		".yaml": "application/x-yaml",
		".yml":  "application/x-yaml",
		".html": "text/html",
		".htm":  "text/html",
		".css":  "text/css",
		".js":   "application/javascript",
		".ts":   "application/typescript",

		// Images
		".jpg":  "image/jpeg",
		".jpeg": "image/jpeg",
		".png":  "image/png",
		".gif":  "image/gif",
		".bmp":  "image/bmp",
		".webp": "image/webp",
		".svg":  "image/svg+xml",
		".ico":  "image/x-icon",

		// Archives
		".zip": "application/zip",
		".rar": "application/x-rar-compressed",
		".7z":  "application/x-7z-compressed",
		".tar": "application/x-tar",
		".gz":  "application/gzip",

		// Audio/Video
		".mp3":  "audio/mpeg",
		".mp4":  "video/mp4",
		".avi":  "video/x-msvideo",
		".mov":  "video/quicktime",
		".wmv":  "video/x-ms-wmv",
		".flv":  "video/x-flv",
		".wav":  "audio/wav",
		".m4a":  "audio/mp4",
		".webm": "video/webm",
	}

	if ct, exists := contentTypes[ext]; exists {
		return ct
	}

	return "application/octet-stream"
}

// HealthCheck verifies MinIO connection
func (s *MinioStorage) HealthCheck(ctx context.Context) error {
	// Check if bucket exists and is accessible
	exists, err := s.client.BucketExists(ctx, s.bucketName)
	if err != nil {
		return fmt.Errorf("minio health check failed: %w", err)
	}

	if !exists {
		return fmt.Errorf("bucket '%s' does not exist", s.bucketName)
	}

	return nil
}

// GetStorageStats returns storage statistics
func (s *MinioStorage) GetStorageStats(ctx context.Context, entityType string, entityID uint) (*StorageStats, error) {
	prefix := fmt.Sprintf("%s/%d/", strings.ToLower(entityType), entityID)

	var totalSize int64
	var fileCount int64

	objectCh := s.client.ListObjects(ctx, s.bucketName, minio.ListObjectsOptions{
		Prefix:    prefix,
		Recursive: true,
	})

	for object := range objectCh {
		if object.Err != nil {
			return nil, fmt.Errorf("failed to list objects: %w", object.Err)
		}
		totalSize += object.Size
		fileCount++
	}

	return &StorageStats{
		TotalSize: totalSize,
		FileCount: fileCount,
	}, nil
}

func (s *MinioStorage) UploadFileWithUUID(ctx context.Context, file *multipart.FileHeader, entityType string, entityID uuid.UUID) (string, error) {
	if file == nil {
		return "", fmt.Errorf("file is required")
	}
	if entityType == "" {
		return "", fmt.Errorf("entity type is required")
	}
	if entityID == uuid.Nil {
		return "", fmt.Errorf("entity ID is required")
	}

	if !s.IsAllowedFileType(file.Filename) {
		return "", fmt.Errorf("file type not allowed: %s", filepath.Ext(file.Filename))
	}

	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer func() {
		if closeErr := src.Close(); closeErr != nil {
			log.Printf("Warning: failed to close file: %v", closeErr)
		}
	}()

	uploadReader, uploadSize, contentType, finalFilename := s.optimizeImageIfApplicable(file, src)
	objectName := s.generateObjectNameWithUUID(entityType, entityID, finalFilename)

	// Upload file to MinIO
	uploadInfo, err := s.client.PutObject(ctx, s.bucketName, objectName, uploadReader, uploadSize, minio.PutObjectOptions{
		ContentType: contentType,
		UserMetadata: map[string]string{
			"entity-type":   entityType,
			"entity-id":     entityID.String(),
			"original-name": finalFilename,
			"upload-time":   time.Now().UTC().Format(time.RFC3339),
		},
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to minio: %w", err)
	}

	log.Printf("File uploaded successfully: %s (Size: %d, ETag: %s)",
		objectName, uploadInfo.Size, uploadInfo.ETag)

	return objectName, nil
}

func (s *MinioStorage) UploadFileFromBytes(ctx context.Context, content []byte, filename string, entityType string, entityID uint) (string, error) {
	if len(content) == 0 {
		return "", fmt.Errorf("content is empty")
	}
	if filename == "" {
		return "", fmt.Errorf("filename is required")
	}
	if entityType == "" {
		return "", fmt.Errorf("entity type is required")
	}
	// if entityID == 0 {
	// 	return "", fmt.Errorf("entity ID is required")
	// }

	// Validate file type using existing method
	if !s.IsAllowedFileType(filename) {
		return "", fmt.Errorf("file type not allowed: %s", filepath.Ext(filename))
	}

	// Determine content type using existing method
	contentType := s.getContentType(&multipart.FileHeader{
		Filename: filename,
		Size:     int64(len(content)),
	})

	if strings.HasPrefix(contentType, "image/") && contentType != "image/svg+xml" && contentType != "image/webp" && contentType != "image/gif" {
		img, format, err := s.imgProcessor.DecodeImage(bytes.NewReader(content))
		if err == nil {
			optimizedBuf, err := s.imgProcessor.OptimizeImageByFormat(img, "webp", 1920, 1920, 85)
			if err == nil {
				if format == "jpeg" || format == "jpg" || format == "png" || format == "bmp" {
					content = optimizedBuf.Bytes()
					filename = strings.TrimSuffix(filename, filepath.Ext(filename)) + ".webp"
					contentType = "image/webp"
				}
			}
		}
	}

	reader := bytes.NewReader(content)
	objectName := s.generateObjectName(entityType, entityID, filename)

	// Upload file to MinIO using same options as UploadFile
	uploadInfo, err := s.client.PutObject(ctx, s.bucketName, objectName, reader, int64(len(content)), minio.PutObjectOptions{
		ContentType: contentType,
		UserMetadata: map[string]string{
			"entity-type":   entityType,
			"entity-id":     fmt.Sprintf("%d", entityID),
			"original-name": filename,
			"upload-time":   time.Now().UTC().Format(time.RFC3339),
			"content-size":  fmt.Sprintf("%d", len(content)),
		},
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to minio: %w", err)
	}

	log.Printf("File uploaded successfully: %s (Size: %d, ETag: %s)",
		objectName, uploadInfo.Size, uploadInfo.ETag)

	return objectName, nil
}

func (s *MinioStorage) generateObjectNameWithUUID(entityType string, entityID uuid.UUID, filename string) string {
	ext := filepath.Ext(filename)
	timestamp := time.Now().Format("20060102_150405")

	return fmt.Sprintf("%s/%s/%s_%s%s",
		entityType,
		entityID.String(),
		timestamp,
		strings.TrimSuffix(filepath.Base(filename), ext),
		ext,
	)
}

func (s *MinioStorage) AddFileToForm(ctx context.Context, writer *multipart.Writer, fieldName, filePath string) error {
	if filePath == "" {
		return fmt.Errorf("file path is empty")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	isExists := s.CheckFileExists(filePath)
	if !isExists {
		return fmt.Errorf("file not found in MinIO %s", filePath)
	}

	object, err := s.client.GetObject(ctx, s.bucketName, filePath, minio.GetObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to get file from MinIO %s: %w", filePath, err)
	}
	defer func() {
		if closeErr := object.Close(); closeErr != nil {
			fmt.Printf("Warning: failed to close MinIO object: %v\n", closeErr)
		}
	}()

	objectInfo, err := object.Stat()
	if err != nil {
		return fmt.Errorf("failed to get object info: %w", err)
	}

	filename := filepath.Base(filePath)
	if originalName, exists := objectInfo.UserMetadata["Original-Name"]; exists && originalName != "" {
		filename = originalName
	}

	part, err := writer.CreateFormFile(fieldName, filename)
	if err != nil {
		return fmt.Errorf("failed to create form file: %w", err)
	}

	_, err = io.Copy(part, object)
	if err != nil {
		return fmt.Errorf("failed to copy file content: %w", err)
	}

	return nil
}

func (s *MinioStorage) bucketForKind(kind string) string {
	if s == nil {
		return ""
	}
	if kind == "" {
		kind = "default"
	}
	if bucket := s.buckets[kind]; bucket != "" {
		return bucket
	}
	return s.bucketName
}

func (s *MinioStorage) generateTypedObjectName(entityType string, kind string, entityID uint, filename string) string {
	if kind == "" {
		kind = "file"
	}
	return fmt.Sprintf("%s/%s/%d/%s-%s",
		strings.ToLower(entityType),
		strings.ToLower(kind),
		entityID,
		uuid.NewString(),
		sanitizeFilename(filename),
	)
}

func allowedAssetFileType(filename string, kind string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	switch kind {
	case "audio":
		return ext == ".mp3" || ext == ".wav" || ext == ".m4a" || ext == ".ogg"
	case "pdf":
		return ext == ".pdf"
	case "video":
		return ext == ".mp4" || ext == ".mov" || ext == ".webm" || ext == ".m4v"
	default:
		return ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".webp" || ext == ".gif" || ext == ".svg"
	}
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}

func uniqueBuckets(buckets map[string]string) []string {
	seen := make(map[string]struct{}, len(buckets))
	result := make([]string, 0, len(buckets))
	for _, bucket := range buckets {
		if bucket == "" {
			continue
		}
		if _, ok := seen[bucket]; ok {
			continue
		}
		seen[bucket] = struct{}{}
		result = append(result, bucket)
	}
	return result
}

func sanitizeFilename(filename string) string {
	name := strings.ToLower(filepath.Base(filename))
	name = strings.ReplaceAll(name, " ", "-")
	return strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' || r == '_' || r == '.' {
			return r
		}
		return '-'
	}, name)
}

// StorageStats represents storage statistics
type StorageStats struct {
	TotalSize int64 `json:"total_size"`
	FileCount int64 `json:"file_count"`
}
