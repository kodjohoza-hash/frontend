import React from 'react';

const segments = [
  { id: 'all', label: 'Tous', icon: 'fa-globe', desc: '100% des utilisateurs' },
  { id: 'clients', label: 'Clients', icon: 'fa-user', desc: 'Utilisateurs actifs' },
  { id: 'agents', label: 'Agents', icon: 'fa-user-tie', desc: 'Agents certifiés' },
  { id: 'partners', label: 'Partenaires', icon: 'fa-handshake', desc: 'Partenaires stratégiques' },
  { id: 'premium', label: 'Premium', icon: 'fa-crown', desc: 'Abonnés premium' },
];

const AdminNotificationRecipients = ({ selected, onChange }) => (
  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
    {segments.map(s => (
      <div key={s.id} onClick={() => onChange?.(s.id)} style={{ flex: 1, minWidth: 120, padding: '0.85rem 1rem', background: selected === s.id ? 'rgba(139,92,246,0.12)' : '#13132B', border: `1px solid ${selected === s.id ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', color: selected === s.id ? '#8B5CF6' : 'rgba(255,255,255,0.3)', marginBottom: '0.3rem' }}><i className={`fas ${s.icon}`} /></div>
        <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 500 }}>{s.label}</div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.15rem' }}>{s.desc}</div>
      </div>
    ))}
  </div>
);
export default AdminNotificationRecipients;
