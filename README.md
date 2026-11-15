# PixelRank

See where you stand.

PixelRank links your public LeetCode, Codeforces and CodeChef handles and puts them in one place. You get one score, a dashboard, and a leaderboard for your college. Later the same board goes global, with country ranks and college vs college.

It starts with one campus on purpose. If students in one college check it every week, other colleges will want to be on the board too.

## What is in this version

- Landing page in an arcade / pixel style
- College leaderboard with sample data
- A player dashboard with level, XP and linked handles (sample data)
- Contest cards and a weekly practice plan (quests)

Real handle sync is not in yet. That is the next step, Codeforces first because it has a proper public API.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Stack

Next.js, TypeScript, Tailwind CSS. Postgres and Redis come in with the sync and leaderboard work.

## Plan

1. Link handles and sync ratings, with caching and a last synced time
2. College leaderboard with branch and batch filters
3. Contest calendar and reminders
4. Global board, country board, college vs college
5. Weak topic analysis and a weekly practice plan

## Note on data

Codeforces has a public API. LeetCode and CodeChef do not have a stable official one for this, so those syncs need caching and should handle failures properly. Only public profile data is used.
