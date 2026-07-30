import React from 'react';
import { settingsHistory } from '../../../data/adminSettingsData';

const AdminSettingsHistory = ({ categoryId }) => {
  const items = settingsHistory.filter(h => !categoryId || true);

  if (items.length === 0) {
    return <div className="adst-empty"><i className="fas fa-clock-rotate-left" /><p>Aucun historique</p></div>;
  }

  return (
    <div className="adst-history-list">
      {items.map(h => (
        <div key={h.id} className="adst-history-item">
          <div className="adst-history-icon"><i className="fas fa-pen" /></div>
          <div className="adst-history-content">
            <div className="adst-history-field">{h.label}</div>
            <div className="adst-history-meta">
              <i className="fas fa-user" style={{ marginRight: 4 }} />{h.user}
              <span style={{ margin: '0 8px' }}>·</span>
              <i className="fas fa-clock" style={{ marginRight: 4 }} />{h.date}
            </div>
            <div className="adst-history-changes">
              <span className="adst-history-old">{h.oldValue}</span>
              <span className="adst-history-arrow"><i className="fas fa-arrow-right" /></span>
              <span className="adst-history-new">{h.newValue}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSettingsHistory;
