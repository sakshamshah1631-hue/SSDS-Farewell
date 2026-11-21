import React, { useState, useEffect } from 'react';
import { ActiveView } from '../types';
import { Ticket, ArrowRight, Sparkles } from 'lucide-react';

interface MobileQuickBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  registeredCount: number;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  activeView,
  setActiveView,
  registeredCount,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating quick bar once user scrolls past 300px on home view
      if (window.scrollY > 300 && activeView === 'home') {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeView]);

  if (!visible || activeView !== 'home') return null;

  return (
    <div className="sm:hidden fixed bottom-4 inset-x-3 z-30 no-print animate-fadeIn">
      <div className="glass-panel-gold rounded-2xl p-2.5 border border-amber-400/40 shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-3 bg-[#050811]/95">
        
        <div className="flex items-center gap-2 pl-1.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full border border-amber-400/50 bg-amber-400/10 flex items-center justify-center text-amber-300 font-cinzel font-bold text-[10px] shrink-0">
            SSDS
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate">
              Class 10 Farewell
            </span>
            <span className="text-[9px] text-amber-300/90 font-mono flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>{registeredCount} Registered (Div A–G)</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveView('register');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-[11px] uppercase tracking-wider shadow-lg shadow-cyan-950/60 border border-cyan-400/40 flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <Ticket className="w-3.5 h-3.5 text-cyan-200" />
          <span>Get Pass</span>
          <ArrowRight className="w-3 h-3 text-cyan-200" />
        </button>

      </div>
    </div>
  );
};
