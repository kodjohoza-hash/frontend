import clsx from 'clsx';

const AgencyAnalyticsStats = ({ kpis }) => (
  <div className="aa-kpi-grid">
    {kpis.map((kpi) => (
      <div key={kpi.id} className={clsx('aa-kpi', `aa-kpi--${kpi.color}`)}>
        <div className={clsx('aa-kpi__icon', `aa-kpi__icon--${kpi.color}`)}>
          <i className={`bi ${kpi.icon}`} />
        </div>
        <div className="aa-kpi__body">
          <div className="aa-kpi__value">
            {kpi.value}
            <span className="aa-kpi__suffix">{kpi.suffix || ''}</span>
          </div>
          <div className="aa-kpi__label">{kpi.label}</div>
        </div>
        {kpi.trend && (
          <div className={clsx('aa-kpi__trend', kpi.trendUp ? 'aa-kpi__trend--up' : 'aa-kpi__trend--down')}>
            <i className={clsx('bi', kpi.trendUp ? 'bi-arrow-up-short' : 'bi-arrow-down-short')} />
            <span>{kpi.trend}</span>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default AgencyAnalyticsStats;
