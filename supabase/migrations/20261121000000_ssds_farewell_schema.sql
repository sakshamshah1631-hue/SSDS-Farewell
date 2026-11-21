-- ====================================================================
-- Sinhagad Spring Dale School (Ambegaon) Class 10 Farewell 2026
-- Supabase Schema Migration: Registrations & Dynamic Venue Controller
-- ====================================================================

-- 1. Create registrations table
CREATE TABLE IF NOT EXISTS public.farewell_registrations (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL UNIQUE,
    class_name TEXT NOT NULL DEFAULT 'Class 10',
    division TEXT NOT NULL CHECK (division IN ('Div A', 'Div B', 'Div C', 'Div D', 'Div E', 'Div F', 'Div G')),
    song_request TEXT,
    favorite_memory TEXT,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'Confirmed'
);

-- 2. Create venue table
CREATE TABLE IF NOT EXISTS public.farewell_venue (
    id TEXT PRIMARY KEY DEFAULT 'current_venue',
    is_tentative BOOLEAN NOT NULL DEFAULT true,
    status_badge TEXT NOT NULL DEFAULT 'VENUE: TENTATIVE (TO BE ANNOUNCED SOON)',
    title TEXT NOT NULL DEFAULT 'Open-Air Lawn Destination & Banquet Grounds',
    location_area TEXT NOT NULL DEFAULT 'Ambegaon / Katraj-Dehu Road Corridor, South Pune',
    tentative_description TEXT NOT NULL DEFAULT 'The Class of 2026 Organizing Committee is finalizing a premier open-air lawn destination in South Pune / Ambegaon. The selected location will feature a dedicated disco dance floor, professional acoustic sound rigging, secure perimeter event security, and a royal banquet lawn. GPS directions and parking gate passes will be broadcast via SMS to all registered students prior to the gala.',
    confirmed_name TEXT DEFAULT 'The Royal Grand Heritage Lawns & Banquet',
    confirmed_address TEXT DEFAULT 'Survey No. 44, Ambegaon BK, Near Sinhagad Technical Campus, Pune 411046',
    confirmed_landmark TEXT DEFAULT 'Opposite Sinhagad Sports Complex',
    confirmed_gps_url TEXT DEFAULT 'https://maps.google.com',
    dress_code_note TEXT DEFAULT 'Black Tie Formal, Tuxedos, Blazers, Evening Gowns or Traditional Festive Sarees / Bandhgala',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Insert default venue configuration if not present
INSERT INTO public.farewell_venue (id, is_tentative, title, location_area, tentative_description)
VALUES (
    'current_venue',
    true,
    'Open-Air Lawn Destination & Banquet Grounds',
    'Ambegaon / Katraj-Dehu Road Corridor, South Pune',
    'The Class of 2026 Organizing Committee is finalizing a premier open-air lawn destination in South Pune / Ambegaon. The selected location will feature a dedicated disco dance floor, professional acoustic sound rigging, secure perimeter event security, and a royal banquet lawn. GPS directions and parking gate passes will be broadcast via SMS to all registered students prior to the gala.'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.farewell_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farewell_venue ENABLE ROW LEVEL SECURITY;

-- 5. Public RLS Policies for Web Application
DROP POLICY IF EXISTS "Public select registrations" ON public.farewell_registrations;
CREATE POLICY "Public select registrations" ON public.farewell_registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert registrations" ON public.farewell_registrations;
CREATE POLICY "Public insert registrations" ON public.farewell_registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update registrations" ON public.farewell_registrations;
CREATE POLICY "Public update registrations" ON public.farewell_registrations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete registrations" ON public.farewell_registrations;
CREATE POLICY "Public delete registrations" ON public.farewell_registrations FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public select venue" ON public.farewell_venue;
CREATE POLICY "Public select venue" ON public.farewell_venue FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public update venue" ON public.farewell_venue;
CREATE POLICY "Public update venue" ON public.farewell_venue FOR ALL USING (true);

-- 6. Indexes for ultra-fast search & query performance
CREATE INDEX IF NOT EXISTS idx_farewell_registrations_division ON public.farewell_registrations (division);
CREATE INDEX IF NOT EXISTS idx_farewell_registrations_mobile ON public.farewell_registrations (mobile);
CREATE INDEX IF NOT EXISTS idx_farewell_registrations_created_at ON public.farewell_registrations (registered_at DESC);
