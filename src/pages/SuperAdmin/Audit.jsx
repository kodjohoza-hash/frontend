import React, { useState, useMemo, useCallback } from 'react';
import AdminAuditStats from '../../components/admin/audit/AdminAuditStats';
import AdminAuditFilters from '../../components/admin/audit/AdminAuditFilters';
import AdminAuditTable from '../../components/admin/audit/AdminAuditTable';
import AdminAuditTimeline from '../../components/admin/audit/AdminAuditTimeline';
import AdminAuditDetails from '../../components/admin/audit/AdminAuditDetails';
import AdminAuditAlerts from '../../components/admin/audit/AdminAuditAlerts';
import AdminAuditSessions from '../../components/admin/audit/AdminAuditSessions';
import AdminAuditExport from '../../components/admin/audit/AdminAuditExport';
import AdminAuditCards from '../../components/admin/audit/AdminAuditCards';
import AdminAuditSkeleton from '../../components/admin/audit/AdminAuditSkeleton';
import { auditEvents, filterEvents, paginateEvents, defaultFilters } from '../../data/adminAuditData';

const tabs = [
  { id: 'journal', label: 'Journal d\'audit', icon: 'fa-list' },
  { id: 'surveillance', label: 'Surveillance', icon: 'fa-eye' },
  { id: 'alertes', label: 'Alertes', icon: 'fa-bell' },
  { id: 'sessions', label: 'Sessions actives', icon: 'fa-users' },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('journal');
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const perPage = 25;

  const filtered = useMemo(() => filterEvents(auditEvents, filters), [filters]);
  const paginated = useMemo(() => paginateEvents(filtered, page, perPage), [filtered, page]);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setToast({ show: true, type: 'info', message: 'Filtres réinitialisés' });
  }, []);

  const handleSelectEvent = useCallback((e) => setSelectedEvent(e), []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
    setToast({ show: true, type: 'info', message: 'Données actualisées' });
  }, []);

  const renderPagination = () => {
    if (paginated.totalPages <= 1) return null;
    return (
      <div className="ada-pagination">
        <button className="ada-page-btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
          <i className="fas fa-chevron-left" />
        </button>
        {Array.from({ length: Math.min(paginated.totalPages, 5) }, (_, i) => {
          const start = Math.max(1, Math.min(page - 2, paginated.totalPages - 4));
          const p = start + i;
          if (p > paginated.totalPages) return null;
          return (
            <button key={p} className={`ada-page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
              {p}
            </button>
          );
        })}
        <button className="ada-page-btn" disabled={page >= paginated.totalPages} onClick={() => setPage(p => Math.min(paginated.totalPages, p + 1))}>
          <i className="fas fa-chevron-right" />
        </button>
        <span className="ada-page-info">
          Page {paginated.page} / {paginated.totalPages} — {paginated.total} événements
        </span>
      </div>
    );
  };

  return (
    <div className="ada-dashboard">
      <div className="ada-hero">
        <div className="ada-hero-content">
          <h1>
            <i className="fas fa-shield-halved" style={{ color: '#3B82F6' }} />
            Journal d'Audit & Surveillance
          </h1>
          <p>Consultez toutes les actions réalisées sur la plateforme Bus Tix Connect</p>
          <div className="ada-hero-badge">
            <i className="fas fa-circle live" />
            Surveillance en temps réel
            <i className="fas fa-circle" style={{ fontSize: 6, marginLeft: 4 }} />
            <span>200 événements historisés</span>
          </div>
        </div>
      </div>

      <div className="ada-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`ada-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setSelectedEvent(null); }}>
            <i className={`fas ${tab.icon}`} /> {tab.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <AdminAuditExport setToast={setToast} />
          <button className="ada-control-btn" onClick={handleRefresh} style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}>
            <i className="fas fa-rotate" /> Actualiser
          </button>
        </div>
      </div>

      {loading && activeTab === 'journal' ? (
        <AdminAuditSkeleton type="dashboard" />
      ) : (
        <>
          {activeTab === 'journal' && (
            <>
              <AdminAuditStats loading={false} />
              <AdminAuditFilters filters={filters} setFilters={setFilters} onReset={handleReset} />
              <AdminAuditTable events={paginated.items} loading={false} onSelect={handleSelectEvent} selectedId={selectedEvent?.id} />
              {renderPagination()}
              <div className="ada-section-header">
                <h2><i className="fas fa-clock-rotate-left" style={{ color: '#8B5CF6' }} /> Timeline chronologique</h2>
              </div>
              <AdminAuditTimeline events={paginated.items} onSelect={handleSelectEvent} />
            </>
          )}

          {activeTab === 'surveillance' && (
            <>
              <AdminAuditCards loading={false} />
              <div className="ada-section-header">
                <h2><i className="fas fa-clock-rotate-left" style={{ color: '#3B82F6' }} /> Événements critiques récents</h2>
              </div>
              <AdminAuditTable events={auditEvents.filter(e => e.severity === 'critical' || e.severity === 'high').slice(0, 15)} onSelect={handleSelectEvent} selectedId={selectedEvent?.id} />
            </>
          )}

          {activeTab === 'alertes' && (
            <AdminAuditAlerts loading={false} setToast={setToast} />
          )}

          {activeTab === 'sessions' && (
            <AdminAuditSessions loading={false} />
          )}
        </>
      )}

      {selectedEvent && (
        <AdminAuditDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {toast.show && (
        <div className={`ada-toast ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`} />
          {toast.message}
          <button onClick={() => setToast({ ...toast, show: false })}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', marginLeft: 8 }}>
            <i className="fas fa-times" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
