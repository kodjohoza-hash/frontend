import React from 'react';
import { supportCategories, supportPriorities, supportStatuses, supportUsers } from '../../../data/adminSupportData';

const catMap = {}; supportCategories.forEach(c => catMap[c.id] = c);
const prioMap = {}; supportPriorities.forEach(p => prioMap[p.id] = p);
const statMap = {}; supportStatuses.forEach(s => statMap[s.id] = s);
const userMap = {}; supportUsers.forEach(u => userMap[u.id] = u);

const avatarColors = ['#8B5CF6','#3B82F6','#10B981','#F59E0B','#EF4444','#EC4899','#14B8A6','#F97316','#6366F1','#FBBF24'];

const AdminSupportTable = ({ tickets, onSelect, selectedId, onAssign, onStatusChange, onView }) => (
  <div className="ads-table-wrapper">
    <table className="ads-table">
      <thead>
        <tr>
          <th>Ticket</th>
          <th>Sujet</th>
          <th>Catégorie</th>
          <th>Priorité</th>
          <th>Statut</th>
          <th>Assigné</th>
          <th>Création</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tickets.length === 0 ? (
          <tr><td colSpan={8}><div className="ads-empty"><i className="fas fa-ticket" /><p>Aucun ticket trouvé</p></div></td></tr>
        ) : tickets.map((t, i) => {
          const cat = catMap[t.category] || { label: t.category, icon: 'fa-tag', color: '#6B7280' };
          const prio = prioMap[t.priority] || { label: t.priority, color: '#6B7280', bg: 'rgba(107,114,128,0.12)' };
          const stat = statMap[t.status] || { label: t.status, color: '#6B7280', bg: 'rgba(107,114,128,0.12)' };
          const user = userMap[t.user] || { avatar: '??', name: t.user };
          return (
            <tr key={t.id} className={selectedId === t.id ? 'selected' : ''} onClick={() => onSelect?.(t)} style={{ animation: `ads-toast-in 0.3s ease-out ${i * 0.025}s both` }}>
              <td style={{ fontWeight: 500, color: '#8B5CF6', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{t.id}</td>
              <td>
                <div className="ads-subject-text">{t.subject}</div>
                <div className="ads-subject-meta">
                  <span>{user.name}</span>
                  <span>·</span>
                  <span>{t.company !== '—' ? t.company : 'Client'}</span>
                </div>
              </td>
              <td><span className="ads-badge" style={{ background: `${cat.color}15`, color: cat.color }}><i className={`fas ${cat.icon}`} /> {cat.label}</span></td>
              <td><span className="ads-badge" style={{ background: prio.bg, color: prio.color }}>{prio.label}</span></td>
              <td><span className="ads-badge" style={{ background: stat.bg, color: stat.color }}><i className={`fas ${stat.icon}`} /> {stat.label}</span></td>
              <td>
                {t.assignedTo ? (() => {
                  const a = [...supportUsers, ...[{ id: 'agent_001', name: 'Admin Guillaume', avatar: 'AG' }, { id: 'agent_002', name: 'Admin Douala', avatar: 'AD' }, { id: 'agent_003', name: 'Admin Yaoundé', avatar: 'AY' }, { id: 'agent_004', name: 'Support L1', avatar: 'S1' }, { id: 'agent_005', name: 'Support L2', avatar: 'S2' }]].find(u => u.id === t.assignedTo);
                  return <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span className="ads-avatar-sm" style={{ background: avatarColors[Array.prototype.findIndex.call([...supportUsers, { id: 'agent_001' }, { id: 'agent_002' }, { id: 'agent_003' }, { id: 'agent_004' }, { id: 'agent_005' }], u => u.id === t.assignedTo) % avatarColors.length] || '#8B5CF6' }}>{a?.avatar || '?'}</span><span style={{ fontSize: '0.75rem' }}>{a?.name || t.assignedTo}</span></span>;
                })() : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>—</span>}
              </td>
              <td style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{t.createdAt}</td>
              <td onClick={e => e.stopPropagation()}>
                <div className="ads-action-group">
                  <button className="ads-table-action" title="Voir" onClick={() => onView?.(t)}><i className="fas fa-eye" /></button>
                  <button className="ads-table-action" title="Assigner" onClick={() => onAssign?.(t)}><i className="fas fa-user-plus" /></button>
                  <button className="ads-table-action" title="Changer statut" onClick={() => onStatusChange?.(t)}><i className="fas fa-arrow-right-arrow-left" /></button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
export default AdminSupportTable;
