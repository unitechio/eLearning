package impl

import (
	"context"
	"errors"
	"strings"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/errs"
	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/database"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
	"gorm.io/gorm"
)

type IntegrationRepository struct {
	db *gorm.DB
}

func NewIntegrationRepository(db *gorm.DB) *IntegrationRepository {
	repo := &IntegrationRepository{db: db}
	repo.seedCatalogIfEmpty()
	return repo
}

func (r *IntegrationRepository) ListCatalog(ctx context.Context, filter repository.IntegrationListFilter) ([]domain.IntegrationCatalog, int64, error) {
	var items []domain.IntegrationCatalog
	var total int64

	q := r.db.WithContext(ctx).Model(&domain.IntegrationCatalog{})
	if filter.Search != "" {
		like := "%" + strings.ToLower(filter.Search) + "%"
		q = q.Where("lower(name) LIKE ? OR lower(description) LIKE ? OR lower(provider) LIKE ?", like, like, like)
	}
	if filter.Category != "" && !strings.EqualFold(filter.Category, "all") {
		q = q.Where("category = ?", strings.ToLower(filter.Category))
	}

	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if filter.Page > 0 && filter.PageSize > 0 {
		q = q.Scopes(database.Paginate(filter.Page, filter.PageSize))
	}

	if err := q.Order("name ASC").Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *IntegrationRepository) GetCatalogBySlug(ctx context.Context, slug string) (*domain.IntegrationCatalog, error) {
	var item domain.IntegrationCatalog
	if err := r.db.WithContext(ctx).Where("slug = ?", strings.ToLower(slug)).First(&item).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errs.ErrContentNotFound
		}
		return nil, err
	}
	return &item, nil
}

func (r *IntegrationRepository) GetCatalogByID(ctx context.Context, id uuid.UUID) (*domain.IntegrationCatalog, error) {
	var item domain.IntegrationCatalog
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&item).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errs.ErrContentNotFound
		}
		return nil, err
	}
	return &item, nil
}

func (r *IntegrationRepository) ListUserIntegrations(ctx context.Context, tenantID uuid.UUID, filter repository.IntegrationListFilter) ([]domain.UserIntegration, int64, error) {
	var items []domain.UserIntegration
	var total int64

	q := r.db.WithContext(ctx).Model(&domain.UserIntegration{}).
		Preload("Catalog").
		Where("tenant_id = ?", tenantID)

	if filter.Status != "" && !strings.EqualFold(filter.Status, "all") {
		q = q.Where("status = ?", strings.ToLower(filter.Status))
	}

	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if filter.Page > 0 && filter.PageSize > 0 {
		q = q.Scopes(database.Paginate(filter.Page, filter.PageSize))
	}

	if err := q.Order("updated_at DESC").Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *IntegrationRepository) GetUserIntegrationBySlug(ctx context.Context, tenantID uuid.UUID, slug string) (*domain.UserIntegration, error) {
	var item domain.UserIntegration
	err := r.db.WithContext(ctx).
		Joins("JOIN integration_catalog ON integration_catalog.id = user_integrations.catalog_id").
		Preload("Catalog").
		Where("user_integrations.tenant_id = ? AND integration_catalog.slug = ?", tenantID, strings.ToLower(slug)).
		First(&item).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errs.ErrContentNotFound
		}
		return nil, err
	}
	return &item, nil
}

func (r *IntegrationRepository) GetUserIntegrationByID(ctx context.Context, id uuid.UUID) (*domain.UserIntegration, error) {
	var item domain.UserIntegration
	if err := r.db.WithContext(ctx).Preload("Catalog").Where("id = ?", id).First(&item).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errs.ErrContentNotFound
		}
		return nil, err
	}
	return &item, nil
}

func (r *IntegrationRepository) UpsertUserIntegration(ctx context.Context, ui *domain.UserIntegration) error {
	return r.db.WithContext(ctx).Save(ui).Error
}

func (r *IntegrationRepository) DeleteUserIntegration(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.UserIntegration{}, "id = ?", id).Error
}

func (r *IntegrationRepository) CreateLog(ctx context.Context, log *domain.IntegrationLog) error {
	return r.db.WithContext(ctx).Create(log).Error
}

func (r *IntegrationRepository) ListLogs(ctx context.Context, userIntegrationID uuid.UUID) ([]domain.IntegrationLog, error) {
	var items []domain.IntegrationLog
	err := r.db.WithContext(ctx).
		Where("user_integration_id = ?", userIntegrationID).
		Order("created_at DESC").
		Limit(50).
		Find(&items).Error
	return items, err
}

