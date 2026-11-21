import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  Calendar,
  MapPin,
  Image as ImageIcon,
  Ticket,
  Lock,
  Menu,
  X,
  Award,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  registeredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  registeredCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToSection = (sectionId: string) => {
    if (activeView !== 'home') {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#050811]/90 border-b border-slate-800/80 transition-all duration-300">
      
      {/* Topmost Institutional Thin Bar */}
      <div className="bg-gradient-to-r from-midnight-950 via-slate-900 to-midnight-950 px-4 sm:px-8 py-1.5 border-b border-cyan-500/10 hidden sm:flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-wider">
        <div className="flex items-center space-x-3">
          <span className="text-amber-400 font-semibold tracking-widest uppercase">SSDS AMBEGAON</span>
          <span className="text-slate-600">/</span>
          <span>SINHAGAD SPRING DALE SENIOR SECONDARY</span>
        </div>

        <div className="flex items-center space-x-4 text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <strong className="text-slate-300">Class 10 (Div A–G)</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-300 font-medium">Batch of 2026 Farewell Gala</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Monogram Brand */}
          <div
            onClick={() => setActiveView('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* Custom Monogram Badge (Strictly NO Purple - Gold & Midnight Navy) */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center text-amber-300 font-bold font-cinzel text-xs sm:text-sm shadow-lg shadow-amber-950/40 group-hover:border-amber-400/80 group-hover:scale-105 transition-all">
              SSDS
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-editorial-serif text-sm sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors truncate">
                Spring Dale School
              </span>
              <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-mono truncate max-w-[190px] sm:max-w-none">
                Ambegaon, Pune • Class of 2026
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium uppercase tracking-widest text-slate-300">
            <button
              onClick={() => setActiveView('home')}
              className={`hover:text-cyan-300 transition-colors py-1 relative ${
                activeView === 'home' ? 'text-cyan-300 font-semibold' : ''
              }`}
            >
              Overview
              {activeView === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => navigateToSection('itinerary')}
              className="hover:text-cyan-300 transition-colors py-1"
            >
              Itinerary
            </button>

            <button
              onClick={() => navigateToSection('venue')}
              className="hover:text-cyan-300 transition-colors py-1 flex items-center gap-1.5"
            >
              <span>Destination</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                Tentative
              </span>
            </button>

            <button
              onClick={() => navigateToSection('atmosphere')}
              className="hover:text-cyan-300 transition-colors py-1"
            >
              Atmosphere
            </button>

            <button
              onClick={() => navigateToSection('reflections')}
              className="hover:text-cyan-300 transition-colors py-1"
            >
              Reflections
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-3.5">
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3 py-2 rounded-lg text-xs font-medium tracking-wider flex items-center gap-1.5 border transition-all ${
                activeView === 'admin'
                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/40'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => setActiveView('register')}
              className="relative group px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 overflow-hidden shadow-lg shadow-cyan-950/40"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute inset-0 border border-cyan-400/40 rounded-xl pointer-events-none" />
              <span className="relative flex items-center gap-2 text-white">
                <Ticket className="w-3.5 h-3.5 text-cyan-200" />
                <span>Register for Pass</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-cyan-100 font-mono">
                  {registeredCount}
                </span>
              </span>
            </button>
          </div>

          {/* Mobile Right Bar: Register Quick Pill + Drawer Toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setActiveView('register')}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-950/50 border border-cyan-400/40"
            >
              <Ticket className="w-3 h-3 text-cyan-200" />
              <span>Pass</span>
              <span className="px-1 py-0.2 rounded bg-black/30 text-[9px] font-mono">
                {registeredCount}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/90 text-slate-300 active:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-cyan-300" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-down Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#070b14]/98 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3.5 animate-fadeIn">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-1 border-b border-slate-800/80 pb-2 flex items-center justify-between">
            <span>Navigation Menu</span>
            <span className="text-cyan-400">Class of 2026</span>
          </div>

          <div className="grid grid-cols-1 gap-1 text-sm font-medium">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                activeView === 'home'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-900/80'
              }`}
            >
              <span>Overview</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigateToSection('itinerary')}
              className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-slate-900/80 transition-colors"
            >
              <span>Itinerary</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigateToSection('venue')}
              className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-slate-900/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>Destination & Venue</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                  Tentative
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigateToSection('atmosphere')}
              className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-slate-900/80 transition-colors"
            >
              <span>Atmosphere & Gallery</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => navigateToSection('reflections')}
              className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-slate-900/80 transition-colors"
            >
              <span>Cherished Memories</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveView('register');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60"
            >
              <Ticket className="w-4 h-4" />
              <span>Enroll for VIP Pass ({registeredCount} Registered)</span>
            </button>

            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-midnight-950 border border-slate-800 text-slate-400 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Management Gate</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
