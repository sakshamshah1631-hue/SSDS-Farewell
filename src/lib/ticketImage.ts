import { StudentRegistration, VenueConfig } from '../types';

/**
 * Generates a standalone high-resolution SVG of the personalized luxury VIP Farewell Ticket.
 * This SVG can be converted into a base64 Data URL (image/svg+xml) or rendered onto an HTML5 canvas.
 * When a smartphone camera scans a data:image/svg+xml or when viewed in a browser, it renders as a pure image.
 */
export function generateTicketSvg(student: StudentRegistration, venueConfig: VenueConfig): string {
  const venueName = venueConfig.isTentative
    ? 'Open-Air Lawn Destination (Ambegaon / South Pune)'
    : (venueConfig.confirmedName || 'SSDS Ambegaon Lawns');

  const escapeXml = (unsafe: string) =>
    unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const safeName = escapeXml(student.fullName);
  const safeDiv = escapeXml(student.division);
  const safeClass = escapeXml(student.className);
  const safeId = escapeXml(student.id);
  const safeMobile = escapeXml(student.mobile);
  const safeVenue = escapeXml(venueName);
  const safeSong = student.songRequest ? escapeXml(student.songRequest) : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 560" width="1000" height="560">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#040711" />
        <stop offset="50%" stop-color="#091326" />
        <stop offset="100%" stop-color="#03060d" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#d97706" />
        <stop offset="50%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.8" />
      </filter>
    </defs>

    <rect width="1000" height="560" fill="url(#bgGrad)" />

    <!-- Outer Gold Border -->
    <rect x="20" y="20" width="960" height="520" rx="24" fill="none" stroke="url(#goldGrad)" stroke-width="2" />
    <rect x="28" y="28" width="944" height="504" rx="18" fill="none" stroke="#1e293b" stroke-width="1" />

    <!-- Top Header Banner -->
    <path d="M 28 46 Q 28 28 46 28 L 954 28 Q 972 28 972 46 L 972 120 L 28 120 Z" fill="#0b1329" />
    <line x1="28" y1="120" x2="972" y2="120" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.5" />

    <!-- School Crest -->
    <circle cx="82" cy="74" r="32" fill="#78350f" fill-opacity="0.3" stroke="#f59e0b" stroke-width="2" />
    <text x="82" y="81" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#fef08a" text-anchor="middle">SSDS</text>

    <!-- School & Event Titles -->
    <text x="135" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" fill="#fbbf24" letter-spacing="2">SINHAGAD SPRING DALE SCHOOL, AMBEGAON</text>
    <text x="135" y="96" font-family="Georgia, serif" font-size="26" font-weight="bold" fill="#ffffff">Class of 2026 Farewell Gala Pass</text>

    <!-- Pass ID Badge on Right -->
    <rect x="740" y="48" width="205" height="52" rx="10" fill="#082f49" stroke="#0ea5e9" stroke-width="1.5" />
    <text x="842" y="66" font-family="monospace" font-size="10" font-weight="bold" fill="#94a3b8" text-anchor="middle" letter-spacing="1">OFFICIAL PASS ID</text>
    <text x="842" y="89" font-family="monospace" font-size="16" font-weight="bold" fill="#38bdf8" text-anchor="middle">${safeId}</text>

    <!-- Student Name -->
    <text x="60" y="175" font-family="monospace" font-size="11" font-weight="bold" fill="#64748b" letter-spacing="1">AUTHORIZED STUDENT NAME</text>
    <text x="60" y="215" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#ffffff">${safeName}</text>

    <!-- Info Pill 1: Class & Division -->
    <rect x="60" y="245" width="290" height="70" rx="12" fill="#0b1222" stroke="#1e293b" />
    <text x="80" y="272" font-family="monospace" font-size="10" fill="#94a3b8" letter-spacing="1">CLASS &amp; DIVISION</text>
    <text x="80" y="299" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="bold" fill="#38bdf8">${safeClass} — ${safeDiv}</text>

    <!-- Info Pill 2: Contact -->
    <rect x="370" y="245" width="290" height="70" rx="12" fill="#0b1222" stroke="#1e293b" />
    <text x="390" y="272" font-family="monospace" font-size="10" fill="#94a3b8" letter-spacing="1">VERIFIED CONTACT</text>
    <text x="390" y="299" font-family="monospace" font-size="17" font-weight="bold" fill="#f1f5f9">+91 ${safeMobile}</text>

    <!-- Payment Verification Banner -->
    <rect x="60" y="335" width="600" height="55" rx="12" fill="#064e3b" fill-opacity="0.4" stroke="#059669" stroke-width="1.5" />
    <circle cx="95" cy="362" r="14" fill="#059669" />
    <path d="M 89 362 L 93 366 L 102 357" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    <text x="122" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold" fill="#34d399">PAYMENT VERIFIED &amp; OFFICIAL ADMISSION AUTHORIZED</text>
    <text x="122" y="377" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#a7f3d0">Official VIP Admission Pass Issued by Organizing Committee</text>
    <rect x="585" y="347" width="60" height="30" rx="6" fill="#059669" />
    <text x="615" y="367" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">PAID</text>

    <!-- Venue & Date Details -->
    <text x="60" y="425" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold" fill="#e2e8f0">Event: Saturday, 28 February 2026 • 05:30 PM Onwards</text>
    <text x="60" y="450" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">Destination: ${safeVenue}</text>
    ${safeSong ? `<text x="60" y="475" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-style="italic" fill="#38bdf8">Requested Song: &quot;${safeSong}&quot;</text>` : ''}

    <!-- Official Badge / QR Seal Box on Right -->
    <rect x="710" y="170" width="235" height="290" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
    <rect x="725" y="185" width="205" height="205" rx="10" fill="#040711" />
    
    <!-- Stylized Digital Pass Gate Icon Matrix inside -->
    <g transform="translate(735, 195) scale(1.85)">
      <rect x="5" y="5" width="30" height="30" rx="5" fill="#f8fafc" />
      <rect x="10" y="10" width="20" height="20" fill="#040711" />
      <rect x="14" y="14" width="12" height="12" fill="#f8fafc" />

      <rect x="65" y="5" width="30" height="30" rx="5" fill="#f8fafc" />
      <rect x="70" y="10" width="20" height="20" fill="#040711" />
      <rect x="74" y="14" width="12" height="12" fill="#f8fafc" />

      <rect x="5" y="65" width="30" height="30" rx="5" fill="#f8fafc" />
      <rect x="10" y="70" width="20" height="20" fill="#040711" />
      <rect x="14" y="74" width="12" height="12" fill="#f8fafc" />

      <rect x="42" y="10" width="16" height="16" fill="#f8fafc" />
      <rect x="42" y="42" width="16" height="16" fill="#f8fafc" />
      <rect x="10" y="42" width="16" height="16" fill="#f8fafc" />
      <rect x="74" y="42" width="16" height="16" fill="#f8fafc" />
      <rect x="42" y="74" width="16" height="16" fill="#f8fafc" />
      <rect x="68" y="68" width="24" height="24" fill="#38bdf8" rx="4" />
    </g>

    <text x="827" y="418" font-family="monospace" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle" letter-spacing="1">PASS KEY VERIFIED</text>
    <text x="827" y="438" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#059669" text-anchor="middle">AUTHORIZED VIP GATE PASS</text>
    <text x="827" y="452" font-family="monospace" font-size="9" fill="#64748b" text-anchor="middle">${safeId}</text>

    <!-- Ticket Footer Bar -->
    <line x1="28" y1="510" x2="972" y2="510" stroke="#1e293b" stroke-width="1" />
    <text x="50" y="530" font-family="monospace" font-size="9" fill="#475569" letter-spacing="1">NON-TRANSFERABLE • PRESENT DIGITAL TICKET IMAGE AT RECEPTION DESK</text>
    <text x="950" y="530" font-family="monospace" font-size="10" font-weight="bold" fill="#f59e0b" text-anchor="end">SSDS AMBEGAON 2026</text>
  </svg>`;
}

/**
 * Returns a data URL of the standalone ticket SVG image.
 */
export function getTicketImageDataUrl(student: StudentRegistration, venueConfig: VenueConfig): string {
  const svg = generateTicketSvg(student, venueConfig);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
