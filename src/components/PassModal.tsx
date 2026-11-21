import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { StudentRegistration, VenueConfig } from '../types';
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
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  // Generate Real Scannable QR Code with all individual student details
  useEffect(() => {
    if (!student) return;

    // Notify parent that pass is viewed / issued
    if (onPassIssued) {
      onPassIssued(student.id);
    }

    setIsGenerating(true);

    const venueName = venueConfig.isTentative
      ? 'Open-Air Lawn Destination (Ambegaon / South Pune)'
      : (venueConfig.confirmedName || 'SSDS Ambegaon Lawns');

    // Human & Scanner readable verification payload
    const qrPayload = [
      'SSDS AMBEGAON • CLASS 10 FAREWELL 2026',
      'OFFICIAL VIP ADMISSION PASS',
      '========================================',
      `PASS ID: ${student.id}`,
      `STUDENT NAME: ${student.fullName}`,
      `CLASS: Class 10 (2025-26)`,
      `DIVISION: ${student.division}`,
      `REGISTERED MOBILE: +91 ${student.mobile}`,
      `PAYMENT STATUS: VERIFIED & RECEIVED`,
      `PASS STATUS: AUTHORIZED VIP ENTRY`,
      `EVENT: Class 10 Farewell Evening Gala`,
      `DATE: Saturday, 28 February 2026 • 05:30 PM`,
      `VENUE: ${venueName}`,
      `INSTITUTION: Sinhagad Spring Dale School, Ambegaon`,
      `SECURITY TOKEN: SSDS-AUTH-2026-X-${student.division.replace(/\s+/g, '')}`,
      '========================================',
      'Valid for 1 Student VIP Admission with Dinner & Gala Entry',
    ].join('\n');

    QRCode.toDataURL(qrPayload, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H', // High error correction level for reliable optical scan
      color: {
        dark: '#030712',
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `SSDS_VIP_QR_${student.fullName.replace(/\s+/g, '_')}_${student.division}_${student.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyDetails = () => {
    const venueName = venueConfig.isTentative
      ? 'Open-Air Lawn Destination (Ambegaon / South Pune)'
      : (venueConfig.confirmedName || 'SSDS Ambegaon Lawns');

    const text = [
      `SINHAGAD SPRING DALE SCHOOL, AMBEGAON`,
      `CLASS OF 2026 FAREWELL GALA — VIP ENTRY PASS`,
      `----------------------------------------`,
      `Pass ID: ${student.id}`,
      `Student Name: ${student.fullName}`,
      `Class & Division: ${student.className} — ${student.division}`,
      `Registered Mobile: +91 ${student.mobile}`,
      `Payment Status: VERIFIED & RECEIVED`,
      `Date & Time: Saturday, 28 February 2026 • 05:30 PM Onwards`,
      `Venue: ${venueName}`,
      `Dress Code: Formal Evening / Black Tie / Traditional`,
      `----------------------------------------`,
      `Note: Present this official Pass ID or Scannable QR at the entrance registration desk.`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
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

        {/* Printable Ticket Card (Optimized for Mobile, Desktop and Print) */}
        <div className="print-pass-card rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-cyan-400/40 shadow-2xl relative bg-[#070b14]/95">
          
          {/* Decorative Ticket Notches */}
          <div className="ticket-notch-left hidden sm:block" />
          <div className="ticket-notch-right hidden sm:block" />

          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-midnight-950 via-slate-900 to-midnight-950 p-4 sm:p-6 border-b border-cyan-500/20 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-400/60 bg-amber-400/15 flex items-center justify-center text-amber-300 font-bold font-cinzel text-xs sm:text-sm shrink-0 shadow-lg shadow-amber-950/40">
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
                <span className="text-xs sm:text-sm font-bold font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 inline-block shadow-inner">
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
                <span className="text-lg sm:text-2xl font-bold text-white font-editorial-serif break-words">
                  {student.fullName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <div className="p-2.5 rounded-xl bg-midnight-950/70 border border-slate-800">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Class & Division
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5 block">
                    {student.className} — {student.division}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-midnight-950/70 border border-slate-800">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Verified Contact
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 font-mono mt-0.5 block">
                    +91 {student.mobile}
                  </span>
                </div>
              </div>

              {/* Payment & Security Verification Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block font-semibold">
                      Payment Received & Verified
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Admission contribution verified by Committee
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
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

            {/* REAL SCANNABLE QR CODE SECTION */}
            <div className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-midnight-950 border border-slate-800 text-center">
              
              <div className="p-2 sm:p-2.5 rounded-xl bg-white mb-2 shadow-xl border-2 border-slate-200">
                {isGenerating ? (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-slate-400">
                    <QrCode className="w-8 h-8 animate-spin text-slate-800" />
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Scannable QR Pass for ${student.fullName}`}
                    className="w-32 h-32 sm:w-36 sm:h-36 object-contain block"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-xs text-slate-600">
                    Generating QR...
                  </div>
                )}
              </div>

              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider uppercase block">
                Official Scannable Gate QR
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Scan via any smartphone camera
              </span>
            </div>

          </div>

          {/* Pass Footer Note */}
          <div className="bg-midnight-950 p-3 sm:p-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-slate-500 gap-1 text-center sm:text-left">
            <span className="font-mono">
              NON-TRANSFERABLE • PRESENT DIGITAL OR PRINTED TICKET AT RECEPTION
            </span>
            <span className="text-amber-300 font-mono font-medium">
              SSDS AMBEGAON 2026
            </span>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 sm:gap-3 pt-4 no-print">
          
          {/* Download QR Image */}
          <button
            onClick={handleDownloadQR}
            disabled={!qrDataUrl}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl glass-panel text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download QR</span>
          </button>

          {/* Copy Share Details */}
          <button
            onClick={handleCopyDetails}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-amber-400/25 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Copy Pass Info</span>
              </>
            )}
          </button>

          {/* Print VIP Ticket */}
          <button
            onClick={handlePrint}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all border border-cyan-400/40"
          >
            <Printer className="w-4 h-4" />
            <span>Print VIP Ticket</span>
          </button>

        </div>

      </div>
    </div>
  );
};
