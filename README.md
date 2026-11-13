# Sahyadri Glow — Artisanal Candle E-Commerce Platform

A production-ready, handcrafted artisanal candle e-commerce platform built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

---

## 🌟 Features Overview

- **Storefront Catalog:** Handcrafted soy candle collections, categories ('Single', 'Blend', 'Combo Pack'), aromatic notes, burn time, weight, and bestseller badges.
- **Combo Pack System:** Admin builder to bundle multiple candles with custom quantities, automatic Combine MRP calculation, customizable Sale Value / Offer pricing, and instant savings indicators.
- **Authentication:** Custom Username & Password registration and login system with client-side credential persistence and role-based access.
- **Admin Panel:**
  - Complete Product Management (Add, Edit, Delete, Stock update, Image upload).
  - Combo Pack Creator with itemized breakdowns.
  - Order History & Management dashboard with real-time customer and payment details.
- **Payment & Checkout:**
  - UPI Payment Method only (Credit Card removed for zero transaction fee Indian customer flow).
  - Direct 1-Tap Mobile UPI App Redirection (`upi://pay?pa=harshalimehta4014@oksbi&...`) supporting Google Pay, PhonePe, Paytm, and BHIM.
  - Desktop QR Code scanner (`public/qr.jpeg`) with 1-click UPI ID copying.
  - 12-digit UPI UTR / Transaction ID verification before placing order.
  - Direct WhatsApp order notification sent to business phone `+91 82751 65651` with itemized order details.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React Icons, Canvas Confetti.
- **Backend / Database:** Supabase (PostgreSQL with Row Level Security, RPC functions, and migrations).
- **Styling:** Custom CSS variables + Tailwind utility classes.

---

## 🚀 Quick Start for Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (or use `.env.example`):
```env
VITE_SUPABASE_URL=https://fwhtgramhslwnqsbwtji.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3aHRncmFtaHNsd25xc2J3dGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNTMxOTQsImV4cCI6MjEwODgyOTE5NH0.XcO8z5Q4GNYlSO5RaZEI-IGdD0wYZVpCuawSzojJYI4
```

### 3. Run Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
The compiled production bundle is generated in the `dist/` directory.

---

## 🌐 Hosting & Deployment Instructions

### Option 1: Vercel (Recommended)
1. Push or upload this project repository to GitHub / GitLab.
2. Import project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL`: `https://fwhtgramhslwnqsbwtji.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<anon_key_from_.env>`
7. Deploy!

### Option 2: Netlify
1. Connect repository or run `netlify deploy --prod --dir=dist`.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add single-page application redirect rule (already configured or add `/* /index.html 200` in `_redirects`).

### Option 3: Render / Cloudflare Pages
- **Build command:** `npm run build`
- **Output folder:** `dist`
- Set environment variables as listed above.

---

## 📁 Project Structure

```
├── public/                 # Static assets (images, qr.jpeg, favicon, icons)
├── src/
│   ├── App.tsx             # Main Application, routing, storefront, admin & checkout logic
│   ├── index.css           # Global typography, color schemes, and component styles
│   ├── main.tsx            # Application entry point
│   └── lib/
│       └── supabase.ts     # Supabase client initialization & types
├── supabase/
│   └── migrations/         # PostgreSQL schema & security hardening scripts
├── index.html              # HTML root with SEO tags and fonts
├── package.json            # Project dependencies & npm scripts
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```
