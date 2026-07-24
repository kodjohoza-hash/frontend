export default function AgencyDriverPerformance({ driver }) {
  if (!driver) return null;
  const p = driver.performance;

  const metrics = [
    { label: 'Total voyages', value: p.totalTrips.toLocaleString('fr-FR'), icon: 'bi-signpost-2', color: 'var(--ag-primary-400)' },
    { label: 'Kilomètres parcourus', value: `${(p.totalKm).toLocaleString('fr-FR')} km`, icon: 'bi-speedometer', color: 'var(--ag-accent)' },
    { label: 'Taux de ponctualité', value: `${p.punctuality}%`, icon: 'bi-clock-history', color: 'var(--ag-success)' },
    { label: 'Satisfaction client', value: `${p.satisfaction}/5`, icon: 'bi-star-fill', color: 'var(--ag-warning)' },
    { label: 'Incidents signalés', value: p.incidents, icon: 'bi-exclamation-triangle', color: p.incidents > 3 ? 'var(--ag-danger)' : 'var(--ag-info)' },
    { label: 'Années de service', value: `${p.yearsService} ans`, icon: 'bi-calendar3', color: 'var(--ag-info)' },
  ];

  const barData = [
    { month: 'Jan', trips: 28, km: 4200 },
    { month: 'Fév', trips: 32, km: 5100 },
    { month: 'Mar', trips: 25, km: 3800 },
    { month: 'Avr', trips: 30, km: 4600 },
    { month: 'Mai', trips: 35, km: 5400 },
    { month: 'Jun', trips: 27, km: 4100 },
    { month: 'Jul', trips: 18, km: 2800 },
  ];

  const maxTrips = Math.max(...barData.map((d) => d.trips));

  return (
    <div className="add-perf">
      <div className="add-perf__metrics">
        {metrics.map((m, i) => (
          <div key={i} className="add-perf__metric">
            <i className={`bi ${m.icon}`} style={{ color: m.color }} />
            <div className="add-perf__metric-body">
              <span className="add-perf__metric-value">{m.value}</span>
              <span className="add-perf__metric-label">{m.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="add-perf__chart">
        <h5 className="add-perf__chart-title">Voyages par mois (2026)</h5>
        <div className="add-perf__bars">
          {barData.map((d, i) => (
            <div key={i} className="add-perf__bar-col">
              <div className="add-perf__bar-wrap">
                <div className="add-perf__bar" style={{ height: `${(d.trips / maxTrips) * 100}%` }}>
                  <span className="add-perf__bar-value">{d.trips}</span>
                </div>
              </div>
              <span className="add-perf__bar-label">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
