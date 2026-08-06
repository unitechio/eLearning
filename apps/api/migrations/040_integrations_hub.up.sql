CREATE TABLE IF NOT EXISTS integration_catalog (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    provider VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'communication',
    description TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    developer VARCHAR(100) NOT NULL,
    steps_count INT NOT NULL DEFAULT 4,
    is_pro BOOLEAN NOT NULL DEFAULT FALSE,
    is_new BOOLEAN NOT NULL DEFAULT FALSE,
    features_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    overview_text TEXT,
    how_it_works_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_integration_catalog_category ON integration_catalog(category);
CREATE INDEX IF NOT EXISTS idx_integration_catalog_slug ON integration_catalog(slug);

CREATE TABLE IF NOT EXISTS user_integrations (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    catalog_id UUID NOT NULL REFERENCES integration_catalog(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'disconnected',
    account_identifier VARCHAR(255),
    account_details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    error_message TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_synced_at TIMESTAMPTZ,
    auth_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_user_integration UNIQUE (tenant_id, catalog_id)
);

CREATE INDEX IF NOT EXISTS idx_user_integrations_tenant_status ON user_integrations(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_user_integrations_catalog ON user_integrations(catalog_id);

CREATE TABLE IF NOT EXISTS integration_logs (
    id UUID PRIMARY KEY,
    user_integration_id UUID NOT NULL REFERENCES user_integrations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    message TEXT,
    payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_integration_logs_user_integration ON integration_logs(user_integration_id);
