import React from 'react';
import { supportCategories, supportPriorities, supportStatuses, supportUsers, supportAgents } from '../../../data/adminSupportData';

const catMap = {}; supportCategories.forEach(c => catMap[c.id] = c);
const prioMap = {}; supportPriorities.forEach(p => prioMap[p.id] = p);
const statMap = {}; supportStatuses.forEach(s => statMap[s.id] = s);
const userMap = {}; supportUsers.forEach(u => userMap[u.id] = u);
const agentMap = {}; [...supportAgents, ...[{ id: 'system', name: 'Système', avatar: 'SY' }]].forEach(a => agentMap[a.id] = a);

const AdminSupportProfile = ({ ticket }) => {
  if (!ticket) return null;
  const user = userMap[ticket.user] || { name: ticket.user, email: '', company: ticket.company, role: 'Client', avatar: '?' };
  const cat = catMap[ticket.category] || { label: ticket.category, icon: 'fa-tag', color: '#6B7280' };
  const prio = prioMap[ticket.priority] || { label: ticket.priority, color: '#6B7280' };
  const stat = statMap[ticket.status] || { label: ticket.status, color: '#6B7280' };
  const agent = ticket.assignedTo ? agentMap[ticket.assignedTo] : null;

  return (
    <div style={{ padding: '0.25rem 0' }}>
      <div className="ads-detail-grid">
        <div className="ads-detail-field"><div className="ads-detail-label">Ticket</div><div className="ads-detail-value" style={{ color: '#8B5CF6', fontWeight: 500 }}>{ticket.id}</div></div>
        <div className="ads-detail-field"><div className="ads-detail-label">Source</div><div className="ads-detail-value" style={{ textTransform: 'capitalize' }}>{ticket.source}</div></div>
        <div className="ads-detail-field"><div className="ads-detail-label">Catégorie</div><div className="ads-detail-value"><span className="ads-badge" style={{ background: `${cat.color}15`, color: cat.color }}><i className={`fas ${cat.icon}`} /> {cat.label}</span></div></div>
        <div className="ads-detail-field"><div className="ads-detail-label">Priorité</div><div className="ads-detail-value"><span className="ads-badge" style={{ background: prio.bg || `${prio.color}15`, color: prio.color }}>{prio.label}</span></div></div>
        <div className="ads-detail-field"><div className="ads-detail-label">Statut</div><div className="ads-detail-value"><span className="ads-badge" style={{ background: stat.bg || `${stat.color}15`, color: stat.color }}><i className={`fas ${stat.icon || 'fa-circle'}`} /> {stat.label}</span></div></div>
        <div className="ads-detail-field"><div className="ads-detail-label">Assigné à</div><div className="ads-detail-value">{agent ? agent.name : <span style={{ color: 'rgba(255,255,255,0.2)' }}>Non assigné</span>}</div></div>
        <div className="ads-detail-field"><div className="ads-detail-label">Utilisateur</div><div className="ads-detail-value">{user.name}</div></div>
        <div className="ads-detail-field"><div className="ads-detail-label">Compagnie</div><div className="ads-detail-value">{ticket.company !== '—' ? ticket.company : 'Client particulier'}</div></div>
        <div className="ads-detail-field"><div className="ads-detail-label">Créé le</div><div className="ads-detail-value">{ticket.createdAt}</div></div>
        <div className="ads-detail-field"><div className="ads-detail-label">Dernière activité</div><div className="ads-detail-value">{ticket.updatedAt}</div></div>
      </div>
      {ticket.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {ticket.tags.map((tag, i) => <span key={i} className="ads-badge" style={{ background: 'rgba(139,92,246,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>#{tag}</span>)}
        </div>
      )}
      <div style={{ marginBottom: '1rem' }}>
        <div className="ads-detail-label" style={{ marginBottom: '0.35rem' }}>Description</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '0.65rem 0.85rem' }}>{ticket.description}</div>
      </div>
      {ticket.attachments?.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div className="ads-detail-label" style={{ marginBottom: '0.35rem' }}>Pièces jointes</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {ticket.attachments.map((att, i) => (
              <span key={i} className="ads-message-attachment"><i className="fas fa-paperclip" />{att}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminSupportProfile;
