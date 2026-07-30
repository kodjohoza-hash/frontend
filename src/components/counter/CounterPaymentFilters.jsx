import { useState } from 'react';
import clsx from 'clsx';
import { paymentFilterOptions } from '@data/counterPaymentData';

const CounterPaymentFilters = ({ filters, onFilterChange, onReset }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  const activeCount = Object.entries(filters || {}).filter(
    ([k, v]) => v && k !== 'search' && v !== ''
  ).length;

  return (
    <div className="acp-filters">
      <div className="acp-filters-header">
        <div className="acp-filters-header-left">
          <i className="bi bi-funnel" /> Filtres
          {activeCount > 0 && (
            <span style={{ background: '#FF6B35', color: '#fff', borderRadius: 12, padding: '1px 8px', fontSize: 11, fontWeight: 600 }}>
              {activeCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="acp-btn acp-btn-secondary acp-btn-sm" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
          </button>
          <button className={clsx('acp-filters-toggle', { open })} onClick={() => setOpen(!open)}>
            <i className="bi bi-chevron-down" />
          </button>
        </div>
      </div>
      <div className={clsx('acp-filters-body', { open })}>
        <div className="acp-filters-grid">
          <div className="acp-filter-group">
            <label className="acp-filter-label">Mode de paiement</label>
            <select className="acp-filter-select" value={filters?.method || ''} onChange={(e) => handleChange('method', e.target.value)}>
              {paymentFilterOptions.methods.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="acp-filter-group">
            <label className="acp-filter-label">Statut</label>
            <select className="acp-filter-select" value={filters?.status || ''} onChange={(e) => handleChange('status', e.target.value)}>
              {paymentFilterOptions.statuses.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="acp-filter-group">
            <label className="acp-filter-label">Date</label>
            <input type="date" className="acp-filter-input" value={filters?.date || ''} onChange={(e) => handleChange('date', e.target.value)} />
          </div>
          <div className="acp-filter-group">
            <label className="acp-filter-label">Montant min</label>
            <input type="number" className="acp-filter-input" placeholder="0" value={filters?.amountMin || ''} onChange={(e) => handleChange('amountMin', e.target.value)} />
          </div>
          <div className="acp-filter-group">
            <label className="acp-filter-label">Montant max</label>
            <input type="number" className="acp-filter-input" placeholder="100000" value={filters?.amountMax || ''} onChange={(e) => handleChange('amountMax', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterPaymentFilters;
