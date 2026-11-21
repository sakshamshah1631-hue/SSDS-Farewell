import React from 'react';
import {
  Clock,
  Sparkles,
  Camera,
  Award,
  Utensils,
  Music,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { ItineraryItem } from '../types';

export const Itinerary: React.FC = () => {
  const schedule: (ItineraryItem & { icon: React.ReactNode })[] = [
    {
      time: '05:30 PM – 06:30 PM',
      title: 'Red Carpet Arrival & Photo Opportunities',
      subtitle: 'Commemorative Portraits & Welcome Mocktails',
      description:
        'Walk the grand red carpet framed with festoon lights. Professional batch photographers will capture class division portraits, candid moments, and friend group step-and-repeat backdrops.',
      tag: 'Reception',
      icon: <Camera className="w-4 h-4 text-cyan-400" />,
    },
    {
      time: '06:30 PM – 07:45 PM',
      title: 'Valedictory Ceremonies & Teacher Tributes',
      subtitle: 'Speeches, Year-in-Review Film & Student Citations',
      description:
        'Dignified address by faculty mentors and student council leaders. Screening of the Class of 2026 retrospective documentary film celebrating milestones from 5th to 10th standard at SSDS Ambegaon.',
      tag: 'Main Stage',
      icon: <Award className="w-4 h-4 text-amber-300" />,
    },
    {
      time: '07:45 PM – 09:00 PM',
      title: 'The Royal Lawn Banquet & Gala Dinner',
      subtitle: 'Lavish Multi-Cuisine Buffet Under Starlight',
      description:
        'A curated culinary spread featuring gourmet delicacies, continental live pasta counters, artisanal chaat street, and signature dessert creations served under the night sky on the banquet lawn.',
      tag: 'Banquet Lawn',
      icon: <Utensils className="w-4 h-4 text-cyan-400" />,
    },
    {
      time: '09:00 PM – 10:30 PM',
      title: 'Starlight Lawn Disco & DJ Dance Floor',
      subtitle: 'Live DJ Set, Sound Stage & Batch Anthems',
      description:
        'The open-air lawn transforms with dynamic concert-grade lighting, laser beams, and immersive soundscapes. Featuring dance anthems, global hits, and student-requested tracks.',
      tag: 'Dance Floor',
      icon: <Music className="w-4 h-4 text-amber-300" />,
    },
    {
      time: '10:30 PM – 11:00 PM',
      title: 'Memento Presentation & Candlelight Farewell',
      subtitle: 'SSDS Class of 2026 Yearbooks & Closing Circle',
      description:
        'Distribution of personalized commemorative SSDS Class of 2026 yearbooks, batch medals, and official farewell citations. Final gathering circle under the open night sky to sing the school hymn.',
      tag: 'Closing Ceremony',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
    },
  ];

  return (
    <section id="itinerary" className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 text-[10px] sm:text-xs tracking-widest uppercase font-semibold mb-3">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Evening Program Sequence</span>
        </div>
        <h2 className="font-editorial-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          An Itinerary of Elegance & Celebration
        </h2>
        <p className="mt-3 sm:mt-4 text-slate-400 text-xs sm:text-base leading-relaxed px-2">
          From the ceremonial red carpet to the open-lawn disco under the night stars, every hour is crafted to celebrate your 10-year journey at Sinhagad Spring Dale School.
        </p>
      </div>

      {/* Timeline Grid: responsive layout */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical Line on desktop */}
        <div className="hidden sm:block absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-500/10 via-cyan-400/30 to-amber-400/20" />

        <div className="space-y-5 sm:space-y-12">
          {schedule.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Center Dot for desktop */}
                <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full glass-panel border border-cyan-400/40 items-center justify-center bg-midnight-900 shadow-md shadow-cyan-900/50 z-10">
                  {item.icon}
                </div>

                {/* Content Box */}
                <div className={`w-full sm:w-1/2 ${isEven ? 'sm:pl-10 text-left' : 'sm:pr-10 text-left'}`}>
                  <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 group hover:shadow-xl hover:shadow-cyan-950/30">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] sm:text-xs font-bold text-cyan-300 tracking-wider uppercase flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{item.time}</span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-editorial-serif text-base sm:text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {item.title}
                    </h3>

                    <h4 className="text-[11px] sm:text-xs uppercase font-medium tracking-wider text-amber-300/90 mt-1 mb-2.5">
                      {item.subtitle}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Empty side for layout alignment on desktop */}
                <div className="hidden sm:block sm:w-1/2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dress Code & Protocol Card */}
      <div className="mt-10 sm:mt-16 max-w-4xl mx-auto glass-panel rounded-2xl p-5 sm:p-8 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 pb-5 sm:pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Official Protocol & Dress Code</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-editorial-serif">
              Gala Standards for the Class of 2026
            </h3>
          </div>
          <div className="px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
            Semi-Formal / Black-Tie
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-5 sm:mt-6">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
              Gentlemen Attire
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tuxedos, formal suits, tailored blazers with trousers, or distinguished traditional Indian Bandhgalas / Kurta-Jacket ensembles. Formal shoes required.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
              Ladies Attire
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evening floor-length gowns, cocktail dresses, designer sarees, or elegant Indo-Western evening wear. Comfortable formal footwear recommended for the lawn.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 sm:pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] sm:text-xs text-slate-400 gap-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Entry strictly restricted to registered SSDS Class 10 students carrying their official digital pass.</span>
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
            SSDS / AMBEGAON / 2026
          </span>
        </div>
      </div>

    </section>
  );
};
