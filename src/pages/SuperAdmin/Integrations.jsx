import React, { useState, useMemo } from 'react';
import '../../../src/assets/styles/admin-integrations.css';
import {
  AdminIntegrationStats,
  AdminIntegrationFilters,
  AdminIntegrationCards,
  AdminIntegrationTable,
  AdminWebhookManager,
  AdminApiKeys,
  AdminApiLogs,
  AdminMonitoringCharts,
  AdminDocumentation,
} from '../../../src/components/admin/integrations';
import {
  integrations, defaultIntegrationFilters, filterIntegrations,
  integrationCategories, integrationStatuses,
} from '../../../src/data/adminIntegrationData';

const Integrations = () => {
  const [tab, setTab] = useState('integrations');
  const [viewMode, setViewMode] = useState('cards');
  const [filters, setFilters] = useState(defaultIntegrationFilters);

  const filtered = useMemo(() => filterIntegrations(integrations, filters), [filters]);

  const tabs = [
    {
      id: 'integrations', label: 'Intégrations', icon: 'fa-plug',
      badge: integrations.filter(i => i.status === 'active').length,
    },
    { id: 'webhooks', label: 'Webhooks', icon: 'fa-bolt', badge: null },
    { id: 'apikeys', label: 'Clés API', icon: 'fa-key', badge: null },
    { id: 'logs', label: 'Logs API', icon: 'fa-file-lines', badge: null },
    { id: 'monitoring', label: 'Monitoring', icon: 'fa-chart-line', badge: null },
    { id: 'docs', label: 'Documentation', icon: 'fa-book', badge: null },
  ];

  return (
    <div className="adi-container">
      <div className="adi-hero">
        <h1><i className="fa-solid fa-puzzle-piece" style={{ color: '#8B5CF6' }}></i> Centre d'Intégrations & API</h1>
        <p>Gérez vos intégrations tierces, webhooks, clés API et surveillez les performances de votre plateforme.</p>
        <div className="adi-hero-actions">
          <button className="adi-btn-primary"><i className="fa-solid fa-plus"></i> Nouvelle intégration</button>
          <button className="adi-btn-secondary"><i className="fa-solid fa-key"></i> Générer une clé API</button>
          <button className="adi-btn-secondary"><i className="fa-regular fa-file-code"></i> Documentation API</button>
        </div>
      </div>

      <AdminIntegrationStats />

      <div className="adi-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`adi-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            <i className={`fa-solid ${t.icon}`}></i>
            {t.label}
            {t.badge !== null && t.badge !== undefined && (
              <span className="adi-tab-badge">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div className="adi-tab-content">
        {/* ─── Integrations Tab ─── */}
        {tab === 'integrations' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <AdminIntegrationFilters filters={filters} onChange={setFilters} total={filtered.length} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className={`adi-card-action toggle${viewMode === 'cards' ? ' edit' : ''}`}
                  onClick={() => setViewMode('cards')}
                  style={{ padding: '6px 12px' }}
                >
                  <i className="fa-solid fa-grid-2"></i> Cartes
                </button>
                <button
                  className={`adi-card-action toggle${viewMode === 'table' ? ' edit' : ''}`}
                  onClick={() => setViewMode('table')}
                  style={{ padding: '6px 12px' }}
                >
                  <i className="fa-solid fa-table"></i> Tableau
                </button>
              </div>
            </div>
            {viewMode === 'cards' ? (
              <AdminIntegrationCards integrations={filtered} />
            ) : (
              <AdminIntegrationTable integrations={filtered} />
            )}
          </>
        )}

        {/* ─── Webhooks Tab ─── */}
        {tab === 'webhooks' && <AdminWebhookManager />}

        {/* ─── API Keys Tab ─── */}
        {tab === 'apikeys' && <AdminApiKeys />}

        {/* ─── Logs Tab ─── */}
        {tab === 'logs' && <AdminApiLogs />}

        {/* ─── Monitoring Tab ─── */}
        {tab === 'monitoring' && <AdminMonitoringCharts />}

        {/* ─── Documentation Tab ─── */}
        {tab === 'docs' && <AdminDocumentation />}
      </div>
    </div>
  );
};
export default Integrations;
