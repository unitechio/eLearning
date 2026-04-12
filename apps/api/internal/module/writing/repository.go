package writing

import "gorm.io/gorm"

type Submission struct {
	gorm.Model
	UserID     uint    `json:"user_id"     gorm:"not null;index"`
	PromptText string  `json:"prompt"      gorm:"type:text"`
	Response   string  `json:"response"    gorm:"type:text;not null"`
	WordCount  int     `json:"word_count"`
	AIScore    float64 `json:"ai_score"`
	AIFeedback string  `json:"ai_feedback" gorm:"type:text"`
}

type SubmitRequest struct {
	PromptText string `json:"prompt"   binding:"required"`
	Response   string `json:"response" binding:"required,min=50"`
}

type Repository interface {
	Create(s *Submission) error
	FindByUser(userID uint, limit, offset int) ([]Submission, int64, error)
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repository{db: db} }

func (r *repository) Create(s *Submission) error {
	return r.db.Create(s).Error
}

func (r *repository) FindByUser(userID uint, limit, offset int) ([]Submission, int64, error) {
	var items []Submission
	var total int64
	q := r.db.Model(&Submission{}).Where("user_id = ?", userID)
	q.Count(&total)
	err := q.Order("created_at DESC").Limit(limit).Offset(offset).Find(&items).Error
	return items, total, err
}

func wordCount(text string) int {
	count, inWord := 0, false
	for _, ch := range text {
		if ch == ' ' || ch == '\n' || ch == '\t' {
			inWord = false
		} else if !inWord {
			inWord = true
			count++
		}
	}
	return count
}
