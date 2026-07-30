import { storageData, backupAlerts } from '../../../data/adminBackupData';

const AdminBackupStorage = () => {
  const usedPct = Math.round((storageData.used / storageData.total) * 100);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px,1fr))', gap: 16 }}>
      {/* Main Storage Card */}
      <div className="adb-storage-card">
        <div className="adb-storage-header">
          <div className="adb-storage-title"><i className="fa-solid fa-hard-drive" style={{ color: '#3B82F6' }}></i> Stockage total</div>
          <span className="adb-badge" style={{ background: usedPct > 80 ? 'rgba(239,68,68,.1)' : 'rgba(16,185,129,.1)', color: usedPct > 80 ? '#EF4444' : '#10B981' }}>
            {usedPct}% utilisé
          </span>
        </div>
        <div className="adb-storage-total">{storageData.used} <span>/ {storageData.total} {storageData.totalUnit}</span></div>
        <div className="adb-progress" style={{ height: 10, borderRadius: 5 }}>
          <div className="adb-progress-bar" style={{ width: `${usedPct}%`, background: usedPct > 80 ? '#EF4444' : usedPct > 60 ? '#F59E0B' : '#3B82F6' }}></div>
        </div>
        <div className="adb-storage-breakdown">
          <div className="adb-storage-stat"><i className="fa-solid fa-circle" style={{ color: '#3B82F6' }}></i> Utilisé: {storageData.used} {storageData.usedUnit}</div>
          <div className="adb-storage-stat"><i className="fa-solid fa-circle" style={{ color: '#10B981' }}></i> Libre: {storageData.free} {storageData.freeUnit}</div>
        </div>
        <div className="adb-storage-meta">
          <div className="adb-storage-meta-item">
            <i className="fa-solid fa-compress"></i>
            <div><strong>Ratio compression</strong><span>{storageData.compression.ratio}</span></div>
          </div>
          <div className="adb-storage-meta-item">
            <i className="fa-solid fa-floppy-disk"></i>
            <div><strong>Économisé</strong><span>{storageData.compression.saved} {storageData.compression.savedUnit}</span></div>
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className="adb-storage-card">
        <div className="adb-storage-header">
          <div className="adb-storage-title"><i className="fa-solid fa-chart-pie" style={{ color: '#8B5CF6' }}></i> Répartition</div>
        </div>
        <div className="adb-dist-list">
          {storageData.distribution.map((d, i) => {
            const pct = Math.round((d.value / storageData.used) * 100);
            return (
              <div key={i} className="adb-dist-item">
                <span className="adb-dist-label"><i className="fa-solid fa-circle" style={{ color: d.color, fontSize: 10 }}></i> {d.label}</span>
                <div className="adb-dist-bar">
                  <div className="adb-dist-fill" style={{ width: `${pct}%`, background: d.color }}>{pct > 15 ? `${pct}%` : ''}</div>
                </div>
                <span className="adb-dist-value">{d.value} GB</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Location */}
      <div className="adb-storage-card">
        <div className="adb-storage-header">
          <div className="adb-storage-title"><i className="fa-solid fa-location-dot" style={{ color: '#EC4899' }}></i> Par emplacement</div>
        </div>
        <div className="adb-dist-list">
          {storageData.byLocation.map((d, i) => {
            const total = storageData.byLocation.reduce((a, b) => a + b.used, 0);
            const pct = Math.round((d.used / total) * 100);
            return (
              <div key={i} className="adb-dist-item">
                <span className="adb-dist-label"><i className="fa-solid fa-circle" style={{ color: d.color, fontSize: 10 }}></i> {d.location}</span>
                <div className="adb-dist-bar">
                  <div className="adb-dist-fill" style={{ width: `${pct}%`, background: d.color }}>{pct > 12 ? `${pct}%` : ''}</div>
                </div>
                <span className="adb-dist-value">{d.used} GB</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      <div className="adb-storage-card">
        <div className="adb-storage-header">
          <div className="adb-storage-title"><i className="fa-solid fa-bell" style={{ color: '#EF4444' }}></i> Alertes</div>
        </div>
        <div className="adb-alert-list">
          {backupAlerts.filter(a => !a.resolved).slice(0, 5).map(alt => (
            <div key={alt.id} className="adb-alert-item" style={{ padding: '10px 12px' }}>
              <div className="adb-alert-icon" style={{
                background: alt.type === 'error' ? 'rgba(239,68,68,.1)' : alt.type === 'warning' ? 'rgba(245,158,11,.1)' : 'rgba(59,130,246,.1)',
                color: alt.type === 'error' ? '#EF4444' : alt.type === 'warning' ? '#F59E0B' : '#3B82F6',
              }}>
                <i className={`fa-solid ${alt.type === 'error' ? 'fa-circle-exclamation' : alt.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info'}`}></i>
              </div>
              <div className="adb-alert-content">
                <div className="adb-alert-title">{alt.title}</div>
                <div className="adb-alert-msg">{alt.message}</div>
                <div className="adb-alert-time">{alt.time}</div>
              </div>
            </div>
          ))}
          {backupAlerts.filter(a => !a.resolved).length === 0 && (
            <div style={{ textAlign: 'center', padding: 20, color: '#6B7280', fontSize: 13 }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#10B981', fontSize: 24, display: 'block', marginBottom: 8 }}></i>
              Aucune alerte active
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminBackupStorage;
