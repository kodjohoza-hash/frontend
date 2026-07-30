import { useState, useEffect } from 'react';
import { backups } from '../../../data/adminBackupData';

const AdminBackupRestore = ({ backup, onClose }) => {
  const [step, setStep] = useState('confirm');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step !== 'restoring') return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.floor(Math.random() * 8) + 2;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [step]);

  const bkp = backup || backups[0];
  const estimatedTime = bkp.size > 0 ? Math.round(bkp.size * 0.35) : 15;

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setStep('done'), 600);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <div className="adb-restore-overlay" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="adb-restore-modal">
        <div className="adb-restore-header">
          <h2><i className="fa-solid fa-rotate-left" style={{ color: '#F59E0B', marginRight: 8 }}></i> Restaurer une sauvegarde</h2>
          <button className="adb-restore-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>

        {step === 'confirm' && (
          <div className="adb-restore-body">
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>Vous êtes sur le point de restaurer la sauvegarde suivante :</p>
            <div className="adb-restore-field"><label>Nom</label><div className="adb-value">{bkp.name}</div></div>
            <div className="adb-restore-field"><label>Version</label><div className="adb-value">{bkp.version || 'N/A'}</div></div>
            <div className="adb-restore-field"><label>Date</label><div className="adb-value">{bkp.date} à {bkp.time}</div></div>
            <div className="adb-restore-field"><label>Taille</label><div className="adb-value">{bkp.size > 0 ? `${bkp.size} ${bkp.sizeUnit}` : '—'}</div></div>
            <div className="adb-restore-field"><label>Temps estimé</label><div className="adb-value">~{estimatedTime} minutes</div></div>
            <div className="adb-restore-field"><label>Type</label><div className="adb-value">{bkp.category}</div></div>
            <div className="adb-restore-footer">
              <button className="adb-btn-secondary" style={{ color: '#374151', borderColor: '#D1D5DB' }} onClick={onClose}>Annuler</button>
              <button className="adb-btn-warning" onClick={() => setStep('restoring')}><i className="fa-solid fa-rotate-left"></i> Démarrer la restauration</button>
            </div>
          </div>
        )}

        {step === 'restoring' && (
          <div className="adb-restore-body">
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>Restauration en cours...</p>
            <div className="adb-restore-progress">
              <div className="adb-restore-progress-label">
                <span>Progression</span>
                <span>{progress}%</span>
              </div>
              <div className="adb-progress" style={{ height: 10, borderRadius: 5 }}>
                <div className="adb-progress-bar" style={{ width: `${progress}%`, background: progress >= 100 ? '#10B981' : '#F59E0B' }}></div>
              </div>
            </div>
            <div className="adb-restore-field"><label>Restauration de</label><div className="adb-value">{bkp.name}</div></div>
            {progress >= 100 && (
              <div style={{ textAlign: 'center', padding: 16, marginTop: 12, background: 'rgba(16,185,129,.08)', borderRadius: 10 }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: 32, color: '#10B981' }}></i>
                <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 600, color: '#10B981' }}>Restauration terminée avec succès !</p>
              </div>
            )}
            <div className="adb-restore-footer">
              <button className="adb-btn-secondary" style={{ color: '#374151', borderColor: '#D1D5DB' }} onClick={onClose}>Fermer</button>
              {progress >= 100 && <button className="adb-btn-success" onClick={onClose}><i className="fa-solid fa-check"></i> Terminé</button>}
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="adb-restore-body">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: 48, color: '#10B981' }}></i>
              <h3 style={{ margin: '16px 0 8px', color: '#1E1B4B' }}>Restauration réussie</h3>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>La sauvegarde <strong>{bkp.name}</strong> a été restaurée avec succès.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, fontSize: 12, color: '#6B7280' }}>
                <span><i className="fa-regular fa-clock"></i> Temps réel: ~{estimatedTime} min</span>
                <span><i className="fa-solid fa-hard-drive"></i> {bkp.size > 0 ? `${bkp.size} ${bkp.sizeUnit}` : '—'}</span>
              </div>
            </div>
            <div className="adb-restore-footer" style={{ justifyContent: 'center' }}>
              <button className="adb-btn-success" onClick={onClose}><i className="fa-solid fa-check"></i> Fermer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminBackupRestore;
