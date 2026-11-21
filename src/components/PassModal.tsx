import React from 'react';
import { StudentRegistration, VenueConfig } from '../types';
import {
  X,
  Printer,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Music,
} from 'lucide-react';

interface PassModalProps {
  student: StudentRegistration | null;
  venueConfig: VenueConfig;
  onClose: () => void;
}

export const PassModal: React.FC<PassModalProps> = ({
  student,
  venueConfig,
  onClose,
}) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 sm:-top-12 right-0 p-2 text-slate-400 hover:text-white transition-colors no-print"
          aria-label="Close Pass Modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Printable Pass Card */}
        <div className="print-pass-card rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-cyan-400/40 shadow-2xl relative">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-midnight-950 via-slate-900 to-midnight-950 p-5 sm:p-7 border-b border-cyan-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-amber-400/50 bg-amber-400/10 flex items-center justify-center text-amber-300 font-bold font-cinzel text-xs shrink-0">
                  SSDS
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-amber-400">
                    Sinhagad Spring Dale School, Ambegaon
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-editorial-serif">
                    Class of 2026 Farewell Gala Pass
                  </h3>
                </div>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between pt-1 sm:pt-0">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block">
                  Registration ID
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 inline-block">
                  {student.id}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-center">
            <div className="sm:col-span-2 space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                  Student Name
                </span>
                <span className="text-lg sm:text-xl font-bold text-white font-editorial-serif break-words">
                  {student.fullName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Class & Division
                  </span>
                  <span className="text-xs font-semibold text-cyan-300">
                    {student.className} — {student.division}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Mobile Number
                  </span>
                  <span className="text-xs font-semibold text-slate-200 font-mono">
                    +91 {student.mobile}
                  </span>
                </div>
              </div>

              {student.songRequest && (
                <div className="pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Song Request
                  </span>
                  <span className="text-xs italic text-slate-300 flex items-center gap-1.5 mt-0.5 break-words">
                    <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {student.songRequest}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Grand Evening</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>05:30 PM Onwards</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    {venueConfig.isTentative
                      ? 'Lawn Grounds (Tentative)'
                      : venueConfig.confirmedName}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Simulation */}
            <div className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-midnight-950 border border-slate-800 text-center">
              <div className="p-2 rounded-lg bg-white text-slate-950 mb-2">
                <svg className="w-20 h-20" viewBox="0 0 100 100" fill="#070b14">
                  <rect x="5" y="5" width="28" height="28" rx="4" />
                  <rect x="10" y="10" width="18" height="18" fill="#ffffff" />
                  <rect x="14" y="14" width="10" height="10" />

                  <rect x="67" y="5" width="28" height="28" rx="4" />
                  <rect x="72" y="10" width="18" height="18" fill="#ffffff" />
                  <rect x="76" y="14" width="10" height="10" />

                  <rect x="5" y="67" width="28" height="28" rx="4" />
                  <rect x="10" y="72" width="18" height="18" fill="#ffffff" />
                  <rect x="14" y="76" width="10" height="10" />

                  <rect x="42" y="42" width="16" height="16" rx="2" />
                  <rect x="38" y="15" width="8" height="8" />
                  <rect x="70" y="45" width="8" height="8" />
                  <rect x="45" y="70" width="8" height="8" />
                </svg>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Student Pass
              </span>
            </div>
          </div>

          {/* Pass Footer */}
          <div className="bg-midnight-950 p-3 sm:p-3.5 border-t border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
            <span>PRESENT AT ENTRANCE REGISTRATION DESK</span>
            <span className="text-amber-300 font-mono">SSDS 2026</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Pass</span>
          </button>
        </div>

      </div>
    </div>
  );
};
