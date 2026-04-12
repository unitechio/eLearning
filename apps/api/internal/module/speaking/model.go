package speaking

import "gorm.io/gorm"

type Attempt struct {
	gorm.Model
	UserID     uint    `json:"user_id"    gorm:"not null;index"`
	AudioURL   string  `json:"audio_url"  gorm:"type:text"`
	Transcript string  `json:"transcript" gorm:"type:text"`
	Score      float64 `json:"score"`
	Feedback   string  `json:"feedback"   gorm:"type:text"`
}
