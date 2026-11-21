import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Filter, Music, Users, Moon, X, Maximize2 } from 'lucide-react';
import { AtmosphereItem } from '../types';

export const AtmosphereGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<AtmosphereItem | null>(null);

  const galleryItems: AtmosphereItem[] = [
    {
      id: 'atm-1',
      title: 'Starlight Lawn Dance Stage',
      subtitle: 'Concert Lighting & Acoustic Zone',
      caption: 'Dynamic cyan and amber wash lights illuminating the open lawn dance floor as the Class of 2026 gathers for the celebration.',
      tag: 'dance',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=75&w=900&auto=format&fit=crop',
    },
    {
      id: 'atm-2',
      title: 'Festoon Canopy Over Banquets',
      subtitle: 'Open-Air Lawn Dining Ambiance',
      caption: 'Warm starlight string lights suspended across manicured green lawns, creating an upscale dinner setting under the Pune night sky.',
      tag: 'lawn',
      imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=75&w=900&auto=format&fit=crop',
    },
    {
      id: 'atm-3',
      title: 'Red Carpet Entrance & Step-and-Repeat',
      subtitle: 'Formal Student Arrival Protocol',
      caption: 'Students arrive in tailored suits and evening gowns, welcomed by the camera flashes of official school photojournalists.',
      tag: 'milestone',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=75&w=900&auto=format&fit=crop',
    },
    {
      id: 'atm-4',
      title: 'Live DJ & Disco Light Show',
      subtitle: 'Curated Batch Anthems',
      caption: 'Bass-heavy sound arrays and atmospheric hazers casting crisp azure beams across the celebration grounds.',
      tag: 'dance',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=75&w=900&auto=format&fit=crop',
    },
    {
      id: 'atm-5',
      title: 'Shared Laughter & Reunion Corners',
      subtitle: 'A Decade of Friendship',
      caption: 'Classmates from Div A to Div G reflecting on tenth standard memories, board exam prep, and ten years together at SSDS Ambegaon.',
      tag: 'milestone',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=75&w=900&auto=format&fit=crop',
    },
    {
      id: 'atm-6',
      title: 'Midnight Toast & Starlight Send-Off',
      subtitle: 'The Final Class 10 Gathering',
      caption: 'A heartfelt final countdown surrounded by sparkling lights as our students prepare to step forward into higher secondary milestones.',
      tag: 'lawn',
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=75&w=900&auto=format&fit=crop',
    },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.tag === activeCategory);

  return (
    <section id="gallery" className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-cyan-300 text-[10px] sm:text-xs tracking-widest uppercase font-semibold mb-2.5">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Curated Event Atmosphere</span>
        </div>
        <h2 className="font-editorial-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Lawn Gala & Starlight Disco
        </h2>
        <p className="mt-2.5 sm:mt-4 text-slate-400 text-xs sm:text-base leading-relaxed px-2">
          Glimpses of the refined evening aesthetic: festoon illumination, open dance floor acoustics, red carpet steps, and timeless camaraderie.
        </p>

        {/* Mobile-Friendly Filter Pills: Fits comfortably on mobile and desktop */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6 px-1">
          {[
            { id: 'all', shortLabel: 'All', label: 'All Moments', icon: <Filter className="w-3 h-3" /> },
            { id: 'lawn', shortLabel: 'Lawns', label: 'Evening Lawns', icon: <Moon className="w-3 h-3" /> },
            { id: 'dance', shortLabel: 'Disco & DJ', label: 'Disco & Dance', icon: <Music className="w-3 h-3" /> },
            { id: 'milestone', shortLabel: 'Memories', label: 'Milestones', icon: <Users className="w-3 h-3" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all duration-200 shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.icon}
              <span className="sm:hidden">{cat.shortLabel}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid with Touch Tap Lightbox */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.99]"
          >
            {/* Image Container with Hover Scale */}
            <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                style={{
                  filter: 'contrast(1.08) brightness(0.85) hue-rotate(170deg) saturate(1.1)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/30 to-transparent opacity-85 group-hover:opacity-70 transition-opacity" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-midnight-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                  {item.tag}
                </span>
              </div>

              {/* Tap to Expand Hint */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-slate-300 group-hover:text-cyan-300 transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Editorial Content Below */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between bg-midnight-900/60">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-300/90 font-semibold block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="font-editorial-serif text-base sm:text-lg font-bold text-white group-hover:text-cyan-200 transition-colors mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {item.caption}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                <span>SSDS Lawn Gala</span>
                <span className="font-mono">NO. 0{index + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Mobile/Desktop Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-cyan-400/40 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 border border-slate-700 text-slate-200 hover:text-white"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[60vh] sm:max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
                style={{
                  filter: 'contrast(1.08) brightness(0.9) hue-rotate(170deg) saturate(1.1)',
                }}
              />
            </div>

            <div className="p-5 sm:p-6 bg-midnight-950/90 border-t border-slate-800">
              <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-amber-400 block mb-1">
                {selectedImage.subtitle}
              </span>
              <h3 className="font-editorial-serif text-lg sm:text-2xl font-bold text-white mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
