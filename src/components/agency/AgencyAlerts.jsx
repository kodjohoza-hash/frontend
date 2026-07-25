import clsx from 'clsx';

const alertIcons = {
  warning: 'bi-exclamation-triangle',
  danger: 'bi-x-octagon',
  info: 'bi-info-circle',
  success: 'bi-check-circle',
};

const AgencyAlerts = ({ alerts }) => {
  return (
    <div className="aa-alerts-grid">
      {alerts.map((alert) => (
        <div key={alert.id} className={clsx('aa-alert', `aa-alert--${alert.type}`)}>
          <div className="aa-alert__icon">
            <i className={`bi ${alertIcons[alert.type] || 'bi-bell'}`} />
          </div>
          <div className="aa-alert__content">
            <div
              className="aa-alert__text"
              dangerouslySetInnerHTML={{ __html: alert.text }}
            />
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
