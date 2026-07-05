DROP TABLE IF EXISTS support_ticket_comments;
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS payment_transactions;
DROP TABLE IF EXISTS billing_invoices;
DROP TABLE IF EXISTS ielts_related_posts;
DROP TABLE IF EXISTS ielts_mock_test_sessions;

ALTER TABLE ielts_content_items
    DROP COLUMN IF EXISTS reviewed_at,
    DROP COLUMN IF EXISTS reviewed_by,
    DROP COLUMN IF EXISTS review_note,
    DROP COLUMN IF EXISTS review_status;
