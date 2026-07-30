import React, { useState, useMemo } from 'react';
import '../../../src/assets/styles/admin-ai.css';
import {
  AdminAIStats,
  AdminAIAssistants,
  AdminAIWorkflows,
  AdminAISuggestions,
  AdminAIAnalytics,
  AdminAIHistory,
  AdminAIFilters,
  AdminAITable,
  AdminAIAutomation,
} from '../../../src/components/admin/ai';
import {
  automations, defaultAIFilters, filterAI,
} from '../../../src/data/adminAIData';

const AI = () => {
  const [tab, setTab] = useState('assistants');
  const [filters, setFilters] = useState(defaultAIFilters);

  const filteredAutomations = useMemo(() => filterAI(automations, filters), [filters]);

  const tabs = [
    { id: 'assistants', label: 'Assistants IA', icon: 'fa-robot', badge: null },
    { id: 'workflows', label: 'Workflows', icon: 'fa-diagram-project', badge: null },
    { id: 'automations', label: 'Automatisations', icon: 'fa-bolt', badge: null },
    { id: 'suggestions', label: 'Suggestions', icon: 'fa-lightbulb', badge: null },
    { id: 'analytics', label: 'Analyses', icon: 'fa-chart-line', badge: null },
    { id: 'history', label: 'Historique', icon: 'fa-clock-rotate-left', badge: null },
  ];

  return (
    <div>
      <div className="adai-hero">
        <h1><i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#8B5CF6' }}></i> Centre IA & Automatisation</h1>
        <p>Pilotez vos assistants intelligents, automatisez vos processus et exploitez l'analyse prédictive — comme Microsoft Copilot et n8n.</p>
        <div className="adai-hero-actions">
          <button className="adai-btn-primary"><i className="fa-solid fa-plus"></i> Nouvel assistant</button>
          <button className="adai-btn-secondary"><i className="fa-solid fa-diagram-project"></i> Créer un workflow</button>
          <button className="adai-btn-secondary"><i className="fa-solid fa-bolt"></i> Automatisation</button>
          <button className="adai-btn-secondary"><i className="fa-solid fa-file-export"></i> Exporter</button>
        </div>
      </div>

      <AdminAIStats />

      <div className="adai-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`adai-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            <i className={`fa-solid ${t.icon}`}></i>
            {t.label}
            {t.badge !== null && t.badge !== undefined && t.badge > 0 && (
              <span className="adai-tab-badge">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div className="adai-tab-content">
        {tab === 'assistants' && <AdminAIAssistants />}
        {tab === 'workflows' && <AdminAIWorkflows />}
        {tab === 'automations' && (
          <>
            <AdminAIFilters filters={filters} onChange={setFilters} total={filteredAutomations.length} />
            <div style={{ marginTop: 16 }}>
              <AdminAIAutomation />
            </div>
          </>
        )}
        {tab === 'suggestions' && <AdminAISuggestions />}
        {tab === 'analytics' && <AdminAIAnalytics />}
        {tab === 'history' && <AdminAIHistory />}
      </div>
    </div>
  );
};
export default AI;
