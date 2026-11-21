import React from 'react';
import { VenueConfig } from '../types';
import {
  MapPin,
  Compass,
  ShieldCheck,
  Car,
  Bell,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface VenueSectionProps {
  venueConfig: VenueConfig;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ venueConfig }) => {
  return (
    <section id="venue" className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Background Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs tracking-widest uppercase font-semibold mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Destination Coordinates</span>
        </div>
        <h2 className="font-editorial-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          The Celebration Venue
        </h2>
        <p className="mt-2.5 sm:mt-4 text-slate-400 text-xs sm:text-base leading-relaxed px-2">
          Carefully chosen to deliver an expansive open-air celebration with dedicated dance lawn, acoustic zoning, and royal banquet arrangements.
        </p>
      </div>

      {/* Main Venue Status Presentation Card */}
      <div className="max-w-4xl mx-auto glass-panel-gold rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-amber-400/30 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-36 sm:w-48 h-36 sm:h-48 bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-6 pb-5 sm:pb-8 border-b border-amber-400/20">
          <div>
            {/* Status Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full text-[9.5px] sm:text-xs font-bold uppercase tracking-wider bg-amber-400/15 border border-amber-400/40 text-amber-300 mb-2 sm:mb-2.5 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
              <span>
                {venueConfig.isTentative
                  ? 'Venue: Tentative (To Be Announced)'
                  : 'Venue: Official Destination Confirmed'}
              </span>
            </div>

            <h3 className="text-lg sm:text-3xl font-bold text-white font-editorial-serif">
              {venueConfig.isTentative
                ? 'Open-Air Lawn Destination & Banquet Grounds'
                : venueConfig.confirmedName}
            </h3>

            <p className="text-xs sm:text-sm text-cyan-300/90 font-medium tracking-wide mt-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{venueConfig.locationArea}</span>
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t border-slate-800/80 sm:border-0">
            <div className="text-left sm:text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Broadcast Status
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Portal Live Sync Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="py-5 sm:py-6 text-xs sm:text-base text-slate-300 leading-relaxed font-light">
          {venueConfig.isTentative ? (
            <p>{venueConfig.tentativeDescription}</p>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-midnight-900/80 border border-slate-700/60">
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  Confirmed Address
                </div>
                <div className="text-sm font-medium text-white">{venueConfig.confirmedAddress}</div>
                {venueConfig.confirmedLandmark && (
                  <div className="text-xs text-slate-400 mt-1">
                    Landmark: {venueConfig.confirmedLandmark}
                  </div>
                )}
              </div>
              {venueConfig.confirmedGpsUrl && (
                <a
                  href={venueConfig.confirmedGpsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200 underline mt-2"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open in Google Maps Navigation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Venue Amenities & Selection Criteria */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-800">
          <div className="p-3.5 sm:p-4 rounded-xl bg-midnight-950/70 border border-slate-800">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-950 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="text-xs font-semibold text-white">Full Security Perimeter</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Private gate control and student ID badge verification upon entry.
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-midnight-950/70 border border-slate-800">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-950 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-2">
              <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="text-xs font-semibold text-white">Parent Drop-Off & Parking</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Dedicated vehicle drop-off loop and monitored student pickup staging area.
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-midnight-950/70 border border-slate-800">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-950 border border-blue-800/40 flex items-center justify-center text-blue-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="text-xs font-semibold text-white">Starlight Open Lawn</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Spacious turf with weather-proof pavilions and elevated DJ concert riser.
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 pt-3 sm:pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2.5 bg-slate-900/40 p-3 sm:p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              All students registered on this portal will receive instant digital pass updates when the final venue gate coordinates are announced.
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-amber-300 font-medium shrink-0">
            SSDS Ambegaon Committee
          </div>
        </div>

      </div>

    </section>
  );
};
