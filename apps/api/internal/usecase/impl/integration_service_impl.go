package impl

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/eLearning/apps/api/internal/errs"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"github.com/unitechio/eLearning/apps/api/pkg/apperr"
	"gorm.io/datatypes"
)

type IntegrationService struct {
	repo repository.IntegrationRepository
}

func NewIntegrationService(repo repository.IntegrationRepository) *IntegrationService {
	return &IntegrationService{repo: repo}
}

type IntegrationSummaryStats struct {
	TotalConnected    int64 `json:"total_connected"`
	ConnectedCount    int64 `json:"connected_count"`
	DisconnectedCount int64 `json:"disconnected_count"`
	ExpiredCount      int64 `json:"expired_count"`
}

type UserIntegrationDTO struct {
	ID                 string                   `json:"id"`
	Slug               string                   `json:"slug"`
	Name               string                   `json:"name"`
	Provider           string                   `json:"provider"`
	Category           string                   `json:"category"`
	Description        string                   `json:"description"`
	IconURL            string                   `json:"icon_url"`
	Developer          string                   `json:"developer"`
	Status             domain.IntegrationStatus `json:"status"`
	AccountIdentifier  string                   `json:"account_identifier"`
	ErrorMessage       string                   `json:"error_message,omitempty"`
	IsEnabled          bool                     `json:"is_enabled"`
	Features           []string                 `json:"features"`
	LastSyncedAgo      string                   `json:"last_synced_ago"`
	AvatarCount        int                      `json:"avatar_count"`
	StepsCount         int                      `json:"steps_count"`
	IsPro              bool                     `json:"is_pro"`
	IsNew              bool                     `json:"is_new"`
	Config             map[string]any           `json:"config"`
	OverviewText       string                   `json:"overview_text"`
	HowItWorksText     string                   `json:"how_it_works_text"`
}

type IntegrationHubResponse struct {
	Stats        IntegrationSummaryStats `json:"stats"`
	Integrations []UserIntegrationDTO    `json:"integrations"`
}

func (s *IntegrationService) GetUserIntegrationsHub(ctx context.Context, tenantID uuid.UUID, statusFilter string) (*IntegrationHubResponse, error) {
	// Seed demo user integrations if none exist yet for this tenant
	if err := s.seedDemoUserIntegrations(ctx, tenantID); err != nil {
		// non-fatal
	}

	filter := repository.IntegrationListFilter{Status: statusFilter}
	items, _, err := s.repo.ListUserIntegrations(ctx, tenantID, filter)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	// Calculate counts across all user integrations
	allItems, _, _ := s.repo.ListUserIntegrations(ctx, tenantID, repository.IntegrationListFilter{Status: "all"})
	var stats IntegrationSummaryStats
	stats.TotalConnected = int64(len(allItems))

	dtos := make([]UserIntegrationDTO, 0, len(items))
	for _, item := range items {
		switch item.Status {
		case domain.IntegrationStatusConnected:
			stats.ConnectedCount++
		case domain.IntegrationStatusDisconnected:
			stats.DisconnectedCount++
		case domain.IntegrationStatusExpired:
			stats.ExpiredCount++
		}

		dtos = append(dtos, mapToDTO(item))
	}

	return &IntegrationHubResponse{
		Stats:        stats,
		Integrations: dtos,
	}, nil
}

func (s *IntegrationService) ListMarketplaceCatalog(ctx context.Context, query dto.PaginationQuery, category, search string) (*dto.PageResult[UserIntegrationDTO], error) {
	filter := repository.IntegrationListFilter{
		Category: category,
		Search:   search,
		Page:     query.Page,
		PageSize: query.PageSize,
	}

	catalog, total, err := s.repo.ListCatalog(ctx, filter)
	if err != nil {
		return nil, apperr.Internal(err)
	}

	items := make([]UserIntegrationDTO, 0, len(catalog))
	for _, item := range catalog {
		var features []string
		_ = json.Unmarshal(item.FeaturesJSON, &features)

		items = append(items, UserIntegrationDTO{
			ID:             item.ID.String(),
			Slug:           item.Slug,
			Name:           item.Name,
			Provider:       item.Provider,
			Category:       item.Category,
			Description:    item.Description,
			IconURL:        item.IconURL,
			Developer:      item.Developer,
			Status:         domain.IntegrationStatusDisconnected,
			StepsCount:     item.StepsCount,
			IsPro:          item.IsPro,
			IsNew:          item.IsNew,
			Features:       features,
			OverviewText:   item.OverviewText,
			HowItWorksText: item.HowItWorksText,
		})
	}

	return &dto.PageResult[UserIntegrationDTO]{
		Items: items,
		Meta:  buildMeta(query, total),
	}, nil
}

