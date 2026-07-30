import { snapshots, backupStatuses } from '../../../data/adminBackupData';

const AdminBackupSnapshots = () => {
  if (snapshots.length === 0) {
    return (
      <div className="adb-empty-state">
        <i className="fa-solid fa-camera"></i>
        <h3>Aucun snapshot</h3>
        <p>Créez votre premier snapshot pour capturer l'état de vos serveurs.</p>
        <button className="adb-btn-primary" style={{ margin: '16px auto 0' }}><i className="fa-solid fa-camera"></i> Créer un snapshot</button>
      </div>
    );
  }
  return (
    <div>
      <div className="adb-section-header">
        <div className="adb-section-title"><i className="fa-solid fa-camera" style={{ color: '#F59E0B' }}></i> Snapshots <span className="adb-tab-badge">{snapshots.length}</span></div>
        <div className="adb-section-actions">
          <button className="adb-btn-sm success"><i className="fa-solid fa-camera"></i> Créer un snapshot</button>
        </div>
      </div>
      <div className="adb-snapshot-grid">
        {snapshots.map(snap => {
          const st = backupStatuses.find(s => s.id === snap.status);
          return (
            <div key={snap.id} className="adb-snapshot-card">
              <div className="adb-snapshot-name">
                <i className="fa-solid fa-camera" style={{ color: '#F59E0B', fontSize: 14 }}></i>
                {snap.name}
                <span className="adb-badge-sm" style={{ background: st?.bg, color: st?.color, marginLeft: 'auto' }}>
                  <i className="fa-solid fa-circle" style={{ fontSize: 7 }}></i> {st?.label || snap.status}
                </span>
              </div>
              <div className="adb-snapshot-desc">{snap.description}</div>
              <div className="adb-snapshot-meta">
                <span><i className="fa-solid fa-server"></i> {snap.server}</span>
                <span><i className="fa-regular fa-calendar"></i> {snap.date} {snap.time}</span>
                <span><i className="fa-solid fa-hard-drive"></i> {snap.size} {snap.sizeUnit}</span>
                <span><i className={`fa-solid ${snap.type === 'automatic' ? 'fa-robot' : 'fa-user'}`}></i> {snap.type === 'automatic' ? 'Automatique' : 'Manuel'}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <button className="adb-btn-sm primary"><i className="fa-regular fa-eye"></i> Voir</button>
                <button className="adb-btn-sm warning"><i className="fa-solid fa-rotate-left"></i> Restaurer</button>
                <button className="adb-btn-sm danger"><i className="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminBackupSnapshots;
