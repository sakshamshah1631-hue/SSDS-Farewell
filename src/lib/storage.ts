import { StudentRegistration, VenueConfig, Division } from '../types';
import { supabase } from './supabase';

const STORAGE_KEY_REGISTRATIONS = 'ssds_farewell_registrations_v2';
const STORAGE_KEY_VENUE = 'ssds_farewell_venue_config_v2';
const STORAGE_KEY_AUTH = 'ssds_farewell_admin_auth_v1';

// Seed sample students from Sinhagad Spring Dale School Ambegaon (Div A through Div G)
export const INITIAL_REGISTRATIONS: StudentRegistration[] = [
  {
    id: 'SSDS-X-2026-1041',
    fullName: 'Aarav Sachin Deshmukh',
    mobile: '9822014589',
    className: 'Class 10',
    division: 'Div A',
    songRequest: 'Sky Full of Stars',
    favoriteMemory: 'Winning the annual sports football tournament for Div A in 9th grade',
    registeredAt: '2026-02-14T10:15:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1042',
    fullName: 'Ananya Rahul Kulkarni',
    mobile: '9765412380',
    className: 'Class 10',
    division: 'Div B',
    songRequest: 'Ilahi - Yeh Jawaani Hai Deewani',
    favoriteMemory: 'Annual Gathering dance rehearsals till 7 PM in the school auditorium',
    registeredAt: '2026-02-14T11:30:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1043',
    fullName: 'Rohan Vikram Patil',
    mobile: '9423587123',
    className: 'Class 10',
    division: 'Div C',
    songRequest: 'Memories - Maroon 5',
    favoriteMemory: 'Sharing lunch boxes on the second-floor corridor with the entire gang',
    registeredAt: '2026-02-15T09:40:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1044',
    fullName: 'Isha Nitin Joshi',
    mobile: '9890124567',
    className: 'Class 10',
    division: 'Div D',
    songRequest: 'Night Changes - One Direction',
    favoriteMemory: 'Science exhibition working models and Mrs. Kulkarni teacher encouragement',
    registeredAt: '2026-02-15T14:20:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1045',
    fullName: 'Siddharth Mahesh Shinde',
    mobile: '9923415678',
    className: 'Class 10',
    division: 'Div E',
    songRequest: 'Subha Hone Na De',
    favoriteMemory: 'Playing cricket on the Ambegaon school ground during zero period',
    registeredAt: '2026-02-16T16:10:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1046',
    fullName: 'Tanvi Prakash More',
    mobile: '9860334411',
    className: 'Class 10',
    division: 'Div F',
    songRequest: 'Counting Stars',
    favoriteMemory: 'Debate competitions representing SSDS at the inter-school level',
    registeredAt: '2026-02-17T08:55:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1047',
    fullName: 'Aditya Ravindra Jagtap',
    mobile: '9730221199',
    className: 'Class 10',
    division: 'Div G',
    songRequest: 'Viva La Vida',
    favoriteMemory: 'Maths doubt sessions with friends before the preliminary board exams',
    registeredAt: '2026-02-17T12:05:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1048',
    fullName: 'Mrunal Prashant Gaikwad',
    mobile: '9881456722',
    className: 'Class 10',
    division: 'Div A',
    songRequest: 'Don\'t You Worry Child',
    favoriteMemory: 'Singing in the school choir on Republic Day mornings',
    registeredAt: '2026-02-18T10:00:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1049',
    fullName: 'Pranav Amit Sawant',
    mobile: '9403215566',
    className: 'Class 10',
    division: 'Div B',
    songRequest: 'Wake Me Up - Avicii',
    favoriteMemory: 'Library study marathons with sir during free periods',
    registeredAt: '2026-02-18T15:45:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1050',
    fullName: 'Sayali Devendra Bhosale',
    mobile: '9823114477',
    className: 'Class 10',
    division: 'Div C',
    songRequest: 'Tera Yaar Hoon Main',
    favoriteMemory: 'Every single rainy day bus ride to Ambegaon campus with friends',
    registeredAt: '2026-02-19T09:25:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1051',
    fullName: 'Atharva Suhas Kadam',
    mobile: '9764551234',
    className: 'Class 10',
    division: 'Div F',
    songRequest: 'Hall of Fame',
    favoriteMemory: 'The day our entire class decorated the room for Teachers\' Day',
    registeredAt: '2026-02-19T13:40:00Z',
    status: 'Confirmed',
  },
  {
    id: 'SSDS-X-2026-1052',
    fullName: 'Gauri Sanjay Phadke',
    mobile: '9850998811',
    className: 'Class 10',
    division: 'Div G',
    songRequest: 'Starboy',
    favoriteMemory: 'Sitting on the amphitheater stairs discussing our future dreams',
    registeredAt: '2026-02-20T11:10:00Z',
    status: 'Confirmed',
  },
];