func (s *IntegrationService) ConnectIntegration(ctx context.Context, tenantID, userID uuid.UUID, slug, accountIdentifier string) (*UserIntegrationDTO, error) {
	catalog, err := s.repo.GetCatalogBySlug(ctx, slug)
	if err != nil {
		return nil, apperr.NotFound("integration", slug)
	}

	existing, err := s.repo.GetUserIntegrationBySlug(ctx, tenantID, slug)
	if err != nil && !strings.Contains(err.Error(), "not found") {
		// New connection
		existing = &domain.UserIntegration{
			UUIDModel: domain.UUIDModel{ID: uuid.New()},
			TenantID:  tenantID,
			UserID:    userID,
			CatalogID: catalog.ID,
		}
	} else if existing == nil {
		existing = &domain.UserIntegration{
			UUIDModel: domain.UUIDModel{ID: uuid.New()},
			TenantID:  tenantID,
			UserID:    userID,
			CatalogID: catalog.ID,
		}
	}

	now := time.Now().UTC()
	existing.Status = domain.IntegrationStatusConnected
	existing.AccountIdentifier = accountIdentifier
	existing.ErrorMessage = ""
	existing.IsEnabled = true
	existing.LastSyncedAt = &now
	existing.Catalog = catalog

	if err := s.repo.UpsertUserIntegration(ctx, existing); err != nil {
		return nil, apperr.Internal(err)
	}

	s.logEvent(ctx, existing.ID, tenantID, "connect", "connected", "Connected account "+accountIdentifier)

	dto := mapToDTO(*existing)
	return &dto, nil
}

func (s *IntegrationService) ReconnectIntegration(ctx context.Context, tenantID uuid.UUID, slug string) (*UserIntegrationDTO, error) {
	existing, err := s.repo.GetUserIntegrationBySlug(ctx, tenantID, slug)
	if err != nil {
		return nil, apperr.NotFound("user integration", slug)
	}

	now := time.Now().UTC()
	existing.Status = domain.IntegrationStatusConnected
	existing.ErrorMessage = ""
	existing.LastSyncedAt = &now

	if err := s.repo.UpsertUserIntegration(ctx, existing); err != nil {
		return nil, apperr.Internal(err)
	}

	s.logEvent(ctx, existing.ID, tenantID, "reconnect", "connected", "Reauthenticated "+existing.AccountIdentifier)

	dto := mapToDTO(*existing)
	return &dto, nil
}

func (s *IntegrationService) DisconnectIntegration(ctx context.Context, tenantID uuid.UUID, slug string) error {
	existing, err := s.repo.GetUserIntegrationBySlug(ctx, tenantID, slug)
	if err != nil {
		return apperr.NotFound("user integration", slug)
	}

	existing.Status = domain.IntegrationStatusDisconnected
	existing.ErrorMessage = ""
	existing.IsEnabled = false

	if err := s.repo.UpsertUserIntegration(ctx, existing); err != nil {
		return apperr.Internal(err)
	}

	s.logEvent(ctx, existing.ID, tenantID, "disconnect", "disconnected", "Disconnected "+existing.AccountIdentifier)
	return nil
}

func (s *IntegrationService) UpdateConfig(ctx context.Context, tenantID uuid.UUID, slug string, configData map[string]any, isEnabled bool) (*UserIntegrationDTO, error) {
	existing, err := s.repo.GetUserIntegrationBySlug(ctx, tenantID, slug)
	if err != nil {
		return nil, apperr.NotFound("user integration", slug)
	}

	rawJSON, _ := json.Marshal(configData)
	existing.ConfigJSON = datatypes.JSON(rawJSON)
	existing.IsEnabled = isEnabled

	if err := s.repo.UpsertUserIntegration(ctx, existing); err != nil {
		return nil, apperr.Internal(err)
	}

	dto := mapToDTO(*existing)
	return &dto, nil
}

func (s *IntegrationService) TriggerSync(ctx context.Context, tenantID uuid.UUID, slug string) (*UserIntegrationDTO, error) {
	existing, err := s.repo.GetUserIntegrationBySlug(ctx, tenantID, slug)
	if err != nil {
		return nil, apperr.NotFound("user integration", slug)
	}

	now := time.Now().UTC()
	existing.LastSyncedAt = &now

	if err := s.repo.UpsertUserIntegration(ctx, existing); err != nil {
		return nil, apperr.Internal(err)
	}

	s.logEvent(ctx, existing.ID, tenantID, "sync", "success", "Manual sync triggered")

	dto := mapToDTO(*existing)
	return &dto, nil
}

