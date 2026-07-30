import React from 'react';

const AdminNotificationComposer = ({ senders, channels, onSend }) => {
  const [form, setForm] = React.useState({ title: '', body: '', channel: channels[0]?.id || '', sender: senders[0]?.id || '', recipients: 'all' });
  const [preview, setPreview] = React.useState(null);
  const handleChange = (k, v) => { setForm(f => ({ ...f, [k]: v })); };
  const handlePreview = () => {
    const ch = channels.find(c => c.id === form.channel);
    setPreview({ title: form.title || 'Aperçu du titre', content: form.body || 'Contenu de la notification...', channel: ch?.name || form.channel, sender: senders.find(s => s.id === form.sender)?.name || 'Admin' });
  };
  const handleSend = () => {
    if (!form.title || !form.body) return;
    onSend?.(form);
    setForm({ title: '', body: '', channel: channels[0]?.id || '', sender: senders[0]?.id || '', recipients: 'all' });
    setPreview(null);
  };
  return (
    <div className="adn-composer">
      <div className="adn-composer-grid">
        <div className="adn-composer-field">
          <label className="adn-composer-label">Titre</label>
          <input className="adn-composer-input" placeholder="Titre de la notification" value={form.title} onChange={e => handleChange('title', e.target.value)} />
        </div>
        <div className="adn-composer-field">
          <label className="adn-composer-label">Canal</label>
          <select className="adn-composer-input" value={form.channel} onChange={e => handleChange('channel', e.target.value)}>
            {channels.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
          </select>
        </div>
        <div className="adn-composer-field">
          <label className="adn-composer-label">Expéditeur</label>
          <select className="adn-composer-input" value={form.sender} onChange={e => handleChange('sender', e.target.value)}>
            {senders.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="adn-composer-field">
          <label className="adn-composer-label">Destinataires</label>
          <select className="adn-composer-input" value={form.recipients} onChange={e => handleChange('recipients', e.target.value)}>
            <option value="all">Tous les clients</option>
            <option value="agents">Agents</option>
            <option value="partners">Partenaires</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div className="adn-composer-field adn-composer-full">
          <label className="adn-composer-label">Contenu</label>
          <textarea className="adn-composer-input adn-composer-textarea" placeholder="Rédigez le message..." value={form.body} onChange={e => handleChange('body', e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button className="adn-control-btn" onClick={handlePreview}><i className="fas fa-eye" /> Aperçu</button>
        <button className="adn-control-btn" onClick={handleSend}><i className="fas fa-paper-plane" /> Envoyer</button>
      </div>
      {preview && (
        <div className="adn-preview">
          <div className="adn-preview-header">
            <div className="adn-preview-avatar" style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }}><i className="fas fa-bell" /></div>
            <div><div className="adn-preview-title">{preview.title}</div><div className="adn-preview-time">via {preview.channel} · {preview.sender}</div></div>
          </div>
          <div className="adn-preview-content">{preview.content}</div>
          <span className="adn-preview-btn" style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}><i className="fas fa-arrow-right" /> Voir plus</span>
        </div>
      )}
    </div>
  );
};
export default AdminNotificationComposer;
