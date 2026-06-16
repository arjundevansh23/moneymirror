# Money Mirror 💰

A smart personal finance tracker that gives you AI-powered insights, peer benchmarks, and investment projections based on your real spending.

## Stack

- **Frontend** — React + Vite
- **Auth + Database** — Supabase
- **Routing** — React Router
- **Styling** — Plain CSS with design tokens

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/money-mirror
cd money-mirror
npm install
```

### 2. Create a Supabase project
1. Go to supabase.com → New project
2. Go to SQL Editor → paste contents of supabase_schema.sql → Run
3. Go to Settings → API → copy Project URL and anon key

### 3. Add environment variables
Create a .env.local file:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
1. Push to GitHub
2. Import repo on vercel.com
3. Add env variables in Vercel project settings
4. Deploy

## Features
- Login / Signup (email + Google)
- Onboarding — name, age, city, income, occupation
- Personalised peer benchmarks by city + age + income
- Add / edit / delete expenses with category + subcategory
- Spending flip cards with subcategory breakdown
- Dynamic donut chart
- Insights — alerts, benchmarks, habits, opportunity, projections
- Goals with progress tracking and add funds
- Financial health score (0-100)
- All data syncs across devices via Supabase
