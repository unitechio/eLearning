package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
)

func Logger(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery
		method := c.Request.Method

		c.Next()

		if method == "OPTIONS" {
			return
		}

		status := c.Writer.Status()
		latency := time.Since(start)
		clientIP := c.ClientIP()
		requestID, _ := c.Get("RequestID")

		attrs := []slog.Attr{
			slog.Int("status", status),
			slog.String("method", method),
			slog.String("path", path),
			slog.Duration("latency", latency),
			slog.String("ip", clientIP),
			slog.String("request_id", toString(requestID)),
		}
		if query != "" {
			attrs = append(attrs, slog.String("query", query))
		}
		if len(c.Errors) > 0 {
			attrs = append(attrs, slog.String("gin_errors", c.Errors.String()))
		}

		switch {
		case status >= 500:
			logger.LogAttrs(c.Request.Context(), slog.LevelError, "request", attrs...)
		case status >= 400:
			logger.LogAttrs(c.Request.Context(), slog.LevelWarn, "request", attrs...)
		default:
			logger.LogAttrs(c.Request.Context(), slog.LevelInfo, "request", attrs...)
		}
	}
}

func toString(v any) string {
	if v == nil {
		return ""
	}
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}
