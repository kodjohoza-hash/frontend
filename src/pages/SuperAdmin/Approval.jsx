import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  AdminApprovalStats, AdminApprovalFilters, AdminApprovalTable,
  AdminApprovalWorkflow, AdminApprovalProfile, AdminApprovalDocuments,
  AdminApprovalComments, AdminApprovalTimeline, AdminApprovalModal,
  AdminApprovalSkeleton,
} from '../../components/admin';
import { requests as allRequests, approvalStats, workflowSteps as defaultWorkflow } from '../../data/adminApprovalData';
export default function Approval() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [drawerTab, setDrawerTab] = useState('profile');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [toasts, setToasts] = useState([]);
  const perPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setRequests(allRequests || []);
      setStats(approvalStats || null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const updateRequestStatus = useCallback((id, newStatus, extra = {}) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: newStatus, ...extra } : r
    ));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus, ...extra }));
  }, [selected]);

  const filtered = useMemo(() => {
    let list = [...requests];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(r =>
        r.company?.toLowerCase().includes(s) ||
        r.owner?.toLowerCase().includes(s) ||
        r.id?.toString().includes(s)
      );
    }
    if (statusFilter) list = list.filter(r => r.status === statusFilter);
    if (urgencyFilter) list = list.filter(r => r.urgency === urgencyFilter);
    const urgencyOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    switch (sortBy) {
      case 'oldest': list.sort((a, b) => (a.submitted || '').localeCompare(b.submitted || '')); break;
      case 'urgent': list.sort((a, b) => (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9)); break;
      case 'company': list.sort((a, b) => (a.company || '').localeCompare(b.company || '')); break;
      default: list.sort((a, b) => (b.submitted || '').localeCompare(a.submitted || '')); break;
    }
    return list;
  }, [requests, search, statusFilter, urgencyFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSelect = useCallback((r) => { setSelected(r); setDrawerTab('profile'); }, []);
  const closeDrawer = useCallback(() => setSelected(null), []);

  const openModal = useCallback((config) => { setModalConfig(config); setModalOpen(true); }, []);

  const handleApprove = useCallback((r) => {
    openModal({
      title: 'Approve Company',
      message: `Are you sure you want to approve "${r.company}"?`,
      confirmLabel: 'Approve', confirmClass: 'success', icon: 'fa-check-circle',
      onConfirm: () => { updateRequestStatus(r.id, 'approved', { reviewer: 'You' }); addToast(`"${r.company}" approved.`); setModalOpen(false); },
    });
  }, [openModal, updateRequestStatus, addToast]);

  const handleRefuse = useCallback((r) => {
    openModal({
      title: 'Refuse Application',
      message: `Are you sure you want to refuse "${r.company}"?`,
      confirmLabel: 'Refuse', confirmClass: 'danger', icon: 'fa-xmark-circle',
      onConfirm: () => { updateRequestStatus(r.id, 'refused', { reviewer: 'You' }); addToast(`"${r.company}" refused.`, 'error'); setModalOpen(false); },
    });
  }, [openModal, updateRequestStatus, addToast]);

  const handleMarkInfo = useCallback((r) => {
    openModal({
      title: 'Request More Information',
      message: `Mark "${r.company}" as needing more information?`,
      confirmLabel: 'Request Info', confirmClass: 'warning', icon: 'fa-circle-exclamation',
      onConfirm: () => { updateRequestStatus(r.id, 'more_info'); addToast(`Info requested from "${r.company}".`, 'warning'); setModalOpen(false); },
    });
  }, [openModal, updateRequestStatus, addToast]);

  const handleSuspend = useCallback((r) => {
    openModal({
      title: 'Suspend Company',
      message: `Are you sure you want to suspend "${r.company}"?`,
      confirmLabel: 'Suspend', confirmClass: 'danger', icon: 'fa-pause-circle',
      onConfirm: () => { updateRequestStatus(r.id, 'suspended', { reviewer: 'You' }); addToast(`"${r.company}" suspended.`, 'error'); setModalOpen(false); },
    });
  }, [openModal, updateRequestStatus, addToast]);

  const handleReactivate = useCallback((r) => {
    openModal({
      title: 'Reactivate Company',
      message: `Reactivate "${r.company}"?`,
      confirmLabel: 'Reactivate', confirmClass: 'success', icon: 'fa-rotate',
      onConfirm: () => { updateRequestStatus(r.id, 'pending'); addToast(`"${r.company}" reactivated.`); setModalOpen(false); },
    });
  }, [openModal, updateRequestStatus, addToast]);

  const handleHistory = useCallback(() => setDrawerTab('timeline'), []);
  const handleViewDocs = useCallback(() => setDrawerTab('documents'), []);
  const handleAddComment = useCallback(() => addToast('Comment added.', 'info'), [addToast]);

  const resetFilters = useCallback(() => {
    setSearch(''); setStatusFilter(''); setUrgencyFilter(''); setSortBy('newest'); setPage(1);
  }, []);

  const drawerTabs = [
    { id: 'profile', label: 'Profile', icon: 'fa-building' },
    { id: 'documents', label: 'Documents', icon: 'fa-file-lines' },
    { id: 'comments', label: 'Comments', icon: 'fa-comments' },
    { id: 'timeline', label: 'Timeline', icon: 'fa-clock-rotate-left' },
  ];

  if (loading) {
    return (
      <div className="adm-page">
        <div className="adma-hero">
          <div className="adma-hero-content">
            <div><h1>Company Approvals</h1><p>Review and manage company registration requests</p></div>
          </div>
        </div>
        <AdminApprovalSkeleton />
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adma-hero">
        <div className="adma-hero-content">
          <div>
            <h1>Company Approvals</h1>
            <p>Review and manage company registration requests</p>
          </div>
          <div className="adma-hero-actions">
            <button className="adma-btn adma-btn--primary" onClick={() => addToast('Bulk review initiated.', 'info')}>
              <i className="fa-solid fa-layer-group" /> Bulk Review
            </button>
            <button className="adma-btn adma-btn--outline" onClick={() => addToast('Report exported.', 'success')}>
              <i className="fa-solid fa-download" /> Export
            </button>
          </div>
        </div>
      </div>

      <AdminApprovalStats stats={stats} />
      <AdminApprovalFilters
        search={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        statusFilter={statusFilter} onStatusChange={v => { setStatusFilter(v); setPage(1); }}
        urgencyFilter={urgencyFilter} onUrgencyChange={v => { setUrgencyFilter(v); setPage(1); }}
        sortBy={sortBy} onSortChange={v => { setSortBy(v); setPage(1); }}
        showFilters={showFilters} onToggleFilters={() => setShowFilters(p => !p)}
        onReset={resetFilters}
      />
      <AdminApprovalTable
        requests={paginated} onSelect={handleSelect} onViewDocs={handleViewDocs}
        onApprove={handleApprove} onRefuse={handleRefuse} onMarkInfo={handleMarkInfo}
        onSuspend={handleSuspend} onReactivate={handleReactivate} onHistory={handleHistory}
      />

      {totalPages > 1 && (
        <div className="adma-pagination">
          <div className="adma-pagination-info">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </div>
          <div className="adma-pagination-pages">
            <button className="adma-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <i className="fa-solid fa-chevron-left" />
            </button>
            {[...Array(totalPages).keys()].slice(
              Math.max(0, Math.min(page - 3, totalPages - 5)),
              Math.max(5, Math.min(page + 2, totalPages))
            ).map(i => (
              <button key={i} className={`adma-page-btn ${page === i + 1 ? 'adma-page-btn--active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="adma-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      {selected && (
        <>
          <div className="adma-drawer-overlay" onClick={closeDrawer} />
          <div className="adma-drawer">
            <div className="adma-drawer-header">
              <h2><i className="fa-solid fa-file-circle-check" style={{ color: 'var(--adm-accent)' }} /> {selected.company}</h2>
              <button className="adma-drawer-close" onClick={closeDrawer}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="adma-drawer-body">
              <AdminApprovalWorkflow currentStatus={selected.status} workflowSteps={selected.workflowSteps} />
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB' }}>
                {drawerTabs.map(tab => (
                  <button key={tab.id} onClick={() => setDrawerTab(tab.id)}
                    style={{
                      padding: '0.5rem 1rem', border: 'none', background: 'transparent',
                      cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                      color: drawerTab === tab.id ? 'var(--adm-accent)' : '#6B7280',
                      borderBottom: drawerTab === tab.id ? '2px solid var(--adm-accent)' : '2px solid transparent',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.35rem',
                    }}>
                    <i className={`fa-solid ${tab.icon}`} /> {tab.label}
                  </button>
                ))}
              </div>
              {drawerTab === 'profile' && (
                <div className="adma-drawer-section"><AdminApprovalProfile request={selected} /></div>
              )}
              {drawerTab === 'documents' && (
                <div className="adma-drawer-section">
                  <h3><i className="fa-solid fa-file-lines" /> Documents</h3>
                  <AdminApprovalDocuments documents={selected.documents} />
                </div>
              )}
              {drawerTab === 'comments' && (
                <div className="adma-drawer-section">
                  <h3><i className="fa-solid fa-comments" /> Comments & Notes</h3>
                  <AdminApprovalComments comments={selected.comments} onAddComment={handleAddComment} />
                </div>
              )}
              {drawerTab === 'timeline' && (
                <div className="adma-drawer-section">
                  <h3><i className="fa-solid fa-clock-rotate-left" /> Activity Timeline</h3>
                  <AdminApprovalTimeline events={selected.timeline} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <AdminApprovalModal
        isOpen={modalOpen} onClose={() => setModalOpen(false)}
        onConfirm={modalConfig.onConfirm || (() => {})}
        title={modalConfig.title} message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel} confirmClass={modalConfig.confirmClass} icon={modalConfig.icon}
      />

      {/* Toasts */}
      <div className="adma-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`adma-toast adma-toast--${t.type}`}>
            <i className={`fa-solid ${t.type === 'success' ? 'fa-check-circle' : t.type === 'error' ? 'fa-xmark-circle' : t.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info'}`} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
