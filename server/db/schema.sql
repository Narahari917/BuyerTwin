CREATE TABLE IF NOT EXISTS buyers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    desired_locations JSONB NOT NULL,
    timeline TEXT NOT NULL,
    must_have_features JSONB NOT NULL,
    inquiry_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    address_label TEXT NOT NULL,
    city TEXT NOT NULL,
    price INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    sqft INTEGER NOT NULL,
    neighborhood TEXT NOT NULL,
    school_score INTEGER NOT NULL,
    commute_score INTEGER NOT NULL,
    tags JSONB NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS buyer_events (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    duration_seconds INTEGER,
    source_channel TEXT,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('agent', 'buyer')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);