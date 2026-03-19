# Mike & Morgan — Eleuthera 2026

A travel itinerary website for Mike & Morgan's Bahamas trip to Eleuthera, May 5–9, 2026.

## Quick Start

```bash
cd ~/Desktop/"bahamas trip"
python3 -m http.server 8080
# Open localhost:8080 in your browser
```

## Live Site

**https://mikeymesce.github.io/bahamas-trip/**

Hosted on GitHub Pages (free).

## What This Is

A mobile-first travel itinerary PWA with:
- Day-by-day timeline with collapsible sections
- "Adventure vs Chill" mood selector for flexible days
- Flight details with confirmation code
- Accommodation info with Google Maps links
- Restaurant guide
- Friday Fish Fry highlight
- Shared packing list (synced via Supabase — both phones see the same list)
- Quick Reference bottom sheet (cottage address, emergency numbers, grocery stores)
- Countdown timer to departure
- Offline support via service worker

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no frameworks, no build step)
- **Backend:** Supabase (packing list sync)
- **Hosting:** GitHub Pages
- **Fonts:** Google Fonts (Pacifico, Playfair Display, Outfit)
- **PWA:** Service worker + manifest.json

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main page — all sections |
| `style.css` | All styles — mobile-first, tropical design |
| `script.js` | Countdown, mood selector, collapsible days, packing list (Supabase), bottom sheet, copy-to-clipboard |
| `sw.js` | Service worker for offline support |
| `manifest.json` | PWA manifest for "Add to Home Screen" |
| `icon-192.png` / `icon-512.png` | PWA icons |
| `docs/` | Itinerary summary, project docs |

## Supabase Setup

The packing list uses a `bahamas_packing` table in the GAINZ Supabase project.

**Table schema:**
```sql
create table bahamas_packing (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  checked boolean default false,
  created_at timestamptz default now()
);

alter table bahamas_packing enable row level security;

create policy "Allow all access" on bahamas_packing
  for all using (true) with check (true);
```

## Design Inspiration

Based on [Jeremy's Japan trip site](https://mjinjapan.vercel.app/) — adapted for Bahamas with turquoise/ocean color scheme, pink accents, and mood-based itinerary options.
