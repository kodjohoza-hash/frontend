import { alerts } from '@data/adminData';

const iconMap = {
  warning: 'bi-exclamation-triangle',
  danger: 'bi-x-octagon',
  info: 'bi-info-circle',
  success: 'bi-check-circle',
  primary: 'bi-bell',
  accent: 'bi-star',
  purple: 'bi-shield',
};

const AdminAlerts = () => (
  <div className="adm-alerts-card">
    <div className="adm-alerts-card__header">
      <span className="adm-alerts-card__title">Alertes</span>
      <span className="adm-alerts-card__count">{alerts.length}</span>
    </div>
    {alerts.map((alert) => (
      <div key={alert.id} className="adm-alert-item">
        <div className={`adm-alert-item__icon adm-alert-item__icon--${alert.type}`}>
          <i className={`bi ${iconMap[alert.type] || 'bi-bell'}`} />
        </div>
        <div className="adm-alert-item__body">
          <div className="adm-alert-item__title">{alert.title}</div>
          <div className="adm-alert-item__msg">{alert.message}</div>
        </div>
        <span className="adm-alert-item__time">Il y a {alert.time}</span>
      </div>
    ))}
  </div>
);

export default AdminAlerts;
