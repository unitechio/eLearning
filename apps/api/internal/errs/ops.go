package errs

// Operation name constants are used to wrap errors with context so that
// log traces clearly show which operation failed.
//
// Usage:
//
//	return fmt.Errorf("%s: %w", errs.OpCreateUser, err)
//
// This produces log messages like:
//
//	"create user: user already exists"
const (
	// ─── User operations ───────────────────────────────────────
	OpCreateUser  = "create user"
	OpUpdateUser  = "update user"
	OpDeleteUser  = "delete user"
	OpGetUser     = "get user"
	OpListUsers   = "list users"
	OpFindUser    = "find user"

	// ─── Auth operations ───────────────────────────────────────
	OpRegister              = "register"
	OpLogin                 = "login"
	OpLogout                = "logout"
	OpRefreshToken          = "refresh token"
	OpRequestPasswordReset  = "request password reset"
	OpResetPassword         = "reset password"
	OpVerifyEmail           = "verify email"
	OpResendVerification    = "resend verification email"
	OpSetupTOTP             = "setup totp"
	OpEnableTOTP            = "enable totp"
	OpDisableTOTP           = "disable totp"
	OpGenerateToken         = "generate jwt token"
	OpIssueRefreshToken     = "issue refresh token"
	OpTrackSession          = "track session"
	OpRevokeSession         = "revoke session"

	// ─── Authorization operations ──────────────────────────────
	OpGetAccessProfile  = "get access profile"
	OpAssignRole        = "assign role"
	OpRemoveRole        = "remove role"
	OpGrantPermissions  = "grant permissions"
	OpRevokePermissions = "revoke permissions"

	// ─── Billing operations ────────────────────────────────────
	OpListBillingPlans         = "list billing plans"
	OpCreateBillingPlan        = "create billing plan"
	OpUpdateBillingPlan        = "update billing plan"
	OpDeleteBillingPlan        = "delete billing plan"
	OpSubscribe                = "subscribe"
	OpCancelSubscription       = "cancel subscription"
	OpCreateCheckout           = "create checkout"
	OpConfirmPayment           = "confirm payment"
	OpListInvoices             = "list invoices"
	OpListPaymentTransactions  = "list payment transactions"
	OpGrantPremium             = "grant premium"
	OpApplyVoucher             = "apply voucher"
	OpCheckoutCart             = "checkout cart"

	// ─── IELTS operations ──────────────────────────────────────
	OpCreateContent     = "create ielts content"
	OpUpdateContent     = "update ielts content"
	OpDeleteContent     = "delete ielts content"
	OpGetContent        = "get ielts content"
	OpListContent       = "list ielts content"
	OpStartAttempt      = "start ielts attempt"
	OpSubmitAttempt     = "submit ielts attempt"
	OpImportContent     = "import ielts content"
	OpUploadAsset       = "upload ielts asset"
	OpStartMockTest     = "start ielts mock test"
	OpSubmitMockTest    = "submit ielts mock test"

	// ─── System & Audit operations ─────────────────────────────
	OpAutoMigrate     = "auto migrate database"
	OpLogAudit        = "log audit entry"
	OpListAuditLogs   = "list audit logs"
	OpGetAuditLog     = "get audit log"
	OpExportAuditLogs = "export audit logs"
)
