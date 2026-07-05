package impl

import (
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/xuri/excelize/v2"
	"github.com/unitechio/eLearning/apps/api/internal/dto"
)

func parseIELTSImportFile(file *multipart.FileHeader) (*dto.IELTSImportBundle, error) {
	if file == nil {
		return nil, fmt.Errorf("file is required")
	}
	src, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()
	ext := strings.ToLower(filepath.Ext(file.Filename))
	switch ext {
	case ".json":
		raw, err := io.ReadAll(src)
		if err != nil {
			return nil, err
		}
		var bundle dto.IELTSImportBundle
		if err := json.Unmarshal(raw, &bundle); err != nil {
			return nil, err
		}
		return &bundle, nil
	case ".xlsx":
		xlsx, err := excelize.OpenReader(src)
		if err != nil {
			return nil, err
		}
		defer xlsx.Close()
		return parseIELTSXLSX(xlsx)
	default:
		return nil, fmt.Errorf("unsupported import file: %s", ext)
	}
}

func parseIELTSXLSX(file *excelize.File) (*dto.IELTSImportBundle, error) {
	bundle := &dto.IELTSImportBundle{}
	if rows, err := file.GetRows("content"); err == nil {
		values := keyValueRows(rows)
		bundle.Content = dto.IELTSContentRequest{
			Slug:            values["slug"],
			Title:           values["title"],
			Subtitle:        values["subtitle"],
			Description:     values["description"],
			Module:          values["module"],
			Skill:           values["skill"],
			ContentType:     values["content_type"],
			Part:            values["part"],
			TestKind:        values["test_kind"],
			Status:          values["status"],
			ReviewStatus:    values["review_status"],
			Level:           values["level"],
			ThumbnailURL:    values["thumbnail_url"],
			PreviewImageURL: values["preview_image_url"],
			AudioURL:        values["audio_url"],
			PDFURL:          values["pdf_url"],
			SourceURL:       values["source_url"],
			QuestionCount:   atoi(values["question_count"]),
			DurationSeconds: atoi(values["duration_seconds"]),
		}
	}
	bundle.Passages = parsePassageRows(sheetRows(file, "passages"))
	bundle.Groups = parseGroupRows(sheetRows(file, "groups"))
	bundle.Questions = parseQuestionRows(sheetRows(file, "questions"))
	bundle.Vocabulary = parseVocabularyRows(sheetRows(file, "vocabulary"))
	return bundle, nil
}

func sheetRows(file *excelize.File, sheet string) [][]string {
	rows, _ := file.GetRows(sheet)
	return rows
}

func keyValueRows(rows [][]string) map[string]string {
	out := map[string]string{}
	for _, row := range rows {
		if len(row) >= 2 {
			out[strings.TrimSpace(row[0])] = strings.TrimSpace(row[1])
		}
	}
	return out
}

func headerRows(rows [][]string) []map[string]string {
	if len(rows) < 2 {
		return nil
	}
	headers := rows[0]
	out := make([]map[string]string, 0, len(rows)-1)
	for _, row := range rows[1:] {
		item := map[string]string{}
		for i, header := range headers {
			if i < len(row) {
				item[strings.TrimSpace(header)] = strings.TrimSpace(row[i])
			}
		}
		out = append(out, item)
	}
	return out
}

func parsePassageRows(rows [][]string) []dto.IELTSPassageRequest {
	items := []dto.IELTSPassageRequest{}
	for _, row := range headerRows(rows) {
		items = append(items, dto.IELTSPassageRequest{PassageNo: atoi(row["passage_no"]), Title: row["title"], Body: row["body"], SortOrder: atoi(row["sort_order"])})
	}
	return items
}

func parseGroupRows(rows [][]string) []dto.IELTSQuestionGroupRequest {
	items := []dto.IELTSQuestionGroupRequest{}
	for _, row := range headerRows(rows) {
		items = append(items, dto.IELTSQuestionGroupRequest{GroupNo: atoi(row["group_no"]), QuestionFrom: atoi(row["question_from"]), QuestionTo: atoi(row["question_to"]), QuestionType: row["question_type"], Instruction: row["instruction"], SortOrder: atoi(row["sort_order"])})
	}
	return items
}

func parseQuestionRows(rows [][]string) []dto.IELTSQuestionRequest {
	items := []dto.IELTSQuestionRequest{}
	for _, row := range headerRows(rows) {
		items = append(items, dto.IELTSQuestionRequest{GroupID: uint(atoi(row["group_id"])), QuestionNo: atoi(row["question_no"]), Prompt: row["prompt"], Answer: row["answer"], SortOrder: atoi(row["sort_order"])})
	}
	return items
}

func parseVocabularyRows(rows [][]string) []dto.IELTSVocabularyRequest {
	items := []dto.IELTSVocabularyRequest{}
	for _, row := range headerRows(rows) {
		items = append(items, dto.IELTSVocabularyRequest{Term: row["term"], IPA: row["ipa"], PartOfSpeech: row["part_of_speech"], Meaning: row["meaning"], Example: row["example"], ImageURL: row["image_url"], AudioURL: row["audio_url"], SortOrder: atoi(row["sort_order"])})
	}
	return items
}

func atoi(value string) int {
	n, _ := strconv.Atoi(strings.TrimSpace(value))
	return n
}
