package dto

type Course struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Domain      string `json:"domain"`
	Level       string `json:"level"`
	Status      string `json:"status"`
}

type CourseListQuery struct {
	PaginationQuery
	Search string `form:"q"`
	Domain string `form:"domain"`
	Level  string `form:"level"`
	Status string `form:"status"`
}

type UpsertCourseRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Domain      string `json:"domain" binding:"required"`
	Level       string `json:"level"`
	Status      string `json:"status"`
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
