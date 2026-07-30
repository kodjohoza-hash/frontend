import React from 'react';
import { actionTypes, moduleOptions, severityConfig, statusOptions } from '../../../data/adminAuditData';

const AdminAuditFilters = ({ filters, setFilters, onReset }) => {
  const handle = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <div className="ada-controls">
      <input
        className="ada-control-input"
        placeholder="Rechercher..."
        value={filters.search}
        onChange={e => handle('search', e.target.value)}
        style={{ minWidth: 200 }}
      />

      <div className="ada-control-group">
        <label>Action</label>
        <select value={filters.action} onChange={e => handle('action', e.target.value)}>
          <option value="">Toutes</option>
          {actionTypes.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </div>

      <div className="ada-control-group">
        <label>Module</label>
        <select value={filters.module} onChange={e => handle('module', e.target.value)}>
          <option value="">Tous</option>
          {moduleOptions.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="ada-control-group">
        <label>Gravité</label>
        <select value={filters.severity} onChange={e => handle('severity', e.target.value)}>
          <option value="">Toutes</option>
          {Object.entries(severityConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="ada-control-group">
        <label>Statut</label>
        <select value={filters.status} onChange={e => handle('status', e.target.value)}>
          <option value="">Tous</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="ada-control-group">
        <label>Du</label>
        <input type="date" value={filters.dateFrom} onChange={e => handle('dateFrom', e.target.value)} />
      </div>

      <div className="ada-control-group">
        <label>Au</label>
        <input type="date" value={filters.dateTo} onChange={e => handle('dateTo', e.target.value)} />
      </div>

      <button className="ada-control-btn ada-control-btn-outline" onClick={onReset}>
        <i className="fas fa-undo" /> Réinitialiser
      </button>

      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
        <i className="fas fa-filter" /> Filtrer
      </span>
    </div>
  );
};

export default AdminAuditFilters;