func (r *IntegrationRepository) seedCatalogIfEmpty() {
	var count int64
	r.db.WithContext(context.Background()).Model(&domain.IntegrationCatalog{}).Count(&count)
	if count > 0 {
		return
	}

	seeds := []domain.IntegrationCatalog{
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("11111111-1111-4111-a111-111111111111")},
			Name:            "Gmail",
			Slug:            "gmail",
			Provider:        "By Google.com",
			Category:        "communication",
			Description:     "Automate inbox management, email syncing, and follow-up workflows with Gmail integration.",
			IconURL:         "https://api.iconify.design/logos:google-gmail.svg",
			Developer:       "Google Inc.",
			StepsCount:      4,
			IsPro:           false,
			IsNew:           false,
			FeaturesJSON:    []byte(`["Email Sync", "Auto Replies", "Inbox Flow", "Smart Routing", "Follow-Ups"]`),
			OverviewText:    "Utilize the Gmail API to generate messages, automate tasks, and create tailored workflows in your applications when specific actions occur in other platforms.",
			HowItWorksText:  "The Gmail API offers a ready-to-use solution for automation. Connect your workspace email to automatically sync customer correspondence, parse incoming support emails, and trigger notifications.",
		},
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("22222222-2222-4222-a222-222222222222")},
			Name:            "Slack",
			Slug:            "slack",
			Provider:        "By Slack Technologies",
			Category:        "communication",
			Description:     "Keep teams aligned with real-time Slack notifications and collaboration automation across channels.",
			IconURL:         "https://api.iconify.design/logos:slack-icon.svg",
			Developer:       "Slack Technologies",
			StepsCount:      3,
			IsPro:           false,
			IsNew:           false,
			FeaturesJSON:    []byte(`["Team Chat", "Live Alerts", "Channel Sync", "Bot Routing"]`),
			OverviewText:    "Receive instant alerts, automated daily digests, and interactive channel bots in Slack whenever key milestones or user actions occur.",
			HowItWorksText:  "Connect your Slack channels with a single click. Configure automated triggers to post status updates, billing alerts, or student progress directly to your team.",
		},
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("33333333-3333-4333-a333-333333333333")},
			Name:            "Notion",
			Slug:            "notion",
			Provider:        "By Notion Labs",
			Category:        "productivity",
			Description:     "Centralize sprint tracking, bug reports, dev workflows, task statuses, and agile boards.",
			IconURL:         "https://api.iconify.design/logos:notion-icon.svg",
			Developer:       "Notion Labs Inc.",
			StepsCount:      4,
			IsPro:           false,
			IsNew:           true,
			FeaturesJSON:    []byte(`["Sprint Tracking", "Bug Reports", "Dev Workflow", "Task Status", "Agile Boards"]`),
			OverviewText:    "Sync workspace databases, project timelines, and documentation automatically with your Notion databases.",
			HowItWorksText:  "Link your Notion workspace to mirror internal course material, student feedback logs, and team roadmaps seamlessly.",
		},
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("44444444-4444-4444-a444-444444444444")},
			Name:            "Skype",
			Slug:            "skype",
			Provider:        "By Microsoft",
			Category:        "communication",
			Description:     "Connect voice calls, team messaging, and live alerts directly to your operational workspace.",
			IconURL:         "https://api.iconify.design/logos:skype.svg",
			Developer:       "Microsoft Corp.",
			StepsCount:      2,
			IsPro:           false,
			IsNew:           false,
			FeaturesJSON:    []byte(`["Team Chat", "Live Alerts", "Voice Gateway"]`),
			OverviewText:    "Integrate Skype telephony and messaging webhooks into your workflow automation.",
			HowItWorksText:  "Configure Skype OAuth credentials to enable outbound SMS notifications and customer call logging.",
		},
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("55555555-5555-4555-a555-555555555555")},
			Name:            "WhatsApp",
			Slug:            "whatsapp",
			Provider:        "By Meta",
			Category:        "communication",
			Description:     "Centralize conversations and automate messaging workflows across your workspace.",
			IconURL:         "https://api.iconify.design/logos:whatsapp-icon.svg",
			Developer:       "Meta Platforms Inc.",
			StepsCount:      5,
			IsPro:           true,
			IsNew:           false,
			FeaturesJSON:    []byte(`["Team Chat", "Live Alerts", "Channel Sync", "OTP SMS"]`),
			OverviewText:    "Leverage the WhatsApp Business API for interactive message templates, automated student reminders, and 2FA verification.",
			HowItWorksText:  "Connect your WhatsApp Business Account. Manage incoming queries and automate notifications with custom templates.",
		},
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("66666666-6666-4666-a666-666666666666")},
			Name:            "Linear",
			Slug:            "linear",
			Provider:        "By Linear",
			Category:        "developer_tools",
			Description:     "Streamlined issue tracking and project management tool designed for software engineering.",
			IconURL:         "https://api.iconify.design/logos:linear-icon.svg",
			Developer:       "Linear Orbit Inc.",
			StepsCount:      4,
			IsPro:           false,
			IsNew:           true,
			FeaturesJSON:    []byte(`["Issue Sync", "Cycle Tracking", "Git Auto-Close"]`),
			OverviewText:    "Auto-create Linear issues from platform error logs, customer support tickets, and feature requests.",
			HowItWorksText:  "Link your Linear workspace key to map customer feedback directly into active development sprints.",
		},
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("77777777-7777-4777-a777-777777777777")},
			Name:            "GitHub",
			Slug:            "github",
			Provider:        "By GitHub.com",
			Category:        "developer_tools",
			Description:     "GitHub is a platform for version control and collaboration. It lets you and others work together on code.",
			IconURL:         "https://api.iconify.design/logos:github-icon.svg",
			Developer:       "GitHub / Microsoft",
			StepsCount:      2,
			IsPro:           false,
			IsNew:           false,
			FeaturesJSON:    []byte(`["Repo Sync", "CI/CD Webhooks", "PR Automation"]`),
			OverviewText:    "Automate repository deployments, track code changes, and trigger automated test pipelines.",
			HowItWorksText:  "Connect GitHub Webhooks to synchronize automated code submissions and build releases.",
		},
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("88888888-8888-4888-a888-888888888888")},
			Name:            "Zapier",
			Slug:            "zapier",
			Provider:        "By Zapier.com",
			Category:        "automation",
			Description:     "Zapier lets you connect 5,000+ apps to automate your work and increase productivity.",
			IconURL:         "https://api.iconify.design/logos:zapier-icon.svg",
			Developer:       "Zapier Inc.",
			StepsCount:      4,
			IsPro:           false,
			IsNew:           false,
			FeaturesJSON:    []byte(`["5000+ Apps", "Custom Zaps", "Multi-Step Flow"]`),
			OverviewText:    "Connect eEnglish data triggers with thousands of external web applications seamlessly.",
			HowItWorksText:  "Generate API webhooks in Zapier to automate email marketing, CRM contact creation, and spreadsheet syncs.",
		},
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("99999999-9999-4999-a999-999999999999")},
			Name:            "Zendesk",
			Slug:            "zendesk",
			Provider:        "By Zendesk",
			Category:        "crm",
			Description:     "Zendesk is a customer service platform that helps businesses manage customer relationships.",
			IconURL:         "https://api.iconify.design/logos:zendesk-icon.svg",
			Developer:       "Zendesk Inc.",
			StepsCount:      4,
			IsPro:           true,
			IsNew:           false,
			FeaturesJSON:    []byte(`["Ticket Routing", "Live Chat", "Knowledge Base"]`),
			OverviewText:    "Sync customer support tickets, student inquiries, and live chat transcripts directly with Zendesk.",
			HowItWorksText:  "Enter your Zendesk subdomain and API token to automate support ticket creation from student feedback.",
		},
		{
			UUIDModel:       domain.UUIDModel{ID: uuid.MustParse("aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa")},
			Name:            "Jira",
			Slug:            "jira",
			Provider:        "By Atlassian.com",
			Category:        "developer_tools",
			Description:     "Jira is a project management tool tailored for agile teams to plan, track, and release great software.",
			IconURL:         "https://api.iconify.design/logos:jira.svg",
			Developer:       "Atlassian Corp.",
			StepsCount:      4,
			IsPro:           false,
			IsNew:           false,
			FeaturesJSON:    []byte(`["Agile Boards", "Sprint Planning", "Release Track"]`),
			OverviewText:    "Connect Jira Software to map platform epics, user stories, and bug reports.",
			HowItWorksText:  "Authenticate via Atlassian OAuth 2.0 to link development tasks with platform feature releases.",
		},
	}

	for i := range seeds {
		r.db.WithContext(context.Background()).Create(&seeds[i])
	}
}
