import { backupTimeline } from '../../../data/adminBackupData';

const iconMap = { backup: 'fa-database', restore: 'fa-rotate-left', snapshot: 'fa-camera', error: 'fa-circle-xmark', delete: 'fa-trash-can', create: 'fa-plus', validation: 'fa-circle-check' };

const AdminBackupTimeline = () => {
  if (backupTimeline.length === 0) {
    return (
      <div className="adb-empty-state">
        <i className="fa-solid fa-clock-rotate-left"></i>
        <h3>Aucun événement</h3>
        <p>L'historique des sauvegardes apparaîtra ici.</p>
      </div>
    );
  }
  const sorted = [...backupTimeline].sort((a, b) => new Date(b.time) - new Date(a.time));
  return (
    <div className="adb-section-header" style={{ alignItems: 'stretch' }}>
      <div className="adb-section-title"><i className="fa-solid fa-clock-rotate-left" style={{ color: '#3B82F6' }}></i> Chronologie</div>
      <div className="adb-timeline">
        {sorted.map((ev, i) => (
          <div key={ev.id} className="adb-tl-item">
            <div className={`adb-tl-dot ${ev.status}`}><i className={`fa-solid ${iconMap[ev.type] || 'fa-circle'}`}></i></div>
            <div className="adb-tl-title">{ev.title}</div>
            <div className="adb-tl-desc">{ev.description}</div>
            <div className="adb-tl-meta">
              <span><i className="fa-regular fa-clock"></i> {new Date(ev.time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <span><i className="fa-regular fa-user"></i> {ev.user}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminBackupTimeline;
