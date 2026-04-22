package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

// SpeakingWS godoc
// @Summary      WebSocket speaking stream
// @Tags         realtime
// @Produce      json
// @Success      101
// @Router       /ws/speaking [get]
func (h *RealtimeHandler) SpeakingWS(c *gin.Context) { h.upgrade(c, "speaking") }

// AIChatWS godoc
// @Summary      WebSocket AI chat stream
// @Tags         realtime
// @Produce      json
// @Success      101
// @Router       /ws/ai-chat [get]
func (h *RealtimeHandler) AIChatWS(c *gin.Context) { h.upgrade(c, "ai-chat") }

func (h *RealtimeHandler) upgrade(c *gin.Context, channel string) {
	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		response.Fail(c, 500, "failed to upgrade websocket")
		return
	}
	defer conn.Close()
	_ = conn.WriteJSON(gin.H{"channel": channel, "status": "connected"})
}
