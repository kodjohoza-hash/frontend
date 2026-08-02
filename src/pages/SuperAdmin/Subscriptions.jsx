import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  AdminSubscriptionStats, AdminSubscriptionFilters, AdminSubscriptionTable,
  AdminSubscriptionCards, AdminSubscriptionProfile, AdminSubscriptionFeatures,
  AdminSubscriptionBilling, AdminSubscriptionTimeline, AdminSubscriptionModal,
  AdminSubscriptionSkeleton, AdminPlanFormModal,
} from '../../components/admin';
import {
  subscriptions as mockSubscriptions,
  filterPlans, sortPlans,
  formatCurrency, durationLabels,
} from '../../data/adminSubscriptionData';
import useSubscriptionsStore from '../../store/subscriptions.store';
import useAuthStore from '../../store/auth.store';

const drawerTabs = [
  { id: 'profile', label: 'Profile', icon: 'fa-cube' },
  { id: 'features', label: 'Features', icon: 'fa-list-check' },
  { id: 'companies', label: 'Companies', icon: 'fa-building' },
  { id: 'billing', label: 'Billing', icon: 'fa-file-invoice' },
  { id: 'timeline', label: 'History', icon: 'fa-clock-rotate-left' },
];

export default function Subscriptions() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [drawerTab, setDrawerTab] = useState('profile');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [toasts, setToasts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [usingMock, setUsingMock] = useState(true);
  const perPage = 10;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const store = useSubscriptionsStore.getState();
      const p = await store.loadPlans();
      await store.loadSubscriptions();
      await store.loadPayments();
      const s = store.refreshStats();
      if (!cancelled) {
        setPlans(p);
        setStats(s);
        setSubscriptions(store.subscriptions);
        setUsingMock(store.usingMock);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now(); setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3500);
  }, []);

  const openModal = useCallback((cfg) => { setModalConfig(cfg); setModalOpen(true); }, []);
  const handleSelect = useCallback((p) => { setSelected(p); setDrawerTab('profile'); }, []);
  const closeDrawer = useCallback(() => setSelected(null), []);

  const filtered = useMemo(() => {
    let f = filterPlans(plans, { search, status: statusFilter, duration: durationFilter, currency: currencyFilter, minPrice, maxPrice });
    return sortPlans(f, sortBy);
  }, [plans, search, statusFilter, durationFilter, currencyFilter, minPrice, maxPrice, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const selectedSubs = useMemo(() => (selected ? subscriptions.filter(s => s.planId === selected.id) : []), [selected, subscriptions]);
  const selectedBilling = useMemo(() => {
    if (!selected) return [];
    const store = useSubscriptionsStore.getState();
    return store.payments.filter(p => p.planName === selected.name);
  }, [selected]);
  const selectedTimeline = useMemo(() => {
    if (!selected) return [];
    const store = useSubscriptionsStore.getState();
    return store.notifications
      .filter(n => n.companyName)
      .map(n => ({ id: `evt_${n.id}`, subscriptionId: '', action: n.type, title: n.title, description: n.message, time: n.date, user: 'Système' }));
  }, [selected]);

  const refreshFromStore = useCallback(() => {
    const store = useSubscriptionsStore.getState();
    setPlans(store.plans);
    setSubscriptions(store.subscriptions);
    setStats(store.refreshStats());
  }, []);

  const handleNewPlan = useCallback(() => { setEditingPlan(null); setFormOpen(true); }, []);
  const handleEdit = useCallback((p) => { setEditingPlan(p); setFormOpen(true); }, []);
  const handleSavePlan = useCallback(async (payload) => {
    const store = useSubscriptionsStore.getState();
    setSaving(true);
    const res = editingPlan ? await store.updatePlan(editingPlan.id, payload) : await store.createPlan(payload);
    setSaving(false);
    if (res.ok) {
      setFormOpen(false);
      addToast(editingPlan ? `Plan "${res.plan.name}" mis à jour.` : `Plan "${res.plan.name}" créé.`);
      refreshFromStore();
    } else {
      addToast(res.error || 'Enregistrement impossible.', 'error');
      if (!useAuthStore.getState().token) {
        /* Fallback : mutation locale */
        if (editingPlan) {
          setPlans(prev => prev.map(x => x.id === editingPlan.id ? { ...x, ...payload, status: payload.status } : x));
        } else {
          setPlans(prev => [{ ...payload, id: `plan_${Date.now()}`, companiesCount: 0, revenue: 0, popular: false, createdAt: new Date().toISOString().slice(0, 10), features: payload.features }, ...prev]);
        }
        setFormOpen(false);
        addToast(editingPlan ? 'Plan mis à jour (mode démo).' : 'Plan créé (mode démo).');
      }
    }
  }, [editingPlan, addToast, refreshFromStore]);

  const handleDuplicate = useCallback((p) => {
    openModal({
      title: 'Duplicate Plan',
      message: `Create a duplicate of "${p.name}"? All settings will be copied.`,
      confirmLabel: 'Duplicate', confirmClass: 'primary', icon: 'fa-copy',
      onConfirm: () => { addToast(`"${p.name}" duplicated.`); setModalOpen(false); },
    });
  }, [openModal, addToast]);
  const handleArchive = useCallback((p) => {
    const arch = p.status !== 'inactive';
    openModal({
      title: arch ? 'Archive Plan' : 'Reactivate Plan',
      message: arch ? `Archive "${p.name}"? It will no longer be available for new subscriptions.` : `Reactivate "${p.name}"?`,
      confirmLabel: arch ? 'Archive' : 'Reactivate', confirmClass: arch ? 'warning' : 'success', icon: arch ? 'fa-box-archive' : 'fa-box-open',
      onConfirm: async () => {
        setModalOpen(false);
        const store = useSubscriptionsStore.getState();
        const res = await store.updatePlan(p.id, { ...p, status: arch ? 'inactive' : 'active' });
        if (res.ok) {
          refreshFromStore();
          addToast(`"${res.plan.name}" ${arch ? 'archived' : 'reactivated'}.`);
          if (selected?.id === p.id) setSelected(res.plan);
        } else {
          setPlans(prev => prev.map(x => x.id === p.id ? { ...x, status: arch ? 'inactive' : 'active' } : x));
          addToast(`"${p.name}" ${arch ? 'archived' : 'reactivated'} (mode démo).`);
        }
      },
    });
  }, [openModal, addToast, refreshFromStore, selected]);
  const handleDelete = useCallback((p) => {
    openModal({
      title: 'Delete Plan', message: `Permanently delete "${p.name}"? This cannot be undone.`,
      confirmLabel: 'Delete', confirmClass: 'danger', icon: 'fa-trash-can',
      onConfirm: async () => {
        setModalOpen(false);
        const store = useSubscriptionsStore.getState();
        const res = await store.deletePlan(p.id);
        if (res.ok) {
          refreshFromStore();
          addToast(`"${p.name}" deleted.`, 'error');
          if (selected?.id === p.id) setSelected(null);
        } else {
          setPlans(prev => prev.filter(x => x.id !== p.id));
          addToast(`"${p.name}" deleted (mode démo).`, 'error');
          if (selected?.id === p.id) setSelected(null);
        }
      },
    });
  }, [openModal, addToast, refreshFromStore, selected]);
  const handleViewCompanies = useCallback(() => setDrawerTab('companies'), []);
  const handleViewRevenue = useCallback(() => setDrawerTab('billing'), []);
  const handleHistory = useCallback(() => setDrawerTab('timeline'), []);
  const resetFilters = useCallback(() => { setSearch(''); setStatusFilter(''); setDurationFilter(''); setCurrencyFilter(''); setMinPrice(''); setMaxPrice(''); setSortBy('newest'); setPage(1); }, []);

  /* Comparator (mini plan comparison) */
  const popularPlans = useMemo(() => plans.filter(p => p.status === 'active').slice(0, 4), [plans]);

  if (loading) {
    return (
      <div className="adm-page">
        <div className="adms-hero"><div className="adms-hero-content"><div><h1>Subscription Plans</h1><p>Manage pricing plans, billing, and company subscriptions</p></div></div></div>
        <AdminSubscriptionSkeleton />
      </div>
    );
  }

  return (
    <div className="adm-page">
      {/* Hero */}
      <div className="adms-hero">
        <div className="adms-hero-content">
          <div>
            <h1>Subscription Plans</h1>
            <p>Manage pricing plans, billing, and company subscriptions</p>
          </div>
          <div className="adms-hero-actions">
            <button className="adms-btn adms-btn--primary" onClick={handleNewPlan}>
              <i className="fa-solid fa-plus" /> New Plan
            </button>
            <button className="adms-btn adms-btn--outline" onClick={() => addToast('Comparison view toggled.', 'info')}>
              <i className="fa-solid fa-scale-balanced" /> Compare
            </button>
          </div>
        </div>
        <div className="adms-hero-badge">{usingMock ? 'Mode démo (mock data)' : 'API connectée'}</div>
      </div>

      {/* KPI */}
      <AdminSubscriptionStats stats={stats} />

      {/* Comparator */}
      <div className="adms-section-header">
        <h2><i className="fa-solid fa-scale-balanced" /> Plan Comparison</h2>
      </div>
      <div className="adms-comparator">
        {popularPlans.map(p => (
          <div className={`adms-compare-card ${p.popular ? 'adms-compare-card--popular' : ''}`} key={p.id} onClick={() => handleSelect(p)} style={{ cursor: 'pointer' }}>
            {p.popular && <div className="adms-compare-badge">Popular</div>}
            <h3>{p.name}</h3>
            <div className="adms-compare-price">
              {p.price === 0 ? 'Free' : formatCurrency(p.price, p.currency)}
              <span>/{durationLabels[p.duration]}</span>
            </div>
            <ul className="adms-compare-features">
              {['bus_management', 'online_booking', 'messaging', 'reports', 'api_access'].map(fid => {
                const included = p.features.includes(fid);
                return <li key={fid}><i className={`fa-solid ${included ? 'fa-check' : 'fa-xmark'}`} /> {fid.replace(/_/g, ' ')}</li>;
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Filters */}
      <AdminSubscriptionFilters
        search={search} onSearchChange={v => { setSearch(v); setPage(1); }}
        statusFilter={statusFilter} onStatusChange={v => { setStatusFilter(v); setPage(1); }}
        durationFilter={durationFilter} onDurationChange={v => { setDurationFilter(v); setPage(1); }}
        currencyFilter={currencyFilter} onCurrencyChange={v => { setCurrencyFilter(v); setPage(1); }}
        minPrice={minPrice} onMinPriceChange={v => { setMinPrice(v); setPage(1); }}
        maxPrice={maxPrice} onMaxPriceChange={v => { setMaxPrice(v); setPage(1); }}
        sortBy={sortBy} onSortChange={v => { setSortBy(v); setPage(1); }}
        showFilters={showFilters} onToggleFilters={() => setShowFilters(p => !p)} onReset={resetFilters}
      />

      {/* Table */}
      <AdminSubscriptionTable
        plans={paginated} onSelect={handleSelect} onEdit={handleEdit}
        onDuplicate={handleDuplicate} onArchive={handleArchive} onDelete={handleDelete}
        onViewCompanies={handleViewCompanies} onViewRevenue={handleViewRevenue} onHistory={handleHistory}
      />

      {/* Cards (mobile) */}
      <AdminSubscriptionCards
        plans={paginated} onSelect={handleSelect} onEdit={handleEdit}
        onDuplicate={handleDuplicate} onArchive={handleArchive} onDelete={handleDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="adms-pagination">
          <div className="adms-pagination-info">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</div>
          <div className="adms-pagination-pages">
            <button className="adms-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><i className="fa-solid fa-chevron-left" /></button>
            {[...Array(totalPages).keys()].slice(Math.max(0, Math.min(page - 3, totalPages - 5)), Math.max(5, Math.min(page + 2, totalPages))).map(i => (
              <button key={i} className={`adms-page-btn ${page === i + 1 ? 'adms-page-btn--active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="adms-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><i className="fa-solid fa-chevron-right" /></button>
          </div>
        </div>
      )}

      {/* Drawer */}
      {selected && (
        <>
          <div className="adms-drawer-overlay" onClick={closeDrawer} />
          <div className="adms-drawer">
            <div className="adms-drawer-header">
              <h2><i className="fa-solid fa-cube" style={{ color: selected.color || 'var(--adm-accent)' }} /> {selected.name}</h2>
              <button className="adms-drawer-close" onClick={closeDrawer}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="adms-drawer-body">
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', overflowX: 'auto' }}>
                {drawerTabs.map(tab => (
                  <button key={tab.id} onClick={() => setDrawerTab(tab.id)}
                    style={{
                      padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: 600, color: drawerTab === tab.id ? 'var(--adm-accent)' : '#64748B',
                      borderBottom: drawerTab === tab.id ? '2px solid var(--adm-accent)' : '2px solid transparent',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap',
                    }}>
                    <i className={`fa-solid ${tab.icon}`} /> {tab.label}
                  </button>
                ))}
              </div>
              {drawerTab === 'profile' && (
                <div className="adms-drawer-section"><AdminSubscriptionProfile plan={selected} /></div>
              )}
              {drawerTab === 'features' && (
                <div className="adms-drawer-section">
                  <h3><i className="fa-solid fa-list-check" /> Feature Matrix</h3>
                  <AdminSubscriptionFeatures planFeatures={selected.features} />
                </div>
              )}
              {drawerTab === 'companies' && (
                <div className="adms-drawer-section">
                  <h3><i className="fa-solid fa-building" /> Subscribed Companies ({selectedSubs.length})</h3>
                  {selectedSubs.length === 0 ? (
                    <div className="adms-empty" style={{ padding: '1.5rem 0' }}><p>No companies on this plan.</p></div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedSubs.map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>{s.companyName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Since {s.startDate} {s.autoRenew ? '• Auto-renew' : ''}</div>
                          </div>
                          <span className={`adms-badge adms-badge--${s.status}`}>
                            {s.status === 'trial' ? `Trial (${s.trialEnd})` : s.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {drawerTab === 'billing' && (
                <div className="adms-drawer-section">
                  <h3><i className="fa-solid fa-file-invoice" /> Billing Records ({selectedBilling.length})</h3>
                  <AdminSubscriptionBilling records={selectedBilling} />
                </div>
              )}
              {drawerTab === 'timeline' && (
                <div className="adms-drawer-section">
                  <h3><i className="fa-solid fa-clock-rotate-left" /> Activity Timeline ({selectedTimeline.length})</h3>
                  <AdminSubscriptionTimeline events={selectedTimeline} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <AdminSubscriptionModal
        isOpen={modalOpen} onClose={() => setModalOpen(false)}
        onConfirm={modalConfig.onConfirm || (() => {})}
        title={modalConfig.title} message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel} confirmClass={modalConfig.confirmClass} icon={modalConfig.icon}
      />

      {/* Plan form (create / edit) */}
      <AdminPlanFormModal
        isOpen={formOpen} onClose={() => setFormOpen(false)}
        initial={editingPlan} onSave={handleSavePlan} saving={saving}
      />

      {/* Toasts */}
      <div className="adms-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`adms-toast adms-toast--${t.type}`}>
            <i className={`fa-solid ${t.type === 'success' ? 'fa-check-circle' : t.type === 'error' ? 'fa-xmark-circle' : t.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info'}`} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
