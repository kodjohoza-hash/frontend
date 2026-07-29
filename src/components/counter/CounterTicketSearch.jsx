import { useState, useRef, useEffect } from 'react';
import { searchTickets } from '@data/counterScannerData';
import CounterTicketStatus from './CounterTicketStatus';

const SEARCH_MODES = [
  { key: 'all', label: 'Tout', icon: 'bi-search' },
  { key: 'reference', label: 'Référence', icon: 'bi-upc-scan' },
  { key: 'name', label: 'Nom', icon: 'bi-person' },
  { key: 'phone', label: 'Téléphone', icon: 'bi-telephone' },
  { key: 'seat', label: 'Siège', icon: 'bi-grid-3x3' },
];

const CounterTicketSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('all');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.trim().length >= 2) {
      let res = searchTickets(q);
      if (mode !== 'all') {
        res = res.filter((t) => {
          const lq = q.toLowerCase();
          if (mode === 'reference') return t.reference.toLowerCase().includes(lq) || t.id.toLowerCase().includes(lq);
          if (mode === 'name') return t.passenger.name.toLowerCase().includes(lq);
          if (mode === 'phone') return t.passenger.phone.includes(lq);
          if (mode === 'seat') return t.bus.seat.toLowerCase().includes(lq);
          return true;
        });
      }
      setResults(res.slice(0, 10));
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (ticket) => {
    setShowResults(false);
    setQuery('');
    onSelect?.(ticket);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {SEARCH_MODES.map((m) => (
          <button
            key={m.key}
            style={{
              padding: '5px 12px', borderRadius: 6, border: '1px solid #E5E7EB',
              background: mode === m.key ? '#FF6B35' : '#fff',
              color: mode === m.key ? '#fff' : '#6B7280',
              fontWeight: 500, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
            }}
            onClick={() => setMode(m.key)}
          >
            <i className={`bi ${m.icon}`} style={{ marginRight: 4 }} />
            {m.label}
          </button>
        ))}
      </div>
      <div className="acv-search-input-group">
        <i className="bi bi-search acv-search-input-icon" />
        <input
          className="acv-search-input"
          placeholder="Rechercher un billet (référence, nom, téléphone, siège)..."
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
      </div>
      {showResults && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff',
          border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          maxHeight: 340, overflowY: 'auto', zIndex: 200, marginTop: 4,
        }}>
          {results.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                cursor: 'pointer', borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s',
              }}
              onClick={() => handleSelect(t)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0B1D51, #FF6B35)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 600, flexShrink: 0,
              }}>
                {t.passenger.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0B1D51' }}>{t.reference}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{t.passenger.name} — {t.passenger.phone}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{t.trip.from} → {t.trip.to} · {t.bus.seat}</div>
              </div>
              <CounterTicketStatus status={t.status} size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounterTicketSearch;
