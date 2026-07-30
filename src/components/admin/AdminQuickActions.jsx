import { Link } from 'react-router-dom';
import { quickActions } from '@data/adminData';

const AdminQuickActions = () => (
  <div className="adm-actions-grid">
    {quickActions.map((action, i) => (
      <Link
        key={action.id}
        to={action.link}
        className="adm-action-btn"
        style={{ animationDelay: `${i * 0.05}s` }}
      >
        <div className={`adm-action-btn__icon adm-action-btn__icon--${action.color}`}>
          <i className={`bi ${action.icon}`} />
        </div>
        <span className="adm-action-btn__label">{action.label}</span>
        <span className="adm-action-btn__desc">{action.desc}</span>
      </Link>
    ))}
  </div>
);

export default AdminQuickActions;
