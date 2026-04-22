package impl

import (
	"errors"
	"strings"

	"gorm.io/gorm"
)

func isNotFoundErr(err error) bool {
	if err == nil {
		return false
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return true
	}
	return strings.Contains(strings.ToLower(err.Error()), "not found")
}
