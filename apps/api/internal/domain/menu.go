package domain

import (
	"github.com/google/uuid"
)

type Menu struct {
	ID       uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Title    string     `gorm:"column:menu_title;type:nvarchar(100)"`
	URL      string     `gorm:"column:menu_url;type:varchar(100)"`
	Period   int        `gorm:"column:menu_period"`
	Type     int        `gorm:"column:menu_type"`
	ParentID *uuid.UUID `gorm:"column:parent_id;type:varchar(36)"`
	Icon     string     `gorm:"column:menu_icon;type:varchar(30)"`

	// relation (optional)
	Children []Menu `gorm:"-"`
	BaseModel
}

func (Menu) TableName() string {
	return "Menu"
}
