package str

import (
	"encoding/json"
	"reflect"
	"strings"
)

func Trim(s string) string {
	return strings.TrimSpace(s)
}

func IsEmpty(s string) bool {
	return strings.TrimSpace(s) == ""
}

func IsNotEmpty(s string) bool {
	return !IsEmpty(s)
}

func AnyEmpty(values ...string) bool {
	for _, v := range values {
		if IsEmpty(v) {
			return true
		}
	}
	return false
}

func AllNotEmpty(values ...string) bool {
	for _, v := range values {
		if IsEmpty(v) {
			return false
		}
	}
	return true
}

func Contains(s, sub string) bool {
	return strings.Contains(s, sub)
}

func ToJSONString(v any) string {
	b, err := json.Marshal(v)
	if err != nil {
		return ""
	}
	return string(b)
}

func ToString(v any) string {
	if v == nil {
		return ""
	}
	return strings.TrimSpace(v.(string))
}

func Equal(a, b any) bool {
	return reflect.DeepEqual(a, b)
}

// IsNil checks whether the given value is nil.
// Works for pointer, interface, map, slice, func and chan.
func IsNil(v any) bool {
	if v == nil {
		return true
	}

	rv := reflect.ValueOf(v)

	switch rv.Kind() {
	case reflect.Ptr,
		reflect.Interface,
		reflect.Map,
		reflect.Slice,
		reflect.Func,
		reflect.Chan:
		return rv.IsNil()
	}

	return false
}

func IsZero(v any) bool {
	if v == nil {
		return true
	}

	return reflect.ValueOf(v).IsZero()
}
