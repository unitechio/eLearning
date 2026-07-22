package pkg

import (
	"bytes"
	"image"
	"image/jpeg"
	"image/png"
	"io"

	"github.com/disintegration/imaging"
	"github.com/gen2brain/webp"
)

// Processor handles image processing operations
type Processor struct{}

// NewProcessor creates a new image processor
func NewProcessor() *Processor {
	return &Processor{}
}

// Resize resizes an image to the specified dimensions
func (p *Processor) ResizeImg(img image.Image, width, height int) image.Image {
	return imaging.Resize(img, width, height, imaging.Lanczos)
}

// Thumbnail creates a thumbnail with the specified size
func (p *Processor) GenerateThumbnail(img image.Image, size int) image.Image {
	return imaging.Thumbnail(img, size, size, imaging.Lanczos)
}

// Compress compresses an image with the specified quality
func (p *Processor) Compress(img image.Image, quality int) (*bytes.Buffer, error) {
	buf := new(bytes.Buffer)
	err := jpeg.Encode(buf, img, &jpeg.Options{Quality: quality})
	return buf, err
}

// GenerateVariants generates multiple size variants of an image
func (p *Processor) GenerateVariants(img image.Image) map[string]image.Image {
	return map[string]image.Image{
		"thumbnail": p.GenerateThumbnail(img, 150),
		"small":     p.ResizeImg(img, 400, 0),
		"medium":    p.ResizeImg(img, 800, 0),
		"large":     p.ResizeImg(img, 1200, 0),
	}
}

// DecodeImage decodes an image from a reader
func (p *Processor) DecodeImage(r io.Reader) (image.Image, string, error) {
	return image.Decode(r)
}

// EncodeJPEG encodes an image as JPEG with the specified quality
func (p *Processor) EncodeJPEG(img image.Image, quality int) (*bytes.Buffer, error) {
	buf := new(bytes.Buffer)
	err := jpeg.Encode(buf, img, &jpeg.Options{Quality: quality})
	return buf, err
}

// EncodePNG encodes an image as PNG
func (p *Processor) EncodePNG(img image.Image) (*bytes.Buffer, error) {
	buf := new(bytes.Buffer)
	err := png.Encode(buf, img)
	return buf, err
}

// EncodeWebP encodes an image as WebP.
func (p *Processor) EncodeWebP(img image.Image, quality int) (*bytes.Buffer, error) {
	buf := new(bytes.Buffer)
	err := webp.Encode(buf, img, webp.Options{Quality: quality})
	return buf, err
}

// OptimizeImage optimizes an image by resizing if too large and compressing
func (p *Processor) OptimizeImage(img image.Image, maxWidth, maxHeight, quality int) (*bytes.Buffer, error) {
	return p.OptimizeImageByFormat(img, "jpeg", maxWidth, maxHeight, quality)
}

// OptimizeImageByFormat optimizes an image and encodes it in the specified format
func (p *Processor) OptimizeImageByFormat(img image.Image, format string, maxWidth, maxHeight, quality int) (*bytes.Buffer, error) {
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	// Resize if image is too large
	if width > maxWidth || height > maxHeight {
		img = imaging.Fit(img, maxWidth, maxHeight, imaging.Lanczos)
	}

	if format == "png" {
		return p.EncodePNG(img)
	}
	if format == "webp" {
		return p.EncodeWebP(img, quality)
	}
	return p.EncodeJPEG(img, quality)
}
