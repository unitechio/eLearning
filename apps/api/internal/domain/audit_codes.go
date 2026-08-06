package domain

// IELTSAuditCode categorizes IELTS audit events stored in the audit log.
// Each code maps to a specific user-facing or admin-facing action.
//
// Code ranges:
//   1001–1099 — Practice attempts (learner actions)
//   1101–1199 — Content management (admin/instructor)
//   1201–1299 — Passage management
//   1301–1399 — Question group management
//   1401–1499 — Question management
//   1501–1599 — Vocabulary management
//   1551–1599 — Related post management
//   1601–1699 — Asset upload
//   1701–1799 — Learning progress
//   1801–1899 — Content import
//   1901–1999 — Content review workflow
//   2001–2099 — Mock test sessions
type IELTSAuditCode int64

const (
	// ─── Practice attempts ────────────────────────────────────────────────────

	// AuditCodeStartAttempt records a learner starting a practice attempt.
	AuditCodeStartAttempt IELTSAuditCode = 1001
	// AuditCodeSubmitAttempt records a learner submitting a practice attempt.
	AuditCodeSubmitAttempt IELTSAuditCode = 1002

	// ─── Content management ───────────────────────────────────────────────────

	// AuditCodeCreateContent records an admin or instructor creating content.
	AuditCodeCreateContent IELTSAuditCode = 1101
	// AuditCodeUpdateContent records an admin or instructor updating content.
	AuditCodeUpdateContent IELTSAuditCode = 1102
	// AuditCodeDeleteContent records an admin or instructor deleting content.
	AuditCodeDeleteContent IELTSAuditCode = 1103

	// ─── Passage management ───────────────────────────────────────────────────

	AuditCodeCreatePassage IELTSAuditCode = 1201
	AuditCodeUpdatePassage IELTSAuditCode = 1202
	AuditCodeDeletePassage IELTSAuditCode = 1203

	// ─── Question group management ────────────────────────────────────────────

	AuditCodeCreateQuestionGroup IELTSAuditCode = 1301
	AuditCodeUpdateQuestionGroup IELTSAuditCode = 1302
	AuditCodeDeleteQuestionGroup IELTSAuditCode = 1303

	// ─── Question management ──────────────────────────────────────────────────

	AuditCodeCreateQuestion IELTSAuditCode = 1401
	AuditCodeUpdateQuestion IELTSAuditCode = 1402
	AuditCodeDeleteQuestion IELTSAuditCode = 1403

	// ─── Vocabulary management ────────────────────────────────────────────────

	AuditCodeCreateVocabulary IELTSAuditCode = 1501
	AuditCodeUpdateVocabulary IELTSAuditCode = 1502
	AuditCodeDeleteVocabulary IELTSAuditCode = 1503

	// ─── Related post management ──────────────────────────────────────────────

	AuditCodeCreateRelatedPost IELTSAuditCode = 1551
	AuditCodeUpdateRelatedPost IELTSAuditCode = 1552
	AuditCodeDeleteRelatedPost IELTSAuditCode = 1553

	// ─── Asset upload ─────────────────────────────────────────────────────────

	AuditCodeUploadAsset IELTSAuditCode = 1601

	// ─── Learning progress ────────────────────────────────────────────────────

	AuditCodeUpdateProgress IELTSAuditCode = 1701

	// ─── Content import ───────────────────────────────────────────────────────

	AuditCodeImportContent    IELTSAuditCode = 1801
	AuditCodeImportContentPDF IELTSAuditCode = 1802

	// ─── Content review workflow ──────────────────────────────────────────────

	AuditCodeReviewContent IELTSAuditCode = 1901

	// ─── Mock test sessions ───────────────────────────────────────────────────

	AuditCodeStartMockTest  IELTSAuditCode = 2001
	AuditCodeSubmitMockTest IELTSAuditCode = 2002
)
