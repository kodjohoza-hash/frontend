import React from 'react';
import { agentStatuses, agentRoles, agencies, pointsDeVente } from '../../data/agencyCounterAgentData';

export default function AgencyCounterAgentFilters({ filters, onChange, onReset }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="ac-filters">
      <div className="ac-filters__row">
        <div className="ac-filters__field ac-filters__field--search">
          <i className="bi bi-search ac-filters__search-icon" />
          <input
            type="text"
            className="ac-filters__input"
            placeholder="Nom, prénom, téléphone ou email…"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
        <div className="ac-filters__field">
          <label className="ac-filters__label">Agence</label>
          <select
            className="ac-filters__select"
            value={filters.agency || ''}
            onChange={(e) => handleChange('agency', e.target.value)}
          >
            <option value="">Toutes</option>
            {agencies.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="ac-filters__field">
          <label className="ac-filters__label">Point de vente</label>
          <select
            className="ac-filters__select"
            value={filters.pointDeVente || ''}
            onChange={(e) => handleChange('pointDeVente', e.target.value)}
          >
            <option value="">Tous</option>
            {pointsDeVente.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="ac-filters__field">
          <label className="ac-filters__label">Statut</label>
          <select
            className="ac-filters__select"
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Tous</option>
            {agentStatuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="ac-filters__field">
          <label className="ac-filters__label">Rôle</label>
          <select
            className="ac-filters__select"
            value={filters.role || ''}
            onChange={(e) => handleChange('role', e.target.value)}
          >
            <option value="">Tous</option>
            {agentRoles.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <button className="ac-filters__reset" onClick={onReset}>
          <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
        </button>
      </div>
    </div>
  );
}
