import React, { useState, useMemo } from 'react';
import { ActiveView, Division, StudentRegistration, VenueConfig, PaymentStatus } from '../types';
import {
  getRegistrations,
  saveRegistration,
  updateRegistration,
  deleteRegistration,
  togglePaymentStatus,
  issueStudentPass,
  updateVenueConfig,
  exportRegistrationsToCSV,
  loginAdmin,
  logoutAdmin,
  checkAdminAuth,
} from '../lib/storage';
import {
  Lock,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  ArrowLeft,
  LogOut,
  Layers,
  QrCode,
  Clock,
  Sparkles,
  CreditCard,
  Check,
} from 'lucide-react';

interface AdminViewProps {
  venueConfig: VenueConfig;
  onVenueConfigUpdated: (config: VenueConfig) => void;
  setActiveView: (view: ActiveView) => void;
  onSelectStudentForPass: (student: StudentRegistration) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  venueConfig,
  onVenueConfigUpdated,
  setActiveView,
  onSelectStudentForPass,
}) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkAdminAuth());
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Registrations Data
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(() => getRegistrations());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'division'>('date');

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRegistration | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<StudentRegistration | null>(null);
  const [paymentPromptStudent, setPaymentPromptStudent] = useState<StudentRegistration | null>(null);

  // Form states for Add/Edit
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formDivision, setFormDivision] = useState<Division>('Div A');
  const [formPaymentStatus, setFormPaymentStatus] = useState<PaymentStatus>('Pending');
  const [formSong, setFormSong] = useState('');
  const [formMemory, setFormMemory] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Live Venue Editor State
  const [isVenueEditorOpen, setIsVenueEditorOpen] = useState(false);
  const [venueTentativeToggle, setVenueTentativeToggle] = useState(venueConfig.isTentative);
  const [venueTitle, setVenueTitle] = useState(venueConfig.title);
  const [venueArea, setVenueArea] = useState(venueConfig.locationArea);
  const [venueConfirmedName, setVenueConfirmedName] = useState(venueConfig.confirmedName || '');
  const [venueConfirmedAddress, setVenueConfirmedAddress] = useState(venueConfig.confirmedAddress || '');
  const [venueDescription, setVenueDescription] = useState(venueConfig.tentativeDescription);
  const [venueSuccessMsg, setVenueSuccessMsg] = useState<string | null>(null);

  const allDivisions: Division[] = ['Div A', 'Div B', 'Div C', 'Div D', 'Div E', 'Div F', 'Div G'];

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const success = loginAdmin(authPassword, authEmail);
    if (success) {
      setIsAuthenticated(true);
      setRegistrations(getRegistrations());
    } else {
      setAuthError('Invalid credentials. Please use demo credentials: admin@ssds.edu / farewell2026');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setAuthPassword('');
  };

  // Division counts & Analytics
  const analytics = useMemo(() => {
    const total = registrations.length;
    const paidCount = registrations.filter((r) => r.paymentStatus === 'Received').length;
    const pendingCount = registrations.filter((r) => r.paymentStatus !== 'Received').length;
    const passIssuedCount = registrations.filter((r) => r.passIssued).length;

    const divCounts: Record<Division, number> = {
      'Div A': registrations.filter((r) => r.division === 'Div A').length,
      'Div B': registrations.filter((r) => r.division === 'Div B').length,
      'Div C': registrations.filter((r) => r.division === 'Div C').length,
      'Div D': registrations.filter((r) => r.division === 'Div D').length,
      'Div E': registrations.filter((r) => r.division === 'Div E').length,
      'Div F': registrations.filter((r) => r.division === 'Div F').length,
      'Div G': registrations.filter((r) => r.division === 'Div G').length,
    };

    return { total, paidCount, pendingCount, passIssuedCount, divCounts };
  }, [registrations]);

  // Filtered and Sorted Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((student) => {
        const matchesSearch =
          student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.mobile.includes(searchQuery) ||
          student.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDivision =
          selectedDivision === 'All' ? true : student.division === selectedDivision;
        const matchesPayment =
          selectedPaymentStatus === 'All'
            ? true
            : selectedPaymentStatus === 'Received'
            ? student.paymentStatus === 'Received'
            : student.paymentStatus !== 'Received';
        return matchesSearch && matchesDivision && matchesPayment;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
        }
        if (sortBy === 'name') {
          return a.fullName.localeCompare(b.fullName);
        }
        if (sortBy === 'division') {
          return a.division.localeCompare(b.division);
        }
        return 0;
      });
  }, [registrations, searchQuery, selectedDivision, selectedPaymentStatus, sortBy]);

  // Handle Add Student
  const handleOpenAddModal = () => {
    setFormName('');
    setFormMobile('');
    setFormDivision('Div A');
    setFormPaymentStatus('Pending');
    setFormSong('');
    setFormMemory('');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanMobile = formMobile.replace(/\D/g, '');
    if (!formName.trim() || formName.trim().length < 3) {
      setFormError('Please enter a valid student name (minimum 3 characters).');
      return;
    }
    if (cleanMobile.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      const created = saveRegistration({
        fullName: formName.trim(),
        mobile: cleanMobile,
        className: 'Class 10',
        division: formDivision,
        songRequest: formSong.trim() || undefined,
        favoriteMemory: formMemory.trim() || undefined,
      });

      if (formPaymentStatus === 'Received') {
        updateRegistration(created.id, { paymentStatus: 'Received' });
      }

      setRegistrations(getRegistrations());
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      }
    }
  };

  // Handle Edit Student
  const handleOpenEdit = (student: StudentRegistration) => {
    setEditingStudent(student);
    setFormName(student.fullName);
    setFormMobile(student.mobile);
    setFormDivision(student.division);
    setFormPaymentStatus(student.paymentStatus);
    setFormSong(student.songRequest || '');
    setFormMemory(student.favoriteMemory || '');
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setFormError(null);

    const cleanMobile = formMobile.replace(/\D/g, '');
    if (!formName.trim() || formName.trim().length < 3) {
      setFormError('Please enter a valid student name (minimum 3 characters).');
      return;
    }
    if (cleanMobile.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      updateRegistration(editingStudent.id, {
        fullName: formName.trim(),
        mobile: cleanMobile,
        division: formDivision,
        paymentStatus: formPaymentStatus,
        songRequest: formSong.trim() || undefined,
        favoriteMemory: formMemory.trim() || undefined,
      });
      setRegistrations(getRegistrations());
      setIsEditModalOpen(false);
      setEditingStudent(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      }
    }
  };

  // Toggle Payment Status
  const handleTogglePayment = (studentId: string) => {
    togglePaymentStatus(studentId);
    setRegistrations(getRegistrations());
  };

  // Give VIP QR Pass (Only after payment is received)
  const handleGivePass = (student: StudentRegistration) => {
    if (student.paymentStatus !== 'Received') {
      // Payment is pending: prompt admin to verify payment first
      setPaymentPromptStudent(student);
      return;
    }

    // Payment is received: issue pass and open ticket modal
    issueStudentPass(student.id);
    const updatedList = getRegistrations();
    setRegistrations(updatedList);
    const updatedStudent = updatedList.find((s) => s.id === student.id) || student;
    onSelectStudentForPass(updatedStudent);
  };

  // Confirm Payment and immediately give QR Pass
  const handleConfirmPaymentAndGivePass = () => {
    if (!paymentPromptStudent) return;
    updateRegistration(paymentPromptStudent.id, { paymentStatus: 'Received' });
    issueStudentPass(paymentPromptStudent.id);
    const updatedList = getRegistrations();
    setRegistrations(updatedList);
    const updatedStudent = updatedList.find((s) => s.id === paymentPromptStudent.id);
    setPaymentPromptStudent(null);
    if (updatedStudent) {
      onSelectStudentForPass(updatedStudent);
    }
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    deleteRegistration(deleteCandidate.id);
    setRegistrations(getRegistrations());
    setDeleteCandidate(null);
  };

  // Handle Venue Save
  const handleSaveVenueConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateVenueConfig({
      isTentative: venueTentativeToggle,
      statusBadge: venueTentativeToggle
        ? 'VENUE: TENTATIVE (TO BE ANNOUNCED SOON)'
        : 'VENUE: OFFICIAL DESTINATION CONFIRMED',
      title: venueTitle,
      locationArea: venueArea,
      confirmedName: venueConfirmedName,
      confirmedAddress: venueConfirmedAddress,
      tentativeDescription: venueDescription,
    });
    onVenueConfigUpdated(updated);
    setVenueSuccessMsg('Venue settings updated live across the entire website!');
    setTimeout(() => setVenueSuccessMsg(null), 4000);
  };

  // Export CSV
  const handleExportCSV = () => {
    exportRegistrationsToCSV(registrations);
  };

  // IF NOT AUTHENTICATED: Display Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-3 sm:px-4 py-12 sm:py-16">
        <div className="w-full max-w-md glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center mx-auto mb-3.5 text-amber-300">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="font-editorial-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
              SSDS Admin Security Gate
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Organizing Committee & Faculty Management Access
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3 sm:p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Committee Email
              </label>
              <input
                type="text"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@ssds.edu"
                className="w-full px-4 py-3 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Master Security Key
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="farewell2026"
                className="w-full px-4 py-3 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quick Helper Credentials Note */}
            <div className="p-3 rounded-lg bg-midnight-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Demo Organizer Credentials</span>
              </div>
              <div>Email: <code className="text-white font-mono">admin@ssds.edu</code></div>
              <div>Password: <code className="text-white font-mono">farewell2026</code></div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Authenticate & Access Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider"
            >
              Cancel & Return to Public Site
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Top Bar with School Header & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sinhagad Spring Dale School, Ambegaon</span>
          </div>
          <h1 className="font-editorial-serif text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Class 10 Farewell Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Student roster (Div A–G), fee verification, personalized QR Pass generation & live venue broadcast.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setActiveView('home')}
            className="flex-1 md:flex-initial px-3.5 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-initial px-3.5 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold tracking-wider uppercase hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-red-950/40 text-red-300 border border-red-500/30 text-xs font-semibold tracking-wider uppercase hover:bg-red-900/40 transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Students */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-cyan-500/20 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Registered</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-cinzel tracking-wider">
            {analytics.total}
          </div>
          <div className="text-[10px] text-cyan-300/80 mt-1 truncate">
            Class 10 Entries
          </div>
        </div>

        {/* Fees Paid */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Fees Paid</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-300 font-cinzel tracking-wider">
            {analytics.paidCount}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1 truncate">
            Payment Verified
          </div>
        </div>

        {/* Fees Pending */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber-300">Fees Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-cinzel tracking-wider">
            {analytics.pendingCount}
          </div>
          <div className="text-[10px] text-amber-400/80 mt-1 truncate">
            Awaiting Clearance
          </div>
        </div>

        {/* VIP QR Passes Issued */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-cyan-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-cyan-300">QR Passes Issued</span>
            <QrCode className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-cyan-300 font-cinzel tracking-wider">
            {analytics.passIssuedCount}
          </div>
          <div className="text-[10px] text-cyan-300/80 mt-1 truncate">
            Given to Students
          </div>
        </div>

        {/* Venue Status Card & Switcher */}
        <div className="glass-panel-gold rounded-2xl p-4 sm:p-5 border border-amber-400/30 shadow-lg flex flex-col justify-between col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between text-amber-300 mb-1">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Venue Notice</span>
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mt-0.5 truncate">
              {venueConfig.isTentative ? 'Tentative' : 'Confirmed'}
            </div>
          </div>
          
          <button
            onClick={() => setIsVenueEditorOpen(!isVenueEditorOpen)}
            className="mt-3 py-1.5 px-3 rounded-lg bg-amber-400/20 text-amber-200 border border-amber-400/40 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hover:bg-amber-400/30 transition-all text-center"
          >
            {isVenueEditorOpen ? 'Close Editor' : 'Edit Venue'}
          </button>
        </div>

      </div>

      {/* Division Breakdown Metric Row (Div A to Div G) */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Division-wise Registration Distribution</span>
          <Layers className="w-4 h-4 text-amber-300" />
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {allDivisions.map((div) => (
            <div key={div} className="p-2 sm:p-3 rounded-xl bg-midnight-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="text-[9px] sm:text-[11px] uppercase font-bold text-slate-400 block truncate">{div}</span>
              <span className="text-sm sm:text-lg font-bold text-cyan-300 font-cinzel">{analytics.divCounts[div]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Live Venue Updater Drawer */}
      {isVenueEditorOpen && (
        <div className="glass-panel-gold rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-400/40 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-amber-400/20 mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-editorial-serif">
                Live Venue Broadcast Controller
              </h2>
              <p className="text-xs text-slate-300">
                Instantly updates the Landing Hero, Venue Section, and Student VIP Passes across the entire website.
              </p>
            </div>
            <button
              onClick={() => setIsVenueEditorOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {venueSuccessMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{venueSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveVenueConfig} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-midnight-950 border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Venue Status:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVenueTentativeToggle(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    venueTentativeToggle
                      ? 'bg-amber-400 text-slate-950 font-bold shadow'
                      : 'bg-midnight-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  Tentative
                </button>
                <button
                  type="button"
                  onClick={() => setVenueTentativeToggle(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    !venueTentativeToggle
                      ? 'bg-emerald-400 text-slate-950 font-bold shadow'
                      : 'bg-midnight-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  Confirmed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Location Area / Corridor
                </label>
                <input
                  type="text"
                  value={venueArea}
                  onChange={(e) => setVenueArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Confirmed Destination Name
                </label>
                <input
                  type="text"
                  value={venueConfirmedName}
                  onChange={(e) => setVenueConfirmedName(e.target.value)}
                  placeholder="e.g. The Royal Grand Heritage Lawns"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Confirmed Address Details (If Finalized)
              </label>
              <input
                type="text"
                value={venueConfirmedAddress}
                onChange={(e) => setVenueConfirmedAddress(e.target.value)}
                placeholder="Survey No. 44, Ambegaon BK, Pune 411046"
                className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Tentative Notice Description
              </label>
              <textarea
                rows={2}
                value={venueDescription}
                onChange={(e) => setVenueDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow"
            >
              Save & Publish Venue Updates
            </button>
          </form>
        </div>
      )}

      {/* Data Management Section: Search, Filter & Actions */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-800 space-y-5">
        
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, mobile, or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Division Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {['All', 'Div A', 'Div B', 'Div C', 'Div D', 'Div E', 'Div F', 'Div G'].map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border shrink-0 ${
                  selectedDivision === div
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50'
                    : 'bg-midnight-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {div}
              </button>
            ))}
          </div>

          {/* Payment Status Filter Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            {['All', 'Received', 'Pending'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedPaymentStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border shrink-0 ${
                  selectedPaymentStatus === status
                    ? status === 'Received'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                      : status === 'Pending'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                      : 'bg-blue-500/20 text-blue-200 border-blue-400/50'
                    : 'bg-midnight-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {status === 'Received' ? 'Paid' : status}
              </button>
            ))}
          </div>

          {/* Manual Add Student Button */}
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-xs tracking-wider uppercase shadow-md shadow-cyan-900/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>

        {/* Student Records Table with mobile-scrollable wrapper */}
        <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-800 bg-midnight-950/60 -mx-1 sm:mx-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-midnight-900/80 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3 sm:px-4">Pass ID</th>
                <th className="py-3 px-3 sm:px-4">Student Name</th>
                <th className="py-3 px-3 sm:px-4">Division</th>
                <th className="py-3 px-3 sm:px-4">Mobile</th>
                <th className="py-3 px-3 sm:px-4">Payment Status</th>
                <th className="py-3 px-3 sm:px-4 text-center">VIP Pass & QR</th>
                <th className="py-3 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    No student registrations match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((student) => {
                  const isPaid = student.paymentStatus === 'Received';
                  const isPassIssued = student.passIssued;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      <td className="py-3.5 px-3 sm:px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        {student.id}
                      </td>

                      <td className="py-3.5 px-3 sm:px-4 font-medium text-white whitespace-nowrap">
                        <div>{student.fullName}</div>
                        {student.songRequest && (
                          <div className="text-[10px] text-slate-400 italic truncate max-w-xs">
                            Song: {student.songRequest}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-cyan-200 border border-slate-700">
                          {student.division}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 sm:px-4 font-mono text-slate-300 whitespace-nowrap">
                        +91 {student.mobile}
                      </td>

                      {/* Payment Status (Clickable Toggle) */}
                      <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePayment(student.id)}
                          title={`Click to mark as ${isPaid ? 'Pending' : 'Received'}`}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            isPaid
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                          }`}
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Paid</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>Pending</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* VIP QR Pass Action: Allowed only after payment is received */}
                      <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                        {isPaid ? (
                          <button
                            onClick={() => handleGivePass(student)}
                            title="Generate and issue scannable VIP QR Pass"
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow ${
                              isPassIssued
                                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 hover:bg-cyan-500/30'
                                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-950/40'
                            }`}
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>{isPassIssued ? 'View QR Ticket' : 'Give QR Pass'}</span>
                            {!isPassIssued && <Sparkles className="w-3 h-3 ml-0.5" />}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleGivePass(student)}
                            title="Requires fee payment before issuing QR Pass"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-500 bg-midnight-950 border border-slate-800 hover:border-slate-700 hover:text-slate-400 transition-colors"
                          >
                            <Lock className="w-3 h-3 text-slate-500" />
                            <span>Payment Req.</span>
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Record */}
                          <button
                            onClick={() => handleOpenEdit(student)}
                            title="Edit Student Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Record */}
                          <button
                            onClick={() => setDeleteCandidate(student)}
                            title="Delete Registration"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-1 gap-2 text-center sm:text-left">
          <span>
            Showing <strong className="text-white">{filteredRegistrations.length}</strong> of{' '}
            <strong className="text-white">{registrations.length}</strong> total registered students.
          </span>
          <span className="font-mono text-[10px] sm:text-[11px]">
            SSDS AMBEGAON • CLASS OF 2026 OFFICIAL REGISTRY
          </span>
        </div>

      </div>

      {/* MODAL: Payment Clearance Confirmation Prompt (When clicking Give QR on Pending student) */}
      {paymentPromptStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-2xl sm:rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <CreditCard className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-editorial-serif text-lg font-bold text-white">
                Payment Verification Required
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Fee contribution for <strong className="text-white">{paymentPromptStudent.fullName}</strong> ({paymentPromptStudent.division}) is currently marked as <strong className="text-amber-300">Pending</strong>.
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Official Scannable VIP Entry Passes can only be given after payment is received. Would you like to confirm payment and issue their QR ticket now?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setPaymentPromptStudent(null)}
                className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPaymentAndGivePass}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
              >
                <Check className="w-4 h-4" />
                <span>Mark Paid & Issue QR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Student Entry */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-cyan-500/30 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="font-editorial-serif text-lg sm:text-xl font-bold text-white">
                Add Student Registration
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Aarav Sachin Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  10-Digit Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9822014589"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Division
                  </label>
                  <select
                    value={formDivision}
                    onChange={(e) => setFormDivision(e.target.value as Division)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                  >
                    {allDivisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formPaymentStatus}
                    onChange={(e) => setFormPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Received">Received (Paid)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Song Request (Optional)
                </label>
                <input
                  type="text"
                  value={formSong}
                  onChange={(e) => setFormSong(e.target.value)}
                  placeholder="e.g. Memories - Maroon 5"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Favorite School Memory (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formMemory}
                  onChange={(e) => setFormMemory(e.target.value)}
                  placeholder="Sports day memories, auditorium rehearsals, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-semibold uppercase tracking-wider shadow"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Student Entry */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-500/30 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <h3 className="font-editorial-serif text-lg sm:text-xl font-bold text-white">
                  Edit Student Registration
                </h3>
                <span className="text-xs font-mono text-cyan-400">{editingStudent.id}</span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  10-Digit Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Division
                  </label>
                  <select
                    value={formDivision}
                    onChange={(e) => setFormDivision(e.target.value as Division)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                  >
                    {allDivisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formPaymentStatus}
                    onChange={(e) => setFormPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Received">Received (Paid)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Song Request
                </label>
                <input
                  type="text"
                  value={formSong}
                  onChange={(e) => setFormSong(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Favorite School Memory
                </label>
                <textarea
                  rows={2}
                  value={formMemory}
                  onChange={(e) => setFormMemory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Student Confirmation */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-2xl sm:rounded-3xl p-6 border border-red-500/40 shadow-2xl space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-red-950/50 border border-red-500/40 flex items-center justify-center text-red-400">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-editorial-serif text-lg font-bold text-white">
                Delete Registration Record?
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Are you sure you want to remove <strong className="text-white">{deleteCandidate.fullName}</strong> ({deleteCandidate.id})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold uppercase tracking-wider shadow hover:bg-red-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
