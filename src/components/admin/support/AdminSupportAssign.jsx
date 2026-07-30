import React from 'react';
import { supportAgents } from '../../../data/adminSupportData';

const avatarColors = ['#8B5CF6','#3B82F6','#10B981','#F59E0B','#EF4444','#EC4899'];

const AdminSupportAssign = ({ currentAgent, show, onAssign, onClose }) => {
  if (!show) return null;
  return (
    <div className="ads-assign-overlay" onClick={onClose}>
      <div className="ads-assign-modal" onClick={e => e.stopPropagation()}>
        <h3><i className="fas fa-user-plus" style={{ color: '#8B5CF6' }} /> Assigner le ticket</h3>
        <div className="ads-assign-desc">Choisissez un agent pour traiter ce ticket</div>
        <div className="ads-assign-list">
          <div className={`ads-assign-item ${!currentAgent ? 'active' : ''}`} onClick={() => { onAssign(null); onClose(); }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}><i className="fas fa-minus" /></div>
            <div className="ads-assign-info"><div className="ads-assign-name">Non assigné</div><div className="ads-assign-role">—</div></div>
          </div>
          {supportAgents.map((agent, i) => (
            <div key={agent.id} className={`ads-assign-item ${currentAgent === agent.id ? 'active' : ''}`} onClick={() => { onAssign(agent.id); onClose(); }}>
              <span className="ads-avatar-md" style={{ background: avatarColors[i % avatarColors.length] }}>{agent.avatar}</span>
              <div className="ads-assign-info"><div className="ads-assign-name">{agent.name}</div><div className="ads-assign-role">{agent.role}</div></div>
              <div className="ads-assign-meta">
                <span><i className="fas fa-ticket" /> {agent.ticketsActive}</span>
                <span><i className="fas fa-star" /> {agent.satisfaction}%</span>
                {agent.online && <span style={{ color: '#10B981' }}><i className="fas fa-circle" style={{ fontSize: '0.5rem' }} /> En ligne</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="ads-assign-actions">
          <button className="ads-reply-btn" style={{ background: 'rgba(107,114,128,0.2)', color: 'rgba(255,255,255,0.5)' }} onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
};
export default AdminSupportAssign;
