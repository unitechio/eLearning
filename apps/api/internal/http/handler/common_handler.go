package handler

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	httpmw "github.com/unitechio/eLearning/apps/api/internal/http/middleware"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

func requestContext(c *gin.Context) context.Context {
	return c.Request.Context()
}

func currentUserID(c *gin.Context) (uuid.UUID, bool) {
	val, exists := c.Get(httpmw.ContextKeyUserID)
	if !exists {
		return uuid.UUID{}, false
	}
	userID, ok := val.(uuid.UUID)
	return userID, ok
}

func currentUserIDOrAbort(c *gin.Context) (uuid.UUID, bool) {
	userID, ok := currentUserID(c)
	if !ok {
		response.Fail(c, 401, "unauthorized")
		return uuid.UUID{}, false
	}
	return userID, true
}

func bindJSONOrAbort(c *gin.Context, target any) bool {
	if err := c.ShouldBindJSON(target); err != nil {
		response.Fail(c, 400, err.Error())
		return false
	}
	return true
}

func bindQueryOrAbort(c *gin.Context, target any) bool {
	if err := c.ShouldBindQuery(target); err != nil {
		response.Fail(c, 400, err.Error())
		return false
	}
	return true
}
