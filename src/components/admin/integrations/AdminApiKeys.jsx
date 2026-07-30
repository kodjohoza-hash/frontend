import { apiKeys } from '../../../data/adminIntegrationData';

const statusStyle = (s) => {
  if (s === 'active') return { bg: 'rgba(16,185,129,.1)', color: '#10B981' };
  if (s === 'revoked') return { bg: 'rgba(239,68,68,.1)', color: '#EF4444' };
  if (s === 'expired') return { bg: 'rgba(107,114,128,.1)', color: '#6B7280' };
  return { bg: 'rgba(245,158,11,.1)', color: '#F59E0B' };
};

const AdminApiKeys = () => {
  if (apiKeys.length === 0) {
    return (
      <div className="adi-empty-state">
        <i className="fa-solid fa-key"></i>
        <h3>Aucune clé API</h3>
        <p>Générez votre première clé API pour accéder à l'API REST.</p>
        <button className="adi-btn-primary" style={{ margin: '16px auto 0' }}><i className="fa-solid fa-plus"></i> Générer une clé</button>
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="adi-btn-primary"><i className="fa-solid fa-key"></i> Générer une clé</button>
      </div>
      <div className="adi-apikey-list">
        {apiKeys.map(key => {
          const ss = statusStyle(key.status);
          return (
            <div key={key.id} className="adi-apikey-item">
              <div className="adi-apikey-header">
                <div>
                  <div className="adi-apikey-name">
                    {key.name}
                    <span className="adi-badge" style={{ background: ss.bg, color: ss.color }}>
                      <i className="fa-solid fa-circle" style={{ fontSize: 8 }}></i> {key.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="adi-card-action edit" style={{ padding: '3px 8px', fontSize: 11 }}><i className="fa-regular fa-pen-to-square"></i></button>
                  {key.status === 'active' && <button className="adi-card-action delete" style={{ padding: '3px 8px', fontSize: 11 }}><i className="fa-solid fa-ban"></i></button>}
                </div>
              </div>
              <div className="adi-apikey-key">
                <span>{key.key}</span>
                <button className="adi-copy-btn"><i className="fa-regular fa-copy"></i></button>
              </div>
              <div className="adi-apikey-perms">
                {key.permissions.map(p => <span key={p} className="adi-apikey-perm">{p.toUpperCase()}</span>)}
              </div>
              <div className="adi-apikey-meta">
                <span><i className="fa-regular fa-calendar"></i> Créée: {key.createdAt}</span>
                <span><i className="fa-regular fa-calendar-xmark"></i> Expire: {key.expiresAt}</span>
                <span><i className="fa-regular fa-clock"></i> Dernière utilisation: {key.lastUsed}</span>
                <span><i className="fa-regular fa-user"></i> {key.creator?.split(' ')[1] || key.creator}</span>
              </div>
              {key.description && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>{key.description}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminApiKeys;
