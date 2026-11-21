import React, { useState, useEffect } from 'react';
import { ActiveView, VenueConfig } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  ChevronDown,
} from 'lucide-react';

interface HeroProps {
  venueConfig: VenueConfig;
  setActiveView: (view: ActiveView) => void;
  registeredCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  venueConfig,
  setActiveView,
  registeredCount,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 18);
    targetDate.setHours(17, 30, 0, 0);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[90vh] sm:min-h-[92vh] flex items-center justify-center pt-4 sm:pt-8 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Editorial Lawn Party & Disco Atmosphere Layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#070b14] via-[#091024] to-[#070b14]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 transform scale-100 transition-opacity duration-700"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=70&w=1280&auto=format&fit=crop')`,
            filter: 'contrast(1.15) brightness(0.65) saturate(1.1) hue-rotate(185deg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/90 via-[#070b14]/70 to-[#070b14]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Formal Institutional Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full glass-panel border border-cyan-400/30 text-cyan-200 text-[10px] sm:text-xs tracking-widest uppercase font-semibold mb-5 sm:mb-6 shadow-sm max-w-[95%]">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
          <span className="truncate">Sinhagad Spring Dale School, Ambegaon</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
          <span className="text-amber-300 font-bold shrink-0">Class of 2026</span>
        </div>

        {/* Grand Headline: Editorial Typography Pairing */}
        <h1 className="font-editorial-serif text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-3 sm:mb-4 leading-[1.12]">
          The Valedictory
          <span className="block italic font-normal text-gradient-cyan">
            Farewell Gala
          </span>
        </h1>

        {/* Dignified Subheading */}
        <p className="max-w-2xl text-xs sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-6 sm:mb-8 px-2">
          Honoring the camaraderie, triumphs, and unforgettable journey of Class X.
          An evening of dinner, awards, open-lawn disco, and timeless memories under starlit skies.
        </p>

        {/* Live Countdown Grid - Mobile Optimized (Compact padding & typography on mobile) */}
        <div className="w-full max-w-xl grid grid-cols-4 gap-2 sm:gap-4 mb-8 sm:mb-10">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-xl p-2 sm:p-4 text-center border border-cyan-500/20 shadow-lg relative overflow-hidden"
            >
              <div className="text-xl sm:text-3xl md:text-4xl font-bold text-white font-cinzel tracking-wider">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[9px] sm:text-xs uppercase tracking-widest text-slate-400 font-medium mt-0.5 sm:mt-1">
                {item.label}
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-12 bg-cyan-500/10 blur-xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Live Status Pill: Tentative Venue Status */}
        <div className="mb-8 sm:mb-10 w-full max-w-2xl px-1">
          <div className="p-3.5 sm:p-4 rounded-xl glass-panel-gold border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                  {venueConfig.isTentative ? 'Venue: Tentative (To Be Announced)' : 'Venue: Confirmed Destination'}
                </div>
                <div className="text-xs text-slate-300 font-normal mt-0.5 leading-snug">
                  {venueConfig.isTentative
                    ? 'Premium open-lawn banquet grounds in South Pune / Ambegaon'
                    : venueConfig.confirmedName}
                </div>
              </div>
            </div>

            <button
              onClick={() => scrollToSection('venue')}
              className="text-xs font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-4 shrink-0 transition-colors self-end sm:self-center"
            >
              Details & Updates
            </button>
          </div>
        </div>

        {/* Primary Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-2">
          <button
            onClick={() => setActiveView('register')}
            className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 text-white shadow-xl shadow-cyan-900/40 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 border border-cyan-400/40"
          >
            <span>Register for Admission Pass</span>
            <ArrowRight className="w-4 h-4 text-cyan-200" />
          </button>

          <button
            onClick={() => scrollToSection('itinerary')}
            className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-medium tracking-wider uppercase glass-panel text-slate-200 hover:text-white hover:border-slate-500 hover:bg-slate-800/60 transition-all flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Evening Itinerary</span>
          </button>
        </div>

        {/* Key Event Highlights Row - Responsive 2x2 on mobile, 4 on desktop */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-800/80 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Class X Batch</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">Div A through G</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Grand Evening</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">05:30 PM Onwards</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Lawn Celebration</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">Gala & Disco Stage</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Secure Admission</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">Digital Pass Verification</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection('itinerary')}
          className="mt-8 sm:mt-12 text-slate-500 hover:text-cyan-400 transition-colors animate-bounce p-2"
          aria-label="Scroll down to itinerary"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

      </div>
    </section>
  );
};
