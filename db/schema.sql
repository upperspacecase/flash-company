-- Flash Company metrics schema. Run once against your Neon database.
-- Easiest: node --env-file=.env.local scripts/init-db.mjs
-- Or paste the statements below into the Neon dashboard SQL editor.

CREATE TABLE IF NOT EXISTS signups (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
