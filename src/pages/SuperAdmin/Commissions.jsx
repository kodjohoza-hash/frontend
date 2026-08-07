import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  AdminCommissionStats, AdminCommissionFilters, AdminCommissionTable,
  AdminCommissionCards, AdminCommissionProfile, AdminCommissionRules,
  AdminCommissionCharts, AdminCommissionTimeline, AdminCommissionExport,
  AdminCommissionSkeleton,
} from '../../components/admin';
import {
  commissions as allCommissions, commissionStats as statsData,
  commissionRules, commissionTimeline, calculateCommission,
  findApplicableRule, commissionStatusConfig,
  filterCommissions, sortCommissions, formatCurrency,
  commissionTypes, defaultFilters,
} from '../../data/adminCommissionData';

const drawerTabs = [
  { id: 'profile', label: 'Commission', icon: 'fa-coins' },
  { id: 'rules', label: 'Rules', icon: 'fa-scale-balanced' },
  { id: 'charts', label: 'Charts', icon: 'fa-chart-line' },
  { id: 'timeline', label: 'History', icon: 'fa-clock-rotate-left' },
];

export default function Commissions() {
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState([]);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [drawerTab, setDrawerTab] = useState('profile');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [toasts, setToasts] = useState([]);
  const [showRules, setShowRules] = useState(false);
  const [localRules, setLocalRules] = useState(commissionRules);
  const perPage = 10;

  useEffect(() => {
    const t = setTimeout(() => { setCommissions(allCommissions); setLoading(false); }, 400);
    return () => clearTimeout(t);
  }, []);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now(); setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3500);
  }, []);

  const openModal = useCallback((cfg) => { setModalConfig(cfg); setModalOpen(true); }, []);

  const filtered = useMemo(() => {
    let f = filterCommissions(commissions, { search, company: companyFilter, city: cityFilter, status: statusFilter, type: typeFilter, dateFrom, dateTo });
    return sortCommissions(f, sortBy);
  }, [commissions, search, companyFilter, cityFilter, statusFilter, typeFilter, dateFrom, dateTo, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSelect = useCallback((c) => { setSelected(c); setDrawerTab('profile'); }, []);
  const closeDrawer = useCallback(() => setSelected(null), []);
  const handleViewRules = useCallback(() => { setShowRules(true); addToast('Rules view toggled.', 'info'); }, [addToast]);

  const handleToggleRule = useCallback((r) => {
    const newStatus = r.status === 'active' ? 'inactive' : 'active';
    setLocalRules(prev => prev.map(x => x.id === r.id ? { ...x, status: newStatus } : x));
    addToast(`"${r.name}" ${newStatus === 'active' ? 'reactivated' : 'suspended'}.`, newStatus === 'active' ? 'success' : 'warning');
  }, [addToast]);

  const handleExport = useCallback((fmt) => {
    addToast(`Export ${fmt.toUpperCase()} — mock download ready for Express.js.`, 'success');
  }, [addToast]);

  const handleViewTxn = useCallback(() => { addToast('Transaction details modal ready.', 'info'); }, [addToast]);
  const handleViewCompany = useCallback(() => { addToast('Company profile modal ready.', 'info'); }, [addToast]);
  const handleHistory = useCallback(() => setDrawerTab('timeline'), []);

  const resetFilters = useCallback(() => {
    setSearch(''); setCompanyFilter(''); setCityFilter(''); setStatusFilter('');
    setTypeFilter(''); setDateFrom(''); setDateTo(''); setSortBy('newest'); setPage(1);
  }, []);

  if (loading) {
    return (
      <div className="adm-page">
        <div className="adcm-hero"><div className="adcm-hero-content"><div><h1>Commission Management</h1><p>Track, manage, and analyze platform commissions</p></div></div></div>
        <AdminCommissionSkeleton />
      </div>
    );
  }

  return (
    <div className="adm-page">
      {/* Hero */}
      <div className="adcm-hero">
        <div className="adcm-hero-content">
          <div>
            <h1>Commission Management</h1>
            <p>Track, manage, and analyze platform commissions</p>
          </div>
          <div className="adcm-hero-actions">
            <button className="adcm-btn adcm-btn--primary" onClick={() => addToast('New rule modal ready for Express.js.', 'info')}>
              <i className="fa-solid fa-plus" /> New Rule
            </button>
            <button className="adcm-btn adcm-btn--outline" onClick={() => setShowRules(p => !p)}>
              <i className="fa-solid fa-scale-balanced" /> {showRules ? 'Commissions' : 'Rules'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI */}
      <AdminCommissionStats stats={statsData} />

      {/* Mode toggle */}
      {showRules ? (
        <>
          <div className="adcm-section-header">
            <h2><i className="fa-solid fa-scale-balanced" /> Commission Rules ({localRules.length})</h2>
          </div>
          <div className="adcm-table-wrapper" style={{ padding: '1rem' }}>
            <AdminCommissionRules rules={localRules} onToggleStatus={handleToggleRule} />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div className="adcm-section-header">
              <h2><i className="fa-solid fa-calculator" /> Dynamic Calculation Engine</h2>
              <button className="adcm-btn adcm-btn--primary" onClick={() => {
                const test = calculateCommission(5000, localRules[0]);
                addToast(`Test: 5000 XAF × ${localRules[0].value}% = ${test} XAF commission`, 'info');
              }}><i className="fa-solid fa-flask" /> Test Rule
              </button>
            </div>
            <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '1rem', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.7 }}>
              <p><strong>How it works:</strong> The engine evaluates all active rules by priority. For a given transaction, it finds the first matching rule based on company, city, trip type, volume, subscription, or promotion. Rules are fully configurable and ready for Express.js.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                {commissionTypes.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                    <i className={`fa-solid ${t.icon}`} style={{ color: '#059669', width: 16 }} />
                    <span style={{ fontWeight: 500 }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Filters */}
          <AdminCommissionFilters
            search={search} onSearchChange={v => { setSearch(v); setPage(1); }}
            companyFilter={companyFilter} onCompanyChange={v => { setCompanyFilter(v); setPage(1); }}
            cityFilter={cityFilter} onCityChange={v => { setCityFilter(v); setPage(1); }}
            statusFilter={statusFilter} onStatusChange={v => { setStatusFilter(v); setPage(1); }}
            typeFilter={typeFilter} onTypeChange={v => { setTypeFilter(v); setPage(1); }}
            dateFrom={dateFrom} onDateFromChange={v => { setDateFrom(v); setPage(1); }}
            dateTo={dateTo} onDateToChange={v => { setDateTo(v); setPage(1); }}
            sortBy={sortBy} onSortChange={v => { setSortBy(v); setPage(1); }}
            showFilters={showFilters} onToggleFilters={() => setShowFilters(p => !p)} onReset={resetFilters}
          />

          {/* Export */}
          <AdminCommissionExport onExport={handleExport} />

          {/* Charts */}
          <AdminCommissionCharts />

          {/* Table */}
          <AdminCommissionTable
            commissions={paginated} onSelect={handleSelect}
            onViewTxn={handleViewTxn} onViewCompany={handleViewCompany} onHistory={handleHistory}
          />

          {/* Cards (mobile) */}
          <AdminCommissionCards commissions={paginated} onSelect={handleSelect} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="adcm-pagination">
              <div className="adcm-pagination-info">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</div>
              <div className="adcm-pagination-pages">
                <button className="adcm-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><i className="fa-solid fa-chevron-left" /></button>
                {[...Array(totalPages).keys()].slice(Math.max(0, Math.min(page - 3, totalPages - 5)), Math.max(5, Math.min(page + 2, totalPages))).map(i => (
                  <button key={i} className={`adcm-page-btn ${page === i + 1 ? 'adcm-page-btn--active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button className="adcm-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><i className="fa-solid fa-chevron-right" /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Drawer */}
      {selected && !showRules && (
        <>
          <div className="adcm-drawer-overlay" onClick={closeDrawer} />
          <div className="adcm-drawer">
            <div className="adcm-drawer-header">
              <h2><i className="fa-solid fa-coins" style={{ color: '#059669' }} /> {selected.ref}</h2>
              <button className="adcm-drawer-close" onClick={closeDrawer}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="adcm-drawer-body">
              <div className="adcm-drawer-tabs">
                {drawerTabs.map(tab => (
                  <button key={tab.id} onClick={() => setDrawerTab(tab.id)}
                    style={{
                      padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: 600, color: drawerTab === tab.id ? '#059669' : '#64748B',
                      borderBottom: drawerTab === tab.id ? '2px solid #059669' : '2px solid transparent',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.35rem',
                    }}>
                    <i className={`fa-solid ${tab.icon}`} /> {tab.label}
                  </button>
                ))}
              </div>
              {drawerTab === 'profile' && <div className="adcm-drawer-section"><AdminCommissionProfile commission={selected} /></div>}
              {drawerTab === 'rules' && (
                <div className="adcm-drawer-section">
                  <h3><i className="fa-solid fa-scale-balanced" /> Applied Rule</h3>
                  {localRules.filter(r => r.id === selected.ruleId).map(r => (
                    <div key={r.id} style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: 8, border: '1px solid #F1F5F9' }}>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{r.description}</div>
                    </div>
                  ))}
                </div>
              )}
              {drawerTab === 'charts' && <AdminCommissionCharts />}
              {drawerTab === 'timeline' && (
                <div className="adcm-drawer-section">
                  <h3><i className="fa-solid fa-clock-rotate-left" /> Activity Timeline</h3>
                  <AdminCommissionTimeline events={commissionTimeline.filter(t => t.description?.includes(selected.ref) || t.description?.includes(selected.companyName))} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="adcm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adcm-modal" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', fontSize: '2.75rem', marginBottom: '0.5rem' }}>
              <i className={`fa-solid ${modalConfig.icon || 'fa-circle-question'}`}
                style={{ color: modalConfig.confirmClass === 'danger' ? '#EF4444' : modalConfig.confirmClass === 'success' ? '#10B981' : modalConfig.confirmClass === 'warning' ? '#F59E0B' : '#059669' }} />
            </div>
            <h3>{modalConfig.title || 'Confirm'}</h3>
            <p>{modalConfig.message || 'Proceed?'}</p>
            <div className="adcm-modal-actions">
              <button className="adcm-btn--cancel" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className={`adcm-btn--${modalConfig.confirmClass || 'primary'}`} onClick={() => { modalConfig.onConfirm?.(); setModalOpen(false); }}>
                {modalConfig.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="adcm-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`adcm-toast adcm-toast--${t.type}`}>
            <i className={`fa-solid ${t.type === 'success' ? 'fa-check-circle' : t.type === 'error' ? 'fa-xmark-circle' : t.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info'}`} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
