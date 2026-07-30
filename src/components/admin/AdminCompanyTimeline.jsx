const AdminCompanyTimeline = ({ events }) => {
  if (!events?.length) return null;
  return (
    <div className="admc-drawer-section">
      <h3><i className="bi bi-clock-history" /> Activité récente</h3>
      <div className="admc-timeline">
        {events.map((e) => (
          <div key={e.id} className="admc-timeline-item">
            <div className={`admc-timeline-icon admc-timeline-icon--${e.color}`}>
              <i className={`bi ${e.icon}`} />
            </div>
            <div className="admc-timeline-content">
              <h4>{e.action}</h4>
              <p>{e.detail}</p>
              <div className="admc-timeline-time">{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminCompanyTimeline;
