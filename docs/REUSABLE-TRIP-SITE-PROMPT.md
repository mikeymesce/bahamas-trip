# Reusable Trip Itinerary Website Prompt

Copy everything below the line and paste it into a new Claude Code conversation. Fill in your trip details where you see [BRACKETS].

---

## PROMPT START — COPY BELOW THIS LINE

I want you to build me a beautiful, mobile-first travel itinerary website I can pull up on my phone while traveling.

### Setup
1. Create a new folder at ~/Desktop/[TRIP-NAME]
2. Initialize a git repo
3. Create a GitHub repo called [REPO-NAME] and push
4. Enable GitHub Pages so I can access it at [username].github.io/[REPO-NAME]

### Trip Details
- **Travelers:** [Names]
- **Dates:** [Start date – End date]
- **Destination:** [Where you're going]
- **Flights:** [Paste your flight details or attach PDFs]
- **Accommodation:** [Hotel/Airbnb name, address, dates, check-in time]
- **Car/Transport:** [Rental car details or how you're getting around]

### Day-by-Day Itinerary
[Fill in what you're doing each day, or tell Claude you need help planning it. You can say things like "Day 2 is open — give me adventure vs chill options"]

### Website Features I Want

**Design:**
- Mobile-first — must look amazing on phones
- Tropical/vacation vibe with colors matching the destination
- Clean and modern but with personality — not boring
- Google Fonts for a polished look (serif for titles, clean sans-serif for body)

**Hero Section:**
- Full-screen gradient header matching destination vibe
- Trip title in an elegant/fun font
- Live countdown timer (days, hours, minutes, seconds) to departure
- "View Itinerary" button
- Wave divider at bottom of hero
- Fun tagline

**Navigation:**
- Sticky horizontal day nav (D0, D1, D2... with dates and location labels)
- Active day highlights as you scroll
- Scrollable on mobile

**Day Sections:**
- Each day collapsible (tap header to expand/collapse)
- Day number badge (colored by theme)
- Day title + subtitle describing the vibe
- Location tag pill (color-coded)

**Timeline Cards:**
- Vertical timeline with colored dots
- White cards with colored left border by category:
  - Beach = cyan, Food = orange, Adventure = blue, Transport = gray, Nightlife = purple, Nature = green, Shopping = pink
- Category tag pills on each card
- "Open in Maps" links for locations (Google Maps)
- Yellow "Pro tip" callout boxes for important notes

**Mood Selector (optional):**
- For flexible days, show two side-by-side cards: "Adventure" vs "Chill"
- Tapping one shows that path's activities

**Flight Cards:**
- Individual cards for each leg (outbound/return)
- Airport codes, times, flight numbers, duration
- Layover info between legs
- Confirmation code with copy button

**Accommodation Card:**
- Blue left border (hotel style)
- Name, dates, address, Directions link
- Check-in time
- Price info
- Feature tags (beds, bath, amenities)

**Cost Tracker:**
- Running total of trip costs

**Restaurant Guide:**
- Cards for each dinner spot with descriptions and tags
- Highlight the must-do restaurant

**Quick Reference (Bottom Sheet):**
- Floating pink ? button (bottom right corner, always visible)
- Opens a slide-up bottom sheet with:
  - Hotel/cottage address with Copy button
  - Google Maps link
  - Confirmation codes with Copy button
  - Emergency numbers
  - Local useful info (grocery stores, pharmacies, etc.)
  - Travel tips
  - Helpful links

**Shared Packing List:**
- "Don't Forget to Bring" section
- Add items, check them off, delete them
- Synced via Supabase so multiple people see the same list
- Supabase setup: create a table called [trip]_packing with columns: id (uuid), text (text), checked (boolean), created_at (timestamptz)
- Enable RLS with an "allow all" policy

**PWA / Offline:**
- Service worker for offline access
- manifest.json for "Add to Home Screen"

**Tech Stack:**
- Vanilla HTML/CSS/JS — no frameworks, no build step
- Separate files: index.html, style.css, script.js, sw.js, manifest.json
- Supabase for shared packing list
- GitHub Pages for hosting

### Style Reference
The design should match the quality of https://mjinjapan.vercel.app/ — a polished, app-like travel itinerary site with:
- Warm cream background
- Colored timeline with category borders
- Clean typography
- Lots of white space
- Subtle shadows
- Bottom sheet for quick reference
- Feels like an app, not a website
