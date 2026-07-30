import React from 'react';

const AdminSettingsImport = ({ setToast }) => {
  const handleImport = (type) => {
    if (setToast) setToast({ show: true, type: 'info', message: `Import ${type} en cours (simulation)` });
  };

  return (
    <div className="adst-io-grid">
      <div className="adst-io-card" onClick={() => handleImport('JSON')}>
        <div className="adst-io-icon" style={{ color: '#8B5CF6' }}><i className="fas fa-file-import" /></div>
        <div className="adst-io-title">Importer JSON</div>
        <div className="adst-io-desc">Importer la configuration depuis un fichier JSON</div>
      </div>
      <div className="adst-io-card" onClick={() => handleImport('fichier de sauvegarde')}>
        <div className="adst-io-icon" style={{ color: '#10B981' }}><i className="fas fa-database" /></div>
        <div className="adst-io-title">Restaurer une sauvegarde</div>
        <div className="adst-io-desc">Restaurer la configuration depuis une sauvegarde</div>
      </div>
    </div>
  );
};

export default AdminSettingsImport;
