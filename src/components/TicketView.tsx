import React, { useEffect, useState } from 'react';
import { StudentRegistration, VenueConfig } from '../types';
import { getRegistrations, getVenueConfig } from '../lib/storage';
import { generateTicketSvg } from '../lib/ticketImage';
import {
  Download,
  ArrowLeft,
  CheckCircle2,
  Printer,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Music,
} from 'lucide-react';

interface TicketViewProps {
  passId: string;
  onBackToHome: () => void;
}

export const TicketView: React.FC<TicketViewProps> = ({ passId, onBackToHome }) => {
  const [student, setStudent] = useState<StudentRegistration | null>(null);
  const [venueConfig, setVenueConfig] = useState<VenueConfig>(() => getVenueConfig());
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const list = getRegistrations();
    const found = list.find((s) => s.id.toLowerCase() === passId.toLowerCase());
    if (found) {
      setStudent(found);
    } else {
      setNotFound(true);
    }
    setVenueConfig(getVenueConfig());
  }, [passId]);

  const handleDownload = () => {
    if (!student) return;
    const svgStr = generateTicketSvg(student, venueConfig);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SSDS_VIP_Ticket_${student.fullName.replace(/\s+/g, '_')}_${student.division}_${student.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (notFound) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-md w-full text-center border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 font-mono text-lg">
            !
          </div>
          <h2 className="text-xl font-bold font-editorial-serif text-white">Ticket Not Found</h2>
          <p className="text-xs text-slate-400">
            No active VIP admission ticket was found for Pass ID <strong className="text-cyan-300 font-mono">{passId}</strong>.
          </p>
          <button
            onClick={onBackToHome}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-white uppercase tracking-wider hover:bg-slate-700 transition-colors"
          >
            Go to SSDS Farewell Portal
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center text-slate-400 text-sm">
        Loading VIP Ticket Image...
      </div>
    );
  }

  const svgContent = generateTicketSvg(student, venueConfig);
  const venueName = venueConfig.isTentative
    ? 'Open-Air Lawn Destination (Ambegaon / South Pune)'
    : (venueConfig.confirmedName || 'SSDS Ambegaon Lawns');

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 max-w-4xl mx-auto space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>SSDS Farewell Home</span>
        </button>

        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-slate-500">
          OFFICIAL VERIFIED VIP TICKET
        </span>
      </div>

      {/* Verified Banner */}
      <div className="glass-panel-gold rounded-2xl p-4 sm:p-5 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-cinzel">
              Authentic Admission Pass Verified
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-300">
              Valid for <strong className="text-white">{student.fullName}</strong> ({student.className} — {student.division}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center justify-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Save Ticket Image</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* FULL TICKET IMAGE RENDER */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-amber-400/30 bg-[#040711] p-1 sm:p-2">
        <div
          className="w-full aspect-[1000/560] max-w-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Student Details Info Panel */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4 no-print">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Student Identity Verification</span>
          <span className="text-xs font-mono font-bold text-cyan-400">{student.id}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Student</span>
            <span className="text-white font-semibold">{student.fullName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Division</span>
            <span className="text-cyan-300 font-semibold">{student.className} — {student.division}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Payment</span>
            <span className="text-emerald-400 font-semibold uppercase">Verified & Paid</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Gate Status</span>
            <span className="text-emerald-400 font-semibold">Authorized Entry</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Saturday, 28 February 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>05:30 PM Onwards</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{venueName}</span>
          </div>
          {student.songRequest && (
            <div className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              <span>Requested: "{student.songRequest}"</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
