ALTER TABLE ielts_content_items
    ADD COLUMN IF NOT EXISTS review_status VARCHAR(30) DEFAULT 'draft',
    ADD COLUMN IF NOT EXISTS review_note TEXT,
    ADD COLUMN IF NOT EXISTS reviewed_by UUID,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS ielts_mock_test_sessions (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    user_id UUID NOT NULL,
    status VARCHAR(30) DEFAULT 'started',
    listening_attempt_id BIGINT,
    reading_attempt_id BIGINT,
    writing_attempt_id BIGINT,
    speaking_attempt_id BIGINT,
    overall_score NUMERIC(4,1),
    component_scores JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ,
    elapsed_seconds INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ielts_mock_sessions_user_status ON ielts_mock_test_sessions(user_id, status);

CREATE TABLE IF NOT EXISTS ielts_related_posts (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    content_item_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    title VARCHAR(500),
    sort_order INT DEFAULT 0,
    CONSTRAINT uniq_ielts_related_content_post UNIQUE(content_item_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_ielts_related_posts_content ON ielts_related_posts(content_item_id, sort_order);

CREATE TABLE IF NOT EXISTS billing_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    user_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    invoice_no VARCHAR(40) NOT NULL UNIQUE,
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(30) DEFAULT 'pending',
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_billing_invoices_user_status ON billing_invoices(user_id, status);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_status_created ON billing_invoices(status, created_at DESC);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    user_id UUID NOT NULL,
    invoice_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_reference VARCHAR(120),
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(30) DEFAULT 'pending',
    checkout_url TEXT,
    paid_at TIMESTAMPTZ,
    failure_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_status ON payment_transactions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_invoice ON payment_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider_ref ON payment_transactions(provider, provider_reference);

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    user_id UUID NOT NULL,
    assignee_id UUID,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(80),
    priority VARCHAR(30) DEFAULT 'normal',
    status VARCHAR(30) DEFAULT 'open'
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status ON support_tickets(user_id, status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assignee_status ON support_tickets(assignee_id, status);

CREATE TABLE IF NOT EXISTS support_ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    ticket_id UUID NOT NULL,
    user_id UUID NOT NULL,
    body TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_support_ticket_comments_ticket ON support_ticket_comments(ticket_id, created_at);
