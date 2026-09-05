create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  protocol text not null unique,
  name text,
  email text,
  display_name text not null default 'Anônimo',
  service text not null check (service in ('passaporte','registro-civil','procuracao','documentos','visto','outros')),
  incident_date date,
  description text not null check (char_length(description) between 1 and 5000),
  wait_time text,
  resolved text,
  rating smallint check (rating between 1 and 5),
  consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.complaints enable row level security;

revoke all on table public.complaints from anon, authenticated;

grant insert (protocol, name, email, display_name, service, incident_date, description, wait_time, resolved, rating, consent)
  on table public.complaints to anon;

grant select (protocol, display_name, service, incident_date, description, wait_time, resolved, rating, status, created_at)
  on table public.complaints to anon;

create policy "anonymous visitors can submit pending complaints"
on public.complaints
for insert
to anon
with check (status = 'pending');

create policy "anonymous visitors can read approved complaints"
on public.complaints
for select
to anon
using (status = 'approved');

create index complaints_status_created_at_idx on public.complaints (status, created_at desc);
