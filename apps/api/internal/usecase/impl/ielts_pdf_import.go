package impl

import (
	"fmt"
	"mime/multipart"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/unitechio/eLearning/apps/api/internal/dto"
	"github.com/unitechio/gopdf/extractor"
	"github.com/unitechio/gopdf/model"
	"gorm.io/datatypes"
)

var pdfSlugCleaner = regexp.MustCompile(`[^a-z0-9]+`)

func parseIELTSPDFFile(file *multipart.FileHeader) (*dto.IELTSPDFImportResult, error) {
	if file == nil {
		return nil, fmt.Errorf("file is required")
	}
	if strings.ToLower(filepath.Ext(file.Filename)) != ".pdf" {
		return nil, fmt.Errorf("unsupported import file: %s", filepath.Ext(file.Filename))
	}

	src, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()

	reader, err := model.NewPdfReader(src)
	if err != nil {
		return nil, err
	}

	pageCount, err := reader.GetNumPages()
	if err != nil {
		return nil, err
	}

	baseName := strings.TrimSpace(strings.TrimSuffix(filepath.Base(file.Filename), filepath.Ext(file.Filename)))
	title := prettyPDFTitle(baseName)
	pages := make([]dto.IELTSPDFImportPage, 0, pageCount)
	suggestedPassages := make([]dto.IELTSPassageRequest, 0, pageCount)
	extractedPages := make([]string, 0, pageCount)
	hasExtractableText := false
	requiresOCR := false
	totalChars := 0

	for pageNo := 1; pageNo <= pageCount; pageNo++ {
		page, err := reader.GetPage(pageNo)
		if err != nil {
			return nil, err
		}
		pageExtractor, err := extractor.New(page)
		if err != nil {
			return nil, err
		}

		text, err := pageExtractor.ExtractText()
		if err != nil {
			return nil, err
		}
		pageImages, err := pageExtractor.ExtractPageImages(nil)
		if err != nil {
			return nil, err
		}

		normalizedText := normalizePDFText(text)
		imageCount := 0
		if pageImages != nil {
			imageCount = len(pageImages.Images)
		}
		hasTextLayer := normalizedText != ""
		pageRequiresOCR := !hasTextLayer && imageCount > 0
		if hasTextLayer {
			hasExtractableText = true
			extractedPages = append(extractedPages, normalizedText)
			totalChars += len([]rune(normalizedText))
		}
		if pageRequiresOCR {
			requiresOCR = true
		}

		pageTitle := fmt.Sprintf("Passage %d", pageNo)
		pageBody := normalizedText
		if pageBody == "" && imageCount > 0 {
			pageBody = fmt.Sprintf("[Scanned PDF page %d detected. OCR is required before auto-generating questions from this page.]", pageNo)
		}

		pages = append(pages, dto.IELTSPDFImportPage{
			PageNo:       pageNo,
			Title:        pageTitle,
			Text:         normalizedText,
			TextLength:   len([]rune(normalizedText)),
			ImageCount:   imageCount,
			RequiresOCR:  pageRequiresOCR,
			HasTextLayer: hasTextLayer,
		})
		suggestedPassages = append(suggestedPassages, dto.IELTSPassageRequest{
			PassageNo: pageNo,
			Title:     pageTitle,
			Body:      pageBody,
			SortOrder: pageNo,
		})
	}

	description := fmt.Sprintf("Imported from PDF %s with %d pages.", file.Filename, pageCount)
	if requiresOCR {
		description += " Some pages look scanned and need OCR before extracting full text."
	}

	result := &dto.IELTSPDFImportResult{
		FileName:           file.Filename,
		Title:              title,
		PageCount:          pageCount,
		ExtractedText:      strings.Join(extractedPages, "\n\n"),
		ExtractedChars:     totalChars,
		RequiresOCR:        requiresOCR,
		HasExtractableText: hasExtractableText,
		Pages:              pages,
		SuggestedContent: dto.IELTSContentRequest{
			Slug:            makePDFSlug(baseName),
			Title:           title,
			Description:     description,
			Module:          "practice",
			Skill:           "reading",
			ContentType:     "practice_test",
			Status:          "draft",
			QuestionCount:   0,
			DurationSeconds: 0,
			Tags:            datatypes.JSON([]byte(`["pdf-import"]`)),
			Metadata:        marshalJSON(map[string]any{"import_source": "pdf", "source_file_name": file.Filename, "page_count": pageCount, "requires_ocr": requiresOCR}, "{}"),
		},
		SuggestedPassages: suggestedPassages,
	}

	return result, nil
}

func normalizePDFText(value string) string {
	value = strings.ReplaceAll(value, "\r\n", "\n")
	value = strings.ReplaceAll(value, "\r", "\n")
	lines := strings.Split(value, "\n")
	cleaned := make([]string, 0, len(lines))
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed == "" {
			if len(cleaned) == 0 || cleaned[len(cleaned)-1] == "" {
				continue
			}
			cleaned = append(cleaned, "")
			continue
		}
		cleaned = append(cleaned, strings.Join(strings.Fields(trimmed), " "))
	}
	return strings.TrimSpace(strings.Join(cleaned, "\n"))
}

func prettyPDFTitle(value string) string {
	value = strings.NewReplacer("_", " ", "-", " ").Replace(strings.TrimSpace(value))
	return strings.Join(strings.Fields(value), " ")
}

func makePDFSlug(value string) string {
	slug := strings.ToLower(prettyPDFTitle(value))
	slug = pdfSlugCleaner.ReplaceAllString(slug, "-")
	slug = strings.Trim(slug, "-")
	if slug == "" {
		return "pdf-import"
	}
	return slug
}
