CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    google_id VARCHAR(255) UNIQUE,
    email_verified_at TIMESTAMP,
    password VARCHAR(255),
    super BOOLEAN NOT NULL DEFAULT FALSE,
    avatar VARCHAR(255),
    preferences JSONB,
    last_login TIMESTAMP,
    remember_token VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_id_index ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_last_activity_index ON sessions (last_activity);

CREATE TABLE IF NOT EXISTS role_user (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS group_user (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS password_activation_tokens (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS password_activation_tokens_email_index ON password_activation_tokens (email);

CREATE TABLE IF NOT EXISTS express_sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS express_sessions_expire_idx ON express_sessions (expire);

CREATE TABLE IF NOT EXISTS traffic_visitors (
    id BIGSERIAL PRIMARY KEY,
    visitor_uuid UUID NOT NULL UNIQUE,
    first_seen_at TIMESTAMP,
    last_seen_at TIMESTAMP,
    first_ip VARCHAR(45),
    last_ip VARCHAR(45),
    first_user_agent TEXT,
    last_user_agent TEXT,
    first_accept_language VARCHAR(255),
    last_accept_language VARCHAR(255),
    first_locale VARCHAR(10),
    last_locale VARCHAR(10),
    first_referer TEXT,
    first_landing_url TEXT,
    is_ad_traffic BOOLEAN NOT NULL DEFAULT FALSE,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    gclid VARCHAR(255),
    gad_source VARCHAR(255),
    gclsrc VARCHAR(255),
    dclid VARCHAR(255),
    fbclid VARCHAR(255),
    msclkid VARCHAR(255),
    country_code VARCHAR(2),
    country_name VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS traffic_visitors_first_seen_at_index ON traffic_visitors (first_seen_at);
CREATE INDEX IF NOT EXISTS traffic_visitors_last_seen_at_index ON traffic_visitors (last_seen_at);
CREATE INDEX IF NOT EXISTS traffic_visitors_first_locale_index ON traffic_visitors (first_locale);
CREATE INDEX IF NOT EXISTS traffic_visitors_last_locale_index ON traffic_visitors (last_locale);
CREATE INDEX IF NOT EXISTS traffic_visitors_last_seen_ip_index ON traffic_visitors (last_seen_at, last_ip);
CREATE INDEX IF NOT EXISTS traffic_visitors_ad_last_seen_index ON traffic_visitors (is_ad_traffic, last_seen_at);
CREATE INDEX IF NOT EXISTS traffic_visitors_utm_index ON traffic_visitors (utm_source, utm_medium);
CREATE INDEX IF NOT EXISTS traffic_visitors_gclid_index ON traffic_visitors (gclid);

CREATE TABLE IF NOT EXISTS traffic_visits (
    id BIGSERIAL PRIMARY KEY,
    traffic_visitor_id BIGINT NOT NULL REFERENCES traffic_visitors(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    request_method VARCHAR(10) NOT NULL,
    route_name VARCHAR(255),
    host VARCHAR(255),
    path TEXT NOT NULL,
    full_url TEXT NOT NULL,
    query_params JSONB,
    referer TEXT,
    ip_address VARCHAR(45),
    response_status SMALLINT,
    response_time_ms INTEGER,
    bot_score SMALLINT NOT NULL DEFAULT 0,
    is_suspected_bot BOOLEAN NOT NULL DEFAULT FALSE,
    bot_reasons JSONB,
    occurred_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS traffic_visits_session_id_index ON traffic_visits (session_id);
CREATE INDEX IF NOT EXISTS traffic_visits_route_name_index ON traffic_visits (route_name);
CREATE INDEX IF NOT EXISTS traffic_visits_ip_address_index ON traffic_visits (ip_address);
CREATE INDEX IF NOT EXISTS traffic_visits_response_status_index ON traffic_visits (response_status);
CREATE INDEX IF NOT EXISTS traffic_visits_bot_score_index ON traffic_visits (bot_score);
CREATE INDEX IF NOT EXISTS traffic_visits_is_suspected_bot_index ON traffic_visits (is_suspected_bot);
CREATE INDEX IF NOT EXISTS traffic_visits_occurred_at_index ON traffic_visits (occurred_at);
CREATE INDEX IF NOT EXISTS traffic_visits_ip_occurred_index ON traffic_visits (ip_address, occurred_at);

CREATE TABLE IF NOT EXISTS lead_submissions (
    id BIGSERIAL PRIMARY KEY,
    traffic_visitor_id BIGINT REFERENCES traffic_visitors(id) ON DELETE SET NULL,
    traffic_visit_id BIGINT REFERENCES traffic_visits(id) ON DELETE SET NULL,
    form_type VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    company VARCHAR(255),
    address TEXT,
    message TEXT,
    products JSONB,
    turnstile_validated BOOLEAN NOT NULL DEFAULT TRUE,
    mail_sent_at TIMESTAMP,
    mail_error TEXT,
    submitted_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_submissions_form_type_index ON lead_submissions (form_type);
CREATE INDEX IF NOT EXISTS lead_submissions_email_index ON lead_submissions (email);
CREATE INDEX IF NOT EXISTS lead_submissions_submitted_at_index ON lead_submissions (submitted_at);
CREATE INDEX IF NOT EXISTS lead_submissions_form_submitted_index ON lead_submissions (form_type, submitted_at);

CREATE TABLE IF NOT EXISTS background_jobs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    available_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reserved_at TIMESTAMP,
    failed_at TIMESTAMP,
    last_error TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS background_jobs_pending_index ON background_jobs (available_at, failed_at);

ALTER TABLE lead_submissions ADD COLUMN IF NOT EXISTS crm_synced_at TIMESTAMP;
ALTER TABLE lead_submissions ADD COLUMN IF NOT EXISTS crm_error TEXT;
