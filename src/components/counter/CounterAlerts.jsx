import clsx from 'clsx';

const alertIcons = {
  warning: 'bi-exclamation-triangle',
  info: 'bi-info-circle',
  success: 'bi-check-circle',
  primary: 'bi-bell',
  accent: 'bi-star',
};

const CounterAlerts = ({ alerts }) => (
  <div className="act-card">
    <div className="act-card__header">
      <h3 className="act-card__title">
        <i className="bi bi-exclamation-diamond" />
        Alertes
      </h3>
      <span className="act-card__badge">{alerts.length}</span>
    </div>
    <div className="act-alerts__list">
      {alerts.map((alert) => (
        <div key={alert.id} className="act-alert-item">
          <div className={clsx('act-alert-item__icon', `act-alert-item__icon--${alert.type}`)}>
            <i className={`bi ${alertIcons[alert.type] || 'bi-bell'}`} />
          </div>
          <div className="act-alert-item__body">
            <span className="act-alert-item__title">{alert.title}</span>
            <span className="act-alert-item__text" dangerouslySetInnerHTML={{ __html: alert.text }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CounterAlerts;
