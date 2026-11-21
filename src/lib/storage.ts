import { StudentRegistration, VenueConfig, Division, PaymentStatus } from '../types';

const STORAGE_KEY_REGISTRATIONS = 'ssds_farewell_registrations_v3';
const STORAGE_KEY_VENUE = 'ssds_farewell_venue_config_v3';
const STORAGE_KEY_AUTH = 'ssds_farewell_admin_auth_v1';

// Pre-seeded students from Sinhagad Spring Dale School Ambegaon (Div A through Div G)
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
    paymentStatus: 'Received',
    passIssued: true,
    passIssuedAt: '2026-02-14T10:30:00Z',
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
    paymentStatus: 'Received',
    passIssued: true,
    passIssuedAt: '2026-02-14T12:00:00Z',
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
    paymentStatus: 'Pending',
    passIssued: false,
  },
  {
    id: 'SSDS-X-2026-1044',
    fullName: 'Isha Nitin Joshi',
    mobile: '9890124567',
    className: 'Class 10',
    division: 'Div D',
    songRequest: 'Night Changes - One Direction',
    favoriteMemory: 'Science exhibition working models and teacher encouragement',
    registeredAt: '2026-02-15T14:20:00Z',
    status: 'Confirmed',
    paymentStatus: 'Received',
    passIssued: true,
    passIssuedAt: '2026-02-15T15:00:00Z',
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
    paymentStatus: 'Pending',
    passIssued: false,
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
    paymentStatus: 'Received',
    passIssued: true,
    passIssuedAt: '2026-02-17T09:30:00Z',
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
    paymentStatus: 'Pending',
    passIssued: false,
  },
  {
    id: 'SSDS-X-2026-1048',
    fullName: 'Mrunal Prashant Gaikwad',
    mobile: '9881456722',
    className: 'Class 10',
    division: 'Div A',
    songRequest: "Don't You Worry Child",
    favoriteMemory: 'Singing in the school choir on Republic Day mornings',
    registeredAt: '2026-02-18T10:00:00Z',
    status: 'Confirmed',
    paymentStatus: 'Received',
    passIssued: true,
    passIssuedAt: '2026-02-18T10:45:00Z',
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
    paymentStatus: 'Pending',
    passIssued: false,
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
    paymentStatus: 'Received',
    passIssued: true,
    passIssuedAt: '2026-02-19T10:15:00Z',
  },
  {
    id: 'SSDS-X-2026-1051',
    fullName: 'Atharva Suhas Kadam',
    mobile: '9764551234',
    className: 'Class 10',
    division: 'Div F',
    songRequest: 'Hall of Fame',
    favoriteMemory: "The day our entire class decorated the room for Teachers' Day",
    registeredAt: '2026-02-19T13:40:00Z',
    status: 'Confirmed',
    paymentStatus: 'Pending',
    passIssued: false,
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
    paymentStatus: 'Received',
    passIssued: true,
    passIssuedAt: '2026-02-20T11:45:00Z',
  },
];

export const DEFAULT_VENUE_CONFIG: VenueConfig = {
  isTentative: true,
  statusBadge: 'VENUE: TENTATIVE (TO BE ANNOUNCED SOON)',
  title: 'Open-Air Lawn Destination & Banquet Grounds',
  announcementDate: 'Official Venue Announcement: Coming Soon',
  locationArea: 'Ambegaon / Katraj-Dehu Road Corridor, South Pune',
  tentativeDescription:
    'The Class of 2026 Organizing Committee is finalizing a premier open-air lawn destination in South Pune / Ambegaon. The selected location will feature a dedicated disco dance floor, professional acoustic sound rigging, secure perimeter event security, and a royal banquet lawn.',
  confirmedName: 'The Royal Grand Heritage Lawns & Banquet',
  confirmedAddress: 'Survey No. 44, Ambegaon BK, Near Sinhagad Technical Campus, Pune 411046',
  confirmedLandmark: 'Opposite Sinhagad Sports Complex',
  confirmedGpsUrl: 'https://maps.google.com',
  dressCodeNote: 'Black Tie Formal, Tuxedos, Blazers, Evening Gowns or Traditional Festive Sarees / Bandhgala',
  lastUpdated: new Date().toISOString(),
};

