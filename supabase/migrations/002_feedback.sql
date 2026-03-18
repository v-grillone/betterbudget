create table feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  type text check (type in ('feature', 'problem')) not null,
  message text not null,
  created_at timestamptz default now()
);

alter table feedback enable row level security;

create policy "users own feedback" on feedback for all using (auth.uid() = user_id);
