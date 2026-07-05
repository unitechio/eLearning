CREATE SEQUENCE IF NOT EXISTS ielts_content_items_id_seq;
CREATE SEQUENCE IF NOT EXISTS ielts_passages_id_seq;
CREATE SEQUENCE IF NOT EXISTS ielts_question_groups_id_seq;
CREATE SEQUENCE IF NOT EXISTS ielts_questions_id_seq;
CREATE SEQUENCE IF NOT EXISTS ielts_vocabulary_items_id_seq;
CREATE SEQUENCE IF NOT EXISTS ielts_practice_attempts_id_seq;
CREATE SEQUENCE IF NOT EXISTS ielts_learning_progress_id_seq;
CREATE SEQUENCE IF NOT EXISTS ws_audit_id_seq;

CREATE TABLE IF NOT EXISTS ielts_content_items (
    id bigint PRIMARY KEY DEFAULT nextval('ielts_content_items_id_seq'),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    slug varchar(240) NOT NULL UNIQUE,
    title varchar(500) NOT NULL,
    subtitle varchar(500),
    description text,
    module varchar(50) NOT NULL,
    skill varchar(50) NOT NULL,
    content_type varchar(80) NOT NULL,
    part varchar(80),
    test_kind varchar(80),
    status varchar(40) NOT NULL DEFAULT 'draft',
    level varchar(40),
    thumbnail_url varchar(1000),
    preview_image_url varchar(1000),
    audio_url varchar(1000),
    pdf_url varchar(1000),
    source_url varchar(1000),
    question_count integer NOT NULL DEFAULT 0,
    duration_seconds integer NOT NULL DEFAULT 0,
    view_count bigint NOT NULL DEFAULT 0,
    tags jsonb NOT NULL DEFAULT '[]'::jsonb,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    published_at timestamptz
);

CREATE TABLE IF NOT EXISTS ielts_passages (
    id bigint PRIMARY KEY DEFAULT nextval('ielts_passages_id_seq'),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    content_item_id bigint NOT NULL REFERENCES ielts_content_items(id) ON DELETE CASCADE,
    passage_no integer NOT NULL,
    title varchar(500),
    body text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ielts_question_groups (
    id bigint PRIMARY KEY DEFAULT nextval('ielts_question_groups_id_seq'),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    content_item_id bigint NOT NULL REFERENCES ielts_content_items(id) ON DELETE CASCADE,
    passage_id bigint REFERENCES ielts_passages(id) ON DELETE SET NULL,
    group_no integer NOT NULL,
    question_from integer NOT NULL,
    question_to integer NOT NULL,
    question_type varchar(120) NOT NULL,
    instruction text,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ielts_questions (
    id bigint PRIMARY KEY DEFAULT nextval('ielts_questions_id_seq'),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    content_item_id bigint NOT NULL REFERENCES ielts_content_items(id) ON DELETE CASCADE,
    group_id bigint NOT NULL REFERENCES ielts_question_groups(id) ON DELETE CASCADE,
    question_no integer NOT NULL,
    prompt text,
    answer text,
    options jsonb NOT NULL DEFAULT '[]'::jsonb,
    explanation jsonb NOT NULL DEFAULT '{}'::jsonb,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ielts_vocabulary_items (
    id bigint PRIMARY KEY DEFAULT nextval('ielts_vocabulary_items_id_seq'),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    content_item_id bigint NOT NULL REFERENCES ielts_content_items(id) ON DELETE CASCADE,
    term varchar(300) NOT NULL,
    ipa varchar(300),
    part_of_speech varchar(80),
    meaning text,
    example text,
    image_url varchar(1000),
    audio_url varchar(1000),
    sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ielts_practice_attempts (
    id bigint PRIMARY KEY DEFAULT nextval('ielts_practice_attempts_id_seq'),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    user_id uuid NOT NULL,
    content_item_id bigint NOT NULL REFERENCES ielts_content_items(id) ON DELETE CASCADE,
    mode varchar(60) NOT NULL,
    status varchar(40) NOT NULL DEFAULT 'started',
    started_at timestamptz NOT NULL,
    submitted_at timestamptz,
    time_limit_seconds integer NOT NULL DEFAULT 0,
    elapsed_seconds integer NOT NULL DEFAULT 0,
    total_questions integer NOT NULL DEFAULT 0,
    correct_count integer NOT NULL DEFAULT 0,
    wrong_count integer NOT NULL DEFAULT 0,
    skipped_count integer NOT NULL DEFAULT 0,
    score numeric NOT NULL DEFAULT 0,
    answers jsonb NOT NULL DEFAULT '{}'::jsonb,
    stats jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS ielts_learning_progress (
    id bigint PRIMARY KEY DEFAULT nextval('ielts_learning_progress_id_seq'),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    user_id uuid NOT NULL,
    content_item_id bigint NOT NULL REFERENCES ielts_content_items(id) ON DELETE CASCADE,
    status varchar(40) NOT NULL DEFAULT 'not_started',
    completed_questions integer NOT NULL DEFAULT 0,
    total_questions integer NOT NULL DEFAULT 0,
    last_question_no integer NOT NULL DEFAULT 0,
    learned_at timestamptz,
    CONSTRAINT uq_ielts_progress_user_content UNIQUE (user_id, content_item_id)
);

CREATE TABLE IF NOT EXISTS ws_audit (
    id bigint PRIMARY KEY DEFAULT nextval('ws_audit_id_seq'),
    ws_call_type varchar(80),
    act_type_id bigint,
    request_time timestamptz,
    action_user_name varchar(255),
    ws_uri varchar(1000),
    source_app_id varchar(120),
    ip_pc varchar(80),
    destination_app_id varchar(120),
    status varchar(40),
    finish_time bigint,
    msg_request bytea,
    msg_response bytea,
    request_in_id varchar(120),
    request_out_id varchar(120),
    request_time_milisecond bigint,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ielts_content_module_skill ON ielts_content_items(module, skill);
CREATE INDEX IF NOT EXISTS idx_ielts_content_type_status ON ielts_content_items(content_type, status);
CREATE INDEX IF NOT EXISTS idx_ielts_content_published ON ielts_content_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ielts_content_deleted_at ON ielts_content_items(deleted_at);
CREATE INDEX IF NOT EXISTS idx_ielts_passages_content_sort ON ielts_passages(content_item_id, sort_order, passage_no);
CREATE INDEX IF NOT EXISTS idx_ielts_groups_content_sort ON ielts_question_groups(content_item_id, sort_order, question_from);
CREATE INDEX IF NOT EXISTS idx_ielts_questions_content_no ON ielts_questions(content_item_id, question_no);
CREATE INDEX IF NOT EXISTS idx_ielts_vocab_content_sort ON ielts_vocabulary_items(content_item_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_ielts_attempt_user_content ON ielts_practice_attempts(user_id, content_item_id, status);
CREATE INDEX IF NOT EXISTS idx_ielts_attempt_submitted ON ielts_practice_attempts(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ws_audit_request_time ON ws_audit(request_time DESC);
CREATE INDEX IF NOT EXISTS idx_ws_audit_user_status ON ws_audit(action_user_name, status);
CREATE INDEX IF NOT EXISTS idx_ws_audit_uri ON ws_audit(ws_uri);
