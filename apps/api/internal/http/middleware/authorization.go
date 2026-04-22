package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/service"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

const ContextKeyAccess = "access_profile"

func RequireRoles(authz service.AuthorizationService, roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := currentUserIDFromContext(c)
		if !ok {
			response.Fail(c, http.StatusUnauthorized, "unauthorized")
			c.Abort()
			return
		}
		if err := authz.RequireRoles(userID, roles...); err != nil {
			_ = c.Error(err)
			c.Abort()
			return
		}
		profile, err := authz.GetAccessProfile(userID)
		if err == nil {
			c.Set(ContextKeyAccess, profile)
		}
		c.Next()
	}
}

func RequireFeature(authz service.AuthorizationService, feature string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := currentUserIDFromContext(c)
		if !ok {
			response.Fail(c, http.StatusUnauthorized, "unauthorized")
			c.Abort()
			return
		}
		if err := authz.RequireFeature(userID, feature); err != nil {
			_ = c.Error(err)
			c.Abort()
			return
		}
		c.Next()
	}
}

func currentUserIDFromContext(c *gin.Context) (uuid.UUID, bool) {
	val, exists := c.Get(ContextKeyUserID)
	if !exists {
		return uuid.UUID{}, false
	}
	userID, ok := val.(uuid.UUID)
	return userID, ok
}
