package mail

import (
	"bytes"
	"context"
	"embed"
	"fmt"
	"html/template"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
	"github.com/unitechio/eLearning/apps/api/internal/repository"
)

//go:embed templates
var templateFS embed.FS

type Renderer interface {
	Render(ctx context.Context, tpl *domain.EmailTemplate, data map[string]any) (subject string, body string, err error)
	RenderByName(ctx context.Context, name string, locale string, data map[string]any) (subject string, body string, err error)
}

type HTMLRenderer struct {
	templateRepo repository.EmailTemplateRepository
	base         BaseContext
	subjects     map[string]string
}

func NewRenderer(repo repository.EmailTemplateRepository, base BaseContext) *HTMLRenderer {
	return &HTMLRenderer{
		templateRepo: repo,
		base:         base,
		subjects: map[string]string{
			TemplateVerifyEmail:   "Xac minh email cua ban",
			TemplatePasswordReset: "Dat lai mat khau",
			TemplateSecurityAlert: "Canh bao bao mat tai khoan",
			TemplateWelcome:       "Chao mung ban den voi {{.AppName}}",
			TemplateCertificate:   "Chung chi khoa hoc {{.CourseName}}",
			TemplateEvent:         "{{.EventTitle}}",
			TemplateInvoice:       "Hoa don #{{.InvoiceNumber}}",
			TemplatePayment:       "Thanh toan thanh cong",
		},
	}
}

func (r *HTMLRenderer) BuildContext(data map[string]any) map[string]any {
	result := map[string]any{
		"AppName":        r.base.AppName,
		"AppURL":         r.base.AppURL,
		"LogoURL":        r.base.LogoURL,
		"LogoText":       r.base.LogoText,
		"CompanyName":    r.base.CompanyName,
		"CompanyAddress": r.base.CompanyAddress,
		"CompanyPhone":   r.base.CompanyPhone,
		"CompanyEmail":   r.base.CompanyEmail,
		"SupportEmail":   r.base.SupportEmail,
		"SupportURL":     r.base.SupportURL,
		"HelpCenterURL":  r.base.HelpCenterURL,
		"PrivacyURL":     r.base.PrivacyURL,
		"TermsURL":       r.base.TermsURL,
		"FacebookURL":    r.base.FacebookURL,
		"YoutubeURL":     r.base.YoutubeURL,
		"LinkedInURL":    r.base.LinkedInURL,
		"CurrentYear":    time.Now().Year(),
	}
	for k, v := range data {
		result[k] = v
	}
	if _, ok := result["EmailTitle"]; !ok {
		result["EmailTitle"] = result["AppName"]
	}
	if _, ok := result["Preheader"]; !ok {
		result["Preheader"] = ""
	}
	if _, ok := result["HeaderEyebrow"]; !ok {
		result["HeaderEyebrow"] = result["AppName"]
	}
	if _, ok := result["UnsubscribeURL"]; !ok {
		result["UnsubscribeURL"] = result["AppURL"]
	}
	return result
}

func (r *HTMLRenderer) Render(ctx context.Context, tpl *domain.EmailTemplate, data map[string]any) (string, string, error) {
	renderData := r.BuildContext(data)
	subject, err := executeTemplate(tpl.Subject, renderData)
	if err != nil {
		return "", "", err
	}
	body, err := executeTemplate(tpl.Body, renderData)
	if err != nil {
		return "", "", err
	}
	return subject, body, nil
}

func (r *HTMLRenderer) RenderByName(ctx context.Context, name string, locale string, data map[string]any) (string, string, error) {
	if r.templateRepo != nil {
		if tpl, err := r.templateRepo.FindByName(ctx, name, locale); err == nil && tpl != nil && tpl.IsActive {
			return r.Render(ctx, tpl, data)
		}
	}
	return r.RenderEmbedded(name, data)
}

func (r *HTMLRenderer) RenderEmbedded(name string, data map[string]any) (string, string, error) {
	spec, ok := Registry[name]
	if !ok {
		return "", "", fmt.Errorf("mail: unknown template %q", name)
	}
	renderData := r.BuildContext(data)
	tpl, err := template.New(name).Option("missingkey=zero").ParseFS(templateFS, spec.Layout, spec.Content)
	if err != nil {
		return "", "", fmt.Errorf("mail: parse %q: %w", name, err)
	}
	var buf bytes.Buffer
	if err := tpl.ExecuteTemplate(&buf, "layout", renderData); err != nil {
		return "", "", fmt.Errorf("mail: execute %q: %w", name, err)
	}
	subjectTemplate := r.subjects[name]
	if subjectTemplate == "" {
		subjectTemplate = "{{.EmailTitle}}"
	}
	subject, err := executeTemplate(subjectTemplate, renderData)
	if err != nil {
		return "", "", err
	}
	return subject, buf.String(), nil
}

func executeTemplate(content string, data map[string]any) (string, error) {
	t, err := template.New("mail").Option("missingkey=zero").Parse(content)
	if err != nil {
		return "", err
	}
	var buf bytes.Buffer
	if err := t.Execute(&buf, data); err != nil {
		return "", err
	}
	return buf.String(), nil
}
