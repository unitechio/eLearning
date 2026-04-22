package repository

type Pagination struct {
	Page     int
	PageSize int
}

type CourseListFilter struct {
	Pagination
	Search string
	Domain string
	Level  string
	Status string
}

type UnitListFilter struct {
	Pagination
	Search string
}

type LessonListFilter struct {
	Pagination
	Search string
}

type ActivitySubmissionListFilter struct {
	Pagination
	Search string
	Status string
}

type ActivitySubmissionUserFilter struct {
	Pagination
	Status string
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
