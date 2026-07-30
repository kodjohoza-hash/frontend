import React from 'react';

const AdminExportPanel = ({ setToast }) => {
  const handleExport = (format) => {
    setToast({ show: true, type: 'info', message: `Export ${format} en cours (simulation)` });
  };

  return (
    <div className="adbi-export-panel">
      <button className="adbi-export-btn" onClick={() => handleExport('PDF')} title="Exporter en PDF">
        <i className="fas fa-file-pdf" style={{ color: '#EF4444' }} /> PDF
      </button>
      <button className="adbi-export-btn" onClick={() => handleExport('Excel')} title="Exporter en Excel">
        <i className="fas fa-file-excel" style={{ color: '#10B981' }} /> Excel
      </button>
      <button className="adbi-export-btn" onClick={() => handleExport('CSV')} title="Exporter en CSV">
        <i className="fas fa-file-csv" style={{ color: '#3B82F6' }} /> CSV
      </button>
      <button className="adbi-export-btn" onClick={() => handleExport('Image PNG')} title="Exporter en PNG">
        <i className="fas fa-image" style={{ color: '#F59E0B' }} /> PNG
      </button>
      <button className="adbi-export-btn" onClick={() => handleExport('Impression')} title="Imprimer">
        <i className="fas fa-print" style={{ color: '#8B5CF6' }} /> Imprimer
      </button>
    </div>
  );
};

export default AdminExportPanel;
