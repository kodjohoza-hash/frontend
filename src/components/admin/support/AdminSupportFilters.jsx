import React from 'react';
import { supportCategories, supportPriorities, supportStatuses, supportAgents } from '../../../data/adminSupportData';

const AdminSupportFilters = ({ filters, onChange, onReset }) => {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  return (
    <div className="ads-controls">
      <input className="ads-control-input" style={{ flex: 1, minWidth: 160 }} placeholder="Rechercher un ticket..." value={filters.search} onChange={e => set('search', e.target.value)} />
      <div className="ads-control-group"><label>N° Ticket</label><input className="ads-control-input" style={{ minWidth: 90, width: 90 }} placeholder="TKT-" value={filters.ticketNumber} onChange={e => set('ticketNumber', e.target.value)} /></div>
      <div className="ads-control-group"><label>Catégorie</label><select className="ads-control-select" value={filters.category} onChange={e => set('category', e.target.value)}><option value="">Toutes</option>{supportCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
      <div className="ads-control-group"><label>Priorité</label><select className="ads-control-select" value={filters.priority} onChange={e => set('priority', e.target.value)}><option value="">Toutes</option>{supportPriorities.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div>
      <div className="ads-control-group"><label>Statut</label><select className="ads-control-select" value={filters.status} onChange={e => set('status', e.target.value)}><option value="">Tous</option>{supportStatuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
      <div className="ads-control-group"><label>Assigné</label><select className="ads-control-select" value={filters.assignedTo} onChange={e => set('assignedTo', e.target.value)}><option value="">Tous</option><option value="unassigned">Non assigné</option><option value="assigned">Assigné</option>{supportAgents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
      <button className="ads-control-btn" onClick={onReset}><i className="fas fa-undo" /> Réinitialiser</button>
    </div>
  );
};
export default AdminSupportFilters;
