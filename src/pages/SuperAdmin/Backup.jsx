import React, { useState, useMemo, useCallback } from 'react';
import '../../../src/assets/styles/admin-backup.css';
import {
  AdminBackupStats,
  AdminBackupFilters,
  AdminBackupTable,
  AdminBackupTimeline,
  AdminBackupSnapshots,
  AdminBackupStorage,
  AdminBackupScheduler,
  AdminBackupRestore,
  AdminBackupCharts,
} from '../../../src/components/admin/backup';
import {
  backups, defaultBackupFilters, filterBackups,
  backupAlerts,
} from '../../../src/data/adminBackupData';

const Backup = () => {
  const [tab, setTab] = useState('backups');
  const [filters, setFilters] = useState(defaultBackupFilters);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const filtered = useMemo(() => filterBackups(backups, filters), [filters]);

  const tabs = [
    { id: 'backups', label: 'Sauvegardes', icon: 'fa-database', badge: backups.filter(b => b.status === 'in_progress').length },
    { id: 'snapshots', label: 'Snapshots', icon: 'fa-camera', badge: null },
    { id: 'scheduler', label: 'Planification', icon: 'fa-calendar-clock', badge: null },
    { id: 'storage', label: 'Stockage', icon: 'fa-hard-drive', badge: null },
    { id: 'charts', label: 'Statistiques', icon: 'fa-chart-line', badge: null },
    { id: 'timeline', label: 'Historique', icon: 'fa-clock-rotate-left', badge: null },
  ];

  return (
    <div>
      <div className="adb-hero">
        <h1><i className="fa-solid fa-shield-hdd" style={{ color: '#3B82F6' }}></i> Centre de Sauvegarde & Reprise</h1>
        <p>Protégez vos données avec des sauvegardes automatisées, des snapshots et une restauration rapide — comme AWS Backup.</p>
        <div className="adb-hero-actions">
          <button className="adb-btn-primary"><i className="fa-solid fa-plus"></i> Nouvelle sauvegarde</button>
          <button className="adb-btn-success"><i className="fa-solid fa-camera"></i> Créer un snapshot</button>
          <button className="adb-btn-secondary"><i className="fa-solid fa-calendar-clock"></i> Planifier</button>
          <button className="adb-btn-secondary"><i className="fa-solid fa-file-export"></i> Exporter</button>
        </div>
      </div>

      <AdminBackupStats />

      <div className="adb-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`adb-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            <i className={`fa-solid ${t.icon}`}></i>
            {t.label}
            {t.badge !== null && t.badge !== undefined && t.badge > 0 && (
              <span className="adb-tab-badge">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div className="adb-tab-content">
        {tab === 'backups' && (
          <>
            <AdminBackupFilters filters={filters} onChange={setFilters} total={filtered.length} />
            <div style={{ marginTop: 16 }}>
              <AdminBackupTable backups={filtered} onRestore={setRestoreTarget} />
            </div>
          </>
        )}

        {tab === 'snapshots' && <AdminBackupSnapshots />}
        {tab === 'scheduler' && <AdminBackupScheduler />}
        {tab === 'storage' && <AdminBackupStorage />}
        {tab === 'charts' && <AdminBackupCharts />}
        {tab === 'timeline' && <AdminBackupTimeline />}
      </div>

      {restoreTarget && (
        <AdminBackupRestore backup={restoreTarget} onClose={() => { setRestoreTarget(null); showToast('Restauration terminée avec succès', 'success'); }} />
      )}

      {toast && (
        <div className={`adb-toast ${toast.type}`}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : toast.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}`}></i>
          {toast.msg}
        </div>
      )}
    </div>
  );
};
export default Backup;
