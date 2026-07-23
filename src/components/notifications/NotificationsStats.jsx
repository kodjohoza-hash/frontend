const NotificationsStats = ({ stats }) => {
  const items = [
    { key: 'total', label: 'Total', value: stats.total, icon: 'bi-inbox', color: 'primary' },
    { key: 'unread', label: 'Non lues', value: stats.unread, icon: 'bi-envelope-fill', color: 'accent' },
    { key: 'today', label: "Aujourd'hui", value: stats.today, icon: 'bi-calendar-today', color: 'success' },
    { key: 'week', label: 'Cette semaine', value: stats.week, icon: 'bi-calendar-week', color: 'info' },
  ];

  return (
    <div className="nf-stats">
      {items.map((s, i) => (
        <div
          key={s.key}
          className={`nf-stat nf-stat--${s.color}`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className={`nf-stat__icon nf-stat__icon--${s.color}`}>
            <i className={`bi ${s.icon}`} />
          </div>
          <div className="nf-stat__content">
            <span className="nf-stat__value">{s.value}</span>
            <span className="nf-stat__label">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsStats;
