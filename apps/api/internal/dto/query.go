package dto

import "github.com/google/uuid"

type Pagination struct {
	Page     int
	PageSize int
}

type CourseListFilter struct {
	Pagination
	TenantID uuid.UUID
	Search   string
	Domain   string
	Level    string
	Status   string
}

type UnitListFilter struct {
	Pagination
	TenantID uuid.UUID
	Search   string
}

type LessonListFilter struct {
	Pagination
	TenantID uuid.UUID
	Search   string
}

type ActivitySubmissionListFilter struct {
	Pagination
	TenantID uuid.UUID
	Search   string
	Status   string
}

type ActivitySubmissionUserFilter struct {
	Pagination
	TenantID uuid.UUID
	Status   string
}

type NotificationListFilter struct {
	Pagination
	Search   string
	Category string
	IsRead   *bool
}

type BillingPlanListFilter struct {
	Pagination
	Search   string
	Currency string
}

type BillingHistoryListFilter struct {
	Pagination
	Search string
	Status string
}

type BillingSubscriptionListFilter struct {
	Pagination
	Search string
	Status string
}

type UserListFilter struct {
	Pagination
	Search string
	Status string
}

type PronunciationHistoryFilter struct {
	Pagination
	Kind string
}

type DictionaryHistoryFilter struct {
	Pagination
	Search string
	Saved  *bool
}

type VocabularySetFilter struct {
	Pagination
	Search string
	Domain string
}
type ListeningLessonListFilter struct {
	Pagination
	Search string
	Level  string
	Domain string
}
