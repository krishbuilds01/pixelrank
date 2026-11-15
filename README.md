# PixelRank

See where you stand.

PixelRank links your public LeetCode, Codeforces and CodeChef handles and puts them in one place. You get one score, a dashboard with your level and XP, and a leaderboard for your college. The same data also gives a country board, a global board and college vs college rankings.

It starts with one campus on purpose. If students in one college check it every week, other colleges will want to be on the board too.

## Features

- Sign up and login (passwords hashed, sessions in httpOnly cookies)
- Link your three handles and sync real ratings
  - Codeforces from the official API
  - LeetCode from its GraphQL endpoint, including solved count and weak topics
  - CodeChef from the public profile page (no stable official API exists)
- One unified score, XP and levels - formula in docs/WALKTHROUGH.md
- Leaderboards: global, per college, per country, with branch and batch filters
- College vs college rankings
- Contest page: live Codeforces rounds plus the weekly LeetCode and CodeChef schedule
- Weekly quests picked from your weak LeetCode topics
- Settings: hide yourself from public boards, or delete your account and all your data
- Sync is rate limited and failure tolerant - if one platform is down, the rest still sync and your old ratings stay

## Run it locally

```bash
npm install
npm run db:seed   # optional demo users, password demo1234
npm run dev
```

Open http://localhost:3000

Data is stored in a local SQLite file at data/pixelrank.db, created on first run. No external services or API keys are needed.

## Test

```bash
npm test
npm run build
```

## Stack

Next.js, TypeScript, Tailwind CSS, SQLite (node:sqlite), bcrypt, zod, vitest.

## How it works

Short plain notes on the sync, the score formula, the data model and the contest logic are in [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md).

## Note on data

Only public profile data is used. Codeforces has a public API. LeetCode and CodeChef do not have a stable official one for this, so those syncs are cached, retried and allowed to fail without breaking the rest of the app. The dashboard always shows when a profile was last synced.
