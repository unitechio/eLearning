package constants

const (
	ScopePasswordReset = "password_reset"
	ScopeRegister      = "register"
	ScopeEmailVerify   = "email_verify"
	ScopeLogin2FA      = "login_2fa"
)

// Cache key prefixes
const (
	PrefixUser       = "user:"
	PrefixSession    = "session:"
	PrefixOTP        = "otp:"
	PrefixPermission = "permission:"
	PrefixRateLimit  = "ratelimit:"
	PrefixCache      = "cache:"
)
