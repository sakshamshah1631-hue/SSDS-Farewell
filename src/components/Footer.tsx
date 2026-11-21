import React from 'react';
import { ActiveView } from '../types';
import { MapPin, Phone, Mail, ShieldCheck, Lock, Ticket } from 'lucide-react';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
  const scrollTo = (id: string) => {
    setActiveView('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-midnight-950 border-t border-slate-800/80 pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative text-xs text-slate-400">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-slate-800">
        
        {/* School Branding */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border border-amber-400/50 bg-amber-400/10 flex items-center justify-center text-amber-300 font-cinzel font-bold text-xs shrink-0">
              SSDS
            </div>
            <div>
              <span className="font-cinzel text-xs sm:text-sm font-bold text-white tracking-wider block">
                SINHAGAD SPRING DALE SCHOOL
              </span>
              <span className="text-[10px] sm:text-[11px] text-amber-400 font-medium tracking-widest uppercase">
                Ambegaon (Bk), Pune • Class 10 Farewell 2026
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-md font-light">
            An evening dedicated to honoring the character, academic achievements, and ten-year journey of the Class of 2026. Sinhagad Spring Dale School is committed to cultivating leadership, integrity, and lifelong pursuit of knowledge.
          </p>

          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Official Event Portal Authorized by Student Welfare Committee</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-white">
            Program Navigation
          </h4>
          <ul className="space-y-2.5">
            <li>
              <button
                onClick={() => scrollTo('hero')}
                className="hover:text-cyan-300 transition-colors py-0.5 text-left"
              >
                Event Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollTo('itinerary')}
                className="hover:text-cyan-300 transition-colors py-0.5 text-left"
              >
                Gala Sequence & Schedule
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollTo('venue')}
                className="hover:text-cyan-300 transition-colors py-0.5 text-left"
              >
                Venue Coordinates & Updates
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollTo('gallery')}
                className="hover:text-cyan-300 transition-colors py-0.5 text-left"
              >
                Atmosphere & Lawn Disco
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollTo('reflections')}
                className="hover:text-cyan-300 transition-colors py-0.5 text-left"
              >
                Class 10 Reflections
              </button>
            </li>
          </ul>
        </div>

        {/* Student Helpdesk & Portals - Vadgaon removed as requested */}
        <div className="space-y-3">
          <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-white">
            Helpdesk & Portals
          </h4>
          <div className="space-y-2 text-slate-400">
            <p className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Ambegaon Campus, Sinhagad Road, Pune 411041</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Event Helpline: +91 20 2435 5000</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>farewell2026@ssds.edu.in</span>
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => setActiveView('register')}
              className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 text-xs font-semibold uppercase tracking-wider py-1 text-left"
            >
              <Ticket className="w-3.5 h-3.5 shrink-0" />
              <span>Student Registration Portal</span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-xs font-semibold uppercase tracking-wider py-1 text-left"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Faculty & Admin Gate</span>
            </button>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-slate-500 gap-3 text-center sm:text-left">
        <p>© 2026 Sinhagad Spring Dale School, Ambegaon. All Rights Reserved.</p>
        <p className="font-mono text-[10px] text-slate-600">
          DESIGNED FOR CLASS OF 2026 • VALEDICTORY ASSEMBLY
        </p>
      </div>

    </footer>
  );
};
