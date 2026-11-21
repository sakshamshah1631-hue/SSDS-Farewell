import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { StudentRegistration, VenueConfig } from '../types';
import { generateTicketSvg } from '../lib/ticketImage';
import {
  X,
  Printer,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Music,
  Download,
  Share2,
  Check,
  Sparkles,
  QrCode,
  BadgeCheck,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface PassModalProps {
  student: StudentRegistration | null;
  venueConfig: VenueConfig;
  onClose: () => void;
  onPassIssued?: (studentId: string) => void;
}

export const PassModal: React.FC<PassModalProps> = ({
  student,
  venueConfig,
  onClose,
  onPassIssued,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [ticketImageUrl, setTicketImageUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [isDownloadingTicket, setIsDownloadingTicket] = useState<boolean>(false);
  const ticketCardRef = useRef<HTMLDivElement>(null);

  // Generate QR Code that redirects directly to the student's Ticket Image
  useEffect(() => {
    if (!student) return;

    if (onPassIssued) {
      onPassIssued(student.id);
    }

    setIsGenerating(true);

    // 1. Direct Web Link to view the ticket image online
    // Works both on localhost and production (Render/Vercel) automatically
    const baseUrl = window.location.origin;
    const ticketDirectUrl = `${baseUrl}/?ticket=${encodeURIComponent(student.id)}`;
    setTicketImageUrl(ticketDirectUrl);

    // 2. Generate clean, highly-scannable QR matrix encoding the direct image/ticket URL
    // Standard phone camera scanning a URL pops up "Open Link" and immediately renders the full ticket image!
    QRCode.toDataURL(ticketDirectUrl, {
      width: 480,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('Failed to generate real QR code:', err);
        setIsGenerating(false);
      });
  }, [student, venueConfig, onPassIssued]);

  if (!student) return null;

  // Direct Ticket Image Download via SVG/Canvas
  const downloadTicketAsFile = () => {
    const svgStr = generateTicketSvg(student, venueConfig);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = student.fullName.replace(/\s+/g, '_');
    link.href = url;
    link.download = `SSDS_VIP_Ticket_${safeName}_${student.division}_${student.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsDownloadingTicket(false);
  };

  // Direct Ticket Download (Primary Handler using html2canvas with SVG/Canvas Fallback)
  const handleDirectDownloadTicket = async () => {
    setIsDownloadingTicket(true);

    try {
      if (ticketCardRef.current) {
        const canvas = await html2canvas(ticketCardRef.current, {
          scale: 2.5,
          useCORS: true,
          backgroundColor: '#070b14',
          logging: false,
          allowTaint: true,
        });

        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        const safeName = student.fullName.replace(/\s+/g, '_');
        link.download = `SSDS_VIP_Ticket_${safeName}_${student.division}_${student.id}.png`;
        link.href = image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDownloadingTicket(false);
      } else {
        downloadTicketAsFile();
      }
    } catch (err) {
      console.warn('html2canvas notice, using direct ticket renderer:', err);
      downloadTicketAsFile();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenTicketImageInNewTab = () => {
    if (ticketImageUrl) {
      window.open(ticketImageUrl, '_blank');
    }
  };

  const handleCopyDetails = () => {
    const venueName = venueConfig.isTentative
      ? 'Open-Air Lawn Destination (Ambegaon / South Pune)'
      : (venueConfig.confirmedName || 'SSDS Ambegaon Lawns');

    const text = [
      `SINHAGAD SPRING DALE SCHOOL, AMBEGAON`,
      `CLASS OF 2026 FAREWELL GALA — VIP ADMISSION PASS`,
      `----------------------------------------`,
      `Pass ID: ${student.id}`,
      `Student Name: ${student.fullName}`,
      `Class & Division: ${student.className} — ${student.division}`,
      `Registered Mobile: +91 ${student.mobile}`,
      `Payment Status: VERIFIED & RECEIVED`,
      `Gate Clearance: AUTHORIZED VIP ENTRY`,
      `Ticket Image Link: ${ticketImageUrl}`,
      `Date & Time: Saturday, 28 February 2026 • 05:30 PM Onwards`,
      `Venue: ${venueName}`,
      `----------------------------------------`,
      `Present this pass image at the reception concierge desk.`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 sm:-top-12 right-0 p-2 text-slate-400 hover:text-white transition-colors no-print flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
          aria-label="Close Pass Modal"
        >
          <span>Close</span>
          <X className="w-5 h-5" />
        </button>

        {/* PRIMARY ADMIN CALL-TO-ACTION: DIRECT DOWNLOAD TICKET BANNER */}
        <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-blue-500/20 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-left no-print shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                VIP Ticket Image Ready for {student.fullName}
              </span>
              <span className="text-[11px] text-slate-300">
                Scanning the QR code now directly opens this student&apos;s ticket image on their phone.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDirectDownloadTicket}
              disabled={isDownloadingTicket}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 shrink-0 border border-amber-300"
            >
              {isDownloadingTicket ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Generating Image...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Direct Download Ticket</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PRINTABLE / CAPTURABLE TICKET CARD */}
        <div
          ref={ticketCardRef}
          className="print-pass-card rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border-2 border-amber-400/40 shadow-2xl relative bg-[#070b14]"
        >
          {/* Decorative Ticket Notches */}
          <div className="ticket-notch-left hidden sm:block" />
          <div className="ticket-notch-right hidden sm:block" />

          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-midnight-950 via-slate-900 to-midnight-950 p-4 sm:p-6 border-b border-amber-400/30 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400/80 bg-amber-400/20 flex items-center justify-center text-amber-300 font-bold font-cinzel text-xs sm:text-sm shrink-0 shadow-lg shadow-amber-950/50">
                  SSDS
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Sinhagad Spring Dale School, Ambegaon</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white font-editorial-serif tracking-tight">
                    Class of 2026 Farewell Gala Pass
                  </h3>
                </div>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between pt-1 sm:pt-0 border-t border-slate-800 sm:border-0">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block">
                  Official Pass ID
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-cyan-300 bg-cyan-950/90 px-2.5 py-1 rounded-lg border border-cyan-400/50 inline-block shadow-inner">
                  {student.id}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            
            {/* Student & Event Credentials */}
            <div className="md:col-span-2 space-y-3.5">
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                  Authorized Student
                </span>
                <span className="text-xl sm:text-2xl font-bold text-white font-editorial-serif break-words">
                  {student.fullName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <div className="p-2.5 rounded-xl bg-midnight-950/90 border border-slate-800">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Class & Division
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5 block">
                    {student.className} — {student.division}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-midnight-950/90 border border-slate-800">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Verified Contact
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 font-mono mt-0.5 block">
                    +91 {student.mobile}
                  </span>
                </div>
              </div>

              {/* Payment & Security Verification Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block font-semibold">
                      Payment Received & Verified
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Official VIP Admission Authorized by Committee
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shrink-0 font-bold">
                  PAID
                </span>
              </div>

              {student.songRequest && (
                <div className="pt-0.5">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Dance Floor Song Request
                  </span>
                  <span className="text-xs italic text-slate-300 flex items-center gap-1.5 mt-0.5 break-words">
                    <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {student.songRequest}
                  </span>
                </div>
              )}

              {/* Event Timing & Venue */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:flex-wrap gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Saturday, 28 Feb 2026</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>05:30 PM Onwards</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    {venueConfig.isTentative
                      ? 'Lawn Destination (Ambegaon, South Pune)'
                      : (venueConfig.confirmedName || 'SSDS Ambegaon Lawns')}
                  </span>
                </div>
              </div>
            </div>

            {/* REAL SCANNABLE QR CODE LINKED DIRECTLY TO TICKET IMAGE */}
            <div className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-midnight-950 border border-slate-800 text-center">
              
              {/* White Quiet-Zone Container for Instant Optical Camera Detection */}
              <div className="p-3 rounded-2xl bg-white mb-2 shadow-2xl border-2 border-slate-300 flex items-center justify-center">
                {isGenerating ? (
                  <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center text-slate-400">
                    <QrCode className="w-8 h-8 animate-spin text-slate-800" />
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Scannable QR Pass for ${student.fullName}`}
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain block select-none cursor-pointer"
                    onClick={handleOpenTicketImageInNewTab}
                    title="Click to open direct ticket image"
                  />
                ) : (
                  <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center text-xs text-slate-600">
                    Generating QR...
                  </div>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-300 tracking-wider uppercase block font-semibold">
                Scan to Open Ticket Image
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Opens ticket image on any phone
              </span>
            </div>

          </div>

          {/* Pass Footer Note */}
          <div className="bg-midnight-950 p-3 sm:p-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-slate-500 gap-1 text-center sm:text-left">
            <span className="font-mono">
              NON-TRANSFERABLE • PRESENT DIGITAL PASS IMAGE AT RECEPTION DESK
            </span>
            <span className="text-amber-300 font-mono font-medium">
              SSDS AMBEGAON 2026
            </span>
          </div>

        </div>

        {/* Modal Bottom Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 no-print">
          
          {/* Secondary Options */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenTicketImageInNewTab}
              className="px-3 py-2 rounded-xl glass-panel text-cyan-300 hover:text-white border border-slate-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all"
              title="Open ticket image in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preview Image</span>
            </button>

            <button
              onClick={handleCopyDetails}
              className="px-3 py-2 rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-amber-400/25 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Copy Link & Text</span>
                </>
              )}
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-slate-700"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDirectDownloadTicket}
              disabled={isDownloadingTicket}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/60 hover:brightness-110 active:scale-[0.98] transition-all border border-amber-300"
            >
              {isDownloadingTicket ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Direct Download Ticket</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
