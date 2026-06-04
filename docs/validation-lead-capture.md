# Validation Lead-Capture — Architecture & Scale Plan

> Status: plan only. The current app is a demo (frontend-only clickable
> prototype). This document is how we'd make the validation lead-capture loop
> real and have it hold up live at up to ~100,000 users.

## The loop

Inside the Validation step a cohort can:

1. **Publish** the landing page we generate (or point us at a site they already have).
2. **Share** it — the link drops into the outreach copy we already produce (LinkedIn / DM / email / WhatsApp).
3. **Capture** — visitors leave an email; a backend stores it.
4. **See results** — a live Signups panel in Validation shows real counts, feeding back into the agent's feedback synthesis.

This realises an existing PRD requirement (Validation Engine: "landing page with feedback feature", "feedback aggregates into the shared agent") and is the slice River flagged as mattering most for first-pass validation.

## Scale assumptions (sizing it)

- 100k users, cohorts of ≤3 → ~35k cohorts → tens of thousands of public landing pages.
- Each venture is shared to ~10–20 people × up to 3 founders → bursty traffic when a link is posted.
- Realistic peak: one link gets mild traction → thousands of form submits in minutes.
- Shape: **spiky writes** (form submits) + **cache-friendly reads** (the public page is the same for everyone) + **low-volume authenticated reads** (the team's dashboard).

So: serve the page from cache, make writes cheap and abuse-resistant, keep dashboards gated.

## Architecture (Vercel + Next 16)

1. **Public landing page** — `app/v/[slug]/page.tsx`. Generated on-demand (not at build time — there are too many), cached at the CDN edge with ISR, revalidated on publish/edit. Traffic spikes hit the CDN, not the DB. Renders the same hero we already designed, with a real email form.
2. **Capture endpoint** — `app/api/leads`. Validates, dedupes, rate-limits, writes. Returns fast.
3. **Datastore** — serverless Postgres with connection pooling. **Recommend Neon** (already used on findaspot; its serverless/HTTP driver sidesteps the serverless connection-limit problem). Vercel Postgres is Neon underneath; Supabase is also fine if we later want its auth/realtime.
4. **Notifications** — Resend for "you got a lead." At scale, **batched digests** (e.g. daily or every N leads), not one email per lead.

## Data model (multi-tenant)

```
ventures(
  id, slug UNIQUE, cohort_id, status,        -- draft | live
  content JSONB,                              -- the landing snapshot we render
  owner_token,                               -- gates the dashboard (see below)
  created_at
)

leads(
  id, venture_id FK, email, channel,          -- linkedin | dm | email | whatsapp | direct
  utm JSONB, ip_hash, created_at
)
  INDEX (venture_id, created_at)
  UNIQUE (venture_id, lower(email))            -- dedupe; upsert on conflict
```

Counts: `COUNT(*)` on the index is fine at this scale. Add a denormalized `lead_count` only if a dashboard becomes hot.

## The parts that bite at scale

- **Serverless ↔ Postgres connections.** The #1 gotcha. Use Neon's serverless driver (or a pgBouncer pooler) so a burst of functions doesn't exhaust connections.
- **Spam.** Public forms get bot-flooded. Honeypot field + per-IP rate limit + email syntax/MX check; add Cloudflare Turnstile only if abuse appears.
- **Ownership / access.** The PRD says "no accounts, just a link." So the **leads dashboard must be gated by a per-cohort signed token (magic link)** — not by the public slug. Without this, anyone who guesses a slug reads another team's leads. Non-negotiable.
- **Privacy / PII.** Real emails = consent obligations (EU footprint is implied by the Estonia / Stripe Atlas pricing notes). Consent checkbox + privacy-policy link + a delete path.
- **Idempotency.** Same person submits twice → `UNIQUE(venture_id, email)` + upsert.

## Demo now vs. live later

- **Demo (now):** fake the Publish action and a live Signups panel with seeded numbers — no infra. The demo tells the whole story without a backend.
- **Live (later):** everything above. The only thing blocked on Tay's side is provisioning the datastore and putting the connection string in `.env.local`; the rest is buildable.
- When we build the routes, check `node_modules/next/dist/docs/` first — this is Next 16 and its route-handler / ISR APIs differ from older versions (per AGENTS.md).

## BYO-site (fast-follow, not first cut)

For teams who already have a site: a `<script>` embed (or a hosted form URL) that POSTs to `/api/leads` with the venture's public token, CORS-scoped to their domain. Same table, same dashboard.

## Open decisions (need Tay)

1. **Datastore** — Neon (recommended) / Supabase / Vercel Postgres?
2. **Dashboard access** — per-cohort magic-link token (recommended)?
3. **Privacy for v1** — consent checkbox + minimal PII now, or defer?
