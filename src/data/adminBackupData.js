/* ══════════════════════════════════════════════════════════════
   BACKUP & DISASTER RECOVERY — Bus Tix Connect Super Admin
   Ready for Express.js, AWS S3, GCP, Azure, NAS, Local
   ══════════════════════════════════════════════════════════════ */

/* ─── Categories ─── */
export const backupCategories = [
  { id: 'full', label: 'Complète', icon: 'fa-database', color: '#8B5CF6' },
  { id: 'incremental', label: 'Incrémentielle', icon: 'fa-plus-circle', color: '#3B82F6' },
  { id: 'differential', label: 'Différentielle', icon: 'fa-not-equal', color: '#10B981' },
  { id: 'snapshot', label: 'Snapshot', icon: 'fa-camera', color: '#F59E0B' },
  { id: 'database', label: 'Base de données', icon: 'fa-server', color: '#EC4899' },
  { id: 'files', label: 'Fichiers', icon: 'fa-folder', color: '#14B8A6' },
  { id: 'config', label: 'Configuration', icon: 'fa-cog', color: '#F97316' },
  { id: 'logs', label: 'Logs', icon: 'fa-file-lines', color: '#6366F1' },
];

/* ─── Statuses ─── */
export const backupStatuses = [
  { id: 'completed', label: 'Réussie', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  { id: 'failed', label: 'Échouée', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  { id: 'in_progress', label: 'En cours', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  { id: 'pending', label: 'Planifiée', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  { id: 'cancelled', label: 'Annulée', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  { id: 'expired', label: 'Expirée', color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)' },
];

/* ─── KPI ─── */
export const backupKPI = {
  totalBackups: { label: 'Sauvegardes totales', value: 348, trend: 12, icon: 'fa-database', color: '#8B5CF6' },
  successfulBackups: { label: 'Sauvegardes réussies', value: 328, trend: 14, icon: 'fa-circle-check', color: '#10B981' },
  failedBackups: { label: 'Sauvegardes échouées', value: 20, trend: -5, icon: 'fa-circle-xmark', color: '#EF4444' },
  lastBackup: { label: 'Dernière sauvegarde', value: 'Aujourd\'hui 03:00', icon: 'fa-clock', color: '#3B82F6', noTrend: true },
  lastRestore: { label: 'Dernière restauration', value: '28/07/2026', icon: 'fa-rotate-left', color: '#F59E0B', noTrend: true },
  storageUsed: { label: 'Stockage utilisé', value: 284, suffix: 'GB', trend: 8, icon: 'fa-hard-drive', color: '#EC4899' },
  storageAvailable: { label: 'Stockage disponible', value: 716, suffix: 'GB', trend: 0, icon: 'fa-draw-polygon', color: '#14B8A6', noTrend: true },
  avgBackupTime: { label: 'Temps moyen de sauvegarde', value: 18, suffix: 'min', trend: -2, icon: 'fa-gauge-high', color: '#F97316' },
  avgRestoreTime: { label: 'Temps moyen de restauration', value: 42, suffix: 'min', trend: -5, icon: 'fa-clock-rotate-left', color: '#6366F1' },
};

/* ─── Backups ─── */
export const backups = [
  { id: 'bkp_001', name: 'Backup complet plateforme', category: 'full', size: 128.5, sizeUnit: 'GB', date: '2026-07-30', time: '03:00', duration: 22, status: 'completed', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/full/', version: 'v7.4.2', creator: 'Système (Auto)', description: 'Sauvegarde complète de la plateforme BUS TIX CONNECT.', retention: '30 jours' },
  { id: 'bkp_002', name: 'Backup DB transactions', category: 'database', size: 45.2, sizeUnit: 'GB', date: '2026-07-30', time: '03:30', duration: 15, status: 'completed', compression: 'zstd', encrypted: true, location: 's3://btc-backups/prod/db/', version: 'v7.4.2', creator: 'Système (Auto)', description: 'Sauvegarde de la base de données transactionnelle.', retention: '90 jours' },
  { id: 'bkp_003', name: 'Backup incrémentiel #1', category: 'incremental', size: 8.3, sizeUnit: 'GB', date: '2026-07-30', time: '04:15', duration: 6, status: 'completed', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/incr/', version: 'v7.4.2', creator: 'Système (Auto)', description: 'Sauvegarde incrémentielle des fichiers modifiés.', retention: '14 jours' },
  { id: 'bkp_004', name: 'Backup fichiers uploads', category: 'files', size: 62.8, sizeUnit: 'GB', date: '2026-07-30', time: '02:00', duration: 28, status: 'completed', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/uploads/', version: 'v7.4.2', creator: 'Système (Auto)', description: 'Sauvegarde des fichiers uploadés (logos, photos, documents).', retention: '60 jours' },
  { id: 'bkp_005', name: 'Backup configuration', category: 'config', size: 0.45, sizeUnit: 'GB', date: '2026-07-30', time: '01:00', duration: 4, status: 'completed', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/config/', version: 'v7.4.2', creator: 'Système (Auto)', description: 'Sauvegarde des fichiers de configuration.', retention: '180 jours' },
  { id: 'bkp_006', name: 'Backup logs plateforme', category: 'logs', size: 12.4, sizeUnit: 'GB', date: '2026-07-30', time: '05:00', duration: 9, status: 'completed', compression: 'zstd', encrypted: false, location: 's3://btc-backups/prod/logs/', version: 'v7.4.2', creator: 'Système (Auto)', description: 'Archive des logs de la plateforme.', retention: '90 jours' },
  { id: 'bkp_007', name: 'Snapshot pré-déploiement v7.5', category: 'snapshot', size: 256.0, sizeUnit: 'GB', date: '2026-07-29', time: '22:00', duration: 8, status: 'completed', compression: 'none', encrypted: true, location: 'snapshot://prod/v7.5-pre/', version: 'v7.5.0-rc', creator: 'Admin Guillaume', description: 'Snapshot avant le déploiement de la v7.5.0.', retention: '7 jours' },
  { id: 'bkp_008', name: 'Backup complet hebdomadaire', category: 'full', size: 132.1, sizeUnit: 'GB', date: '2026-07-27', time: '03:00', duration: 25, status: 'completed', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/full/', version: 'v7.4.1', creator: 'Système (Auto)', description: 'Sauvegarde complète hebdomadaire.', retention: '30 jours' },
  { id: 'bkp_009', name: 'Backup DB utilisateurs', category: 'database', size: 18.7, sizeUnit: 'GB', date: '2026-07-27', time: '03:30', duration: 11, status: 'completed', compression: 'zstd', encrypted: true, location: 's3://btc-backups/prod/db/', version: 'v7.4.1', creator: 'Système (Auto)', description: 'Sauvegarde de la base de données utilisateurs.', retention: '90 jours' },
  { id: 'bkp_010', name: 'Backup différentiel #1', category: 'differential', size: 32.6, sizeUnit: 'GB', date: '2026-07-26', time: '03:00', duration: 14, status: 'completed', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/diff/', version: 'v7.4.1', creator: 'Système (Auto)', description: 'Sauvegarde différentielle des modifications.', retention: '14 jours' },
  { id: 'bkp_011', name: 'Restauration test v7.3', category: 'full', size: 125.0, sizeUnit: 'GB', date: '2026-07-25', time: '10:00', duration: 45, status: 'completed', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/full/', version: 'v7.3.0', creator: 'Admin Guillaume', description: 'Restauration de test pour valider l\'intégrité.', retention: '7 jours' },
  { id: 'bkp_012', name: 'Backup complet mensuel', category: 'full', size: 130.8, sizeUnit: 'GB', date: '2026-07-01', time: '03:00', duration: 24, status: 'completed', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/full/', version: 'v7.4.0', creator: 'Système (Auto)', description: 'Sauvegarde complète mensuelle.', retention: '365 jours' },
  { id: 'bkp_013', name: 'Backup DB échouée', category: 'database', size: 0, sizeUnit: 'GB', date: '2026-07-28', time: '03:30', duration: 0, status: 'failed', compression: null, encrypted: false, location: null, version: 'v7.4.1', creator: 'Système (Auto)', description: 'Échec de la sauvegarde — connexion DB perdue.', retention: 'N/A' },
  { id: 'bkp_014', name: 'Backup en cours', category: 'full', size: 64.2, sizeUnit: 'GB', date: '2026-07-30', time: '10:15', duration: 0, status: 'in_progress', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/full/', version: 'v7.4.2', creator: 'Admin Douala', description: 'Sauvegarde manuelle en cours.', retention: '30 jours' },
  { id: 'bkp_015', name: 'Backup planifié v7.5', category: 'full', size: 0, sizeUnit: 'GB', date: '2026-08-01', time: '03:00', duration: 0, status: 'pending', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/full/', version: 'v7.5.0', creator: 'Planificateur', description: 'Sauvegarde complète planifiée.', retention: '30 jours' },
  { id: 'bkp_016', name: 'Snapshot mise à jour sécurité', category: 'snapshot', size: 256.0, sizeUnit: 'GB', date: '2026-07-22', time: '20:00', duration: 7, status: 'completed', compression: 'none', encrypted: true, location: 'snapshot://prod/security-patch/', version: 'v7.4.1', creator: 'Admin Guillaume', description: 'Snapshot avant patch de sécurité critique.', retention: '14 jours' },
  { id: 'bkp_017', name: 'Backup fichiers uploads (échec)', category: 'files', size: 0, sizeUnit: 'GB', date: '2026-07-20', time: '02:00', duration: 0, status: 'failed', compression: null, encrypted: false, location: null, version: 'v7.4.0', creator: 'Système (Auto)', description: 'Échec — espace de stockage insuffisant.', retention: 'N/A' },
  { id: 'bkp_018', name: 'Backup configuration prod', category: 'config', size: 0.42, sizeUnit: 'GB', date: '2026-07-29', time: '01:00', duration: 3, status: 'completed', compression: 'gzip', encrypted: true, location: 's3://btc-backups/prod/config/', version: 'v7.4.2', creator: 'Système (Auto)', description: 'Sauvegarde quotidienne de la configuration.', retention: '180 jours' },
  { id: 'bkp_019', name: 'Backup logs expire', category: 'logs', size: 15.1, sizeUnit: 'GB', date: '2026-06-30', time: '05:00', duration: 10, status: 'expired', compression: 'zstd', encrypted: false, location: 's3://btc-backups/prod/logs/', version: 'v7.3.0', creator: 'Système (Auto)', description: 'Sauvegarde des logs — conservation expirée.', retention: '30 jours' },
  { id: 'bkp_020', name: 'Backup annulé (maintenance)', category: 'full', size: 0, sizeUnit: 'GB', date: '2026-07-15', time: '03:00', duration: 0, status: 'cancelled', compression: null, encrypted: false, location: null, version: 'v7.4.0', creator: 'Admin Guillaume', description: 'Annulé pour maintenance planifiée.', retention: 'N/A' },
];

/* ─── Snapshots ─── */
export const snapshots = [
  { id: 'snap_001', name: 'Pre-deploy v7.5', server: 'BTC-PROD-WEB-01', date: '2026-07-29', time: '22:00', status: 'completed', size: 256, sizeUnit: 'GB', type: 'manual', description: 'Snapshot avant déploiement v7.5.0' },
  { id: 'snap_002', name: 'Security Patch', server: 'BTC-PRO-DB-01', date: '2026-07-22', time: '20:00', status: 'completed', size: 180, sizeUnit: 'GB', type: 'manual', description: 'Snapshot avant patch de sécurité critique' },
  { id: 'snap_003', name: 'Config Update', server: 'BTC-PROD-API-01', date: '2026-07-18', time: '14:00', status: 'completed', size: 2.5, sizeUnit: 'GB', type: 'automatic', description: 'Snapshot automatique avant modification configuration' },
  { id: 'snap_004', name: 'DB Migration', server: 'BTC-PRO-DB-01', date: '2026-07-10', time: '02:00', status: 'completed', size: 190, sizeUnit: 'GB', type: 'manual', description: 'Snapshot avant migration base de données' },
  { id: 'snap_005', name: 'Daily Auto-Snapshot', server: 'BTC-PROD-WEB-01', date: '2026-07-30', time: '00:00', status: 'completed', size: 260, sizeUnit: 'GB', type: 'automatic', description: 'Snapshot automatique quotidien' },
  { id: 'snap_006', name: 'Failed Snapshot', server: 'BTC-PROD-API-01', date: '2026-07-28', time: '00:00', status: 'failed', size: 0, sizeUnit: 'GB', type: 'automatic', description: 'Snapshot échoué — erreur de volume' },
  { id: 'snap_007', name: 'Hotfix v7.4.3', server: 'BTC-PROD-WEB-01', date: '2026-07-25', time: '18:00', status: 'completed', size: 255, sizeUnit: 'GB', type: 'manual', description: 'Snapshot avant déploiement correctif urgent' },
];

/* ─── Schedules ─── */
export const schedules = [
  { id: 'sch_001', name: 'Backup complet quotidien', type: 'full', frequency: 'daily', time: '03:00', retention: '30 jours', storage: 'AWS S3 - Standard', status: 'active', lastRun: '2026-07-30 03:00', nextRun: '2026-07-31 03:00', creator: 'Admin Guillaume', createdAt: '2026-01-01', destinations: ['s3://btc-backups/prod/full/'] },
  { id: 'sch_002', name: 'Backup DB toutes les 6h', type: 'database', frequency: 'custom', time: '00:00,06:00,12:00,18:00', retention: '90 jours', storage: 'AWS S3 - Glacier', status: 'active', lastRun: '2026-07-30 00:00', nextRun: '2026-07-30 12:00', creator: 'Admin Guillaume', createdAt: '2026-01-01', destinations: ['s3://btc-backups/prod/db/'] },
  { id: 'sch_003', name: 'Backup fichiers uploads', type: 'files', frequency: 'daily', time: '02:00', retention: '60 jours', storage: 'AWS S3 - Standard', status: 'active', lastRun: '2026-07-30 02:00', nextRun: '2026-07-31 02:00', creator: 'Admin Guillaume', createdAt: '2026-01-15', destinations: ['s3://btc-backups/prod/uploads/'] },
  { id: 'sch_004', name: 'Backup incrémentiel horaire', type: 'incremental', frequency: 'hourly', time: ':00', retention: '14 jours', storage: 'AWS S3 - Standard', status: 'active', lastRun: '2026-07-30 10:00', nextRun: '2026-07-30 11:00', creator: 'Admin Guillaume', createdAt: '2026-01-01', destinations: ['s3://btc-backups/prod/incr/'] },
  { id: 'sch_005', name: 'Backup configuration', type: 'config', frequency: 'daily', time: '01:00', retention: '180 jours', storage: 'AWS S3 - Standard', status: 'active', lastRun: '2026-07-30 01:00', nextRun: '2026-07-31 01:00', creator: 'Admin Guillaume', createdAt: '2026-01-20', destinations: ['s3://btc-backups/prod/config/'] },
  { id: 'sch_006', name: 'Backup logs hebdomadaire', type: 'logs', frequency: 'weekly', time: '05:00', retention: '90 jours', storage: 'AWS S3 - Glacier', status: 'active', lastRun: '2026-07-27 05:00', nextRun: '2026-08-03 05:00', creator: 'Admin Douala', createdAt: '2026-02-01', destinations: ['s3://btc-backups/prod/logs/'] },
  { id: 'sch_007', name: 'Snapshot automatique quotidien', type: 'snapshot', frequency: 'daily', time: '00:00', retention: '7 jours', storage: 'Local - SSD NVMe', status: 'active', lastRun: '2026-07-30 00:00', nextRun: '2026-07-31 00:00', creator: 'Admin Guillaume', createdAt: '2026-01-01', destinations: ['snapshot://prod/daily/'] },
  { id: 'sch_008', name: 'Backup complet mensuel', type: 'full', frequency: 'monthly', time: '03:00', retention: '365 jours', storage: 'AWS S3 - Glacier Deep Archive', status: 'active', lastRun: '2026-07-01 03:00', nextRun: '2026-08-01 03:00', creator: 'Admin Guillaume', createdAt: '2026-01-01', destinations: ['s3://btc-backups/prod/monthly/'] },
  { id: 'sch_009', name: 'Backup différentiel hebdo', type: 'differential', frequency: 'weekly', time: '03:00', retention: '14 jours', storage: 'AWS S3 - Standard', status: 'inactive', lastRun: '2026-07-26 03:00', nextRun: '2026-08-02 03:00', creator: 'Admin Douala', createdAt: '2026-03-01', destinations: ['s3://btc-backups/prod/diff/'] },
  { id: 'sch_010', name: 'Backup test restauration', type: 'full', frequency: 'monthly', time: '10:00', retention: '7 jours', storage: 'NAS Local', status: 'inactive', lastRun: '2026-07-25 10:00', nextRun: '2026-08-25 10:00', creator: 'Admin Guillaume', createdAt: '2026-04-01', destinations: ['nas://btc-backups/test/'] },
];

/* ─── Storage Data ─── */
export const storageData = {
  total: 1000, totalUnit: 'GB',
  used: 284, usedUnit: 'GB',
  free: 716, freeUnit: 'GB',
  compression: { ratio: '2.4:1', saved: 185, savedUnit: 'GB' },
  distribution: [
    { label: 'Sauvegardes complètes', value: 128, color: '#8B5CF6' },
    { label: 'Base de données', value: 64, color: '#EC4899' },
    { label: 'Fichiers uploads', value: 63, color: '#14B8A6' },
    { label: 'Snapshots', value: 18, color: '#F59E0B' },
    { label: 'Logs', value: 12, color: '#6366F1' },
    { label: 'Configuration', value: 1, color: '#F97316' },
  ],
  evolution: [
    { month: 'Jan', used: 180 },
    { month: 'Fév', used: 195 },
    { month: 'Mar', used: 210 },
    { month: 'Avr', used: 225 },
    { month: 'Mai', used: 240 },
    { month: 'Juin', used: 260 },
    { month: 'Juil', used: 284 },
  ],
  byLocation: [
    { location: 'AWS S3 - Standard', used: 180, color: '#3B82F6' },
    { location: 'AWS S3 - Glacier', used: 60, color: '#8B5CF6' },
    { location: 'AWS S3 - Glacier Deep', used: 8, color: '#EC4899' },
    { location: 'NAS Local', used: 24, color: '#10B981' },
    { location: 'SSD NVMe (Snapshots)', used: 12, color: '#F59E0B' },
  ],
};

/* ─── Alerts ─── */
export const backupAlerts = [
  { id: 'alt_001', type: 'error', title: 'Échec de sauvegarde DB', message: 'La sauvegarde de la base de données a échoué le 28/07/2026 à 03:30 — connexion perdue.', time: 'Il y a 2 jours', resolved: true },
  { id: 'alt_002', type: 'warning', title: 'Stockage faible', message: 'Stockage AWS S3 à 85% — prévoir une extension.', time: 'Il y a 5 jours', resolved: false },
  { id: 'alt_003', type: 'error', title: 'Sauvegarde expirée', message: 'La sauvegarde des logs du 30/06/2026 a expiré.', time: 'Il y a 7 jours', resolved: false },
  { id: 'alt_004', type: 'warning', title: 'Aucune sauvegarde récente', message: 'Le serveur BTC-PROD-API-01 n\'a pas été sauvegardé depuis 48h.', time: 'Il y a 3 jours', resolved: true },
  { id: 'alt_005', type: 'error', title: 'Erreur de snapshot', message: 'Le snapshot automatique du 28/07/2026 a échoué — erreur de volume.', time: 'Il y a 2 jours', resolved: false },
  { id: 'alt_006', type: 'info', title: 'Restauration réussie', message: 'Restauration de test v7.3 terminée avec succès le 25/07/2026.', time: 'Il y a 5 jours', resolved: true },
  { id: 'alt_007', type: 'warning', title: 'Sauvegarde NAS échouée', message: 'Le NAS local est inaccessible — vérifier la connexion réseau.', time: 'Il y a 1 jour', resolved: false },
];

/* ─── Timeline ─── */
export const backupTimeline = [
  { id: 'tl_001', type: 'backup', title: 'Sauvegarde complète hebdomadaire', description: 'Backup complet — 132.1 Go — AWS S3', user: 'Système (Auto)', time: '2026-07-30T03:00:00', status: 'success' },
  { id: 'tl_002', type: 'backup', title: 'Sauvegarde DB transactions', description: 'Base de données — 45.2 Go — AWS S3', user: 'Système (Auto)', time: '2026-07-30T03:30:00', status: 'success' },
  { id: 'tl_003', type: 'backup', title: 'Sauvegarde incrémentielle', description: 'Incrémentiel — 8.3 Go — AWS S3', user: 'Système (Auto)', time: '2026-07-30T04:15:00', status: 'success' },
  { id: 'tl_004', type: 'snapshot', title: 'Snapshot pré-déploiement', description: 'Snapshot v7.5.0-rc — Serveur WEB-01', user: 'Admin Guillaume', time: '2026-07-29T22:00:00', status: 'success' },
  { id: 'tl_005', type: 'error', title: 'Échec sauvegarde DB', description: 'Connexion base de données perdue — 0 Go', user: 'Système (Auto)', time: '2026-07-28T03:30:00', status: 'error' },
  { id: 'tl_006', type: 'restore', title: 'Restauration test v7.3', description: 'Restauration complète — 125 Go — Durée: 45 min', user: 'Admin Guillaume', time: '2026-07-25T10:00:00', status: 'success' },
  { id: 'tl_007', type: 'snapshot', title: 'Snapshot hotfix v7.4.3', description: 'Snapshot avant déploiement correctif — WEB-01', user: 'Admin Guillaume', time: '2026-07-25T18:00:00', status: 'success' },
  { id: 'tl_008', type: 'delete', title: 'Suppression sauvegarde expirée', description: 'Backup logs du 30/06/2026 — 15.1 Go supprimés', user: 'Système (Auto)', time: '2026-07-25T05:00:00', status: 'info' },
  { id: 'tl_009', type: 'backup', title: 'Sauvegarde complète mensuelle', description: 'Backup complet — 130.8 Go — AWS S3', user: 'Système (Auto)', time: '2026-07-01T03:00:00', status: 'success' },
  { id: 'tl_010', type: 'snapshot', title: 'Snapshot migration DB', description: 'Snapshot avant migration BDD — Serveur DB-01', user: 'Admin Douala', time: '2026-07-10T02:00:00', status: 'success' },
  { id: 'tl_011', type: 'error', title: 'Échec upload fichiers', description: 'Stockage insuffisant — 0 Go', user: 'Système (Auto)', time: '2026-07-20T02:00:00', status: 'error' },
  { id: 'tl_012', type: 'restore', title: 'Restauration partielle', description: 'Restauration de 3 fichiers de configuration perdus', user: 'Admin Douala', time: '2026-07-15T14:30:00', status: 'success' },
  { id: 'tl_013', type: 'create', title: 'Nouveau plan de backup', description: 'Planification backup complet mensuel créée', user: 'Admin Guillaume', time: '2026-01-01T10:00:00', status: 'info' },
  { id: 'tl_014', type: 'validation', title: 'Vérification d\'intégrité', description: 'Toutes les sauvegardes vérifiées — 100% valides', user: 'Système (Auto)', time: '2026-07-30T06:00:00', status: 'success' },
];

/* ─── Restore History ─── */
export const restoreHistory = [
  { id: 'res_001', name: 'Restauration test v7.3', version: 'v7.3.0', date: '2026-07-25', estimatedTime: 50, actualTime: 45, size: 125, sizeUnit: 'GB', status: 'completed', type: 'full', target: 'BTC-PROD-DR-01', initiatedBy: 'Admin Guillaume' },
  { id: 'res_002', name: 'Restauration partielle config', version: 'v7.4.0', date: '2026-07-15', estimatedTime: 10, actualTime: 7, size: 0.42, sizeUnit: 'GB', status: 'completed', type: 'selective', target: 'BTC-PROD-API-01', initiatedBy: 'Admin Douala' },
  { id: 'res_003', name: 'Restauration fichiers uploads', version: 'v7.4.1', date: '2026-06-20', estimatedTime: 30, actualTime: 22, size: 15.5, sizeUnit: 'GB', status: 'completed', type: 'selective', target: 'BTC-PROD-WEB-01', initiatedBy: 'Admin Guillaume' },
];

/* ─── Chart Data ─── */
export const backupChartData = {
  weeklyActivity: [
    { day: 'Lun', success: 6, failed: 0, size: 85 },
    { day: 'Mar', success: 7, failed: 0, size: 92 },
    { day: 'Mer', success: 5, failed: 1, size: 78 },
    { day: 'Jeu', success: 6, failed: 0, size: 88 },
    { day: 'Ven', success: 7, failed: 0, size: 95 },
    { day: 'Sam', success: 4, failed: 0, size: 62 },
    { day: 'Dim', success: 5, failed: 1, size: 110 },
  ],
  monthlySummary: [
    { month: 'Jan', total: 30, success: 29, failed: 1 },
    { month: 'Fév', total: 28, success: 27, failed: 1 },
    { month: 'Mar', total: 31, success: 30, failed: 1 },
    { month: 'Avr', total: 30, success: 29, failed: 1 },
    { month: 'Mai', total: 31, success: 30, failed: 1 },
    { month: 'Juin', total: 30, success: 28, failed: 2 },
    { month: 'Juil', total: 31, success: 29, failed: 2 },
  ],
};

/* ─── Frequency labels ─── */
export const frequencyLabels = {
  hourly: 'Toutes les heures',
  daily: 'Tous les jours',
  weekly: 'Toutes les semaines',
  monthly: 'Tous les mois',
  custom: 'Personnalisée',
};

/* ─── Default Filters ─── */
export const defaultBackupFilters = { search: '', category: '', status: '' };

/* ─── Filter Helpers ─── */
export const filterBackups = (items, filters) => {
  return items.filter(i => {
    if (filters.search) { const s = filters.search.toLowerCase(); if (!i.name?.toLowerCase().includes(s) && !i.description?.toLowerCase().includes(s)) return false; }
    if (filters.category && i.category !== filters.category) return false;
    if (filters.status && i.status !== filters.status) return false;
    return true;
  });
};
