import React, { useState } from 'react';
import { savedReports, filterSavedReports, defaultReportFilters, reportCategories } from '../../../data/adminReportData';

const AdminSavedReports = ({ filters: globalFilters, setToast }) => {
  const [filters, setFilters] = useState(defaultReportFilters);
  const [reports, setReports] = useState(savedReports);

  const filtered = filterSavedReports(reports, filters);

  const handleFavorite = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));
    setToast({ show: true, type: 'success', message: 'Favori mis à jour' });
  };

  const handleDelete = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    setToast({ show: true, type: 'info', message: 'Rapport supprimé' });
  };

  const handleDuplicate = (id) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    const newReport = { ...report, id: `rpt_${Date.now()}`, name: `${report.name} (copie)`, date: new Date().toISOString().split('T')[0], lastModified: new Date().toLocaleString('fr-FR'), favorite: false };
    setReports(prev => [...prev, newReport]);
    setToast({ show: true, type: 'success', message: 'Rapport dupliqué' });
  };

  const handleView = (report) => {
    setToast({ show: true, type: 'info', message: `Visualisation de "${report.name}" (simulation)` });
  };

  const handleExport = (report) => {
    setToast({ show: true, type: 'info', message: `Export ${report.format} de "${report.name}" (simulation)` });
  };

  const handleShare = (report) => {
    setToast({ show: true, type: 'info', message: `Partage de "${report.name}" (simulation)` });
  };

  const handleCreate = () => {
    setToast({ show: true, type: 'info', message: 'Création d\'un nouveau rapport (simulation)' });
  };

  return (
    <div className="adbi-reports-section">
      <div className="adbi-section-header">
        <h2><i className="fas fa-folder-open" /> Rapports enregistrés</h2>
        <div className="adbi-report-actions">
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            style={{
              background: '#1A1A35', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '0.4rem 0.75rem',
              color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem',
              outline: 'none', width: 180,
            }}
          />
          <select value={filters.category} onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
            style={{ background: '#1A1A35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.4rem 0.75rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', outline: 'none' }}>
            {reportCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="adbi-report-btn adbi-report-btn-primary" onClick={handleCreate}>
            <i className="fas fa-plus" /> Nouveau rapport
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
          <i className="fas fa-folder-open" style={{ fontSize: '2rem', marginBottom: 8, display: 'block' }} />
          Aucun rapport trouvé
        </div>
      ) : (
        <table className="adbi-reports-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Créateur</th>
              <th>Catégorie</th>
              <th>Date</th>
              <th>Modification</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>
                  <span className="adbi-report-name" onClick={() => handleView(r)}>
                    <i className={`fas fa-star${r.favorite ? '' : ' adbi-report-favorite inactive'}`}
                      style={{ marginRight: 8, cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); handleFavorite(r.id); }} />
                    {r.name}
                  </span>
                </td>
                <td>{r.creator}</td>
                <td>{r.category}</td>
                <td>{r.date}</td>
                <td>{r.lastModified}</td>
                <td>
                  <span className={`adbi-report-format ${r.format.toLowerCase()}`}>
                    <i className={`fas ${r.format === 'PDF' ? 'fa-file-pdf' : r.format === 'Excel' ? 'fa-file-excel' : 'fa-file-csv'}`} />
                    {r.format}
                  </span>
                </td>
                <td>
                  <div className="adbi-report-table-actions">
                    <button className="adbi-report-table-action" onClick={() => handleView(r)} title="Voir"><i className="fas fa-eye" /></button>
                    <button className="adbi-report-table-action" onClick={() => handleExport(r)} title="Exporter"><i className="fas fa-download" /></button>
                    <button className="adbi-report-table-action" onClick={() => handleShare(r)} title="Partager"><i className="fas fa-share-nodes" /></button>
                    <button className="adbi-report-table-action" onClick={() => handleDuplicate(r.id)} title="Dupliquer"><i className="fas fa-copy" /></button>
                    <button className="adbi-report-table-action danger" onClick={() => handleDelete(r.id)} title="Supprimer"><i className="fas fa-trash" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSavedReports;
