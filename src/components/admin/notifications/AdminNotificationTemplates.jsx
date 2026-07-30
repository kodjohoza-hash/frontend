import React from 'react';
import { notifCategories } from '../../../data/adminNotificationData';

const catColors = ['#8B5CF6','#3B82F6','#10B981','#FBBF24','#EF4444','#EC4899','#14B8A6','#8B5CF6','#3B82F6','#FBBF24'];

const AdminNotificationTemplates = ({ templates, onSelect, onPreview }) => (
  <div className="adn-template-grid">
    {templates.map((t, i) => (
      <div key={t.id} className="adn-template-card" onClick={() => { onSelect?.(t); onPreview?.(t); }}>
        <div className="adn-template-header">
          <div className="adn-template-icon" style={{ background: `${catColors[i % catColors.length]}22`, color: catColors[i % catColors.length] }}><i className={`fas ${t.icon || 'fa-file-lines'}`} /></div>
          <span className="adn-template-name">{t.name}</span>
        </div>
        <div className="adn-template-category" style={{ background: `${catColors[i % catColors.length]}15`, color: catColors[i % catColors.length] }}>{t.category}</div>
        <div className="adn-template-preview">{t.template?.substring(0, 120)}</div>
        <div className="adn-template-footer"><span><i className="fas fa-clock" /> {t.updatedAt}</span><span>{t.variables} variables</span></div>
      </div>
    ))}
  </div>
);
export default AdminNotificationTemplates;