// Synchronous Local Storage Accessors
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
    // safe fallback
  }
}

export function getRegistrations(): StudentRegistration[] {
  return getLocalRegistrations();
}

// Save New Registration from Student Portal
export function saveRegistration(
  student: Omit<StudentRegistration, 'id' | 'registeredAt' | 'status' | 'paymentStatus' | 'passIssued'>
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
    paymentStatus: 'Pending', // Payment is pending until committee verifies
    passIssued: false, // QR pass is given by admin after payment
  };

  const updated = [newStudent, ...current];
  saveLocalRegistrations(updated);
  return newStudent;
}

// Update Existing Registration
export function updateRegistration(id: string, updates: Partial<StudentRegistration>): StudentRegistration {
  const current = getLocalRegistrations();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error('Student record not found.');
  }

  const updatedStudent = { ...current[index], ...updates };
  current[index] = updatedStudent;
  saveLocalRegistrations(current);
  return updatedStudent;
}

// Toggle Payment Status ('Pending' <-> 'Received')
export function togglePaymentStatus(id: string): StudentRegistration {
  const current = getLocalRegistrations();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error('Student record not found.');
  }

  const student = current[index];
  const newPaymentStatus: PaymentStatus = student.paymentStatus === 'Received' ? 'Pending' : 'Received';
  const updatedStudent: StudentRegistration = {
    ...student,
    paymentStatus: newPaymentStatus,
    // If payment is marked as pending again, un-issue pass
    passIssued: newPaymentStatus === 'Received' ? student.passIssued : false,
  };

  current[index] = updatedStudent;
  saveLocalRegistrations(current);
  return updatedStudent;
}

// Mark Pass Issued (when Admin gives/views the QR Pass)
export function issueStudentPass(id: string): StudentRegistration {
  const current = getLocalRegistrations();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error('Student record not found.');
  }

  const student = current[index];
  if (student.paymentStatus !== 'Received') {
    throw new Error('Payment must be verified as received before issuing VIP Entry Pass.');
  }

  const updatedStudent: StudentRegistration = {
    ...student,
    passIssued: true,
    passIssuedAt: new Date().toISOString(),
  };

  current[index] = updatedStudent;
  saveLocalRegistrations(current);
  return updatedStudent;
}

// Delete Registration
export function deleteRegistration(id: string): void {
  const current = getLocalRegistrations();
  const filtered = current.filter((r) => r.id !== id);
  saveLocalRegistrations(filtered);
}

// Venue Storage
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

export function updateVenueConfig(updates: Partial<VenueConfig>): VenueConfig {
  const current = getVenueConfig();
  const updated: VenueConfig = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY_VENUE, JSON.stringify(updated));
  return updated;
}

// Backward-compatible safe promises
export async function fetchRegistrationsFromSupabase(): Promise<StudentRegistration[]> {
  return getLocalRegistrations();
}

export async function fetchVenueFromSupabase(): Promise<VenueConfig> {
  return getVenueConfig();
}

// Admin Authentication
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

// Export registrations to CSV with Payment & Pass tracking
export function exportRegistrationsToCSV(registrations: StudentRegistration[]): void {
  const headers = [
    'Registration ID',
    'Full Name',
    'Class',
    'Division',
    'Mobile Number',
    'Payment Status',
    'VIP Pass Issued',
    'Song Request',
    'Favorite Memory',
    'Registration Date (IST)',
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
    escapeCSV(r.paymentStatus),
    escapeCSV(r.passIssued ? 'Issued' : 'Unissued'),
    escapeCSV(r.songRequest || 'None'),
    escapeCSV(r.favoriteMemory || 'None'),
    escapeCSV(new Date(r.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SSDS_Class10_Farewell_Official_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
