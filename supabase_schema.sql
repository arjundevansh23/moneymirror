-- ─────────────────────────────────────────
-- Money Mirror — Supabase SQL Schema
-- Run this in Supabase → SQL Editor
-- ─────────────────────────────────────────

-- PROFILES
create table if not exists profiles (
  id          uuid references auth.users on delete cascade primary key,
  name        text,
  age         integer,
  city        text,
  income      integer,
  occupation  text,
  updated_at  timestamptz default now()
);

-- EXPENSES
create table if not exists expenses (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users on delete cascade not null,
  description  text not null,
  amount       numeric(10,2) not null,
  category     text not null,
  subcategory  text,
  date         date not null,
  time         text,
  icon         text,
  created_at   timestamptz default now()
);

-- GOALS
create table if not exists goals (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  name        text not null,
  icon        text default '🎯',
  target      numeric(10,2) not null,
  saved       numeric(10,2) default 0,
  deadline    text,
  created_at  timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ───────────────────
-- Users can only see their own data

alter table profiles enable row level security;
alter table expenses enable row level security;
alter table goals    enable row level security;

-- Profiles
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Expenses
create policy "Users can view own expenses"
  on expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses"
  on expenses for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses"
  on expenses for update using (auth.uid() = user_id);
create policy "Users can delete own expenses"
  on expenses for delete using (auth.uid() = user_id);

-- Goals
create policy "Users can view own goals"
  on goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals"
  on goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals"
  on goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals"
  on goals for delete using (auth.uid() = user_id);

-- ─── INDEXES ─────────────────────────────
create index if not exists expenses_user_date on expenses(user_id, date desc);
create index if not exists goals_user_id      on goals(user_id);
