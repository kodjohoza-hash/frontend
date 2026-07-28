export default function AgencyNotificationStatus({ status }) {
  const iconMap = { unread: 'bi-envelope', read: 'bi-envelope-open', archived: 'bi-archive', pinned: 'bi-pin-fill' };
  const labelMap = { unread: 'Non lue', read: 'Lue', archived: 'Archivée', pinned: 'Épinglée' };

  return (
    <span className={`anot-status anot-status--${status}`}>
      <i className={`bi ${iconMap[status]}`} />
      {labelMap[status]}
    </span>
  );
}
