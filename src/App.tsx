import React, { useState, useEffect } from 'react';
import { ActiveView, StudentRegistration, VenueConfig } from './types';
import {
  getRegistrations,
  getVenueConfig,
} from './lib/storage';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Itinerary } from './components/Itinerary';
import { VenueSection } from './components/VenueSection';
import { AtmosphereGallery } from './components/AtmosphereGallery';
import { Reflections } from './components/Reflections';
import { RegistrationView } from './components/RegistrationView';
import { AdminView } from './components/AdminView';
import { PassModal } from './components/PassModal';
import { TicketView } from './components/TicketView';
import { MobileQuickBar } from './components/MobileQuickBar';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [venueConfig, setVenueConfig] = useState<VenueConfig>(() => getVenueConfig());
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(() => getRegistrations());
  const [passModalStudent, setPassModalStudent] = useState<StudentRegistration | null>(null);

  // Check URL query parameter for QR scan redirection (e.g. ?ticket=SSDS-X-2026-1042)
  const [scannedTicketId, setScannedTicketId] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('ticket') || params.get('pass') || null;
    } catch {
      return null;
    }
  });

  // Sync scroll on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView, scannedTicketId]);

  const handleRegistrationSuccess = () => {
    setRegistrations(getRegistrations());
  };

  const handleVenueConfigUpdated = (newConfig: VenueConfig) => {
    setVenueConfig(newConfig);
  };

  const handlePassIssued = () => {
    setRegistrations(getRegistrations());
  };

  const handleCloseScannedTicket = () => {
    // Clear URL query without full reload
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('ticket');
      url.searchParams.delete('pass');
      window.history.replaceState({}, '', url.pathname);
    } catch {
      // safe fallback
    }
    setScannedTicketId(null);
  };

  // If a student or guard scans a QR code, immediately render the full Ticket Image view!
  if (scannedTicketId) {
    return (
      <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/20 selection:text-cyan-200">
        <AtmosphericBackground />
        <TicketView
          passId={scannedTicketId}
          onBackToHome={handleCloseScannedTicket}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/20 selection:text-cyan-200">
      
      {/* Dynamic Ambient Background: Starlight Motes, Bokeh Orbs & Ribbons (Strictly NO Purple) */}
      <AtmosphericBackground />

      {/* Institutional Navigation Header (No ambient sound/chime) */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        registeredCount={registrations.length}
      />

      {/* Main Routed Content Views */}
      <main className="flex-1 relative z-10 pb-12 sm:pb-0">
        {activeView === 'home' && (
          <div className="space-y-4">
            <Hero
              venueConfig={venueConfig}
              setActiveView={setActiveView}
              registeredCount={registrations.length}
            />
            <Itinerary />
            <VenueSection venueConfig={venueConfig} />
            <AtmosphereGallery />
            <Reflections />
          </div>
        )}

        {activeView === 'register' && (
          <RegistrationView
            venueConfig={venueConfig}
            setActiveView={setActiveView}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        )}

        {activeView === 'admin' && (
          <AdminView
            venueConfig={venueConfig}
            onVenueConfigUpdated={handleVenueConfigUpdated}
            setActiveView={setActiveView}
            onSelectStudentForPass={(student) => setPassModalStudent(student)}
          />
        )}
      </main>

      {/* Reusable Digital Pass Preview & Direct Download Modal */}
      <PassModal
        student={passModalStudent}
        venueConfig={venueConfig}
        onClose={() => setPassModalStudent(null)}
        onPassIssued={handlePassIssued}
      />

      {/* Mobile Floating Quick Action Pill */}
      <MobileQuickBar
        activeView={activeView}
        setActiveView={setActiveView}
        registeredCount={registrations.length}
      />

      {/* Formal Institutional Footer */}
      <Footer setActiveView={setActiveView} />

    </div>
  );
};

export default App;
