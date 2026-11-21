import React, { useState } from 'react';
import { ActiveView, Division, StudentRegistration, VenueConfig } from '../types';
import { saveRegistration } from '../lib/storage';
import {
  Ticket,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Printer,
  User,
  Phone,
  GraduationCap,
  Sparkles,
  Music,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  RotateCcw,
  Heart,
} from 'lucide-react';

interface RegistrationViewProps {
  venueConfig: VenueConfig;
  setActiveView: (view: ActiveView) => void;
  onRegistrationSuccess: (student: StudentRegistration) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  venueConfig,
  setActiveView,
  onRegistrationSuccess,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [className] = useState('Class 10');
  const [division, setDivision] = useState<Division>('Div A');
  const [songRequest, setSongRequest] = useState('');
  const [favoriteMemory, setFavoriteMemory] = useState('');

  // UI State
  const [errors, setErrors] = useState<{ fullName?: string; mobile?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedStudent, setConfirmedStudent] = useState<StudentRegistration | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const availableDivisions: Division[] = ['Div A', 'Div B', 'Div C', 'Div D', 'Div E', 'Div F', 'Div G'];

  // Validation
  const validateForm = () => {
    const newErrors: { fullName?: string; mobile?: string } = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter student full name (minimum 3 characters).';
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number.';
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      newErrors.mobile = 'Mobile number must begin with 6, 7, 8, or 9.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const cleanMobile = mobile.replace(/\D/g, '');
      const created = saveRegistration({
        fullName: fullName.trim(),
        mobile: cleanMobile,
        className,
        division,
        songRequest: songRequest.trim() || undefined,
        favoriteMemory: favoriteMemory.trim() || undefined,
      });

      setConfirmedStudent(created);
      onRegistrationSuccess(created);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError('An unexpected error occurred during registration. Please retry.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetForAnother = () => {
    setConfirmedStudent(null);
    setFullName('');
    setMobile('');
    setDivision('Div A');
    setSongRequest('');
    setFavoriteMemory('');
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[85vh]">
      
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 no-print">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Overview</span>
        </button>

        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-500">
          SSDS / FAREWELL / REGISTRATION
        </span>
      </div>

      {/* CONFIRMATION STATE: Digital VIP Admission Pass */}
      {confirmedStudent ? (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          {/* Success Banner */}
          <div className="glass-panel-gold rounded-2xl p-4 sm:p-5 border border-amber-400/30 flex items-start sm:items-center gap-3.5 text-left no-print">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300 mt-0.5 sm:mt-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-cinzel">
                Registration Confirmed & Pass Issued
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed">
                Official registration for <strong className="text-white">{confirmedStudent.fullName}</strong> is recorded. Save or screenshot your official pass below for entry verification.
              </p>
            </div>
          </div>

          {/* Luxury Digital Pass Card (Printable & Mobile-Optimized) */}
          <div className="print-pass-card rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-cyan-400/40 shadow-2xl relative">
            
            {/* Top Ornamental Header */}
            <div className="bg-gradient-to-r from-midnight-950 via-slate-900 to-midnight-950 p-5 sm:p-8 border-b border-cyan-500/20 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-400/50 bg-amber-400/10 flex items-center justify-center text-amber-300 font-bold font-cinzel text-xs sm:text-sm shrink-0">
                    SSDS
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-amber-400">
                      Sinhagad Spring Dale School, Ambegaon
                    </div>
                    <h2 className="text-base sm:text-2xl font-bold text-white font-editorial-serif tracking-tight">
                      Class of 2026 Farewell Gala Pass
                    </h2>
                  </div>
                </div>

                <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between pt-2 sm:pt-0 border-t border-slate-800 sm:border-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                    Official Pass ID
                  </span>
                  <span className="text-xs sm:text-base font-bold font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30 inline-block">
                    {confirmedStudent.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Pass Body Content */}
            <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Student Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Student Name
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-white font-editorial-serif break-words">
                    {confirmedStudent.fullName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                      Class & Division
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-cyan-300">
                      {confirmedStudent.className} — {confirmedStudent.division}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                      Registered Mobile
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 font-mono">
                      +91 {confirmedStudent.mobile}
                    </span>
                  </div>
                </div>

                {confirmedStudent.songRequest && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                      Dance Floor Song Request
                    </span>
                    <span className="text-xs italic text-slate-300 flex items-center gap-1.5 mt-0.5 break-words">
                      <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {confirmedStudent.songRequest}
                    </span>
                  </div>
                )}

                {/* Event Schedule & Venue Note */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Grand Evening Gala</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>05:30 PM Onwards</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">
                      {venueConfig.isTentative
                        ? 'Lawn Destination (Tentative, South Pune)'
                        : venueConfig.confirmedName}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Verification & Security Seal */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-midnight-950/80 border border-slate-800 text-center">
                {/* SVG QR Code Simulation */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white text-slate-950 mb-2.5 shadow-md">
                  <svg
                    className="w-24 h-24 sm:w-28 sm:h-28"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="#070b14" />
                    <rect x="10" y="10" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="14" y="14" width="10" height="10" fill="#070b14" />

                    <rect x="67" y="5" width="28" height="28" rx="4" fill="#070b14" />
                    <rect x="72" y="10" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="76" y="14" width="10" height="10" fill="#070b14" />

                    <rect x="5" y="67" width="28" height="28" rx="4" fill="#070b14" />
                    <rect x="10" y="72" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="14" y="76" width="10" height="10" fill="#070b14" />

                    <rect x="38" y="10" width="8" height="8" fill="#070b14" />
                    <rect x="50" y="14" width="8" height="8" fill="#070b14" />
                    <rect x="38" y="26" width="8" height="8" fill="#070b14" />
                    <rect x="14" y="38" width="8" height="8" fill="#070b14" />
                    <rect x="26" y="46" width="8" height="8" fill="#070b14" />
                    <rect x="42" y="42" width="16" height="16" rx="2" fill="#070b14" />
                    <rect x="67" y="42" width="8" height="8" fill="#070b14" />
                    <rect x="80" y="46" width="8" height="8" fill="#070b14" />
                    <rect x="67" y="60" width="8" height="8" fill="#070b14" />
                    <rect x="42" y="68" width="8" height="8" fill="#070b14" />
                    <rect x="55" y="74" width="8" height="8" fill="#070b14" />
                    <rect x="72" y="72" width="8" height="8" fill="#070b14" />
                    <rect x="84" y="80" width="8" height="8" fill="#070b14" />
                  </svg>
                </div>

                <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider uppercase block">
                  Scan to Verify Entry
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3" />
                  Official Student Gate Pass
                </span>
              </div>

            </div>

            {/* Pass Barcode Footer */}
            <div className="bg-midnight-950 p-3 sm:p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-slate-500 gap-1.5 text-center sm:text-left">
              <span className="font-mono">
                NON-TRANSFERABLE • PRESENT AT REGISTRATION CONCIERGE DESK
              </span>
              <span className="text-[10px] sm:text-[11px] text-amber-300 font-medium">
                Sinhagad Spring Dale School, Ambegaon
              </span>
            </div>
          </div>

          {/* Action Buttons for Confirmed Pass */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 no-print">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Pass</span>
            </button>

            <button
              onClick={handleResetForAnother}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Register Another Student</span>
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-cyan-500/20 shadow-2xl relative">
          
          {/* Header */}
          <div className="mb-6 sm:mb-8 border-b border-slate-800 pb-5 sm:pb-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
              <Ticket className="w-3.5 h-3.5" />
              <span>Official Student Enrollment</span>
            </div>
            <h1 className="font-editorial-serif text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Class 10 Farewell Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Reserve your digital admission pass for the Sinhagad Spring Dale School Class of 2026 Farewell Gala. Please provide accurate details as printed on school records.
            </p>
          </div>

          {/* Error Banner */}
          {submitError && (
            <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                Student Full Name <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sachin Deshmukh"
                  className={`w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-midnight-900 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.fullName
                      ? 'border-red-500/60 focus:ring-red-500'
                      : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-400/40'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* 2. Mobile Number (10 digits with +91) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                Mobile Number (for SMS Gate Pass) <span className="text-cyan-400">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 sm:px-4 rounded-l-xl border border-r-0 border-slate-800 bg-midnight-950 text-slate-400 text-sm font-mono font-medium">
                  +91
                </span>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9822014589"
                    className={`w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-3.5 rounded-r-xl bg-midnight-900 border text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 transition-all ${
                      errors.mobile
                        ? 'border-red-500/60 focus:ring-red-500'
                        : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-400/40'
                    }`}
                  />
                </div>
              </div>
              {errors.mobile ? (
                <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.mobile}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  Entry QR verification and venue updates will be dispatched to this WhatsApp/SMS number.
                </p>
              )}
            </div>

            {/* 3. Class (Pre-filled as Class 10) & 4. Division Selection (Div A to Div G) */}
            <div className="grid grid-cols-1 gap-5 sm:gap-6">
              
              {/* Class field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                  Standard / Class
                </label>
                <div className="flex items-center gap-2 p-3 sm:p-3.5 rounded-xl bg-midnight-950 border border-slate-800 text-slate-300 text-sm font-medium">
                  <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Class 10 (Class X)</span>
                  <span className="ml-auto text-[10px] uppercase font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 shrink-0">
                    Batch 2026
                  </span>
                </div>
              </div>

              {/* Division Segmented Selector: Div A through Div G */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                  Division (Section) <span className="text-cyan-400">*</span>
                </label>
                {/* Responsive grid for 7 divisions: 4 cols on mobile, 7 cols on larger screens */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDivisions.map((div) => (
                    <button
                      key={div}
                      type="button"
                      onClick={() => setDivision(div)}
                      className={`py-3 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                        division === div
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-900/40'
                          : 'bg-midnight-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {div.replace('Div ', '')}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-500 block mt-1.5">
                  Selected Division: <strong className="text-cyan-300">{division}</strong>
                </span>
              </div>

            </div>

            {/* Optional: Song Request for Open Lawn Disco */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                Lawn Disco Song Request (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Music className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={songRequest}
                  onChange={(e) => setSongRequest(e.target.value)}
                  placeholder="e.g. A Sky Full of Stars / Ilahi / Memories"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
                />
              </div>
            </div>

            {/* Optional: Favorite SSDS Ambegaon Memory */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                Cherished SSDS Memory (For Yearbook Commemorative Reel)
              </label>
              <textarea
                rows={2}
                value={favoriteMemory}
                onChange={(e) => setFavoriteMemory(e.target.value)}
                placeholder="Share a favorite moment, sports victory, teacher quote, or corridor memory..."
                className="w-full px-4 py-3 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 sm:pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 text-white shadow-xl shadow-cyan-900/40 hover:shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 border border-cyan-400/40 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Official Pass...</span>
                ) : (
                  <>
                    <Ticket className="w-4 h-4 text-cyan-200" />
                    <span>Confirm Registration & Generate Digital Pass</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-slate-500 pt-1 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Authorized portal for Sinhagad Spring Dale School, Ambegaon (Class of 2026).
              </span>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
