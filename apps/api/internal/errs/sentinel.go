// Package errs defines all domain-level sentinel errors and operation name
// constants for the eEnglish platform.
//
// Usage pattern:
//
//	// In repository implementation — wrap infrastructure errors:
//	if errors.Is(err, gorm.ErrRecordNotFound) {
//	    return nil, errs.ErrUserNotFound
//	}
//
//	// In usecase — match against sentinel:
//	if errors.Is(err, errs.ErrUserNotFound) {
//	    return apperr.NotFound("user", id)
//	}
//
//	// Wrap with operation context:
//	return fmt.Errorf("%s: %w", errs.OpCreateUser, err)
package errs

import "errors"

// ─────────────────────────────────────────────
// User errors
// ─────────────────────────────────────────────

var (
	ErrUserNotFound      = errors.New("user not found")
	ErrUserAlreadyExists = errors.New("user already exists")
	ErrUserSuspended     = errors.New("user account is suspended")
	ErrUserInactive      = errors.New("user account is inactive")
)

// ─────────────────────────────────────────────
// Authentication errors
// ─────────────────────────────────────────────

var (
	ErrInvalidCredentials    = errors.New("invalid credentials")
	ErrInvalidPassword       = errors.New("invalid password")
	ErrInvalidTOTPCode       = errors.New("invalid two-factor code")
	ErrTOTPNotInitialized    = errors.New("two-factor setup has not been initialized")
	ErrTOTPAlreadyEnabled    = errors.New("two-factor authentication is already enabled")
	ErrInvalidRefreshToken   = errors.New("invalid refresh token")
	ErrRefreshTokenExpired   = errors.New("refresh token expired")
	ErrRefreshTokenRevoked   = errors.New("refresh token revoked")
	ErrRefreshTokenNotFound  = errors.New("refresh token not found")
	ErrTwoFactorRequired     = errors.New("two-factor authentication required")
	ErrEmailNotVerified      = errors.New("email address not verified")
	ErrEmailAlreadyVerified  = errors.New("email address already verified")
	ErrInvalidOTPCode        = errors.New("invalid or expired verification code")
	ErrRateLimitExceeded     = errors.New("rate limit exceeded")
)

// ─────────────────────────────────────────────
// Authorization errors
// ─────────────────────────────────────────────

var (
	ErrInsufficientRole        = errors.New("insufficient role for this action")
	ErrFeatureLocked           = errors.New("premium feature is locked")
	ErrCrossTenantAccessDenied = errors.New("cross-tenant access is denied")
	ErrRoleNotFound            = errors.New("role not found")
	ErrPermissionNotFound      = errors.New("permission not found")
)

// ─────────────────────────────────────────────
// Billing errors
// ─────────────────────────────────────────────

var (
	ErrBillingPlanNotFound        = errors.New("billing plan not found")
	ErrSubscriptionNotFound       = errors.New("subscription not found")
	ErrInvoiceNotFound            = errors.New("invoice not found")
	ErrPaymentTransactionNotFound = errors.New("payment transaction not found")
	ErrVoucherNotFound            = errors.New("voucher not found")
	ErrVoucherExpired             = errors.New("voucher has expired")
	ErrVoucherInactive            = errors.New("voucher is not active")
	ErrUnsupportedPaymentProvider = errors.New("unsupported payment provider")
	ErrUnsupportedPaymentStatus   = errors.New("unsupported payment status")
)

// ─────────────────────────────────────────────
// IELTS / Content errors
// ─────────────────────────────────────────────

var (
	ErrContentNotFound      = errors.New("content not found")
	ErrAttemptNotFound      = errors.New("attempt not found")
	ErrPassageNotFound      = errors.New("passage not found")
	ErrQuestionGroupNotFound = errors.New("question group not found")
	ErrQuestionNotFound     = errors.New("question not found")
	ErrVocabularyNotFound   = errors.New("vocabulary item not found")
	ErrAssetStorageNotReady = errors.New("asset storage is not configured")
)

// ─────────────────────────────────────────────
// Session errors
// ─────────────────────────────────────────────

var (
	ErrSessionNotFound = errors.New("session not found")
)

// ─────────────────────────────────────────────
// Generic input & System errors
// ─────────────────────────────────────────────

var (
	ErrInvalidUUID            = errors.New("invalid UUID format")
	ErrDatabaseMigrationFailed = errors.New("database migration failed")
	ErrSchemaMismatch          = errors.New("database schema mismatch")
	ErrAuditLogNotFound        = errors.New("audit log not found")
	ErrDepartmentNotFound       = errors.New("department not found")
)

// ─────────────────────────────────────────────
// Document Library errors
// ─────────────────────────────────────────────

var (
	ErrDocumentNotFound        = errors.New("document not found")
	ErrDocumentVersionNotFound = errors.New("document version not found")
	ErrDocumentFolderNotFound  = errors.New("document folder not found")
	ErrDocumentUnauthorized    = errors.New("unauthorized: permission denied")
	ErrDocumentForbidden       = errors.New("unauthorized: permission denied for this operation")
	ErrDocumentFileTypeInvalid = errors.New("unsupported document file type")
	ErrDocumentFileTooLarge    = errors.New("document file exceeds maximum allowed size")
	ErrDocumentStorageFailed   = errors.New("document storage operation failed")
	ErrDocumentAlreadyDeleted  = errors.New("document has already been deleted")
	ErrDocumentHasNoAsset      = errors.New("document has no physical file asset")
)
