-- Flash Company metrics schema. Run once against your Neon database
-- (Neon dashboard SQL editor, or: psql "$DATABASE_URL" -f db/schema.sql).

CREATE TABLE IF NOT EXISTS signups (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
