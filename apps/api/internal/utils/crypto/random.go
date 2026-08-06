// Package crypto provides cryptographic utilities including secure random byte,
// password, and secret generation using crypto/rand.
package crypto

import (
	"crypto/rand"
	"encoding/base32"
	"encoding/hex"
	"errors"
	"math/big"
)

var (
	ErrRandomReadFailed = errors.New("failed to read cryptographically secure random bytes")
)

const (
	lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
	uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	digitChars     = "0123456789"
	specialChars   = "!@#$%^&*()_+-=[]{}|;:,.<>?"
	allChars       = lowercaseChars + uppercaseChars + digitChars + specialChars
)

// RandomPassword generates a cryptographically secure random password of the specified length (minimum 8).
// Ensures at least one lowercase, one uppercase, one digit, and one special character.
func RandomPassword(length int) (string, error) {
	if length < 8 {
		length = 8
	}

	result := make([]byte, length)
	// Guarantee character diversity
	sets := []string{lowercaseChars, uppercaseChars, digitChars, specialChars}
	for i, charSet := range sets {
		idx, err := randomInt(len(charSet))
		if err != nil {
			return "", ErrRandomReadFailed
		}
		result[i] = charSet[idx]
	}

	// Fill remaining bytes
	for i := len(sets); i < length; i++ {
		idx, err := randomInt(len(allChars))
		if err != nil {
			return "", ErrRandomReadFailed
		}
		result[i] = allChars[idx]
	}

	// Fisher-Yates shuffle using crypto/rand
	for i := length - 1; i > 0; i-- {
		j, err := randomInt(i + 1)
		if err != nil {
			return "", ErrRandomReadFailed
		}
		result[i], result[j] = result[j], result[i]
	}

	return string(result), nil
}

// GenerateSecret generates a cryptographically secure Base32-encoded secret key
// suitable for TOTP / 2FA secrets.
func GenerateSecret() (string, error) {
	secret := make([]byte, 20)
	if _, err := rand.Read(secret); err != nil {
		return "", ErrRandomReadFailed
	}
	return base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(secret), nil
}

// GenerateRandomHex generates a random hex string of specified byte length.
func GenerateRandomHex(bytesLen int) (string, error) {
	bytes := make([]byte, bytesLen)
	if _, err := rand.Read(bytes); err != nil {
		return "", ErrRandomReadFailed
	}
	return hex.EncodeToString(bytes), nil
}

func randomInt(max int) (int, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(int64(max)))
	if err != nil {
		return 0, err
	}
	return int(n.Int64()), nil
}
