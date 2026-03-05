-- Users table (mirrors auth.users with profile data)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Budgets table (one per user, holds monthly budget + category splits)
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  monthly_amount numeric(10, 2) not null default 0,
  needs_pct numeric(5, 2) not null default 50,
  wants_pct numeric(5, 2) not null default 30,
  investing_pct numeric(5, 2) not null default 20,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pct_sum_100 check (needs_pct + wants_pct + investing_pct = 100)
);

-- Transactions table
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null unique default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('needs', 'wants', 'investing')),
  description text,
  amount numeric(10, 2) not null,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Auto-update updated_at on budgets
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger budgets_updated_at
  before update on public.budgets
  for each row execute function update_updated_at();

-- RLS
alter table public.users enable row level security;
alter table public.budgets enable row level security;
alter table public.transactions enable row level security;

-- Users policies
create policy "users: select own" on public.users
  for select using (auth.uid() = user_id);

create policy "users: insert own" on public.users
  for insert with check (auth.uid() = user_id);

create policy "users: update own" on public.users
  for update using (auth.uid() = user_id);

-- Budgets policies
create policy "budgets: select own" on public.budgets
  for select using (auth.uid() = user_id);

create policy "budgets: insert own" on public.budgets
  for insert with check (auth.uid() = user_id);

create policy "budgets: update own" on public.budgets
  for update using (auth.uid() = user_id);

-- Transactions policies
create policy "transactions: select own" on public.transactions
  for select using (auth.uid() = user_id);

create policy "transactions: insert own" on public.transactions
  for insert with check (auth.uid() = user_id);

create policy "transactions: update own" on public.transactions
  for update using (auth.uid() = user_id);

create policy "transactions: delete own" on public.transactions
  for delete using (auth.uid() = user_id);
