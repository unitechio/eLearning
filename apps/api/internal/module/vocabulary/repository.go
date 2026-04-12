package vocabulary

import (
	"time"

	"gorm.io/gorm"
)

type Word struct {
	gorm.Model
	Word         string `json:"word"          gorm:"not null;uniqueIndex"`
	PartOfSpeech string `json:"part_of_speech" gorm:"not null"`
	Definition   string `json:"definition"    gorm:"not null;type:text"`
	Phonetic     string `json:"phonetic"`
	Example      string `json:"example"       gorm:"type:text"`
	Level        string `json:"level"`
}

type UserWordProgress struct {
	gorm.Model
	UserID             uint       `json:"user_id"              gorm:"not null;uniqueIndex:idx_user_word"`
	WordID             uint       `json:"word_id"              gorm:"not null;uniqueIndex:idx_user_word"`
	Word               Word       `json:"word"                 gorm:"foreignKey:WordID"`
	BoxNumber          int        `json:"box_number"           gorm:"default:1"`
	NextReviewAt       time.Time  `json:"next_review_at"       gorm:"not null"`
	LastReviewAt       *time.Time `json:"last_review_at"`
	ConsecutiveCorrect int        `json:"consecutive_correct"  gorm:"default:0"`
}

type Repository interface {
	GetDueWords(userID uint, limit int) ([]UserWordProgress, error)
	UpsertProgress(p *UserWordProgress) error
	GetAllWords() ([]Word, error)
	CreateWord(w *Word) error
}

type repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetDueWords(userID uint, limit int) ([]UserWordProgress, error) {
	var items []UserWordProgress
	err := r.db.Preload("Word").
		Where("user_id = ? AND next_review_at <= ?", userID, time.Now()).
		Order("next_review_at ASC").
		Limit(limit).
		Find(&items).Error
	return items, err
}

func (r *repository) UpsertProgress(p *UserWordProgress) error {
	return r.db.Save(p).Error
}

func (r *repository) GetAllWords() ([]Word, error) {
	var words []Word
	err := r.db.Find(&words).Error
	return words, err
}

func (r *repository) CreateWord(w *Word) error {
	return r.db.Create(w).Error
}
