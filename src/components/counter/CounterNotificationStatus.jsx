import clsx from 'clsx';

const CONFIG = {
  unread: { icon: 'bi-circle-fill', color: '#3B82F6', label: 'Non lue' },
  read: { icon: 'bi-check2', color: '#6B7280', label: 'Lue' },
  pinned: { icon: 'bi-pin-fill', color: '#F59E0B', label: 'Épinglée' },
  archived: { icon: 'bi-archive', color: '#6B7280', label: 'Archivée' },
  deleted: { icon: 'bi-x-lg', color: '#EF4444', label: 'Supprimée' },
};

const CounterNotificationStatus = ({ status }) => {
  const cfg = CONFIG[status] || { icon: 'bi-question', color: '#6B7280', label: status };

  return (
    <span className="acn-status-badge" style={{ color: cfg.color }}>
      <i className={clsx('bi', cfg.icon)} />
      {cfg.label}
    </span>
  );
};

export default CounterNotificationStatus;
