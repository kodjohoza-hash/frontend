const AdminUserTimeline = ({ events }) => {
  if (!events?.length) return null;
  return (
    <div className="admu-drawer-section">
      <h3><i className="bi bi-clock-history" /> Historique du compte</h3>
      <div className="admu-timeline">
        {events.map((e) => (
          <div key={e.id} className="admu-timeline-item">
            <div className={`admu-timeline-icon admu-timeline-icon--${e.color}`}>
              <i className={`bi ${e.icon}`} />
            </div>
            <div className="admu-timeline-content">
              <h4>{e.action}</h4>
              <p>{e.detail}</p>
              <div className="admu-timeline-time">{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminUserTimeline;
