import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import CounterBookingCard from './CounterBookingCard';
import {
  quickFind,
  bookingRoutes,
  bookingCompanyOptions,
  bookingBusOptions,
  bookingStatusOptions,
  bookingSalePointOptions,
  bookingTimeOptions,
} from '@data/counterBookingData';

const CounterBookingFilters = ({ filters, onFilterChange, onReset, onNewBooking }) => {
  const [open, setOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const [quickResults, setQuickResults] = useState([]);
  const [showQuick, setShowQuick] = useState(false);
  const quickRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (quickRef.current && !quickRef.current.contains(e.target)) {
        setShowQuick(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickSearch = (e) => {
    const q = e.target.value;
    setQuickQuery(q);
    if (q.trim().length >= 2) {
      const results = quickFind(q);
      setQuickResults(results.slice(0, 8));
      setShowQuick(true);
    } else {
      setQuickResults([]);
      setShowQuick(false);
    }
  };

  const handleQuickSelect = (booking) => {
    setShowQuick(false);
    setQuickQuery('');
    onFilterChange?.('viewBooking', booking);
  };

  const handleChange = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  const activeCount = Object.entries(filters || {}).filter(
    ([k, v]) => v && k !== 'search' && v !== ''
  ).length;

  return (
    <div className="acb-filters">
      <div className="acb-filters-header">
        <div className="acb-filters-header-left">
          <i className="bi bi-funnel" />
          <span>Filtres</span>
          {activeCount > 0 && (
            <span style={{
              background: '#FF6B35', color: '#fff', borderRadius: 12,
              padding: '1px 8px', fontSize: 11, fontWeight: 600, marginLeft: 4
            }}>
              {activeCount}
            </span>
          )}
        </div>
        <div className="acb-filters-header-right">
          <button className="acb-btn acb-btn-secondary acb-btn-sm" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
          </button>
          <button className="acb-btn acb-btn-primary acb-btn-sm" onClick={onNewBooking}>
            <i className="bi bi-plus-lg" /> Nouvelle réservation
          </button>
          <button
            className={clsx('acb-filters-toggle', { open })}
            onClick={() => setOpen(!open)}
          >
            <i className="bi bi-chevron-down" />
          </button>
        </div>
      </div>

      <div className={clsx('acb-filters-body', { open })}>
        <div className="acb-filters-grid">
          <div className="acb-filter-group">
            <label className="acb-filter-label">Trajet</label>
            <select className="acb-filter-select" value={filters?.route || ''} onChange={(e) => handleChange('route', e.target.value)}>
              {bookingRoutes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="acb-filter-group">
            <label className="acb-filter-label">Compagnie</label>
            <select className="acb-filter-select" value={filters?.company || ''} onChange={(e) => handleChange('company', e.target.value)}>
              {bookingCompanyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="acb-filter-group">
            <label className="acb-filter-label">Bus</label>
            <select className="acb-filter-select" value={filters?.bus || ''} onChange={(e) => handleChange('bus', e.target.value)}>
              {bookingBusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="acb-filter-group">
            <label className="acb-filter-label">Date</label>
            <input type="date" className="acb-filter-input" value={filters?.date || ''} onChange={(e) => handleChange('date', e.target.value)} />
          </div>
          <div className="acb-filter-group">
            <label className="acb-filter-label">Heure</label>
            <select className="acb-filter-select" value={filters?.timeRange || ''} onChange={(e) => handleChange('timeRange', e.target.value)}>
              {bookingTimeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="acb-filter-group">
            <label className="acb-filter-label">Statut</label>
            <select className="acb-filter-select" value={filters?.status || ''} onChange={(e) => handleChange('status', e.target.value)}>
              {bookingStatusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="acb-filter-group">
            <label className="acb-filter-label">Point de vente</label>
            <select className="acb-filter-select" value={filters?.salePoint || ''} onChange={(e) => handleChange('salePoint', e.target.value)}>
              {bookingSalePointOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="acb-active-filters">
          {Object.entries(filters || {}).map(([k, v]) => {
            if (!v || k === 'search' || v === '') return null;
            return (
              <span key={k} className="acb-active-filter">
                {k === 'route' ? 'Trajet' : k === 'company' ? 'Compagnie' : k === 'bus' ? 'Bus' :
                 k === 'date' ? 'Date' : k === 'timeRange' ? 'Heure' : k === 'status' ? 'Statut' :
                 k === 'salePoint' ? 'Point de vente' : k}: {v}
                <button onClick={() => handleChange(k, '')}><i className="bi bi-x" /></button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CounterBookingFilters;
