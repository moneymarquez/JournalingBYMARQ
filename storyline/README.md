# Storyline — Book Journaling App

Vite + React app. Entries are saved in browser localStorage (no database needed).
AI Chat calls a Vercel serverless function (`/api/chat`) which uses your Claude API key,
kept safely server-side via an environment variable — never exposed in the browser.

## Deploy

1. Push this folder to a GitHub repo (root of repo, not a subfolder).
2. Import the repo into Vercel.
3. In Vercel → Project → Settings → Environment Variables, add:
   - `ANTHROPIC_API_KEY` = your Claude API key
4. Deploy.

No other setup needed — Root Directory stays `./`.
