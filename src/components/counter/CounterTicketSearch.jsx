import { useState, useRef, useEffect } from 'react';
import ticketService from '@services/ticket.service';
import { mapApiTicket } from '@data/ticketScanner';
import CounterTicketStatus from './CounterTicketStatus';

/**
 * Recherche en temps réel via l'API réelle (GET /tickets?recherche=…).
 * Recherche : référence, ID, code-barres, nom/téléphone du client,
 * référence de réservation, code du voyage.
 */
const CounterTicketSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return undefined;
    const requestId = ++requestRef.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await ticketService.search(q, 1, 8);
        if (requestRef.current !== requestId) return;
        setResults((data.items || []).map(mapApiTicket));
        setShowResults(true);
      } catch {
        if (requestRef.current === requestId) setResults([]);
      } finally {
        if (requestRef.current === requestId) setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      setLoading(false);
    }
  };

  const handleSelect = (ticket) => {
    setShowResults(false);
    setQuery('');
    onSelect?.(ticket);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className="acv-search-input-group">
        <i className="bi bi-search acv-search-input-icon" />
        <input
          className="acv-search-input"
          placeholder="Rechercher un billet (référence, nom, téléphone, siège)..."
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        {loading && (
          <i className="bi bi-arrow-repeat acv-search-input-spinner" />
        )}
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
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{t.trip.from} → {t.trip.to} · Siège {t.bus.seat}</div>
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
