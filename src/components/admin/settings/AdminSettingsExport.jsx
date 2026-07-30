import React from 'react';

const AdminSettingsExport = ({ setToast }) => {
  const handleExport = (type) => {
    if (setToast) setToast({ show: true, type: 'info', message: `Export ${type} en cours (simulation)` });
  };

  return (
    <div className="adst-io-grid">
      <div className="adst-io-card" onClick={() => handleExport('JSON')}>
        <div className="adst-io-icon" style={{ color: '#3B82F6' }}><i className="fas fa-file-export" /></div>
        <div className="adst-io-title">Exporter en JSON</div>
        <div className="adst-io-desc">Exporter toute la configuration au format JSON</div>
      </div>
      <div className="adst-io-card" onClick={() => handleExport('Sauvegarde')}>
        <div className="adst-io-icon" style={{ color: '#F59E0B' }}><i className="fas fa-floppy-disk" /></div>
        <div className="adst-io-title">Sauvegarder</div>
        <div className="adst-io-desc">Créer une sauvegarde complète de la configuration</div>
      </div>
      <div className="adst-io-card" onClick={() => handleExport('Réinitialisation')}>
        <div className="adst-io-icon" style={{ color: '#EF4444' }}><i className="fas fa-rotate-left" /></div>
        <div className="adst-io-title">Réinitialiser</div>
        <div className="adst-io-desc">Réinitialiser tous les paramètres par défaut</div>
      </div>
      <div className="adst-io-card" onClick={() => handleExport('Téléchargement')}>
        <div className="adst-io-icon" style={{ color: '#10B981' }}><i className="fas fa-download" /></div>
        <div className="adst-io-title">Télécharger la sauvegarde</div>
        <div className="adst-io-desc">Télécharger la dernière sauvegarde</div>
      </div>
    </div>
  );
};

export default AdminSettingsExport;
