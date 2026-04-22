package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

// ListCourses godoc
// @Summary      List courses
// @Tags         courses
// @Security     BearerAuth
// @Produce      json
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search by title or description"
// @Param        domain     query     string  false  "Filter by domain"
// @Param        level      query     string  false  "Filter by level"
// @Param        status     query     string  false  "Filter by status"
// @Success      200  {object}  response.Envelope{data=[]dto.Course}
// @Router       /courses [get]
func (h *CourseHandler) ListCourses(c *gin.Context) {
	var query dto.CourseListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.ListCourses(query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "courses fetched", res.Items, &res.Meta)
}

// CreateCourse godoc
// @Summary      Create course
// @Tags         courses
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.UpsertCourseRequest  true  "Course payload"
// @Success      201   {object}  response.Envelope{data=dto.Course}
// @Failure      400   {object}  response.Envelope
// @Router       /courses [post]
func (h *CourseHandler) CreateCourse(c *gin.Context) {
	var req dto.UpsertCourseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.CreateCourse(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "course created", item)
}

// GetCourse godoc
// @Summary      Get course by id
// @Tags         courses
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Course ID"
// @Success      200  {object}  response.Envelope{data=dto.Course}
// @Failure      404  {object}  response.Envelope
// @Router       /courses/{id} [get]
func (h *CourseHandler) GetCourse(c *gin.Context) {
	item, err := h.svc.GetCourse(c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "course fetched", item)
}

// UpdateCourse godoc
// @Summary      Update course
// @Tags         courses
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                     true  "Course ID"
// @Param        body  body      dto.UpsertCourseRequest  true  "Course payload"
// @Success      200   {object}  response.Envelope{data=dto.Course}
// @Failure      400   {object}  response.Envelope
// @Router       /courses/{id} [put]
func (h *CourseHandler) UpdateCourse(c *gin.Context) {
	var req dto.UpsertCourseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.UpdateCourse(c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "course updated", item)
}

