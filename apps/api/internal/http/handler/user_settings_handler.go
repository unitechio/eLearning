package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	usecaseimpl "github.com/unitechio/eLearning/apps/api/internal/usecase/impl"
	"github.com/unitechio/eLearning/apps/api/pkg/response"
)

type UserSettingsHandler struct {
	svc *usecaseimpl.UserSettingsUsecase
}

func NewUserSettingsHandler(svc *usecaseimpl.UserSettingsUsecase) *UserSettingsHandler {
	return &UserSettingsHandler{svc: svc}
}

// Get godoc
// @Summary      Get current user settings
// @Tags         user-settings
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope
// @Router       /users/settings [get]
func (h *UserSettingsHandler) Get(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	item, err := h.svc.GetOrCreateSettings(requestContext(c), userID.String())
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "user settings fetched", item)
}

// Update godoc
// @Summary      Update current user settings
// @Tags         user-settings
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      domain.UserSettingsUpdate  true  "User settings update payload"
// @Success      200   {object}  response.Envelope
// @Router       /users/settings [put]
func (h *UserSettingsHandler) Update(c *gin.Context) {
	var req struct {
		Theme                *string `json:"theme,omitempty"`
		FontSize             *string `json:"font_size,omitempty"`
		FontFamily           *string `json:"font_family,omitempty"`
		CompactMode          *bool   `json:"compact_mode,omitempty"`
		SidebarCollapsed     *bool   `json:"sidebar_collapsed,omitempty"`
		Sidebar              *string `json:"sidebar,omitempty"`
		Language             *string `json:"language,omitempty"`
		Timezone             *string `json:"timezone,omitempty"`
		DateFormat           *string `json:"date_format,omitempty"`
		TimeFormat           *string `json:"time_format,omitempty"`
		Currency             *string `json:"currency,omitempty"`
		NotificationLevel    *string `json:"notification_level,omitempty"`
		EmailNotifications   *bool   `json:"email_notifications,omitempty"`
		PushNotifications    *bool   `json:"push_notifications,omitempty"`
		DesktopNotifications *bool   `json:"desktop_notifications,omitempty"`
		NotificationSound    *bool   `json:"notification_sound,omitempty"`
		DigestFrequency      *string `json:"digest_frequency,omitempty"`
		DefaultDashboard     *string `json:"default_dashboard,omitempty"`
		WidgetLayout         *string `json:"widget_layout,omitempty"`
		DefaultPageSize      *int    `json:"default_page_size,omitempty"`
		TableDensity         *string `json:"table_density,omitempty"`
		HighContrast         *bool   `json:"high_contrast,omitempty"`
		ReduceMotion         *bool   `json:"reduce_motion,omitempty"`
		ShowOnlineStatus     *bool   `json:"show_online_status,omitempty"`
		DeveloperMode        *bool   `json:"developer_mode,omitempty"`
		BetaFeatures         *bool   `json:"beta_features,omitempty"`
	}
	if !bindJSONOrAbort(c, &req) {
		return
	}
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	update := toUserSettingsUpdate(req)
	if err := h.svc.UpdateUserSettings(requestContext(c), userID.String(), update); err != nil {
		_ = c.Error(err)
		return
	}
	item, err := h.svc.GetUserSettings(requestContext(c), userID.String())
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "user settings updated", item)
}

// Patch godoc
// @Summary      Patch current user settings
// @Tags         user-settings
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      domain.UserSettingsUpdate  true  "User settings patch payload"
// @Success      200   {object}  response.Envelope
// @Router       /users/settings [patch]
func (h *UserSettingsHandler) Patch(c *gin.Context) {
	h.Update(c)
}

// Reset godoc
// @Summary      Reset current user settings
// @Tags         user-settings
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  response.Envelope
// @Router       /users/settings/reset [post]
func (h *UserSettingsHandler) Reset(c *gin.Context) {
	userID, ok := currentUserIDOrAbort(c)
	if !ok {
		return
	}
	if err := h.svc.ResetToDefaults(requestContext(c), userID.String()); err != nil {
		_ = c.Error(err)
		return
	}
	item, err := h.svc.GetUserSettings(requestContext(c), userID.String())
	if err != nil {
		_ = c.Error(err)
		return
	}
	response.OK(c, "user settings reset", item)
}

func toUserSettingsUpdate(req struct {
	Theme                *string `json:"theme,omitempty"`
	FontSize             *string `json:"font_size,omitempty"`
	FontFamily           *string `json:"font_family,omitempty"`
	CompactMode          *bool   `json:"compact_mode,omitempty"`
	SidebarCollapsed     *bool   `json:"sidebar_collapsed,omitempty"`
	Sidebar              *string `json:"sidebar,omitempty"`
	Language             *string `json:"language,omitempty"`
	Timezone             *string `json:"timezone,omitempty"`
	DateFormat           *string `json:"date_format,omitempty"`
	TimeFormat           *string `json:"time_format,omitempty"`
	Currency             *string `json:"currency,omitempty"`
	NotificationLevel    *string `json:"notification_level,omitempty"`
	EmailNotifications   *bool   `json:"email_notifications,omitempty"`
	PushNotifications    *bool   `json:"push_notifications,omitempty"`
	DesktopNotifications *bool   `json:"desktop_notifications,omitempty"`
	NotificationSound    *bool   `json:"notification_sound,omitempty"`
	DigestFrequency      *string `json:"digest_frequency,omitempty"`
	DefaultDashboard     *string `json:"default_dashboard,omitempty"`
	WidgetLayout         *string `json:"widget_layout,omitempty"`
	DefaultPageSize      *int    `json:"default_page_size,omitempty"`
	TableDensity         *string `json:"table_density,omitempty"`
	HighContrast         *bool   `json:"high_contrast,omitempty"`
	ReduceMotion         *bool   `json:"reduce_motion,omitempty"`
	ShowOnlineStatus     *bool   `json:"show_online_status,omitempty"`
	DeveloperMode        *bool   `json:"developer_mode,omitempty"`
	BetaFeatures         *bool   `json:"beta_features,omitempty"`
}) *domain.UserSettingsUpdate {
	return &domain.UserSettingsUpdate{
		Theme:                req.Theme,
		FontSize:             req.FontSize,
		FontFamily:           req.FontFamily,
		CompactMode:          req.CompactMode,
		SidebarCollapsed:     req.SidebarCollapsed,
		Sidebar:              req.Sidebar,
		Language:             req.Language,
		Timezone:             req.Timezone,
		DateFormat:           req.DateFormat,
		TimeFormat:           req.TimeFormat,
		Currency:             req.Currency,
		NotificationLevel:    req.NotificationLevel,
		EmailNotifications:   req.EmailNotifications,
		PushNotifications:    req.PushNotifications,
		DesktopNotifications: req.DesktopNotifications,
		NotificationSound:    req.NotificationSound,
		DigestFrequency:      req.DigestFrequency,
		DefaultDashboard:     req.DefaultDashboard,
		WidgetLayout:         req.WidgetLayout,
		DefaultPageSize:      req.DefaultPageSize,
		TableDensity:         req.TableDensity,
		HighContrast:         req.HighContrast,
		ReduceMotion:         req.ReduceMotion,
		ShowOnlineStatus:     req.ShowOnlineStatus,
		DeveloperMode:        req.DeveloperMode,
		BetaFeatures:         req.BetaFeatures,
	}
}
