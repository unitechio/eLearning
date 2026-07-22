package verify

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base32"
	"encoding/binary"
	"fmt"
	"math"
	"net/url"
	"strings"
	"time"
)

// TOTP implements Time-based One-Time Password (RFC 6238)
// For 2FA authentication
type TOTP struct {
	Secret string
	Digits int
	Period int
}

func New(secret string) *TOTP {
	return &TOTP{
		Secret: secret,
		Digits: 6,
		Period: 30,
	}
}

func (t *TOTP) Generate() (string, error) {
	return t.GenerateAt(time.Now())
}

func (t *TOTP) GenerateAt(now time.Time) (string, error) {
	counter := uint64(now.Unix()) / uint64(t.Period)
	return t.generate(counter)
}

func (t *TOTP) Verify(code string) bool {
	return t.VerifyWithWindow(code, time.Now(), 1)
}

// VerifyWithWindow verifies TOTP code with time window
// window=1 allows codes from previous and next time periods
func (t *TOTP) VerifyWithWindow(code string, now time.Time, window int) bool {
	if !ValidateCode(code, t.Digits) {
		return false
	}
	for i := -window; i <= window; i++ {
		ts := now.Add(
			time.Duration(i*t.Period) * time.Second,
		)

		c, err := t.GenerateAt(ts)
		if err == nil && CompareCode(c, code) {
			return true
		}
	}

	return false
}

func (t *TOTP) generateTOTPCode(counter uint64) (string, error) {
	secret, err := base32.StdEncoding.WithPadding(base32.NoPadding).DecodeString(strings.ToUpper(t.Secret))
	if err != nil {
		return "", err
	}

	buf := make([]byte, 8)
	binary.BigEndian.PutUint64(buf, counter)

	// HMAC-SHA1
	h := hmac.New(sha1.New, secret)
	h.Write(buf)
	hash := h.Sum(nil)

	// Dynamic truncation
	offset := hash[len(hash)-1] & 0x0f
	code := binary.BigEndian.Uint32(hash[offset:offset+4]) & 0x7fffffff

	code = code % uint32(math.Pow10(t.Digits))

	return fmt.Sprintf("%0*d", t.Digits, code), nil
}

func (t *TOTP) GetQRCodeURL(issuer, accountName string) string {
	label := url.PathEscape(issuer + ":" + accountName)
	values := url.Values{}
	values.Set("secret", t.Secret)
	values.Set("issuer", issuer)
	values.Set("digits", fmt.Sprintf("%d", t.Digits))
	values.Set("period", fmt.Sprintf("%d", t.Period))
	return fmt.Sprintf(
		"otpauth://totp/%s?%s",
		label, values.Encode(),
	)
}

func (t *TOTP) generate(counter uint64) (string, error) {
	secret, err := base32.StdEncoding.
		WithPadding(base32.NoPadding).
		DecodeString(strings.ToUpper(t.Secret))

	if err != nil {
		return "", err
	}

	buf := make([]byte, 8)
	binary.BigEndian.PutUint64(buf, counter)
	h := hmac.New(sha1.New, secret)
	h.Write(buf)
	hash := h.Sum(nil)
	offset := hash[len(hash)-1] & 0xf
	code := binary.BigEndian.Uint32(
		hash[offset : offset+4],
	)

	code &= 0x7fffffff
	mod := uint32(math.Pow10(t.Digits))
	return fmt.Sprintf("%0*d", t.Digits, code%mod), nil
}
