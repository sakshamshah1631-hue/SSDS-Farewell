import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Filter, Music, Users, Moon } from 'lucide-react';
import { AtmosphereItem } from '../types';

export const AtmosphereGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const galleryItems: AtmosphereItem[] = [
    {
      id: 'atm-1',
      title: 'Starlight Lawn Dance Stage',
      subtitle: 'Concert Lighting & Acoustic Zone',
      caption: 'Dynamic cyan and amber wash lights illuminating the open lawn dance floor as the Class of 2026 gathers for the celebration.',
      tag: 'dance',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=70&w=600&auto=format&fit=crop',
    },
    {
      id: 'atm-2',
      title: 'Festoon Canopy Over Banquets',
      subtitle: 'Open-Air Lawn Dining Ambiance',
      caption: 'Warm starlight string lights suspended across manicured green lawns, creating an upscale dinner setting under the Pune night sky.',
      tag: 'lawn',
      imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=70&w=600&auto=format&fit=crop',
    },
    {
      id: 'atm-3',
      title: 'Red Carpet Entrance & Step-and-Repeat',
      subtitle: 'Formal Student Arrival Protocol',
      caption: 'Students arrive in tailored suits and evening gowns, welcomed by the camera flashes of official school photojournalists.',
      tag: 'milestone',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=70&w=600&auto=format&fit=crop',
    },
    {
      id: 'atm-4',
      title: 'Live DJ & Disco Light Show',
      subtitle: 'Curated Batch Anthems',
      caption: 'Bass-heavy sound arrays and atmospheric hazers casting crisp azure beams across the celebration grounds.',
      tag: 'dance',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=70&w=600&auto=format&fit=crop',
    },
    {
      id: 'atm-5',
      title: 'Shared Laughter & Reunion Corners',
      subtitle: 'A Decade of Friendship',
      caption: 'Classmates from Div A to Div G reflecting on tenth standard memories, board exam prep, and ten years together at SSDS Ambegaon.',
      tag: 'milestone',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=70&w=600&auto=format&fit=crop',
    },
    {
      id: 'atm-6',
      title: 'Midnight Toast & Starlight Send-Off',
      subtitle: 'The Final Class 10 Gathering',
      caption: 'A heartfelt final countdown surrounded by sparkling lights as our students prepare to step forward into higher secondary milestones.',
      tag: 'lawn',
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=70&w=600&auto=format&fit=crop',
    },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.tag === activeCategory);

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-cyan-300 text-xs tracking-widest uppercase font-semibold mb-3">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Curated Event Atmosphere</span>
        </div>
        <h2 className="font-editorial-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Lawn Gala & Starlight Disco
        </h2>
        <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
          Glimpses of the refined evening aesthetic: festoon illumination, open dance floor acoustics, red carpet steps, and timeless camaraderie.
        </p>

        {/* Filter Pill Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { id: 'all', label: 'All Perspectives', icon: <Filter className="w-3 h-3" /> },
            { id: 'lawn', label: 'Evening Lawns', icon: <Moon className="w-3 h-3" /> },
            { id: 'dance', label: 'Disco & Dance Floor', icon: <Music className="w-3 h-3" /> },
            { id: 'milestone', label: 'Class Milestones', icon: <Users className="w-3 h-3" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid with Asymmetric Heights & Editorial Captions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="group relative glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/40 transition-all duration-500 flex flex-col"
          >
            {/* Image Container with Hover Scale */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                style={{
                  // Color grading filter: ensures strictly no purple/magenta tint, aligns with cyan & warm amber
                  filter: 'contrast(1.08) brightness(0.85) hue-rotate(170deg) saturate(1.1)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/30 to-transparent opacity-85 group-hover:opacity-70 transition-opacity" />

              {/* Tag Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-midnight-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                  {item.tag}
                </span>
              </div>
            </div>

            {/* Editorial Content Below */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-midnight-900/60">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-amber-300/90 font-semibold block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="font-editorial-serif text-lg font-bold text-white group-hover:text-cyan-200 transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {item.caption}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>SSDS Ambegaon Lawn Gala</span>
                <span className="font-mono">NO. 0{index + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
