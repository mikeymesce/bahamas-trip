# CLAUDE.md — Bahamas Trip

## Team
- **Mike (mikeymesce)** — Product owner. Sales background, not an engineer. Creative lead.
- **Morgan** — Mike's girlfriend. Co-traveler. The site is for both of them.

## Project Overview
- Travel itinerary website for Mike & Morgan's Eleuthera, Bahamas trip (May 5–9, 2026)
- Vanilla HTML/CSS/JS — no frameworks, no build step
- Hosted on GitHub Pages: https://mikeymesce.github.io/bahamas-trip/
- GitHub repo: https://github.com/mikeymesce/bahamas-trip
- Design inspired by Jeremy's Japan trip site (mjinjapan.vercel.app)

## Tech Stack
- **Frontend:** index.html, style.css, script.js
- **Backend:** Supabase (shared packing list — table `bahamas_packing` in the GAINZ Supabase project)
- **Supabase URL:** https://bvnkzimwskuruhdmzpbt.supabase.co
- **Fonts:** Google Fonts — Pacifico (hero title), Playfair Display (section headings), Outfit (body)
- **No service worker** — removed to avoid caching issues. Cache-bust via `?v=N` query strings on CSS/JS.

## Key Features
- Ocean blue gradient hero with live countdown, wave divider
- Scratch-off welcome card for Morgan (shows every time, skip button)
- Morgan pre-trip to-do popup (after scratch-off, checkable, hides when all done)
- Sticky day nav (D0–D4 + Flights + Food + Bonus)
- Collapsible day sections (tap header to expand/collapse)
- Mood selector on Days 1 & 2 (Adventure / Chill / Ambitious)
- Timeline cards with colored left borders by category
- Google Maps links on every location
- Floating ? FAB → bottom sheet quick reference
- Shared packing list (Supabase synced)
- Password-protected private to-do for Mike (password: ilovemorganinthebahamas)
- Weather widget (activates 7 days before trip via Open-Meteo API)
- Restaurant guide, bonus ideas section, cost tracker

## Key People
- **Joe & Alyssa** — own the cottage (Bird of Paradise - Shooting Star). Free stay.
- **Mike's cousin** — arranging the rental car pickup at GHB airport
- **Jeremy (jpul)** — friend/advisor, built the Japan reference site

## Trip Details
- Flights: AA confirmation UXGSTJ, $1,370.26 total
- Cottage: Bird of Paradise, Shooting Star, Banks Road, Governors Harbour, Eleuthera
- Car: arranged through Mike's cousin

## Git & Deploy
- Auto-push to GitHub after changes
- GitHub Pages deploys automatically (takes 1-2 min)
- Bump `?v=N` on CSS/JS links in index.html when making changes to bust browser cache
- gh CLI installed at ~/bin/gh

## How to Work With Mike
- Explain like a high schooler. No jargon.
- Keep responses short unless asked for more.
- Simplest approach first.
- Say yes to ideas and build fast — he iterates by seeing things live.
- Always push to GitHub after changes so he can check on his phone.

## Run Locally
```bash
python3 -m http.server 8080
```
