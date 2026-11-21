export type Division = 'Div A' | 'Div B' | 'Div C' | 'Div D' | 'Div E' | 'Div F' | 'Div G';

export interface StudentRegistration {
  id: string; // e.g., SSDS-X-2026-8492
  fullName: string;
  mobile: string;
  className: string; // 'Class 10'
  division: Division;
  songRequest?: string;
  favoriteMemory?: string;
  registeredAt: string; // ISO date string
  status: 'Confirmed' | 'Pending';
}

export interface VenueConfig {
  isTentative: boolean;
  statusBadge: string;
  title: string;
  announcementDate: string;
  locationArea: string;
  tentativeDescription: string;
  confirmedName?: string;
  confirmedAddress?: string;
  confirmedLandmark?: string;
  confirmedGpsUrl?: string;
  dressCodeNote: string;
  lastUpdated: string;
}

export interface ItineraryItem {
  time: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export interface AtmosphereItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  caption: string;
  tag: string;
}

export type ActiveView = 'home' | 'register' | 'admin';