// DeleteCourse godoc
// @Summary      Delete course
// @Tags         courses
// @Security     BearerAuth
// @Param        id  path  string  true  "Course ID"
// @Success      204
// @Router       /courses/{id} [delete]
func (h *CourseHandler) DeleteCourse(c *gin.Context) {
	if err := h.svc.DeleteCourse(c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.NoContent(c)
}

// ListCourseModules godoc
// @Summary      List course modules
// @Tags         courses
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Course ID"
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search module title"
// @Success      200  {object}  response.Envelope{data=[]dto.CourseModule}
// @Router       /courses/{id}/modules [get]
func (h *CourseHandler) ListCourseModules(c *gin.Context) {
	var query dto.ModuleListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.ListCourseModules(c.Param("id"), query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "course modules fetched", res.Items, &res.Meta)
}

// CreateModule godoc
// @Summary      Create module
// @Tags         modules
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.UpsertModuleRequest  true  "Module payload"
// @Success      201   {object}  response.Envelope{data=dto.CourseModule}
// @Router       /modules [post]
func (h *CourseHandler) CreateModule(c *gin.Context) {
	var req dto.UpsertModuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.CreateModule(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "module created", item)
}

// UpdateModule godoc
// @Summary      Update module
// @Tags         modules
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                     true  "Module ID"
// @Param        body  body      dto.UpsertModuleRequest  true  "Module payload"
// @Success      200   {object}  response.Envelope{data=dto.CourseModule}
// @Router       /modules/{id} [put]
func (h *CourseHandler) UpdateModule(c *gin.Context) {
	var req dto.UpsertModuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.UpdateModule(c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "module updated", item)
}

// DeleteModule godoc
// @Summary      Delete module
// @Tags         modules
// @Security     BearerAuth
// @Param        id  path  string  true  "Module ID"
// @Success      204
// @Router       /modules/{id} [delete]
func (h *CourseHandler) DeleteModule(c *gin.Context) {
	if err := h.svc.DeleteModule(c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.NoContent(c)
}

// ListModuleLessons godoc
// @Summary      List module lessons
// @Tags         modules
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Module ID"
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search lesson title or content"
// @Success      200  {object}  response.Envelope{data=[]dto.Lesson}
// @Router       /modules/{id}/lessons [get]
func (h *CourseHandler) ListModuleLessons(c *gin.Context) {
	var query dto.LessonListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.ListModuleLessons(c.Param("id"), query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "module lessons fetched", res.Items, &res.Meta)
}

// CreateLesson godoc
// @Summary      Create lesson
// @Tags         lessons
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.UpsertLessonRequest  true  "Lesson payload"
// @Success      201   {object}  response.Envelope{data=dto.Lesson}
// @Router       /lessons [post]
func (h *CourseHandler) CreateLesson(c *gin.Context) {
	var req dto.UpsertLessonRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.CreateLesson(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "lesson created", item)
}

// UpdateLesson godoc
// @Summary      Update lesson
// @Tags         lessons
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                     true  "Lesson ID"
// @Param        body  body      dto.UpsertLessonRequest  true  "Lesson payload"
// @Success      200   {object}  response.Envelope{data=dto.Lesson}
// @Router       /lessons/{id} [put]
func (h *CourseHandler) UpdateLesson(c *gin.Context) {
	var req dto.UpsertLessonRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.UpdateLesson(c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "lesson updated", item)
}

// DeleteLesson godoc
// @Summary      Delete lesson
// @Tags         lessons
// @Security     BearerAuth
// @Param        id  path  string  true  "Lesson ID"
// @Success      204
// @Router       /lessons/{id} [delete]
func (h *CourseHandler) DeleteLesson(c *gin.Context) {
	if err := h.svc.DeleteLesson(c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.NoContent(c)
}

// GetActivity godoc
// @Summary      Get activity by id
// @Tags         activities
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Activity ID"
// @Success      200  {object}  response.Envelope{data=dto.Activity}
// @Router       /activities/{id} [get]
func (h *ActivityHandler) GetActivity(c *gin.Context) {
	item, err := h.svc.GetActivity(c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "activity fetched", item)
}

// CreateActivity godoc
// @Summary      Create activity
// @Tags         activities
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      dto.UpsertActivityRequest  true  "Activity payload"
// @Success      201   {object}  response.Envelope{data=dto.Activity}
// @Router       /activities [post]
func (h *ActivityHandler) CreateActivity(c *gin.Context) {
	var req dto.UpsertActivityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.CreateActivity(req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.Created(c, "activity created", item)
}

// UpdateActivity godoc
// @Summary      Update activity
// @Tags         activities
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                       true  "Activity ID"
// @Param        body  body      dto.UpsertActivityRequest  true  "Activity payload"
// @Success      200   {object}  response.Envelope{data=dto.Activity}
// @Router       /activities/{id} [put]
func (h *ActivityHandler) UpdateActivity(c *gin.Context) {
	var req dto.UpsertActivityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	item, err := h.svc.UpdateActivity(c.Param("id"), req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "activity updated", item)
}

// DeleteActivity godoc
// @Summary      Delete activity
// @Tags         activities
// @Security     BearerAuth
// @Param        id  path  string  true  "Activity ID"
// @Success      204
// @Router       /activities/{id} [delete]
func (h *ActivityHandler) DeleteActivity(c *gin.Context) {
	if err := h.svc.DeleteActivity(c.Param("id")); err != nil {
		_ = c.Error(err)
		return
	}
	response.NoContent(c)
}

// SubmitActivity godoc
// @Summary      Submit activity answer
// @Tags         activities
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                       true  "Activity ID"
// @Param        body  body      dto.SubmitActivityRequest  true  "Submission payload"
// @Success      200   {object}  response.Envelope{data=dto.Submission}
// @Router       /activities/{id}/submit [post]
func (h *ActivityHandler) SubmitActivity(c *gin.Context) {
	var req dto.SubmitActivityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return
	}
	item, err := h.svc.SubmitActivity(c.Param("id"), userID, req)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "activity submitted", item)
}

// ListSubmissions godoc
// @Summary      List submissions for activity
// @Tags         activities
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Activity ID"
// @Param        page       query     int     false  "Page number"
// @Param        page_size  query     int     false  "Page size"
// @Param        q          query     string  false  "Search answer or feedback"
// @Param        status     query     string  false  "Filter by submission status"
// @Success      200  {object}  response.Envelope{data=[]dto.Submission}
// @Router       /activities/{id}/submissions [get]
func (h *ActivityHandler) ListSubmissions(c *gin.Context) {
	var query dto.ActivitySubmissionListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Fail(c, 400, err.Error())
		return
	}
	res, err := h.svc.ListActivitySubmissions(c.Param("id"), query)
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OKWithMeta(c, "submissions fetched", res.Items, &res.Meta)
}

// GetSubmission godoc
// @Summary      Get submission by id
// @Tags         submissions
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Submission ID"
// @Success      200  {object}  response.Envelope{data=dto.Submission}
// @Router       /submissions/{id} [get]
func (h *ActivityHandler) GetSubmission(c *gin.Context) {
	item, err := h.svc.GetSubmission(c.Param("id"))
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "submission fetched", item)
}
