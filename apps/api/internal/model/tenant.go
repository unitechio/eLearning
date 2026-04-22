package model

import (
	"github.com/google/uuid"
	"gorm.io/datatypes"
)

// -----------------------------------------------------------------------------
// 1. TENANT & CONFIGURATION
// -----------------------------------------------------------------------------

type Tenant struct {
	ID       uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Name     string         `gorm:"type:varchar(255);not null"`
	Domain   *string        `gorm:"type:varchar(255);unique"`
	Settings datatypes.JSON `gorm:"default:'{}'"`
	BaseModel
}
