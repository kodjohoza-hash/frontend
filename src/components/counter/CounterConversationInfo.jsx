import clsx from 'clsx';

const STATUS_LABEL = {
  online: { text: 'En ligne', color: '#10B981' },
  offline: { text: 'Hors ligne', color: '#9CA3AF' },
  busy: { text: 'Occupé', color: '#EF4444' },
};

const CounterConversationInfo = ({ conversation, onClose }) => {
  const p = conversation?.participant || {};
  const name = p.name || conversation?.name || '';
  const role = p.role || conversation?.role || '';
  const phone = p.phone || '';
  const email = p.email || '';
  const company = p.company || '';
  const branch = p.branch || '';
  const status = p.status || 'offline';
  const lastActivity = p.lastActivity || '';
  const sharedFiles = p.sharedFiles || [];

  const initials = name
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const st = STATUS_LABEL[status] || STATUS_LABEL.offline;

  return (
    <div className="acm-info">
      <div className="acm-info__header">
        <h4 className="acm-info__title">Informations</h4>
        <button type="button" className="acm-info__close" onClick={onClose}>
          <i className="bi bi-x" />
        </button>
      </div>
      <div className="acm-info__content">
        <div className="acm-info__avatar">
          <span className="acm-info__initials">{initials}</span>
        </div>
        <h3 className="acm-info__name">{name}</h3>
        {role && <span className="acm-info__role">{role}</span>}

        <div className="acm-info__section">
          <span className="acm-info__status" style={{ color: st.color }}>
            <span className="acm-info__status-dot" style={{ backgroundColor: st.color }} />
            {st.text}
          </span>
          {lastActivity && (
            <span className="acm-info__last-activity">
              Dernière activité : {lastActivity}
            </span>
          )}
        </div>

        {(phone || email) && (
          <div className="acm-info__section">
            <h5 className="acm-info__section-title">Contact</h5>
            {phone && (
              <div className="acm-info__row">
                <i className="bi bi-telephone" />
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div className="acm-info__row">
                <i className="bi bi-envelope" />
                <span>{email}</span>
              </div>
            )}
          </div>
        )}

        {(company || branch) && (
          <div className="acm-info__section">
            <h5 className="acm-info__section-title">Entreprise</h5>
            {company && (
              <div className="acm-info__row">
                <i className="bi bi-building" />
                <span>{company}</span>
              </div>
            )}
            {branch && (
              <div className="acm-info__row">
                <i className="bi bi-geo-alt" />
                <span>{branch}</span>
              </div>
            )}
          </div>
        )}

        {sharedFiles.length > 0 && (
          <div className="acm-info__section">
            <h5 className="acm-info__section-title">
              Fichiers partagés ({sharedFiles.length})
            </h5>
            <div className="acm-info__files">
              {sharedFiles.map((file, i) => (
                <div key={i} className="acm-info__file">
                  <i className={clsx('bi', file.type === 'pdf' ? 'bi-file-pdf' : file.type === 'image' ? 'bi-file-image' : 'bi-file')} />
                  <span className="acm-info__file-name">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="acm-info__actions">
          <button type="button" className="acm-info__action-btn" title="Appeler">
            <i className="bi bi-telephone" />
          </button>
          <button type="button" className="acm-info__action-btn" title="Vidéo">
            <i className="bi bi-camera-video" />
          </button>
          {email && (
            <button type="button" className="acm-info__action-btn" title="Email">
              <i className="bi bi-envelope" />
            </button>
          )}
          <button type="button" className="acm-info__action-btn acm-info__action-btn--danger" title="Bloquer">
            <i className="bi bi-slash-circle" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterConversationInfo;
