package config

import (
	"os"
	"path/filepath"
	"runtime"

	"gopkg.in/yaml.v3"
)

type mailYAML struct {
	Mail MailConfig `yaml:"mail"`
}

func loadMailConfig() MailConfig {
	cfg := MailConfig{
		Branding: MailBrandingConfig{
			AppName:  getEnv("MAIL_APP_NAME", "IELTS Academy"),
			AppURL:   getEnv("MAIL_APP_URL", "http://localhost:5173"),
			LogoText: getEnv("MAIL_LOGO_TEXT", "IELTS Academy"),
			LogoURL:  getEnv("MAIL_LOGO_URL", ""),
		},
		Company: MailCompanyConfig{
			Name:    getEnv("MAIL_COMPANY_NAME", "IELTS Academy"),
			Address: getEnv("MAIL_COMPANY_ADDRESS", ""),
			Phone:   getEnv("MAIL_COMPANY_PHONE", ""),
			Email:   getEnv("MAIL_COMPANY_EMAIL", getEnv("SMTP_FROM_EMAIL", "support@eenglish.local")),
		},
		Social: MailSocialConfig{
			Facebook: getEnv("MAIL_FACEBOOK_URL", ""),
			Youtube:  getEnv("MAIL_YOUTUBE_URL", ""),
			LinkedIn: getEnv("MAIL_LINKEDIN_URL", ""),
		},
		Support: MailSupportConfig{
			HelpCenter: getEnv("MAIL_HELP_CENTER_URL", ""),
			Support:    getEnv("MAIL_SUPPORT_URL", ""),
			Privacy:    getEnv("MAIL_PRIVACY_URL", ""),
			Terms:      getEnv("MAIL_TERMS_URL", ""),
		},
	}
	path := findMailYAML()
	if path == "" {
		return cfg
	}
	content, err := os.ReadFile(path)
	if err != nil {
		return cfg
	}
	var parsed mailYAML
	if err := yaml.Unmarshal(content, &parsed); err != nil {
		return cfg
	}
	mergeMailConfig(&cfg, parsed.Mail)
	return cfg
}

func findMailYAML() string {
	candidates := []string{"internal/config/mail.yaml"}
	if _, callerFile, _, ok := runtime.Caller(0); ok {
		candidates = append(candidates, filepath.Join(filepath.Dir(callerFile), "mail.yaml"))
	}
	if cwd, err := os.Getwd(); err == nil {
		candidates = append(candidates,
			filepath.Join(cwd, "internal", "config", "mail.yaml"),
			filepath.Join(cwd, "apps", "api", "internal", "config", "mail.yaml"),
		)
	}
	for _, candidate := range candidates {
		if _, err := os.Stat(candidate); err == nil {
			return candidate
		}
	}
	return ""
}

func mergeMailConfig(dst *MailConfig, src MailConfig) {
	if src.Branding.AppName != "" {
		dst.Branding.AppName = src.Branding.AppName
	}
	if src.Branding.AppURL != "" {
		dst.Branding.AppURL = src.Branding.AppURL
	}
	if src.Branding.LogoText != "" {
		dst.Branding.LogoText = src.Branding.LogoText
	}
	if src.Branding.LogoURL != "" {
		dst.Branding.LogoURL = src.Branding.LogoURL
	}
	if src.Company.Name != "" {
		dst.Company.Name = src.Company.Name
	}
	if src.Company.Address != "" {
		dst.Company.Address = src.Company.Address
	}
	if src.Company.Phone != "" {
		dst.Company.Phone = src.Company.Phone
	}
	if src.Company.Email != "" {
		dst.Company.Email = src.Company.Email
	}
	if src.Social.Facebook != "" {
		dst.Social.Facebook = src.Social.Facebook
	}
	if src.Social.Youtube != "" {
		dst.Social.Youtube = src.Social.Youtube
	}
	if src.Social.LinkedIn != "" {
		dst.Social.LinkedIn = src.Social.LinkedIn
	}
	if src.Support.HelpCenter != "" {
		dst.Support.HelpCenter = src.Support.HelpCenter
	}
	if src.Support.Support != "" {
		dst.Support.Support = src.Support.Support
	}
	if src.Support.Privacy != "" {
		dst.Support.Privacy = src.Support.Privacy
	}
	if src.Support.Terms != "" {
		dst.Support.Terms = src.Support.Terms
	}
}
