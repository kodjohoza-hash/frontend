import clsx from 'clsx';

const AgencyStatCard = ({ label, value, suffix, icon, trend, trendUp, color }) => {
  return (
    <div className={clsx('ag-stat', `ag-stat--${color}`)}>
      <div className="ag-stat__top">
        <div className={clsx('ag-stat__icon', `ag-stat__icon--${color}`)}>
          <i className={`bi ${icon}`} />
        </div>
        {trend && (
          <span className={clsx('ag-stat__trend', trendUp ? 'ag-stat__trend--up' : 'ag-stat__trend--neutral')}>
            {trendUp && <i className="bi bi-arrow-up-short" />}
            {trend}
          </span>
        )}
      </div>
      <div className="ag-stat__value">
        {value}<span className="ag-stat__suffix">{suffix || ''}</span>
      </div>
      <div className="ag-stat__label">{label}</div>
      <div className={clsx('ag-stat__bar', `ag-stat__bar--${color}`)} />
    </div>
  );
};

export default AgencyStatCard;
