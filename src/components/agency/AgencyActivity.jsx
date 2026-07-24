import clsx from 'clsx';
import { recentActivity } from '@data/agencyData';

const AgencyActivity = () => {
  return (
    <div className="ag-card ag-activity">
      <div className="ag-card__header">
        <h3 className="ag-card__title">
          <i className="bi bi-activity" />
          Activité récente
        </h3>
        <span className="ag-card__badge">{recentActivity.length}</span>
      </div>
      <div className="ag-activity__list">
        {recentActivity.map((item) => (
          <div key={item.id} className={clsx('ag-activity__item', !item.read && 'ag-activity__item--unread')}>
            <div className={clsx('ag-activity__icon', `ag-activity__icon--${item.color}`)}>
              <i className={`bi ${item.icon}`} />
            </div>
            <div className="ag-activity__body">
              <span className="ag-activity__msg">{item.message}</span>
              <span className="ag-activity__time">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencyActivity;
