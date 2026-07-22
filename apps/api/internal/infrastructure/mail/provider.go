package mail

import (
	"context"

	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type Provider interface {
	Send(ctx context.Context, email domain.EmailData) (providerMessageID string, err error)
	Name() domain.EmailProvider
}