export const DEFAULT_VENUE_CONFIG: VenueConfig = {
  isTentative: true,
  statusBadge: 'VENUE: TENTATIVE (TO BE ANNOUNCED SOON)',
  title: 'Open-Air Lawn Destination & Banquet Grounds',
  announcementDate: 'Official Venue Announcement: Coming Soon',
  locationArea: 'Ambegaon / Katraj-Dehu Road Corridor, South Pune',
  tentativeDescription:
    'The Class of 2026 Organizing Committee is finalizing a premier open-air lawn destination in South Pune / Ambegaon. The selected location will feature a dedicated disco dance floor, professional acoustic sound rigging, secure perimeter event security, and a royal banquet lawn. GPS directions and parking gate passes will be broadcast via SMS to all registered students prior to the gala.',
  confirmedName: 'The Royal Grand Heritage Lawns & Banquet',
  confirmedAddress: 'Survey No. 44, Ambegaon BK, Near Sinhagad Technical Campus, Pune 411046',
  confirmedLandmark: 'Opposite Sinhagad Sports Complex',
  confirmedGpsUrl: 'https://maps.google.com',
  dressCodeNote: 'Black Tie Formal, Tuxedos, Blazers, Evening Gowns or Traditional Festive Sarees / Bandhgala',
  lastUpdated: new Date().toISOString(),
};

// Database Row Mapping
interface DbRegistrationRow {
  id: string;
  full_name: string;
  mobile: string;
  class_name: string;
  division: Division;
  song_request?: string | null;
  favorite_memory?: string | null;
  registered_at: string;
  status: 'Confirmed' | 'Pending';
}

function mapRowToStudent(row: DbRegistrationRow): StudentRegistration {
  return {
    id: row.id,
    fullName: row.full_name,
    mobile: row.mobile,
    className: row.class_name || 'Class 10',
    division: row.division,
    songRequest: row.song_request || undefined,
    favoriteMemory: row.favorite_memory || undefined,
    registeredAt: row.registered_at,
    status: row.status || 'Confirmed',
  };
}

function mapStudentToRow(student: StudentRegistration): DbRegistrationRow {
  return {
    id: student.id,
    full_name: student.fullName,
    mobile: student.mobile,
    class_name: student.className,
    division: student.division,
    song_request: student.songRequest || null,
    favorite_memory: student.favoriteMemory || null,
    registered_at: student.registeredAt,
    status: student.status,
  };
}

// Synchronous local storage reader
export function getLocalRegistrations(): StudentRegistration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REGISTRATIONS;
  } catch {
    return INITIAL_REGISTRATIONS;
  }
}

export function saveLocalRegistrations(list: StudentRegistration[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(list));
  } catch {
    // ignore
  }
}

// Asynchronously Fetch from Supabase (with automatic local sync fallback)
export async function fetchRegistrationsFromSupabase(): Promise<StudentRegistration[]> {
  try {
    const { data, error } = await supabase
      .from('farewell_registrations')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, using local database cache:', error.message);
      return getLocalRegistrations();
    }

    if (data && data.length > 0) {
      const mapped = data.map(mapRowToStudent);
      saveLocalRegistrations(mapped);
      return mapped;
    }

    // If Supabase table is empty, seed it with the initial students
    const local = getLocalRegistrations();
    syncLocalToSupabase(local).catch(() => {});
    return local;
  } catch (err) {
    console.warn('Network or Supabase exception, using local database cache:', err);
    return getLocalRegistrations();
  }
}

