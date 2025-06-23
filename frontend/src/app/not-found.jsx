'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#7c3aed',
        gap: '1.5rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>404</h1>
      <p style={{ fontSize: '1.25rem' }}>This page could not be found.</p>

      <button
        onClick={handleBack}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#7c3aed',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Go back
      </button>
    </div>
  );
}
