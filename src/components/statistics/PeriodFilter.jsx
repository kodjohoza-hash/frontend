import useStatisticsStore from '../../store/statistics.store';
import { STATISTICS_PERIODS } from '../../services/statistics.service';

/**
 * Filtre de période des statistiques (partagé entre les pages Reports / Revenue).
 * Mét à jour le store statistics (period/custom).
 */
const PeriodFilter = ({ className = '' }) => {
  const period = useStatisticsStore((s) => s.period);
  const dateDebut = useStatisticsStore((s) => s.dateDebut);
  const dateFin = useStatisticsStore((s) => s.dateFin);
  const setPeriod = useStatisticsStore((s) => s.setPeriod);
  const setDateRange = useStatisticsStore((s) => s.setDateRange);

  return (
    <div className={`stats-period ${className}`}>
      <label className="stats-period__label" htmlFor="stats-period-select">
        <i className="bi bi-calendar3" /> Période
      </label>
      <select
        id="stats-period-select"
        className="form-select form-select-sm stats-period__select"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      >
        {STATISTICS_PERIODS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
        <option value="custom">Période personnalisée</option>
      </select>
      {period === 'custom' && (
        <div className="stats-period__range">
          <input
            type="date"
            className="form-control form-control-sm"
            value={dateDebut}
            max={dateFin || undefined}
            onChange={(e) => setDateRange(e.target.value, dateFin)}
          />
          <span className="stats-period__sep">→</span>
          <input
            type="date"
            className="form-control form-control-sm"
            value={dateFin}
            min={dateDebut || undefined}
            onChange={(e) => setDateRange(dateDebut, e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default PeriodFilter;
