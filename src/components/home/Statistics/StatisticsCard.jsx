import { memo } from 'react';
import { useCountUp } from '@hooks/useLandingPage';

/**
 * StatisticsCard — Single KPI card with animated counter
 * Memoized to prevent unnecessary re-renders
 */
const StatisticsCard = memo(({ stat, isVisible }) => {
  const count = useCountUp(stat.value, 2200, isVisible);

  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        <i className={`bi ${stat.icon}`} />
      </div>
      <div className="stat-card-value">
        {count.toLocaleString('fr-FR')}{stat.suffix}
      </div>
      <h3 className="stat-card-label">{stat.label}</h3>
      <p className="stat-card-description">{stat.description}</p>
    </div>
  );
});

StatisticsCard.displayName = 'StatisticsCard';

export default StatisticsCard;
