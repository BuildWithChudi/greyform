-- Greyform · inquiries table
-- Paste this whole file into the Supabase SQL editor and run once.
-- Re-running is safe: every statement is idempotent via IF NOT EXISTS / OR REPLACE.

create extension if not exists "pgcrypto";

create table if not exists public.inquiries (
  id              uuid primary key default gen_random_uuid(),
  name            text        not null,
  email           text        not null,
  company         text,
  location        text,
  project_type    text        not null,
  description     text        not null,
  "references"    text,
  timeline        text        not null,
  budget          text        not null,
  status          text        not null default 'new',
  notes           text,
  created_at      timestamptz not null default now()
);

-- Useful indexes for the admin table view (newest-first, status filter).
create index if not exists inquiries_created_at_desc_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_status_idx
  on public.inquiries (status);

-- Lock down anonymous and authenticated client access. Our server talks to
-- Supabase with the service-role key, which bypasses RLS — so the table is
-- only readable/writable from the Greyform server.
alter table public.inquiries enable row level security;

-- (Intentionally no policies: anon and authenticated roles get nothing.)

-- Optional: enum-style check on status so typos can't sneak in.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'inquiries_status_check'
  ) then
    alter table public.inquiries
      add constraint inquiries_status_check
      check (status in ('new', 'contacted', 'proposal_sent', 'won', 'lost'));
  end if;
end$$;
