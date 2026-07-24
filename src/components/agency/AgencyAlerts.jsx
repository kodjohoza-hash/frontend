import clsx from 'clsx';
import { alerts } from '@data/agencyData';

const AgencyAlerts = () => {
  return (
    <div className="ag-card ag-alerts">
      <div className="ag-card__header">
        <h3 className="ag-card__title">
          <i className="bi bi-exclamation-diamond" />
          Alertes importantes
        </h3>
        <span className="ag-card__badge ag-card__badge--danger">{alerts.length}</span>
      </div>
      <div className="ag-alerts__list">
        {alerts.map((alert) => (
          <div key={alert.id} className={clsx('ag-alert', `ag-alert--${alert.level}`)}>
            <div className={clsx('ag-alert__icon', `ag-alert__icon--${alert.level}`)}>
              <i className={`bi ${alert.icon}`} />
            </div>
            <div className="ag-alert__body">
              <span className="ag-alert__title">{alert.title}</span>
              <span className="ag-alert__msg">{alert.message}</span>
            </div>
            <button type="button" className={clsx('ag-alert__btn', `ag-alert__btn--${alert.level}`)}>
              {alert.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencyAlerts;
