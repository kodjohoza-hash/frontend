export default function AgencyNotificationPriority({ priority }) {
  const labelMap = { critical: 'Critique', high: 'Haute', normal: 'Normale', low: 'Faible' };
  const iconMap = { critical: 'bi-exclamation-triangle-fill', high: 'bi-arrow-up', normal: 'bi-dash', low: 'bi-arrow-down' };

  return (
    <span className={`anot-priority anot-priority--${priority}`}>
      <i className={`bi ${iconMap[priority]}`} />
      {labelMap[priority]}
    </span>
  );
}
