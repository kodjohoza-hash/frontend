import clsx from 'clsx';
import { formatDate, formatTime } from '@data/counterSettingsData';

const DEVICE_ICONS = {
  pc: 'bi-laptop',
  mac: 'bi-laptop',
  iphone: 'bi-phone',
  smartphone: 'bi-phone',
  android: 'bi-phone',
  tablet: 'bi-tablet',
  default: 'bi-display',
};

const getDeviceIcon = (device) => {
  const lower = (device || '').toLowerCase();
  if (lower.includes('iphone') || lower.includes('android') || lower.includes('smartphone')) return 'bi-phone';
  if (lower.includes('ipad') || lower.includes('tablet')) return 'bi-tablet';
  if (lower.includes('mac')) return 'bi-laptop';
  if (lower.includes('windows') || lower.includes('pc')) return 'bi-laptop';
  return 'bi-display';
};

const CounterSessionsSettings = ({ sessions, onTerminate, onTerminateAll }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="acs2-card">
        <div className="acs2-card__header">
          <i className="bi bi-laptop acs2-card__header-icon acs2-card__header-icon--accent" />
          <span>Sessions actives</span>
        </div>
        <div className="acs2-empty">
          <i className="bi bi-inbox" />
          <span>Aucune session active</span>
        </div>
      </div>
    );
  }

  const currentSession = sessions.find((s) => s.current);
  const otherSessions = sessions.filter((s) => !s.current);

  const renderSession = (session) => (
    <div
      key={session.id}
      className={clsx('acs2-session', { 'acs2-session--current': session.current })}
    >
      <div className="acs2-session__icon">
        <i className={clsx('bi', getDeviceIcon(session.device))} />
      </div>
      <div className="acs2-session__info">
        <div className="acs2-session__top">
          <span className="acs2-session__device">{session.device}</span>
          {session.current && (
            <span className="acs2-badge acs2-badge--success">Session actuelle</span>
          )}
        </div>
        <div className="acs2-session__meta">
          <span className="acs2-session__meta-item">
            <i className="bi bi-globe2" /> {session.browser}
          </span>
          <span className="acs2-session__meta-item">
            <i className="bi bi-geo-alt" /> {session.location || 'Inconnu'}
          </span>
          <span className="acs2-session__meta-item">
            <i className="bi bi-clock" /> {formatDate(session.lastActive)} à {formatTime(session.lastActive)}
          </span>
          {session.ip && (
            <span className="acs2-session__meta-item">
              <i className="bi bi-hdd-network" /> {session.ip}
            </span>
          )}
        </div>
      </div>
      {!session.current && (
        <button
          className="acs2-btn acs2-btn--sm acs2-btn--danger-outline"
          onClick={() => onTerminate?.(session.id)}
        >
          <i className="bi bi-x-lg" />
          Déconnecter
        </button>
      )}
    </div>
  );

  return (
    <div className="acs2-card">
      <div className="acs2-card__header">
        <i className="bi bi-laptop acs2-card__header-icon acs2-card__header-icon--accent" />
        <span>Sessions actives</span>
        {otherSessions.length > 0 && (
          <button
            className="acs2-btn acs2-btn--sm acs2-btn--outline acs2-card__header-action"
            onClick={onTerminateAll}
          >
            <i className="bi bi-x-circle" />
            Déconnecter toutes les autres sessions
          </button>
        )}
      </div>

      {currentSession && renderSession(currentSession)}
      {otherSessions.length > 0 && (
        <>
          <div className="acs2-separator" />
          {otherSessions.map(renderSession)}
        </>
      )}
    </div>
  );
};

export default CounterSessionsSettings;
