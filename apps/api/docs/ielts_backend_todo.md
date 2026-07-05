# IELTS Backend TODO

## Data foundation

- [x] Create reusable IELTS content tables for reading, listening, writing, speaking, dictation, sample articles, and full/mock tests.
- [x] Store preview image, thumbnail, tags, metadata, passages, question groups, questions, vocabulary, attempts, progress, and answer keys.
- [x] Add `ws_audit` table for DB trace logs.
- [x] Add indexes for slug, module, skill, content type, status, published date, attempts, progress, and audit lookup.

## API foundation

- [x] Public FE APIs for listing and reading IELTS content.
- [x] Public FE APIs for answer key and vocabulary pages.
- [x] Authenticated APIs for starting/submitting practice attempts and reading learning progress.
- [x] Admin APIs for IELTS content CRUD.
- [x] Audit logs from mutation use cases.

## Next phases

- [ ] Admin UI import for passages/questions from spreadsheet/JSON.
- [ ] File upload handler for thumbnails, preview images, audio, PDFs, and vocabulary images.
- [ ] Detailed CRUD for passages, question groups, questions, vocabulary, explanations, and related posts.
- [ ] Full mock test orchestration across all 4 skills.
- [ ] Real scoring rules per IELTS skill, band conversion, and review workflow.
- [ ] Role permissions for editor/reviewer/publisher flows.
