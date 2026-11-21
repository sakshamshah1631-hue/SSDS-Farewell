import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  Compass,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Ticket,
  Lock,
  Menu,
  X,
  Volume2,
  VolumeX,
  Award,
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
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const oscillatorNodeRef = React.useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);

  const toggleAtmosphereAudio = () => {
    try {
      if (!isAudioPlaying) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
        gainNode.connect(ctx.destination);

        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, ctx.currentTime); // A3 warm tone

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4 harmonic

        osc1.connect(gainNode);
        osc2.connect(gainNode);

        osc1.start();
        osc2.start();

        oscillatorNodeRef.current = { osc1, osc2, gain: gainNode };
        setIsAudioPlaying(true);
      } else {
        if (oscillatorNodeRef.current) {
          oscillatorNodeRef.current.osc1.stop();
          oscillatorNodeRef.current.osc2.stop();
          oscillatorNodeRef.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        setIsAudioPlaying(false);
      }
    } catch {
      setIsAudioPlaying(false);
    }
  };

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070b14]/85 border-b border-cyan-500/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* School Monogram & Identity */}
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3.5 group text-left focus:outline-none"
            aria-label="Sinhagad Spring Dale School Farewell Home"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-400/10 via-midnight-850 to-midnight-950 shadow-inner group-hover:border-amber-400 transition-colors">
              <span className="font-cinzel text-xs font-bold tracking-widest text-amber-300">
                SSDS
              </span>
              <div className="absolute inset-0 rounded-full border border-cyan-400/20 scale-110 pointer-events-none" />
            </div>

            <div className="flex flex-col">
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors">
                SINHAGAD SPRING DALE SCHOOL
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-amber-400/90">
                Ambegaon, Pune • Class of 2026 Farewell
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            <button
              onClick={() => navigateToSection('hero')}
              className={`text-xs font-medium tracking-wider uppercase transition-colors ${
                activeView === 'home' ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => navigateToSection('itinerary')}
              className="text-xs font-medium tracking-wider uppercase text-slate-400 hover:text-cyan-300 transition-colors"
            >
              Itinerary
            </button>
            <button
              onClick={() => navigateToSection('venue')}
              className="text-xs font-medium tracking-wider uppercase text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3 h-3 text-amber-400" />
              Venue Status
            </button>
            <button
              onClick={() => navigateToSection('gallery')}
              className="text-xs font-medium tracking-wider uppercase text-slate-400 hover:text-cyan-300 transition-colors"
            >
              Atmosphere
            </button>
            <button
              onClick={() => navigateToSection('reflections')}
              className="text-xs font-medium tracking-wider uppercase text-slate-400 hover:text-cyan-300 transition-colors"
            >
              Reflections
            </button>
          </nav>

          {/* Header Actions */}
          <div className="hidden sm:flex items-center space-x-3.5">
            {/* Ambient Sound Toggle */}
            <button
              onClick={toggleAtmosphereAudio}
              title={isAudioPlaying ? 'Mute ambient evening resonance' : 'Play ambient evening resonance'}
              className="p-2.5 rounded-full border border-slate-700/60 bg-slate-900/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all text-xs"
              aria-label="Toggle ambient atmospheric audio"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Admin Portal Gateway */}
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3 py-2 rounded-lg text-xs font-medium tracking-wider flex items-center gap-1.5 border transition-all ${
                activeView === 'admin'
                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/40'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

            {/* Registration CTA */}
            <button
              onClick={() => setActiveView('register')}
              className="relative group px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute inset-0 border border-cyan-400/40 rounded-lg pointer-events-none" />
              <span className="relative flex items-center gap-2 text-white">
                <Ticket className="w-3.5 h-3.5 text-cyan-200" />
                <span>Register for Pass</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-cyan-100">
                  {registeredCount}
                </span>
              </span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setActiveView('register')}
              className="p-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs"
              aria-label="Register"
            >
              <Ticket className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-cyan-500/15 bg-[#070b14]/98 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-2 pt-2">
            <button
              onClick={() => navigateToSection('hero')}
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 text-left text-xs uppercase tracking-wider"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Event Overview</span>
            </button>
            <button
              onClick={() => navigateToSection('itinerary')}
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 text-left text-xs uppercase tracking-wider"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Evening Itinerary</span>
            </button>
            <button
              onClick={() => navigateToSection('venue')}
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 text-left text-xs uppercase tracking-wider"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Venue Status (Tentative)</span>
            </button>
            <button
              onClick={() => navigateToSection('gallery')}
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 text-left text-xs uppercase tracking-wider"
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Atmosphere & Dance Floor</span>
            </button>
            <button
              onClick={() => navigateToSection('reflections')}
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-lg text-slate-300 hover:bg-slate-900 text-left text-xs uppercase tracking-wider"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Class Reflections</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col space-y-2.5">
            <button
              onClick={() => {
                setActiveView('register');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-lg text-center font-semibold text-xs tracking-wider uppercase bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Register Online for Entry Pass</span>
            </button>

            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg text-center text-xs tracking-wider uppercase border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
