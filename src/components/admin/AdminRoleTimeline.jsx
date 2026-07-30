const AdminRoleTimeline = ({ events }) => {
  if (!events?.length) return null;
  return (
    <div className="admr-drawer-section">
      <h3><i className="bi bi-clock-history" /> Historique des activités</h3>
      <div className="admr-timeline">
        {events.map((e) => (
          <div key={e.id} className="admr-timeline-item">
            <div className={`admr-timeline-icon admr-timeline-icon--${e.color}`}>
              <i className={`bi ${e.icon}`} />
            </div>
            <div className="admr-timeline-content">
              <h4>{e.action}</h4>
              <p>{e.detail}</p>
              <div className="admr-timeline-time">{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminRoleTimeline;
