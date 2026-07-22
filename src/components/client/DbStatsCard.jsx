import clsx from 'clsx';

const DbStatsCard = ({ label, value, suffix, change, trend, icon, color }) => {
  return (
    <div className={clsx('db-stats', `db-stats--${color}`)}>
      <div className={clsx('db-stats__icon', `db-stats__icon--${color}`)}>
        <i className={clsx('bi', icon)} />
      </div>
      <div className="db-stats__body">
        <span className="db-stats__label">{label}</span>
        <div className="db-stats__value">
          {value}
          {suffix && <span className="db-stats__suffix">{suffix}</span>}
        </div>
        {change && (
          <span className={clsx('db-stats__change', trend === 'up' ? 'db-stats__change--up' : 'db-stats__change--down')}>
            <i className={clsx('bi', trend === 'up' ? 'bi-arrow-up-short' : 'bi-arrow-down-short')} />
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default DbStatsCard;
