import { activeSessions } from '@data/settingsData';

const ActiveSessions = () => {
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="st-section">
      <div className="st-section__header">
        <div className="st-section__icon st-section__icon--primary">
          <i className="bi bi-laptop" />
        </div>
        <div>
          <h3 className="st-section__title">Sessions actives</h3>
          <p className="st-section__desc">Gérez les appareils connectés à votre compte</p>
        </div>
      </div>

      <div className="st-card">
        <div className="st-sessions">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className={`st-session ${session.current ? 'st-session--current' : ''}`}
            >
              <div className="st-session__icon">
                <i className="bi bi-laptop" />
              </div>
              <div className="st-session__info">
                <div className="st-session__top">
                  <span className="st-session__device">{session.device}</span>
                  {session.current && (
                    <span className="st-badge st-badge--success">Session actuelle</span>
                  )}
                </div>
                <div className="st-session__meta">
                  <span className="st-session__meta-item">
                    <i className="bi bi-browser-chrome" /> {session.browser}
                  </span>
                  <span className="st-session__meta-item">
                    <i className="bi bi-geo-alt" /> {session.location}
                  </span>
                  <span className="st-session__meta-item">
                    <i className="bi bi-clock" /> {formatDateTime(session.lastActive)}
                  </span>
                </div>
              </div>
              {!session.current && (
                <button type="button" className="st-btn st-btn--danger-outline st-btn--sm">
                  Déconnecter
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveSessions;
