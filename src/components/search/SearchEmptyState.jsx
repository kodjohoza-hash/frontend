import React from 'react';

const SearchEmptyState = React.memo(({ onModifySearch }) => (
  <div
    role="status"
    aria-label="Aucun voyage trouvé"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
    }}
  >
    {/* CSS Bus Illustration */}
    <div
      style={{
        width: 160,
        height: 140,
        position: 'relative',
        marginBottom: 32,
        animation: 'btc-float 3s ease-in-out infinite',
      }}
      aria-hidden="true"
    >
      {/* Bus body */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: 20,
          width: 120,
          height: 68,
          borderRadius: '16px 16px 8px 8px',
          background: 'linear-gradient(135deg, var(--color-primary, #0B1D51) 0%, #1a2d6a 100%)',
          boxShadow: '0 8px 24px rgba(11, 29, 81, 0.2)',
        }}
      >
        {/* Window row */}
        <div style={{ display: 'flex', gap: 6, padding: '12px 12px 0' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 28,
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(4px)',
              }}
            />
          ))}
        </div>
        {/* Door */}
        <div
          style={{
            position: 'absolute',
            right: 12,
            top: 12,
            width: 20,
            height: 40,
            borderRadius: '4px 4px 0 0',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
      </div>

      {/* Windshield */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 10,
          width: 24,
          height: 36,
          borderRadius: '8px 0 0 0',
          background: 'rgba(255, 255, 255, 0.12)',
          transform: 'skewY(-5deg)',
        }}
      />

      {/* Front wheel */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 36,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--color-gray-700, #374151)',
          border: '3px solid var(--color-gray-400, #9ca3af)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-gray-300, #d1d5db)' }} />
      </div>

      {/* Rear wheel */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          right: 28,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--color-gray-700, #374151)',
          border: '3px solid var(--color-gray-400, #9ca3af)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-gray-300, #d1d5db)' }} />
      </div>

      {/* Headlight */}
      <div
        style={{
          position: 'absolute',
          bottom: 52,
          left: 10,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#FBBF24',
          boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)',
        }}
      />

      {/* Exhaust puffs */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 8,
          width: 16,
          height: 12,
          borderRadius: '50%',
          background: 'rgba(156, 163, 175, 0.2)',
          animation: 'btc-puff 2s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 26,
          right: 0,
          width: 12,
          height: 10,
          borderRadius: '50%',
          background: 'rgba(156, 163, 175, 0.15)',
          animation: 'btc-puff 2s ease-in-out infinite 0.3s',
        }}
      />
    </div>

    {/* Title */}
    <h3
      style={{
        fontSize: '1.35rem',
        fontWeight: 700,
        color: 'var(--text-primary, #111827)',
        margin: '0 0 12px',
        letterSpacing: '-0.02em',
      }}
    >
      Aucun voyage trouvé
    </h3>

    {/* Description */}
    <p
      style={{
        fontSize: 'var(--font-size-sm, 0.875rem)',
        color: 'var(--text-secondary, #4b5563)',
        maxWidth: 400,
        margin: '0 0 28px',
        lineHeight: 1.6,
      }}
    >
      Aucun voyage ne correspond à vos critères de recherche.
      Essayez de modifier vos filtres ou votre recherche pour trouver
      le trajet idéal.
    </p>

    {/* CTA */}
    <button
      onClick={onModifySearch}
      aria-label="Modifier la recherche"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 28px',
        borderRadius: 14,
        border: 'none',
        background: 'var(--color-accent, #FF6B35)',
        color: '#fff',
        fontSize: 'var(--font-size-sm, 0.875rem)',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.25)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 107, 53, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.25)';
      }}
    >
      <i className="bi bi-pencil-square" style={{ fontSize: '0.85rem' }} />
      Modifier la recherche
    </button>

    <style>{`
      @keyframes btc-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes btc-puff {
        0% { opacity: 0; transform: scale(0.8) translateX(0); }
        50% { opacity: 1; transform: scale(1.2) translateX(6px); }
        100% { opacity: 0; transform: scale(0.8) translateX(12px); }
      }
    `}</style>
  </div>
));

SearchEmptyState.displayName = 'SearchEmptyState';

export default SearchEmptyState;