// Sync all local records up to Supabase
export async function syncLocalToSupabase(list: StudentRegistration[]): Promise<void> {
  try {
    const rows = list.map(mapStudentToRow);
    const { error } = await supabase
      .from('farewell_registrations')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase bulk upsert notice:', error.message);
    }
  } catch {
    // non-fatal
  }
}

// Standard synchronous getter for immediate rendering
export function getRegistrations(): StudentRegistration[] {
  return getLocalRegistrations();
}

// Unified Save Registration (writes to Supabase & local cache)
export async function saveRegistrationAsync(
  student: Omit<StudentRegistration, 'id' | 'registeredAt' | 'status'>
): Promise<StudentRegistration> {
  const current = getLocalRegistrations();
  const cleanMobile = student.mobile.replace(/\D/g, '');

  const existing = current.find((r) => r.mobile.replace(/\D/g, '') === cleanMobile);
  if (existing) {
    throw new Error(`A registration with mobile +91 ${cleanMobile} is already registered under ID ${existing.id}.`);
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newStudent: StudentRegistration = {
    ...student,
    mobile: cleanMobile,
    id: `SSDS-X-2026-${randomNum}`,
    registeredAt: new Date().toISOString(),
    status: 'Confirmed',
  };

  // 1. Immediately cache locally
  const updated = [newStudent, ...current];
  saveLocalRegistrations(updated);

  // 2. Save directly to Supabase cloud
  try {
    const row = mapStudentToRow(newStudent);
    const { error } = await supabase.from('farewell_registrations').insert([row]);
    if (error) {
      console.warn('Supabase cloud insert notice (stored locally):', error.message);
    }
  } catch (cloudErr) {
    console.warn('Supabase cloud unreachable (stored locally):', cloudErr);
  }

  return newStudent;
}

// Synchronous wrapper used by forms
export function saveRegistration(
  student: Omit<StudentRegistration, 'id' | 'registeredAt' | 'status'>
): StudentRegistration {
  const current = getLocalRegistrations();
  const cleanMobile = student.mobile.replace(/\D/g, '');

  const existing = current.find((r) => r.mobile.replace(/\D/g, '') === cleanMobile);
  if (existing) {
    throw new Error(`A registration with mobile +91 ${cleanMobile} is already registered under ID ${existing.id}.`);
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newStudent: StudentRegistration = {
    ...student,
    mobile: cleanMobile,
    id: `SSDS-X-2026-${randomNum}`,
    registeredAt: new Date().toISOString(),
    status: 'Confirmed',
  };

  const updated = [newStudent, ...current];
  saveLocalRegistrations(updated);

  // Background cloud sync
  saveRegistrationAsync(student).catch(() => {});

  return newStudent;
}

// Update student record (local + Supabase)
export function updateRegistration(id: string, updates: Partial<StudentRegistration>): StudentRegistration {
  const current = getLocalRegistrations();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error('Student record not found.');
  }

  const updatedStudent = { ...current[index], ...updates };
  current[index] = updatedStudent;
  saveLocalRegistrations(current);

  // Background cloud sync
  supabase
    .from('farewell_registrations')
    .update({
      full_name: updatedStudent.fullName,
      mobile: updatedStudent.mobile,
      division: updatedStudent.division,
      song_request: updatedStudent.songRequest || null,
      favorite_memory: updatedStudent.favoriteMemory || null,
    })
    .eq('id', id)
    .then(({ error }) => {
      if (error) console.warn('Supabase update notice:', error.message);
    })
    .catch(() => {});

  return updatedStudent;
}

// Delete student record (local + Supabase)
export function deleteRegistration(id: string): void {
  const current = getLocalRegistrations();
  const filtered = current.filter((r) => r.id !== id);
  saveLocalRegistrations(filtered);

  // Background cloud delete
  supabase
    .from('farewell_registrations')
    .delete()
    .eq('id', id)
    .then(({ error }) => {
      if (error) console.warn('Supabase delete notice:', error.message);
    })
    .catch(() => {});
}

// Venue Storage (local + Supabase)
export function getVenueConfig(): VenueConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VENUE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_VENUE, JSON.stringify(DEFAULT_VENUE_CONFIG));
      return DEFAULT_VENUE_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_VENUE_CONFIG;
  }
}

