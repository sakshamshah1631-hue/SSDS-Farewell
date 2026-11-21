import React from 'react';
import { Award, Quote, Sparkles } from 'lucide-react';

export const Reflections: React.FC = () => {
  const testimonials = [
    {
      name: 'Tanvi More',
      division: 'Class 10, Div A',
      quote:
        'From running up the Ambegaon school hill in fifth standard to facing our preliminary board exams together, these classrooms shaped who we are. This farewell marks the transition into our next chapter.',
      role: 'Student Council Representative',
    },
    {
      name: 'Aarav Deshmukh',
      division: 'Class 10, Div B',
      quote:
        'The inter-house athletics, science exhibitions, and lunchtime debates on the corridors created bonds that no distance can undo. Proud to graduate as the SSDS Class of 2026.',
      role: 'House Captain',
    },
    {
      name: 'Isha Joshi',
      division: 'Class 10, Div D',
      quote:
        'Our teachers never just taught textbooks; they taught us grit, curiosity, and mutual respect. Celebrating one final evening under the stars together is the highest tribute to these years.',
      role: 'Editorial Club Lead',
    },
    {
      name: 'Rohan Patil',
      division: 'Class 10, Div C',
      quote:
        'Walking onto that lawn dance floor surrounded by the classmates who stood by you through every exam and every victory is going to be unforgettable.',
      role: 'Sports Vice Captain',
    },
  ];

  return (
    <section id="reflections" className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 text-[10px] sm:text-xs tracking-wider uppercase font-semibold mb-2.5 sm:mb-3">
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>Voices of the Batch</span>
        </div>
        <h2 className="font-editorial-serif text-2xl sm:text-5xl font-bold text-white tracking-tight">
          Class 10 Reflections
        </h2>
        <p className="mt-3 sm:mt-4 text-slate-400 text-xs sm:text-base leading-relaxed px-2">
          Ten years of shared academic rigor, athletic spirit, and lifelong friendships at Sinhagad Spring Dale School, Ambegaon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="glass-panel rounded-2xl p-4 sm:p-7 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 relative group flex flex-col justify-between"
          >
            <div>
              <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-500/20 mb-3 sm:mb-4 group-hover:text-cyan-400/40 transition-colors" />
              <p className="text-xs sm:text-base text-slate-300 font-light italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white font-editorial-serif tracking-wide">
                  {item.name}
                </h4>
                <p className="text-[11px] sm:text-xs text-amber-300/90 font-medium">
                  {item.division}
                </p>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono tracking-wider bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800 self-start sm:self-auto">
                {item.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
