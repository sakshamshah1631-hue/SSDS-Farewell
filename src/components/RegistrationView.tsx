import React, { useState, useMemo } from 'react';
import { ActiveView, Division, StudentRegistration, VenueConfig } from '../types';
import { saveRegistration, getRegistrations } from '../lib/storage';
import { validateRealIndianMobile, MobileValidationResult } from '../lib/validation';
import {
  Ticket,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  GraduationCap,
  Sparkles,
  Music,
  MapPin,
  Calendar,
  Clock,
  RotateCcw,
  Share2,
  Check,
  ShieldAlert,
  Info,
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
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const availableDivisions: Division[] = ['Div A', 'Div B', 'Div C', 'Div D', 'Div E', 'Div F', 'Div G'];

  // Real-time Mobile Number Validation & Operator Detection
  const mobileValidation = useMemo<MobileValidationResult | null>(() => {
    const clean = mobile.replace(/\D/g, '');
    if (clean.length === 10) {
      return validateRealIndianMobile(clean);
    }
    return null;
  }, [mobile]);

  // Validation
  const validateForm = () => {
    const newErrors: { fullName?: string; mobile?: string } = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter student full name (minimum 3 characters).';
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    const validationCheck = validateRealIndianMobile(cleanMobile);

    if (!validationCheck.isValid) {
      newErrors.mobile = validationCheck.error || 'Please enter a genuine, active 10-digit Indian mobile number.';
    } else {
      // Check for duplicate registered mobile
      const existingStudents = getRegistrations();
      const duplicate = existingStudents.find((s) => s.mobile.replace(/\D/g, '') === cleanMobile);
      if (duplicate) {
        newErrors.mobile = `This mobile number is already registered under ID ${duplicate.id} (${duplicate.fullName}).`;
      }
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

  const handleCopyReceipt = () => {
    if (!confirmedStudent) return;
    const text = [
      `SSDS CLASS 10 FAREWELL 2026 — REGISTRATION RECEIPT`,
      `Reference ID: ${confirmedStudent.id}`,
      `Student Name: ${confirmedStudent.fullName}`,
      `Class & Division: ${confirmedStudent.className} — ${confirmedStudent.division}`,
      `Mobile: +91 ${confirmedStudent.mobile}`,
      `Status: Registration Logged (Pending Payment Verification)`,
      `Note: Provide this Reference ID to your Class In-Charge to receive your official scannable VIP QR Pass.`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 3000);
    });
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-8 no-print">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Overview</span>
        </button>

        <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-500">
          SSDS • FAREWELL 2026 REGISTRATION
        </span>
      </div>

      {/* CONFIRMATION STATE: Registration Acknowledgement Receipt (NO QR CODE in User View) */}
      {confirmedStudent ? (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          
          {/* Success Status Banner */}
          <div className="glass-panel-gold rounded-2xl p-4 sm:p-5 border border-amber-400/30 flex items-start sm:items-center gap-3.5 text-left no-print">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300 mt-0.5 sm:mt-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-cinzel">
                Registration Application Received
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed">
                Thank you, <strong className="text-white">{confirmedStudent.fullName}</strong>. Your entry has been recorded in the Class of 2026 registry.
              </p>
            </div>
          </div>

          {/* Luxury Official Receipt Card */}
          <div className="relative mx-auto max-w-2xl">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 shadow-2xl relative bg-[#070b14]/95">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-midnight-950 via-slate-900 to-midnight-950 p-5 sm:p-7 border-b border-cyan-500/20 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-400/60 bg-amber-400/15 flex items-center justify-center text-amber-300 font-bold font-cinzel text-xs sm:text-sm shrink-0 shadow-lg shadow-amber-950/40">
                      SSDS
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Sinhagad Spring Dale School, Ambegaon</span>
                      </div>
                      <h2 className="text-base sm:text-2xl font-bold text-white font-editorial-serif tracking-tight">
                        Farewell 2026 Registration Receipt
                      </h2>
                    </div>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between pt-2 sm:pt-0 border-t border-slate-800 sm:border-0">
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                      Reference ID
                    </span>
                    <span className="text-xs sm:text-base font-bold font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 inline-block shadow-inner">
                      {confirmedStudent.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt Content */}
              <div className="p-5 sm:p-7 space-y-5">
                
                {/* Student Record Grid */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block mb-1">
                    Registered Student
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-white font-editorial-serif block">
                    {confirmedStudent.fullName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-midnight-950/70 border border-slate-800">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                      Class & Division
                    </span>
                    <span className="text-sm font-bold text-cyan-300 mt-0.5 block">
                      {confirmedStudent.className} — {confirmedStudent.division}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-midnight-950/70 border border-slate-800">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                      Registered Contact
                    </span>
                    <span className="text-sm font-semibold text-slate-200 font-mono mt-0.5 block">
                      +91 {confirmedStudent.mobile}
                    </span>
                  </div>
                </div>

                {confirmedStudent.songRequest && (
                  <div className="p-3 rounded-xl bg-midnight-950/70 border border-slate-800 text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block mb-1">
                      Dance Floor Song Choice
                    </span>
                    <span className="italic text-slate-200 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {confirmedStudent.songRequest}
                    </span>
                  </div>
                )}

                {/* Important Notice Box on VIP Pass & QR Issuance */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-300">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Next Step: Payment Verification & Pass Issuance</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your registration has been logged in the committee database with payment status <strong className="text-amber-300 font-mono">PENDING</strong>.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    In accordance with organizing protocols, your <strong>Official Scannable VIP Entry Pass & QR Code</strong> will be issued directly by your <strong>Class Division In-Charge / Admin</strong> once event contribution payment is verified.
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Keep your Reference ID ({confirmedStudent.id}) handy when completing payment.</span>
                  </div>
                </div>

                {/* Event Schedule Footer Note */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs text-slate-400">
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
                    <span>
                      {venueConfig.isTentative
                        ? 'Lawn Destination (South Pune / Ambegaon)'
                        : venueConfig.confirmedName}
                    </span>
                  </div>
                </div>

              </div>

              {/* Receipt Footer */}
              <div className="bg-midnight-950 p-3 sm:p-4 border-t border-slate-800 flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
                <span className="font-mono">
                  APPLICATION FILED • PENDING ADMIN PASS RELEASE
                </span>
                <span className="text-amber-300 font-medium font-cinzel">
                  SSDS AMBEGAON 2026
                </span>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 no-print">
            <button
              onClick={handleCopyReceipt}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/40 text-xs font-semibold tracking-wider uppercase hover:bg-amber-400/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {copiedReceipt ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Copy Reference Details</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetForAnother}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-cyan-400/40"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Register Another Classmate</span>
            </button>

            <button
              onClick={() => setActiveView('home')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <span>Back to Home</span>
            </button>
          </div>

        </div>
      ) : (
        /* REGISTRATION FORM */
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-cyan-500/20 shadow-2xl relative">
          
          {/* Header */}
          <div className="mb-5 sm:mb-8 border-b border-slate-800 pb-4 sm:pb-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
              <Ticket className="w-3.5 h-3.5" />
              <span>Official Student Enrollment</span>
            </div>
            <h1 className="font-editorial-serif text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Class 10 Farewell Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 sm:mt-2 leading-relaxed">
              Reserve your spot for the Sinhagad Spring Dale School Class of 2026 Farewell Gala. Please provide authentic student details as registered in school records.
            </p>
          </div>

          {/* Error Banner */}
          {submitError && (
            <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  placeholder="e.g. Aarav Sachin Deshmukh"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-midnight-900 border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.fullName ? 'border-red-500/80 focus:border-red-400' : 'border-slate-800 focus:border-cyan-400'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* 2. Mobile Number (Strict Real Indian Mobile Check) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Mobile Number <span className="text-cyan-400">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">10 digits • Starts with 6-9</span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono text-sm font-semibold border-r border-slate-800 pr-2.5">
                  <span className="text-cyan-400 mr-1">+91</span>
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                </div>

                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setMobile(val);
                    if (errors.mobile) setErrors({ ...errors, mobile: undefined });
                  }}
                  placeholder="9822012345"
                  className={`w-full pl-[78px] pr-4 py-3 rounded-xl bg-midnight-900 border text-sm text-white font-mono placeholder-slate-600 focus:outline-none transition-colors ${
                    errors.mobile ? 'border-red-500/80 focus:border-red-400' : 'border-slate-800 focus:border-cyan-400'
                  }`}
                />
              </div>

              {/* Real-time Validation Feedback */}
              {mobileValidation && (
                <div className="mt-1.5">
                  {mobileValidation.isValid ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Valid Indian Mobile Number ({mobileValidation.operatorHint})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{mobileValidation.error}</span>
                    </div>
                  )}
                </div>
              )}

              {errors.mobile && !mobileValidation && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.mobile}</span>
                </p>
              )}
            </div>

            {/* 3. Class & Division Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Class (Pre-filled as Class 10) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Academic Standard
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value={className}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-midnight-950 border border-slate-800 text-sm text-cyan-300 font-semibold cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* Division (Div A to Div G) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Division (Div) <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value as Division)}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  {availableDivisions.map((div) => (
                    <option key={div} value={div} className="bg-midnight-950 text-white">
                      {div} (Class X)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Optional Song Request */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Dance Floor Song Request <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Music className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={songRequest}
                  onChange={(e) => setSongRequest(e.target.value)}
                  placeholder="e.g. Memories - Maroon 5, Ilahi, Sky Full of Stars"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* 5. Optional Favorite School Memory */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Cherished School Memory <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={favoriteMemory}
                onChange={(e) => setFavoriteMemory(e.target.value)}
                placeholder="Share a sentence about your favorite school day, teacher, or memory at SSDS Ambegaon..."
                className="w-full px-4 py-3 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-size-200 text-white shadow-xl shadow-cyan-950/60 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-cyan-400/40 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Student...</span>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>Submit Student Registration</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