export async function fetchVenueFromSupabase(): Promise<VenueConfig> {
  try {
    const { data, error } = await supabase
      .from('farewell_venue')
      .select('*')
      .eq('id', 'current_venue')
      .single();

    if (error || !data) {
      return getVenueConfig();
    }

    const config: VenueConfig = {
      isTentative: data.is_tentative,
      statusBadge: data.status_badge || (data.is_tentative ? 'VENUE: TENTATIVE (TO BE ANNOUNCED SOON)' : 'VENUE: OFFICIAL DESTINATION CONFIRMED'),
      title: data.title || DEFAULT_VENUE_CONFIG.title,
      announcementDate: DEFAULT_VENUE_CONFIG.announcementDate,
      locationArea: data.location_area || DEFAULT_VENUE_CONFIG.locationArea,
      tentativeDescription: data.tentative_description || DEFAULT_VENUE_CONFIG.tentativeDescription,
      confirmedName: data.confirmed_name || DEFAULT_VENUE_CONFIG.confirmedName,
      confirmedAddress: data.confirmed_address || DEFAULT_VENUE_CONFIG.confirmedAddress,
      confirmedLandmark: data.confirmed_landmark || DEFAULT_VENUE_CONFIG.confirmedLandmark,
      confirmedGpsUrl: data.confirmed_gps_url || DEFAULT_VENUE_CONFIG.confirmedGpsUrl,
      dressCodeNote: data.dress_code_note || DEFAULT_VENUE_CONFIG.dressCodeNote,
      lastUpdated: data.updated_at || new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY_VENUE, JSON.stringify(config));
    return config;
  } catch {
    return getVenueConfig();
  }
}

export function updateVenueConfig(updates: Partial<VenueConfig>): VenueConfig {
  const current = getVenueConfig();
  const updated: VenueConfig = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY_VENUE, JSON.stringify(updated));

  // Sync to Supabase
  supabase
    .from('farewell_venue')
    .upsert({
      id: 'current_venue',
      is_tentative: updated.isTentative,
      status_badge: updated.statusBadge,
      title: updated.title,
      location_area: updated.locationArea,
      tentative_description: updated.tentativeDescription,
      confirmed_name: updated.confirmedName || null,
      confirmed_address: updated.confirmedAddress || null,
      confirmed_landmark: updated.confirmedLandmark || null,
      confirmed_gps_url: updated.confirmedGpsUrl || null,
      dress_code_note: updated.dressCodeNote,
      updated_at: new Date().toISOString(),
    })
    .then(({ error }) => {
      if (error) console.warn('Supabase venue update notice:', error.message);
    })
    .catch(() => {});

  return updated;
}

// Admin Authentication Helper
export function checkAdminAuth(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'authenticated';
  } catch {
    return false;
  }
}

export function loginAdmin(password: string, email: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();
  if (
    (cleanEmail === 'admin@ssds.edu' && cleanPass === 'farewell2026') ||
    (cleanEmail === 'admin' && cleanPass === 'farewell2026') ||
    cleanPass === 'ssds2026'
  ) {
    localStorage.setItem(STORAGE_KEY_AUTH, 'authenticated');
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(STORAGE_KEY_AUTH);
}

// Export registrations to CSV
export function exportRegistrationsToCSV(registrations: StudentRegistration[]): void {
  const headers = [
    'Registration ID',
    'Full Name',
    'Class',
    'Division',
    'Mobile Number',
    'Song Request',
    'Favorite Memory',
    'Registration Date (IST)',
    'Status',
  ];

  const escapeCSV = (str: string | undefined) => {
    if (!str) return '""';
    const escaped = String(str).replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const rows = registrations.map((r) => [
    escapeCSV(r.id),
    escapeCSV(r.fullName),
    escapeCSV(r.className),
    escapeCSV(r.division),
    escapeCSV(`+91 ${r.mobile}`),
    escapeCSV(r.songRequest || 'None'),
    escapeCSV(r.favoriteMemory || 'None'),
    escapeCSV(new Date(r.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })),
    escapeCSV(r.status),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SSDS_Class10_Farewell_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
