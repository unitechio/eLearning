package compress

import (
	"bytes"
	"compress/gzip"
	"database/sql/driver"
	"fmt"
	"io"
)

// CompressedText represents a string that is compressed using gzip when saved to the database,
// and decompressed when retrieved from the database.
type CompressedText string

// Value implements the driver.Valuer interface, compressing the text.
func (ct CompressedText) Value() (driver.Value, error) {
	if len(ct) == 0 {
		return []byte{}, nil
	}

	var buf bytes.Buffer
	zw := gzip.NewWriter(&buf)
	
	if _, err := zw.Write([]byte(ct)); err != nil {
		return nil, fmt.Errorf("gzip compress write failed: %w", err)
	}
	if err := zw.Close(); err != nil {
		return nil, fmt.Errorf("gzip compress close failed: %w", err)
	}

	return buf.Bytes(), nil
}

// Scan implements the sql.Scanner interface, decompressing the database bytes.
func (ct *CompressedText) Scan(value interface{}) error {
	if value == nil {
		*ct = ""
		return nil
	}

	b, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("unsupported Scan value type: %T", value)
	}

	if len(b) == 0 {
		*ct = ""
		return nil
	}

	zr, err := gzip.NewReader(bytes.NewReader(b))
	if err != nil {
		return fmt.Errorf("gzip decompress reader init failed: %w", err)
	}
	defer zr.Close()

	var outBuf bytes.Buffer
	if _, err := io.Copy(&outBuf, zr); err != nil {
		return fmt.Errorf("gzip decompress copy failed: %w", err)
	}

	*ct = CompressedText(outBuf.String())
	return nil
}

// CompressedJSON represents a JSON field that is automatically gzip-compressed when stored.
type CompressedJSON []byte

// Value implements the driver.Valuer interface, compressing the JSON byte array.
func (cj CompressedJSON) Value() (driver.Value, error) {
	if len(cj) == 0 {
		return []byte("null"), nil
	}

	var buf bytes.Buffer
	zw := gzip.NewWriter(&buf)
	
	if _, err := zw.Write(cj); err != nil {
		return nil, fmt.Errorf("gzip json compress write failed: %w", err)
	}
	if err := zw.Close(); err != nil {
		return nil, fmt.Errorf("gzip json compress close failed: %w", err)
	}

	return buf.Bytes(), nil
}

// Scan implements the sql.Scanner interface, decompressing the JSON byte array.
func (cj *CompressedJSON) Scan(value interface{}) error {
	if value == nil {
		*cj = []byte("null")
		return nil
	}

	b, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("unsupported Scan JSON value type: %T", value)
	}

	if len(b) == 0 {
		*cj = []byte("null")
		return nil
	}

	// Check if data is actually gzipped (magic bytes: 0x1f, 0x8b)
	if len(b) < 2 || b[0] != 0x1f || b[1] != 0x8b {
		// Not compressed, return as-is (e.g. legacy data migration fallback)
		*cj = b
		return nil
	}

	zr, err := gzip.NewReader(bytes.NewReader(b))
	if err != nil {
		return fmt.Errorf("gzip json decompress reader init failed: %w", err)
	}
	defer zr.Close()

	var outBuf bytes.Buffer
	if _, err := io.Copy(&outBuf, zr); err != nil {
		return fmt.Errorf("gzip json decompress copy failed: %w", err)
	}

	*cj = outBuf.Bytes()
	return nil
}

// MarshalJSON returns the JSON encoding of cj
func (cj CompressedJSON) MarshalJSON() ([]byte, error) {
	if len(cj) == 0 {
		return []byte("null"), nil
	}
	return cj, nil
}

// UnmarshalJSON sets cj to a copy of data
func (cj *CompressedJSON) UnmarshalJSON(data []byte) error {
	if cj == nil {
		return fmt.Errorf("CompressedJSON: UnmarshalJSON on nil pointer")
	}
	*cj = append((*cj)[0:0], data...)
	return nil
}

