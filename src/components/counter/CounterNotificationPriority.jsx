import clsx from 'clsx';

const CONFIG = {
  critical: { color: '#EF4444', icon: 'bi-exclamation-triangle', label: 'Critique' },
  high: { color: '#F59E0B', icon: 'bi-arrow-up', label: 'Haute' },
  normal: { color: '#3B82F6', icon: 'bi-bell', label: 'Normale' },
  low: { color: '#94A3B8', icon: 'bi-arrow-down', label: 'Faible' },
};

const CounterNotificationPriority = ({ priority }) => {
  const cfg = CONFIG[priority] || { color: '#94A3B8', icon: 'bi-question', label: priority };

  return (
    <span className="acn-priority-badge" style={{ background: `${cfg.color}18`, color: cfg.color }}>
      <i className={clsx('bi', cfg.icon)} />
      {cfg.label}
    </span>
  );
};

export default CounterNotificationPriority;
