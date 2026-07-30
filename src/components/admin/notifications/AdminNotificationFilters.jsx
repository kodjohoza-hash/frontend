import React from 'react';
import { notifCategories } from '../../../data/adminNotificationData';

const catColors = [
  { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
  { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  { bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)' },
  { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
  { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
];

const AdminNotificationFilters = ({ cat, setCat, search, setSearch, channels, ch, setCh }) => (
  <div className="adn-controls">
    <div className="adn-control-group">
      <label>Catégorie</label>
      <select value={cat} onChange={e => setCat(e.target.value)}>
        <option value="all">Toutes</option>
        {notifCategories.map((c, i) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div className="adn-control-group">
      <label>Canal</label>
      <select value={ch} onChange={e => setCh(e.target.value)}>
        <option value="all">Tous</option>
        {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
    <input className="adn-control-input" style={{ flex: 1, minWidth: 180 }} placeholder="Rechercher une notification..." value={search} onChange={e => setSearch(e.target.value)} />
  </div>
);
export default AdminNotificationFilters;
