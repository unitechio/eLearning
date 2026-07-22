package verify

import (
	"crypto/rand"
	"crypto/subtle"
	"fmt"
	"math/big"
	"regexp"
)

var numericRegex = regexp.MustCompile(`^\d+$`)

func GenerateNumericCode(digits int) (string, error) {
	if digits <= 0 {
		return "", fmt.Errorf("digits must be greater than zero")
	}

	max := big.NewInt(10)
	code := make([]byte, digits)
	for i := range code {
		n, err := rand.Int(rand.Reader, max)
		if err != nil {
			return "", err
		}

		code[i] = byte('0' + n.Int64())
	}

	return string(code), nil
}

func CompareCode(expected, actual string) bool {
	return subtle.ConstantTimeCompare([]byte(expected), []byte(actual)) == 1
}

func ValidateCode(code string, digits int) bool {
	return len(code) == digits && numericRegex.MatchString(code)
}
