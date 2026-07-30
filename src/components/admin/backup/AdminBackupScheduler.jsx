import { useState } from 'react';
import { schedules, backupCategories, frequencyLabels } from '../../../data/adminBackupData';

const AdminBackupScheduler = () => {
  const [localSchedules, setLocalSchedules] = useState(schedules);

  const toggle = (id) => {
    setLocalSchedules(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  if (localSchedules.length === 0) {
    return (
      <div className="adb-empty-state">
        <i className="fa-solid fa-clock"></i>
        <h3>Aucune planification</h3>
        <p>Créez un plan de sauvegarde pour automatiser vos backups.</p>
        <button className="adb-btn-primary" style={{ margin: '16px auto 0' }}><i className="fa-solid fa-plus"></i> Planifier une sauvegarde</button>
      </div>
    );
  }

  return (
    <div>
      <div className="adb-section-header">
        <div className="adb-section-title"><i className="fa-solid fa-calendar-clock" style={{ color: '#3B82F6' }}></i> Planifications <span className="adb-tab-badge">{localSchedules.length}</span></div>
        <div className="adb-section-actions">
          <button className="adb-btn-sm success"><i className="fa-solid fa-plus"></i> Nouvelle planification</button>
          <button className="adb-btn-sm primary"><i className="fa-solid fa-print"></i> Exporter</button>
        </div>
      </div>
      <div className="adb-schedule-list">
        {localSchedules.map(sch => {
          const cat = backupCategories.find(c => c.id === sch.type);
          return (
            <div key={sch.id} className="adb-schedule-item">
              <div className="adb-schedule-header">
                <div>
                  <div className="adb-schedule-name">
                    <i className={`fa-solid ${cat?.icon || 'fa-database'}`} style={{ color: cat?.color || '#6B7280', fontSize: 14 }}></i>
                    {sch.name}
                    <span className={`adb-badge-sm ${sch.status === 'active' ? '' : ''}`} style={{
                      background: sch.status === 'active' ? 'rgba(16,185,129,.1)' : 'rgba(107,114,128,.1)',
                      color: sch.status === 'active' ? '#10B981' : '#6B7280',
                    }}>
                      <i className="fa-solid fa-circle" style={{ fontSize: 7 }}></i> {sch.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label className="adb-toggle" onClick={() => toggle(sch.id)}>
                    <input type="checkbox" checked={sch.status === 'active'} readOnly />
                    <span className="adb-toggle-slider"></span>
                  </label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="adb-btn-sm ghost"><i className="fa-regular fa-pen-to-square"></i></button>
                    <button className="adb-btn-sm danger"><i className="fa-regular fa-trash-can"></i></button>
                  </div>
                </div>
              </div>
              <div className="adb-schedule-info">
                <span><i className="fa-solid fa-arrows-rotate"></i> {frequencyLabels[sch.frequency] || sch.frequency}</span>
                <span><i className="fa-regular fa-clock"></i> {sch.time}</span>
                <span><i className="fa-solid fa-box-archive"></i> Rétention: {sch.retention}</span>
                <span><i className="fa-solid fa-hard-drive"></i> {sch.storage}</span>
                <span><i className="fa-regular fa-calendar-check"></i> Prochaine: {sch.nextRun}</span>
                <span><i className="fa-regular fa-user"></i> {sch.creator?.split(' ')[1] || sch.creator}</span>
              </div>
              {sch.destinations && sch.destinations.length > 0 && (
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 6, fontFamily: 'monospace' }}>
                  <i className="fa-regular fa-folder"></i> {sch.destinations.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminBackupScheduler;
