package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	ratelimit "github.com/unitechio/eLearning/apps/api/pkg/ratelimit"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

// RateLimit applies a per-IP sliding-window rate limit backed by the provided
// Limiter (typically Redis). If the limiter returns an error (e.g., Redis is
// unavailable), the middleware fails open — requests are allowed through to
// avoid a cache outage taking down the API.
func RateLimit(limiter ratelimit.Limiter, rps int) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		allowed, remaining, err := limiter.Allow(c.Request.Context(), ip, rps, time.Minute)
		if err != nil {
			// Backend unavailable — fail open.
			c.Next()
			return
		}
		c.Header("X-RateLimit-Limit", fmt.Sprintf("%d", rps))
		c.Header("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))
		if !allowed {
			response.Fail(c, http.StatusTooManyRequests, "too many requests")
			c.Abort()
			return
		}
		c.Next()
	}
}
