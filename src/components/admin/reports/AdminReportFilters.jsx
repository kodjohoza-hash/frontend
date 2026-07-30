import React from 'react';
import { periodPresets } from '../../../data/adminReportData';

const AdminReportFilters = ({ filters, setFilters, companies, onRefresh, onReset }) => {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="adbi-controls">
      <div className="adbi-control-group">
        <label>Période</label>
        <select value={filters.period} onChange={e => handleChange('period', e.target.value)}>
          {periodPresets.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>

      {filters.period === 'custom' && (
        <>
          <div className="adbi-control-group">
            <label>Du</label>
            <input type="date" value={filters.dateFrom || ''} onChange={e => handleChange('dateFrom', e.target.value)} />
          </div>
          <div className="adbi-control-group">
            <label>Au</label>
            <input type="date" value={filters.dateTo || ''} onChange={e => handleChange('dateTo', e.target.value)} />
          </div>
        </>
      )}

      <div className="adbi-control-divider" />

      <div className="adbi-control-group">
        <label>Compagnie</label>
        <select value={filters.company} onChange={e => handleChange('company', e.target.value)}>
          <option value="">Toutes</option>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="adbi-control-group">
        <label>Ville</label>
        <select value={filters.city} onChange={e => handleChange('city', e.target.value)}>
          <option value="">Toutes</option>
          <option value="Douala">Douala</option>
          <option value="Yaoundé">Yaoundé</option>
          <option value="Bafoussam">Bafoussam</option>
          <option value="Kribi">Kribi</option>
        </select>
      </div>

      <div className="adbi-control-divider" />

      <div className="adbi-control-group">
        <label>Statut</label>
        <select value={filters.status} onChange={e => handleChange('status', e.target.value)}>
          <option value="">Tous</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      <button className="adbi-control-btn" onClick={onRefresh} title="Rafraîchir">
        <i className="fas fa-rotate" /> Actualiser
      </button>

      <button className="adbi-control-btn adbi-control-btn-outline" onClick={onReset} title="Réinitialiser">
        <i className="fas fa-undo" /> Réinitialiser
      </button>
    </div>
  );
};

export default AdminReportFilters;
