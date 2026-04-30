package domain

import "strings"

type Environment struct {
	BaseModel
	Name        string  `gorm:"size:100;not null;uniqueIndex" json:"name"`
	Slug        string  `gorm:"size:120;uniqueIndex" json:"slug"`
	Description string  `gorm:"type:text" json:"description"`
	Type        string  `gorm:"size:50;default:'general';index" json:"type"`
	URL         *string `gorm:"size:500" json:"url,omitempty"`
	Color       *string `gorm:"size:30" json:"color,omitempty"`
	SortOrder   int     `gorm:"default:0;index" json:"sort_order"`
	IsActive    bool    `gorm:"default:true;index" json:"is_active"`
}

func (Environment) TableName() string {
	return "environments"
}

type EnvironmentFilter struct {
	Page     int
	PageSize int
	Name     string
	IsActive *bool
}

func (f EnvironmentFilter) Normalize() EnvironmentFilter {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.PageSize < 1 {
		f.PageSize = 20
	}
	if f.PageSize > 100 {
		f.PageSize = 100
	}
	return f
}

type FeatureFlag struct {
	BaseModel
	Name         string      `gorm:"size:120;not null;uniqueIndex" json:"name"`
	Key          string      `gorm:"size:120;not null;uniqueIndex" json:"key"`
	Description  string      `gorm:"type:text" json:"description"`
	Category     string      `gorm:"size:100;index" json:"category"`
	Enabled      bool        `gorm:"default:false;index" json:"enabled"`
	RequiredTier LicenseTier `gorm:"size:50;default:'free';index" json:"required_tier"`
}

func (FeatureFlag) TableName() string {
	return "feature_flags"
}

func (f *FeatureFlag) IsAvailableForTier(tier LicenseTier) bool {
	tierOrder := map[LicenseTier]int{
		LicenseTierFree:       1,
		LicenseTierStarter:    2,
		LicenseTierPro:        3,
		LicenseTierEnterprise: 4,
	}
	required := f.RequiredTier
	if required == "" {
		required = LicenseTierFree
	}
	return tierOrder[normalizeTier(tier)] >= tierOrder[normalizeTier(required)]
}

func normalizeTier(tier LicenseTier) LicenseTier {
	switch LicenseTier(strings.ToLower(string(tier))) {
	case LicenseTierStarter:
		return LicenseTierStarter
	case LicenseTierPro:
		return LicenseTierPro
	case LicenseTierEnterprise:
		return LicenseTierEnterprise
	default:
		return LicenseTierFree
	}
}
