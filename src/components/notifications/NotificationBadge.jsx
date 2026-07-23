const NotificationBadge = ({ count }) => {
  if (!count || count === 0) return null;
  return (
    <span className="nf-badge">
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NotificationBadge;
