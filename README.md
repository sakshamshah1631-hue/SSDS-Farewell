# Sinhagad Spring Dale School (Ambegaon) — Class 10 Farewell Gala Portal

A bespoke, production-grade web application built for the **Sinhagad Spring Dale School, Ambegaon (Pune)** Class of 2026 Farewell celebration and official registration.

---

## Visual Identity & Design System

- **Color Palette:** Grounded strictly in an upscale, luxury-event palette of deep midnight obsidian (`#070b14`), deep sapphire blue, starlight celestial cyan, and warm champagne/amber accents. Strictly **zero purple, violet, or magenta** across all UI components, backgrounds, and gradients.
- **Atmospheric Canvas:** Bespoke dynamic canvas engine simulating floating bokeh orbs, starlight motes, and luminous curved neon ribbons inspired by the event aesthetic.
- **Editorial Typography:** High-contrast luxury pairing of **Cinzel**, **Playfair Display**, and **Cormorant Garamond** with **Plus Jakarta Sans** and **Inter**.
- **Zero Emojis:** Professional editorial tone using exclusively clean, thin-stroke SVG icons from **Lucide**.

---

## Core Features

### 1. Landing Experience
- **Editorial Hero Header:** *"Sinhagad Spring Dale School, Ambegaon — Class of 2026 Farewell"* with full-viewport atmospheric evening lawn ambiance, live countdown timer to the gala, and quick registration triggers.
- **Event Highlights:** Class 10 Divisions A through E, grand evening schedule, and security verification standards.
- **Evening Itinerary:** 5-stage chronological timeline covering Red Carpet Arrival, Valedictory Ceremonies, Royal Lawn Banquet, Starlight Lawn Disco & DJ Dance Floor, and Memento Presentations.
- **Tentative Venue Announcement:** Prominent status badge with explanatory note on the open-air lawn destination in South Pune / Ambegaon. Dynamically controllable from the Admin console.
- **Atmosphere & Lawn Disco Gallery:** Curated celebration perspectives with hover scale transitions, category filters (Evening Lawns, Disco & Dance Floor, Class Milestones), and editorial captions.
- **Class 10 Reflections:** Authentic student reflections from Divisions A through E.
- **Ambient Resonance Audio:** Optional Web Audio synthesizer delivering soft starlight harmonic tones (muted by default).

### 2. Dedicated Registration (`/register`)
- Clean, focused form with real-time validation:
  - **Full Name** (Student name with minimum length validation)
  - **Mobile Number** (10-digit Indian phone validation with `+91` prefix)
  - **Class** (Pre-filled as Class 10 / Class X)
  - **Division** (Interactive segmented cards for Div A, Div B, Div C, Div D, Div E)
  - **Dietary Preference** (Pure Vegetarian Buffet / Jain Option)
  - **Optional Dance Floor Song Request & Cherished Memory**
- **Digital VIP Admission Pass:**
  - Unique Pass ID format: `SSDS-X-2026-XXXX`
  - Scannable verification QR Code
  - One-click Print/Download with dedicated `@media print` stylesheet for official boarding pass formatting
  - Option to register another student
  - Persistent `localStorage` synchronization

### 3. Dynamic Admin Panel (`/admin`)
- **Security Gate:** Protected by organizer login.
  - **Email:** `admin@ssds.edu`
  - **Password:** `farewell2026`
- **Analytics Metrics:**
  - Total confirmed registrations
  - Division-wise enrollment counters (Div A through E)
  - Dietary breakdown
  - Live venue status monitor
- **Live Venue Broadcast Updater:**
  - Toggle between **"Tentative (To Be Announced Soon)"** and **"Confirmed Destination"**
  - Update location area, venue name, address, and announcement notes live across the entire site without code changes
- **Data Management Table:**
  - Search by Student Name, Mobile Number, or Registration ID
  - Filter by Division (All, Div A, Div B, Div C, Div D, Div E)
  - Sort by Date, Student Name, or Division
  - Add manual walk-in or offline student entries
  - Edit verified student records
  - Delete records with confirmation modal
  - View and re-print student passes
  - **One-Click Export to CSV / Excel** with complete registration records

---

## Tech Stack & Architecture

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Custom CSS Variables, Glassmorphism
- **Icons:** Lucide React (Thin-stroke SVGs)
- **State Management:** Reactive local state with robust `localStorage` synchronization
- **Print Engine:** Custom `@media print` layout optimized for physical admissions

---

## Local Development & Build

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Compile production build
npm run build
```

---

© 2026 Sinhagad Spring Dale School, Ambegaon. All Rights Reserved.
