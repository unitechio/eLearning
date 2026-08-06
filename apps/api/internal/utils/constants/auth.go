package constants

// Login failure reason codes recorded in the login_attempts table.
// These are used as FailureCode values to classify why a login failed,
// enabling security auditing and suspicious-activity detection.
const (
	// LoginFailureInvalidCredentials is recorded when the email/password pair is wrong.
	LoginFailureInvalidCredentials = "invalid_credentials"

	// LoginFailureAccountDisabled is recorded when the account is suspended or inactive.
	LoginFailureAccountDisabled = "account_disabled"

	// LoginFailureTwoFactorRequired is recorded when 2FA is enabled but no code was provided.
	LoginFailureTwoFactorRequired = "two_factor_required"

	// LoginFailureInvalidTwoFactor is recorded when the submitted TOTP code is wrong.
	LoginFailureInvalidTwoFactor = "invalid_two_factor_code"
)

