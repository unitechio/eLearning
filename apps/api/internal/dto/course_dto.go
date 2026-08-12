package dto

type Course struct {
	ID              string   `json:"id"`
	Title           string   `json:"title"`
	Subtitle        string   `json:"subtitle"`
	Description     string   `json:"description"`
	Domain          string   `json:"domain"`
	Level           string   `json:"level"`
	Status          string   `json:"status"`
	Visibility      string   `json:"visibility"`
	Price           float64  `json:"price"`
	OriginalPrice   float64  `json:"original_price"`
	Currency        string   `json:"currency"`
	ThumbnailURL    string   `json:"thumbnail_url"`
	CategoryID      *string  `json:"category_id"`
	CategoryName    string   `json:"category_name"`
	CategoryColor   string   `json:"category_color"`
	InstructorID    *string  `json:"instructor_id"`
	InstructorName  string   `json:"instructor_name"`
	VideoPreviewURL string   `json:"video_preview_url"`
	WhatYouLearn    []string `json:"what_you_learn"`
	ToolsUsed       string   `json:"tools_used"`
	HasCertificate  bool     `json:"has_certificate"`
	Rating          float64  `json:"rating"`
	ReviewCount     int      `json:"review_count"`
	EnrollmentCount int      `json:"enrollment_count"`
}

type CourseCategory struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Slug  string `json:"slug"`
	Color string `json:"color"`
}

type CourseCategoryPayload struct {
	Name  string `json:"name" binding:"required"`
	Slug  string `json:"slug"`
	Color string `json:"color"`
}

type CourseResource struct {
	ID         string `json:"id"`
	CourseID   string `json:"course_id"`
	Name       string `json:"name"`
	StorageKey string `json:"storage_key"`
	MimeType   string `json:"mime_type"`
	SizeBytes  int64  `json:"size_bytes"`
	UploadedBy string `json:"uploaded_by"`
	CreatedAt  string `json:"created_at"`
}

type CourseReview struct {
	ID        string  `json:"id"`
	CourseID  string  `json:"course_id"`
	UserID    string  `json:"user_id"`
	UserName  string  `json:"user_name"`
	Rating    int     `json:"rating"`
	Comment   string  `json:"comment"`
	CreatedAt string  `json:"created_at"`
}

type AdminCourseDetail struct {
	Course    Course           `json:"course"`
	Modules   []CourseModule   `json:"modules"`
	Resources []CourseResource `json:"resources"`
	Reviews   []CourseReview   `json:"reviews"`
}

type CourseListQuery struct {
	PaginationQuery
	Search     string `form:"q"`
	Domain     string `form:"domain"`
	Level      string `form:"level"`
	Status     string `form:"status"`
	CategoryID string `form:"category_id"`
	AuthorID   string `form:"author_id"`
}

type UpsertCourseRequest struct {
	Title           string   `json:"title" binding:"required"`
	Subtitle        string   `json:"subtitle"`
	Description     string   `json:"description"`
	Domain          string   `json:"domain" binding:"required"`
	Level           string   `json:"level"`
	Status          string   `json:"status"`
	Visibility      string   `json:"visibility"`
	Price           float64  `json:"price"`
	OriginalPrice   float64  `json:"original_price"`
	Currency        string   `json:"currency"`
	ThumbnailURL    string   `json:"thumbnail_url"`
	CategoryID      *string  `json:"category_id"`
	InstructorID    *string  `json:"instructor_id"`
	VideoPreviewURL string   `json:"video_preview_url"`
	WhatYouLearn    []string `json:"what_you_learn"`
	ToolsUsed       string   `json:"tools_used"`
	HasCertificate  bool     `json:"has_certificate"`
}

type CourseModule struct {
	ID       string `json:"id"`
	CourseID string `json:"course_id"`
	Title    string `json:"title"`
	Order    int    `json:"order"`
}

type ModuleListQuery struct {
	PaginationQuery
	Search string `form:"q"`
}

type UpsertModuleRequest struct {
	CourseID string `json:"course_id" binding:"required"`
	Title    string `json:"title" binding:"required"`
	Order    int    `json:"order"`
}

type Lesson struct {
	ID       string `json:"id"`
	ModuleID string `json:"module_id"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Order    int    `json:"order"`
}

type LessonListQuery struct {
	PaginationQuery
	Search string `form:"q"`
}

type UpsertLessonRequest struct {
	ModuleID string `json:"module_id" binding:"required"`
	Title    string `json:"title" binding:"required"`
	Content  string `json:"content"`
	Order    int    `json:"order"`
}

type CreateCourseResourceRequest struct {
	Name       string `json:"name" binding:"required"`
	StorageKey string `json:"storage_key" binding:"required"`
	MimeType   string `json:"mime_type"`
	SizeBytes  int64  `json:"size_bytes"`
}

type CreateCourseReviewRequest struct {
	Rating  int    `json:"rating" binding:"required"`
	Comment string `json:"comment"`
}
