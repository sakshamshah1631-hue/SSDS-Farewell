import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SSDS Farewell UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          background: '#070b14',
          color: '#f8fafc',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '12px', fontWeight: 600 }}>
            Sinhagad Spring Dale School, Ambegaon
          </h1>
          <p style={{ maxWidth: '480px', marginBottom: '20px', lineHeight: 1.6, color: '#94a3b8' }}>
            We encountered a temporary loading error. Please refresh or try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            Reload Event Portal
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
