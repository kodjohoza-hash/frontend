import React from 'react';

const AdminAuditExport = ({ setToast }) => {
  const handleExport = (format) => {
    if (setToast) setToast({ show: true, type: 'info', message: `Export ${format} en cours (simulation)` });
  };

  return (
    <div className="ada-export-panel">
      <button className="ada-export-btn" onClick={() => handleExport('CSV')}>
        <i className="fas fa-file-csv" style={{ color: '#3B82F6' }} /> CSV
      </button>
      <button className="ada-export-btn" onClick={() => handleExport('Excel')}>
        <i className="fas fa-file-excel" style={{ color: '#10B981' }} /> Excel
      </button>
      <button className="ada-export-btn" onClick={() => handleExport('PDF')}>
        <i className="fas fa-file-pdf" style={{ color: '#EF4444' }} /> PDF
      </button>
      <button className="ada-export-btn" onClick={() => handleExport('Impression')}>
        <i className="fas fa-print" style={{ color: '#8B5CF6' }} /> Imprimer
      </button>
    </div>
  );
};

export default AdminAuditExport;
