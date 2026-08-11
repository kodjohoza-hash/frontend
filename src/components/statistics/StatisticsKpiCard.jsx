/**
 * Carte KPI réutilisable pour le module Statistiques.
 * `format` peut être une fonction (ex. formatCurrency) ou 'number'.
 */
const StatisticsKpiCard = ({ label, value, format = 'number', icon = 'bi-graph-up', color = '#0d6efd', suffix = '' }) => {
  let display = value;
  if (typeof format === 'function') display = format(value);
  else if (Number.isFinite(Number(value))) display = Number(value).toLocaleString('fr-FR');

  return (
    <div className="stats-kpi-card">
      <div className="stats-kpi-card__top">
        <div className="stats-kpi-card__icon" style={{ background: `${color}1a`, color }}>
          <i className={`bi ${icon}`} />
        </div>
      </div>
      <div className="stats-kpi-card__value">
        {display}
        {suffix && <span className="stats-kpi-card__suffix">{suffix}</span>}
      </div>
      <div className="stats-kpi-card__label">{label}</div>
    </div>
  );
};

export default StatisticsKpiCard;
