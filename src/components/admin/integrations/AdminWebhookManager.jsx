import { webhooks, webhookEventTypes } from '../../../data/adminIntegrationData';

const AdminWebhookManager = () => {
  if (webhooks.length === 0) {
    return (
      <div className="adi-empty-state">
        <i className="fa-solid fa-plug"></i>
        <h3>Aucun webhook configuré</h3>
        <p>Créez votre premier webhook pour recevoir des événements en temps réel.</p>
        <button className="adi-btn-primary" style={{ margin: '16px auto 0' }}><i className="fa-solid fa-plus"></i> Créer un webhook</button>
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="adi-btn-primary"><i className="fa-solid fa-plus"></i> Nouveau webhook</button>
      </div>
      <div className="adi-webhook-list">
        {webhooks.map(wh => {
          const events = wh.events.map(e => webhookEventTypes.find(wet => wet.id === e)).filter(Boolean);
          return (
            <div key={wh.id} className="adi-webhook-item">
              <div className="adi-webhook-header">
                <div>
                  <div className="adi-webhook-name">
                    {wh.name}
                    <span className="adi-badge" style={{
                      background: wh.status === 'active' ? 'rgba(16,185,129,.1)' : wh.status === 'error' ? 'rgba(239,68,68,.1)' : 'rgba(107,114,128,.1)',
                      color: wh.status === 'active' ? '#10B981' : wh.status === 'error' ? '#EF4444' : '#6B7280',
                    }}>
                      <i className="fa-solid fa-circle" style={{ fontSize: 8 }}></i> {wh.status}
                    </span>
                  </div>
                  <div className="adi-webhook-url"><i className="fa-regular fa-link"></i> {wh.url}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="adi-card-action edit" style={{ padding: '3px 8px', fontSize: 11 }}><i className="fa-regular fa-pen-to-square"></i></button>
                  <button className="adi-card-action delete" style={{ padding: '3px 8px', fontSize: 11 }}><i className="fa-regular fa-trash-can"></i></button>
                </div>
              </div>
              <div className="adi-webhook-events">
                {events.map(ev => <span key={ev.id} className="adi-webhook-event">{ev.label}</span>)}
              </div>
              <div className="adi-webhook-meta">
                <span><i className="fa-regular fa-clock"></i> Dernier appel: {wh.lastTriggered}</span>
                <span><i className="fa-solid fa-chart-line"></i> Succès: {wh.successRate}%</span>
                <span><i className="fa-solid fa-bolt"></i> Total: {wh.totalCalls.toLocaleString()}</span>
                {wh.lastError && <span style={{ color: '#EF4444' }}><i className="fa-solid fa-triangle-exclamation"></i> {wh.lastError}</span>}
                <span style={{ marginLeft: 'auto' }}>
                  <div className="adi-webhook-progress">
                    <div className="adi-webhook-progress-bar" style={{ width: `${wh.successRate}%`, background: wh.successRate >= 99 ? '#10B981' : wh.successRate >= 95 ? '#F59E0B' : '#EF4444' }}></div>
                  </div>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminWebhookManager;
