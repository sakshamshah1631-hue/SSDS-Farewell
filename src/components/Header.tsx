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
  Volume2,
  VolumeX,
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
        osc1.frequency.setValueAtTime(220, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(329.63, ctx.currentTime);

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#050811]/90 border-b border-cyan-500/15 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* School Monogram & Identity */}
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-2.5 sm:space-x-3.5 group text-left focus:outline-none"
            aria-label="Sinhagad Spring Dale School Farewell Home"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-amber-400/50 bg-gradient-to-br from-amber-400/15 via-midnight-850 to-midnight-950 shadow-inner group-hover:border-amber-400 transition-colors shrink-0">
              <span className="font-cinzel text-[11px] sm:text-xs font-bold tracking-widest text-amber-300">
                SSDS
              </span>
              <div className="absolute inset-0 rounded-full border border-cyan-400/25 scale-110 pointer-events-none" />
            </div>

            <div className="flex flex-col">
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                SSDS AMBEGAON
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-medium text-amber-400/90 truncate max-w-[170px] sm:max-w-none">
                Class of 2026 Farewell Gala
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

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-3.5">
            <button
              onClick={toggleAtmosphereAudio}
              title={isAudioPlaying ? 'Mute ambient resonance' : 'Play ambient resonance'}
              className="p-2.5 rounded-full border border-slate-700/60 bg-slate-900/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all text-xs"
              aria-label="Toggle ambient atmospheric audio"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

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

          {/* Mobile Right Bar: Audio + Register Quick Pill + Drawer Toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={toggleAtmosphereAudio}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 active:text-cyan-300 text-xs"
              aria-label="Toggle audio"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

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

      {/* Luxury Full Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-cyan-500/20 bg-[#050811]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 animate-fadeIn shadow-2xl">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
            <span className="font-cinzel text-amber-300 font-semibold tracking-wider">
              NAVIGATION
            </span>
            <span className="font-mono text-[10px] text-cyan-400">
              DIV A – DIV G
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {[
              { id: 'hero', label: 'Event Overview', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
              { id: 'itinerary', label: 'Evening Itinerary', icon: <Calendar className="w-4 h-4 text-cyan-400" /> },
              { id: 'venue', label: 'Venue Coordinates (Tentative)', icon: <MapPin className="w-4 h-4 text-amber-400" /> },
              { id: 'gallery', label: 'Atmosphere & Lawn Disco', icon: <ImageIcon className="w-4 h-4 text-cyan-400" /> },
              { id: 'reflections', label: 'Class 10 Reflections', icon: <Award className="w-4 h-4 text-amber-400" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => navigateToSection(item.id)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-midnight-950/60 border border-slate-800/60 text-slate-200 active:bg-cyan-950/40 text-left text-xs uppercase tracking-wider group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-colors" />
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => {
                setActiveView('register');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 border border-cyan-400/40 active:scale-[0.99] transition-transform"
            >
              <Ticket className="w-4 h-4 text-cyan-200" />
              <span>Register for Student Pass ({registeredCount} Registered)</span>
            </button>

            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-center text-xs tracking-wider uppercase border border-slate-800 bg-slate-900/40 text-slate-400 active:text-slate-200 flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Faculty & Admin Portal</span>
            </button>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
            Sinhagad Spring Dale School, Ambegaon • Batch of 2026
          </div>
        </div>
      )}
    </header>
  );
};
