const AdminUserActivity = ({ activity }) => {
  if (!activity?.length) return null;
  return (
    <div className="admu-drawer-section">
      <h3><i className="bi bi-journal-text" /> Journal d'activité</h3>
      {activity.map((a) => (
        <div key={a.id} className="admu-activity-item">
          <div className="admu-activity-time">{a.date} {a.time}</div>
          <div className="admu-activity-content">
            <strong>{a.action}</strong>
            <span>{a.detail}</span>
            <div className="admu-activity-ip">IP: {a.ip}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminUserActivity;
