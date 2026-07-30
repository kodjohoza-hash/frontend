import React from 'react';

export default function AdminCommissionExport({ onExport }) {
  const handleExport = (format) => {
    onExport?.(format);
  };
  return (
    <div className="adcm-export-bar">
      <button className="adcm-export-btn" onClick={() => handleExport('csv')}>
        <i className="fa-solid fa-file-csv" style={{ color: '#059669' }} /> CSV
      </button>
      <button className="adcm-export-btn" onClick={() => handleExport('excel')}>
        <i className="fa-solid fa-file-excel" style={{ color: '#10B981' }} /> Excel
      </button>
      <button className="adcm-export-btn" onClick={() => handleExport('pdf')}>
        <i className="fa-solid fa-file-pdf" style={{ color: '#EF4444' }} /> PDF
      </button>
      <button className="adcm-export-btn" onClick={() => handleExport('print')}>
        <i className="fa-solid fa-print" style={{ color: '#64748B' }} /> Print
      </button>
    </div>
  );
}
