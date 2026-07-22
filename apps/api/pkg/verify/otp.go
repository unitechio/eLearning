package verify

import (
	"context"
	"fmt"
	"time"

	"github.com/unitechio/eLearning/apps/api/internal/infrastructure/cache"
	"github.com/unitechio/eLearning/apps/api/internal/utils/constants"
)

type OTP struct {
	Digits int
	TTL    time.Duration
}

func NewOTP(ttl time.Duration) *OTP {
	return &OTP{
		Digits: 6,
		TTL:    ttl,
	}
}

func (o *OTP) GenerateOTP(ctx context.Context, scope string, id string) (string, error) {
	code, err := GenerateNumericCode(o.Digits)
	if err != nil {
		return "", err
	}

	key := fmt.Sprintf("%s:%s", scope, id)
	err = cache.Client.Set(ctx, cache.BuildKey(constants.PrefixOTP, key), code, o.TTL).Err()
	if err != nil {
		return "", err
	}

	return code, nil
}

func (o *OTP) Verify(ctx context.Context, scope string, id string, code string) (bool, error) {
	if !ValidateCode(code, o.Digits) {
		return false, nil
	}
	key := cache.BuildKey(constants.PrefixOTP, fmt.Sprintf("%s:%s", scope, id))
	value, err := cache.Client.Get(ctx, key).Result()
	if err != nil {
		return false, err
	}

	if !CompareCode(value, code) {
		return false, nil
	}

	_ = cache.Client.Del(ctx, key).Err()

	return true, nil
}
