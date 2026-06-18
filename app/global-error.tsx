'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          margin: 0,
          backgroundColor: '#020510',
          color: '#e2f4ff',
          fontFamily: 'sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>
            System Error
          </h2>
          <p style={{ color: '#4a6a80', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Something went wrong. Please refresh the page.
          </p>
          <button
            onClick={reset}
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0066ff)',
              border: 'none',
              borderRadius: '0.75rem',
              color: '#020510',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.625rem 1.5rem',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
