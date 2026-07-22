package mail

type TemplateSpec struct {
	Layout  string
	Content string
}

const (
	TemplateVerifyEmail   = "auth.verify_email"
	TemplatePasswordReset = "auth.password_reset"
	TemplateSecurityAlert = "auth.security_alert"
	TemplateWelcome       = "academy.welcome"
	TemplateCertificate   = "academy.certificate"
	TemplateEvent         = "notification.event"
	TemplateInvoice       = "billing.invoice"
	TemplatePayment       = "billing.payment_success"
)

var Registry = map[string]TemplateSpec{
	TemplateVerifyEmail: {
		Layout:  "templates/layouts/minimal.html",
		Content: "templates/auth/verify_email.html",
	},

	TemplatePasswordReset: {
		Layout:  "templates/layouts/minimal.html",
		Content: "templates/auth/password_reset.html",
	},

	TemplateSecurityAlert: {
		Layout:  "templates/layouts/minimal.html",
		Content: "templates/auth/security_alert.html",
	},

	TemplateWelcome: {
		Layout:  "templates/layouts/default.html",
		Content: "templates/layouts/welcome.html",
	},

	TemplateCertificate: {
		Layout:  "templates/layouts/default.html",
		Content: "templates/academy/certificate.html",
	},

	TemplateEvent: {
		Layout:  "templates/layouts/default.html",
		Content: "templates/notification/event.html",
	},

	TemplateInvoice: {
		Layout:  "templates/layouts/default.html",
		Content: "templates/billing/invoice.html",
	},

	TemplatePayment: {
		Layout:  "templates/layouts/minimal.html",
		Content: "templates/payment/payment_success.html",
	},
}
