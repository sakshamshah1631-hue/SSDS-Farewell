import { createClient } from '@supabase/supabase-js';

// Safe fallbacks to prevent fatal startup crash if environment variables are not set in hosting dashboard
const defaultUrl = 'https://fwhtgramhslwnqsbwtji.supabase.co';
const defaultAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3aHRncmFtaHNsd25xc2J3dGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNTMxOTQsImV4cCI6MjEwODgyOTE5NH0.XcO8z5Q4GNYlSO5RaZEI-IGdD0wYZVpCuawSzojJYI4';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
