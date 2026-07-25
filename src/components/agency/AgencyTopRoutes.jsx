import clsx from 'clsx';

const getRankClass = (i) => {
  if (i === 0) return 'aa-top-table__rank--gold';
  if (i === 1) return 'aa-top-table__rank--silver';
  if (i === 2) return 'aa-top-table__rank--bronze';
  return '';
};

const AgencyTopRoutes = ({ data }) => {
  return (
    <div className="aa-top-table">
      <div className="aa-top-table__header">
        <h3 className="aa-top-table__title">
          <i className="bi bi-trophy" />
          Top trajets
        </h3>
      </div>
      <div className="aa-top-table__body">
        {data.map((route, i) => (
          <div key={route.id} className="aa-top-table__row">
            <span className={clsx('aa-top-table__rank', getRankClass(i))}>
              {i + 1}
            </span>
            <div className="aa-top-table__info">
              <span className="aa-top-table__name">{route.name}</span>
              <span className="aa-top-table__value">{route.reservations} réservations</span>
            </div>
            <div className="aa-top-table__bar-wrap">
              <div className="aa-top-table__bar" style={{ width: `${route.percentage}%` }} />
              <span className="aa-top-table__pct">{route.percentage}%</span>
            </div>
            <span className={clsx('aa-top-table__trend', route.trend >= 0 ? 'aa-top-table__trend--up' : 'aa-top-table__trend--down')}>
              <i className={`bi bi-arrow-${route.trend >= 0 ? 'up' : 'down'}-short`} />
              {Math.abs(route.trend)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencyTopRoutes;
