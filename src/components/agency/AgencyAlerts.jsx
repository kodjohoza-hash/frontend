import clsx from 'clsx';

const AgencyAlerts = ({ alerts }) => {
  return (
    <div className="aa-alerts-grid">
      {alerts.map((alert) => (
        <div key={alert.id} className={clsx('aa-alert', `aa-alert--${alert.level}`)}>
          <div className="aa-alert__icon">
            <i className={`bi ${alert.icon || 'bi-bell'}`} />
          </div>
          <div className="aa-alert__content">
            <div className="aa-alert__title">{alert.title}</div>
            <div className="aa-alert__text">{alert.message}</div>
            {alert.action && (
              <a href="#" className="aa-alert__action">
                {alert.action}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgencyAlerts;
