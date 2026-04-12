package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type visitor struct {
	count     int
	resetAt   time.Time
}

func RateLimit(rps int) gin.HandlerFunc {
	var mu sync.Mutex
	visitors := make(map[string]*visitor)

	return func(c *gin.Context) {
		ip := c.ClientIP()

		mu.Lock()
		v, exists := visitors[ip]
		if !exists || time.Now().After(v.resetAt) {
			visitors[ip] = &visitor{count: 1, resetAt: time.Now().Add(time.Second)}
			mu.Unlock()
			c.Next()
			return
		}
		v.count++
		if v.count > rps {
			mu.Unlock()
			response.Fail(c, http.StatusTooManyRequests, "too many requests")
			c.Abort()
			return
		}
		mu.Unlock()
		c.Next()
	}
}
