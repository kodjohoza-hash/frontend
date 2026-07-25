const AgencyAnalyticsSkeleton = () => {
  return (
    <div className="aa-skeleton">
      <div className="aa-skeleton__kpis">
        {[...Array(13)].map((_, i) => (
          <div key={i} className="aa-skeleton__kpi-card">
            <div className="aa-skeleton__bar" style={{ width: 40, height: 40, borderRadius: 10 }} />
            <div className="aa-skeleton__bar" style={{ width: '60%', height: 20 }} />
            <div className="aa-skeleton__bar" style={{ width: '80%', height: 12 }} />
          </div>
        ))}
      </div>
      <div className="aa-skeleton__bar aa-skeleton__filters" style={{ width: '100%', height: 48 }} />
      <div className="aa-skeleton__charts">
        <div className="aa-skeleton__chart" style={{ height: 280 }} />
        <div className="aa-skeleton__chart" style={{ height: 280 }} />
      </div>
      <div className="aa-skeleton__tables">
        <div className="aa-skeleton__table" style={{ height: 200 }} />
        <div className="aa-skeleton__table" style={{ height: 200 }} />
      </div>
    </div>
  );
};

export default AgencyAnalyticsSkeleton;
