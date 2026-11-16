# PixelRank - how it works (plain notes)

Keep this updated. If someone asks how the project works, these are the parts to be able to explain.

## The flow
Sign up -> save handles -> Sync -> the server calls each platform, stores the ratings, computes one score -> leaderboards read from the database sorted by that score.

## Sync
- Codeforces: official API, user.info for rating and user.status to count solved problems.
- LeetCode: their GraphQL endpoint, userContestRanking for rating and submitStats for solved count. tagProblemCounts gives the least practised topics, which become quests.
- CodeChef: no stable official API, so the public profile page is read and the rating is parsed from it. This is the fragile one. It has a retry and a longer timeout, and if it fails the other two platforms still sync (status "partial") and old ratings are kept.
- All three run in parallel. Sync is rate limited per user.

## Score, XP, level
- Score = weighted average of the ratings that exist. Codeforces 40%, LeetCode 35%, CodeChef 25% with the CodeChef rating scaled by 0.8 first because its scale runs higher.
- XP = score x 4 + LeetCode solved x 10.
- Level = floor(sqrt(XP / 250)) + 1.
- Code in src/lib/scoring.ts, tests in tests/scoring.test.ts.

## Data
- Postgres through the pg package when DATABASE_URL is set (Supabase in production), SQLite through Node's built in node:sqlite for local dev otherwise. No ORM. Tables: users, sessions, profiles. See src/lib/db.ts.
- Passwords are hashed with bcrypt. Sessions are random tokens in an httpOnly cookie, stored in the sessions table.
- Why both: SQLite is zero setup for local dev. Production needs a hosted database because a file does not persist on Vercel, so the same helpers (q, q1, run in src/lib/db.ts) talk to Postgres there. Call sites write SQL with ? placeholders and the layer converts them for Postgres.

## Leaderboards
- One query: public users with a score, ordered by score then XP. College, country, branch and batch boards are filters on the same rows - that is the multi-tenant part.
- College vs college groups the same rows by college and ranks by average score.

## Contests
- Codeforces rounds come live from the official API, cached for an hour.
- LeetCode Weekly (Sunday 8:00 AM IST), Biweekly (Saturday 8:00 PM IST) and CodeChef Starters (Wednesday 8:00 PM IST) run on fixed weekly schedules, so the next date is computed, not scraped.
- The contest calendar (src/lib/calendar.ts) builds a full month from the same sources: live Codeforces rounds placed on their IST dates, Weekly on every Sunday, Starters on every Wednesday, Biweekly on alternate Saturdays anchored to a known Biweekly date.

## What is not in yet (next improvements)
- Email reminders for contests (the contest data is ready for it)
- Rating history graph on the dashboard
