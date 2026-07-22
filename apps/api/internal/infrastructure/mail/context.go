package mail

type BaseContext struct {
	AppName  string
	AppURL   string
	LogoURL  string
	LogoText string

	CompanyName    string
	CompanyAddress string
	CompanyPhone   string
	CompanyEmail   string

	SupportEmail  string
	SupportURL    string
	HelpCenterURL string
	PrivacyURL    string
	TermsURL      string

	FacebookURL string
	YoutubeURL  string
	LinkedInURL string

	CurrentYear int
}