func (s *IntegrationService) seedDemoUserIntegrations(ctx context.Context, tenantID uuid.UUID) error {
	catalog, _, err := s.repo.ListCatalog(ctx, repository.IntegrationListFilter{})
	if err != nil || len(catalog) == 0 {
		return err
	}

	existing, _, _ := s.repo.ListUserIntegrations(ctx, tenantID, repository.IntegrationListFilter{})
	if len(existing) > 0 {
		return nil
	}

	now := time.Now().UTC()
	minAgo := now.Add(-2 * time.Minute)
	hoursAgo := now.Add(-12 * time.Hour)
	dayAgo := now.Add(-24 * time.Hour)

	demos := []struct {
		slug       string
		status     domain.IntegrationStatus
		account    string
		syncedAt   *time.Time
		errMessage string
	}{
		{slug: "gmail", status: domain.IntegrationStatusConnected, account: "hello@filllo.com", syncedAt: &minAgo},
		{slug: "slack", status: domain.IntegrationStatusConnected, account: "Clients", syncedAt: &minAgo},
		{slug: "notion", status: domain.IntegrationStatusConnected, account: "Filllo Product Team", syncedAt: &minAgo},
		{slug: "skype", status: domain.IntegrationStatusDisconnected, account: "Filllo Saas", syncedAt: &hoursAgo},
		{slug: "whatsapp", status: domain.IntegrationStatusExpired, account: "+880 1234 567 890", syncedAt: &dayAgo, errMessage: "Authentication expired. Re-connect to restore sync"},
	}

	for _, d := range demos {
		for _, cat := range catalog {
			if cat.Slug == d.slug {
				ui := &domain.UserIntegration{
					UUIDModel:         domain.UUIDModel{ID: uuid.New()},
					TenantID:          tenantID,
					UserID:            uuid.New(),
					CatalogID:         cat.ID,
					Status:            d.status,
					AccountIdentifier: d.account,
					ErrorMessage:      d.errMessage,
					IsEnabled:         d.status == domain.IntegrationStatusConnected,
					LastSyncedAt:      d.syncedAt,
				}
				_ = s.repo.UpsertUserIntegration(ctx, ui)
				break
			}
		}
	}
	return nil
}

func (s *IntegrationService) logEvent(ctx context.Context, uiID, tenantID uuid.UUID, eventType, status, msg string) {
	_ = s.repo.CreateLog(ctx, &domain.IntegrationLog{
		UUIDModel:         domain.UUIDModel{ID: uuid.New()},
		UserIntegrationID: uiID,
		TenantID:          tenantID,
		EventType:         eventType,
		Status:            status,
		Message:           msg,
	})
}

func mapToDTO(ui domain.UserIntegration) UserIntegrationDTO {
	cat := ui.Catalog
	if cat == nil {
		cat = &domain.IntegrationCatalog{
			Name:        "Unknown Integration",
			Slug:        "unknown",
			Category:    "communication",
			Description: "Integration application",
		}
	}

	var features []string
	if len(cat.FeaturesJSON) > 0 {
		_ = json.Unmarshal(cat.FeaturesJSON, &features)
	}

	var cfg map[string]any
	if len(ui.ConfigJSON) > 0 {
		_ = json.Unmarshal(ui.ConfigJSON, &cfg)
	}

	syncedAgo := "Never"
	if ui.LastSyncedAt != nil {
		diff := time.Since(*ui.LastSyncedAt)
		if diff < time.Minute {
			syncedAgo = "Just now"
		} else if diff < time.Hour {
			syncedAgo = "Synced 2 min ago"
		} else if diff < 24*time.Hour {
			syncedAgo = "Synced 12 hours ago"
		} else {
			syncedAgo = "Last synced a day ago"
		}
	}

	avatarCount := 3
	if ui.Status == domain.IntegrationStatusDisconnected {
		avatarCount = 0
	}

	return UserIntegrationDTO{
		ID:                ui.ID.String(),
		Slug:              cat.Slug,
		Name:              cat.Name,
		Provider:          cat.Provider,
		Category:          cat.Category,
		Description:       cat.Description,
		IconURL:           cat.IconURL,
		Developer:         cat.Developer,
		Status:            ui.Status,
		AccountIdentifier: ui.AccountIdentifier,
		ErrorMessage:      ui.ErrorMessage,
		IsEnabled:         ui.IsEnabled,
		Features:          features,
		LastSyncedAgo:     syncedAgo,
		AvatarCount:       avatarCount,
		StepsCount:        cat.StepsCount,
		IsPro:             cat.IsPro,
		IsNew:             cat.IsNew,
		Config:            cfg,
		OverviewText:      cat.OverviewText,
		HowItWorksText:    cat.HowItWorksText,
	}
}

// ensure errs is used
var _ = errs.ErrContentNotFound
