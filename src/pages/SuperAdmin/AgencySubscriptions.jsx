import { useState, useMemo, useEffect, useCallback } from 'react';
import '../../assets/styles/admin-agency-subscriptions.css';
import {
  TODAY, subscriptionStatusConfig, reminderTypeConfig, subscriptionCompanies,
  agencySubscriptions as allSubscriptions,
  subscriptionPayments as allPayments, subscriptionReminders as allReminders,
  getCompanyById, getAgencyById,
  getRevenueByCompany, getSubscriptionSummary, formatCurrency, monthLabel,
} from '../../data/adminAgencySubscriptionData';

const drawerTabs = [
  { id: 'infos', label: 'Informations', icon: 'bi-info-circle' },
  { id: 'payments', label: 'Paiements', icon: 'bi-cash-stack' },
  { id: 'reminders', label: 'Relances', icon: 'bi-bell' },
];

const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

const todayISO = () => new Date().toISOString().replace('T', ' ').substring(0, 16);

export default function AgencySubscriptions() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [sortBy, setSortBy] = useState('status');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [drawerTab, setDrawerTab] = useState('infos');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [toasts, setToasts] = useState([]);
  const perPage = 8;

  useEffect(() => {
    const t = setTimeout(() => {
      setSubscriptions(allSubscriptions);
      setPayments(allPayments);
      setReminders(allReminders);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 4000);
  }, []);

  const openModal = useCallback((cfg) => { setModalConfig(cfg); setModalOpen(true); }, []);
  const handleSelect = useCallback((s) => { setSelected(s); setDrawerTab('infos'); }, []);
  const closeDrawer = useCallback(() => setSelected(null), []);

  const summary = useMemo(() => getSubscriptionSummary(subscriptions), [subscriptions]);
  const revenueByCompany = useMemo(() => getRevenueByCompany(subscriptions), [subscriptions]);

  const filtered = useMemo(() => {
    let list = [...subscriptions];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => {
        const agency = getAgencyById(s.agencyId);
        const company = getCompanyById(agency?.companyId);
        return (
          agency?.name?.toLowerCase().includes(q) ||
          agency?.city?.toLowerCase().includes(q) ||
          agency?.id?.toLowerCase().includes(q) ||
          company?.name?.toLowerCase().includes(q) ||
          s.id?.toLowerCase().includes(q)
        );
      });
    }
    if (statusFilter) list = list.filter(s => s.status === statusFilter);
    if (companyFilter) list = list.filter(s => getAgencyById(s.agencyId)?.companyId === companyFilter);
    const order = { paye: 0, en_retard: 1, impaye: 2, suspendu: 3 };
    switch (sortBy) {
      case 'amount_desc': list.sort((a, b) => b.amount - a.amount); break;
      case 'amount_asc': list.sort((a, b) => a.amount - b.amount); break;
      case 'due': list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); break;
      case 'status': list.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9)); break;
      default: break;
    }
    return list;
  }, [subscriptions, search, statusFilter, companyFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const selectedAgency = useMemo(() => (selected ? getAgencyById(selected.agencyId) : null), [selected]);
  const selectedCompany = useMemo(() => (selected && selectedAgency ? getCompanyById(selectedAgency.companyId) : null), [selected, selectedAgency]);
  const selectedPayments = useMemo(
    () => (selected ? payments.filter(p => p.agencyId === selected.agencyId).sort((a, b) => new Date(b.date) - new Date(a.date)) : []),
    [selected, payments]
  );
  const selectedReminders = useMemo(
    () => (selected ? reminders.filter(r => r.agencyId === selected.agencyId).sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)) : []),
    [selected, reminders]
  );

  const refresh = useCallback((s) => {
    setSubscriptions(prev => prev.map(x => x.id === s.id ? s : x));
    if (selected?.id === s.id) setSelected(s);
  }, [selected]);

  const handleReceive = useCallback((s) => {
    const agency = getAgencyById(s.agencyId);
    const company = getCompanyById(agency?.companyId);
    const next = {
      ...s, status: 'paye', paidAt: todayISO(), method: 'Orange Money',
      reference: `PAY-SUB-${String(payments.length + 1).padStart(4, '0')}`,
      autoDisconnect: false,
    };
    refresh(next);
    setPayments(prev => [{
      id: next.reference, companyId: company.id, agencyId: s.agencyId, amount: s.amount,
      month: s.month, year: s.year, period: monthLabel(s.month, s.year),
      method: 'Orange Money', reference: next.reference, date: todayISO(), status: 'paye',
    }, ...prev]);
    if (s.status === 'suspendu') {
      addToast(`${agency?.name} réactivée — paiement de ${formatCurrency(s.amount)} encaissé`);
    } else {
      addToast(`Paiement de ${formatCurrency(s.amount)} encaissé pour ${agency?.name}`);
    }
  }, [refresh, payments, addToast]);

  const handleRemind = useCallback((s) => {
    const agency = getAgencyById(s.agencyId);
    const company = getCompanyById(agency?.companyId);
    const isLate = ['en_retard', 'impaye'].includes(s.status);
    const type = isLate ? 'retard_paiement' : 'avant_echeance_j7';
    const subject = isLate
      ? `Paiement abonnement en retard — ${agency?.name}`
      : `Renouvellement abonnement dans 7 jours — ${agency?.name}`;
    const message = isLate
      ? `${company?.name}, l'abonnement de l'agence ${agency?.name} (${formatCurrency(s.amount)}) est impayé. Un paiement automatique sera effectué sous 24h.`
      : `${company?.name}, l'abonnement de ${agency?.name} expire le 31/07/2026. Pensez à renouveler pour ${formatCurrency(s.amount)}.`;
    setReminders(prev => [{
      id: `REL-${String(prev.length + 1).padStart(3, '0')}`, companyId: company.id, agencyId: s.agencyId,
      type, channel: 'email', sentAt: todayISO(), subject, message, status: 'envoye',
    }, ...prev]);
    addToast(`Relance envoyée à ${company?.name}`, 'info');
  }, [addToast]);

  const handleSuspend = useCallback((s) => {
    const agency = getAgencyById(s.agencyId);
    const company = getCompanyById(agency?.companyId);
    openModal({
      title: 'Suspendre l\'agence',
      message: `Suspendre ${agency?.name} (${company?.name}) ? Les ${agency?.agents} agents seront déconnectés automatiquement de toutes leurs sessions jusqu'au règlement.`,
      confirmLabel: 'Suspendre', confirmClass: 'danger', icon: 'bi-lock-fill', iconBg: 'rgba(239,68,68,0.12)', iconColor: '#EF4444',
      onConfirm: () => {
        const next = { ...s, status: 'suspendu', autoDisconnect: true };
        refresh(next);
        setReminders(prev => [{
          id: `REL-${String(prev.length + 1).padStart(3, '0')}`, companyId: company.id, agencyId: s.agencyId,
          type: 'suspension', channel: 'email', sentAt: todayISO(),
          subject: `Agence ${agency?.name} suspendue`,
          message: `${company?.name}, l'agence ${agency?.name} a été suspendue. Les ${agency?.agents} agents ont été déconnectés automatiquement.`,
          status: 'envoye',
        }, ...prev]);
        addToast(`${agency?.name} suspendue — ${agency?.agents} agents déconnectés`, 'warning');
        setModalOpen(false);
      },
    });
  }, [openModal, refresh, addToast]);

  const handleReactivate = useCallback((s) => {
    const agency = getAgencyById(s.agencyId);
    const company = getCompanyById(agency?.companyId);
    openModal({
      title: 'Réactiver l\'agence',
      message: `Réactiver ${agency?.name} (${company?.name}) ? Les sessions des ${agency?.agents} agents seront restaurées après encaissement du paiement.`,
      confirmLabel: 'Réactiver', confirmClass: 'success', icon: 'bi-unlock-fill', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10B981',
      onConfirm: () => { handleReceive(s); setModalOpen(false); },
    });
  }, [openModal, handleReceive]);

  const resetFilters = useCallback(() => { setSearch(''); setStatusFilter(''); setCompanyFilter(''); setSortBy('status'); setPage(1); }, []);

  const statusBadge = (status) => {
    const cfg = subscriptionStatusConfig[status];
    return <span className="adasc-badge" style={{ background: cfg.bg, color: cfg.color }}><i className="bi bi-circle-fill" style={{ fontSize: '0.45rem' }} /> {cfg.label}</span>;
  };

  const dayInfo = (s) => {
    if (s.status === 'suspendu') return <span className="adasc-days" style={{ color: subscriptionStatusConfig.suspendu.color }}>Suspendue</span>;
    if (s.status === 'paye') {
      const left = daysBetween(TODAY, s.renewedAt);
      return <span className={`adasc-days ${left <= 3 ? 'adasc-days--warn' : ''}`}>{left} j restants</span>;
    }
    const overdue = daysBetween(s.dueDate, TODAY);
    return <span className={`adasc-days ${overdue >= 15 ? 'adasc-days--danger' : 'adasc-days--warn'}`}>Retard de {overdue} j</span>;
  };

  if (loading) {
    return (
      <div className="adm-page adasc-page">
        <div className="adasc-hero">
          <div>
            <h1><i className="bi bi-card-checklist" /> Abonnements des agences</h1>
            <p>Chargement des données…</p>
          </div>
        </div>
        <div className="adasc-stats">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="adasc-stat" style={{ height: 110, background: 'var(--adm-surface-hover)', animation: 'adascFadeIn 0.5s ease' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page adasc-page">
      {/* Hero */}
      <div className="adasc-hero">
        <div>
          <h1><i className="bi bi-card-checklist" /> Abonnements des agences</h1>
          <p>Suivi des abonnements mensuels par agence, déconnexion automatique et relances de renouvellement</p>
        </div>
        <div className="adasc-hero-actions">
          <button className="adasc-btn adasc-btn--ghost" onClick={() => addToast('Export CSV prêt — à connecter à Express.js.', 'info')}>
            <i className="bi bi-download" /> Exporter
          </button>
          <button className="adasc-btn adasc-btn--light" onClick={() => addToast('Renouvellement automatique lancé pour les agences payées.', 'success')}>
            <i className="bi bi-arrow-repeat" /> Renouveler le mois
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="adasc-stats">
        <div className="adasc-stat adasc-stat--gradient adasc-stat--revenue">
          <div className="adasc-stat__top">
            <span className="adasc-stat__label">Revenu encaissé</span>
            <span className="adasc-stat__icon"><i className="bi bi-cash-stack" /></span>
          </div>
          <div className="adasc-stat__value">{formatCurrency(summary.totalRevenue)}</div>
          <div className="adasc-stat__sub"><i className="bi bi-calendar3" /> Juillet 2026</div>
        </div>
        <div className="adasc-stat adasc-stat--gradient adasc-stat--paid">
          <div className="adasc-stat__top">
            <span className="adasc-stat__label">Agences payées</span>
            <span className="adasc-stat__icon"><i className="bi bi-check-circle" /></span>
          </div>
          <div className="adasc-stat__value">{summary.paid} <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.85 }}>/ {summary.total}</span></div>
          <div className="adasc-stat__sub">Toutes compagnies confondues</div>
        </div>
        <div className="adasc-stat adasc-stat--gradient adasc-stat--late">
          <div className="adasc-stat__top">
            <span className="adasc-stat__label">En retard</span>
            <span className="adasc-stat__icon"><i className="bi bi-hourglass-split" /></span>
          </div>
          <div className="adasc-stat__value">{summary.late}</div>
          <div className="adasc-stat__sub"><i className="bi bi-exclamation-triangle" /> Paiement imminent requis</div>
        </div>
        <div className="adasc-stat adasc-stat--gradient adasc-stat--unpaid">
          <div className="adasc-stat__top">
            <span className="adasc-stat__label">Impayées</span>
            <span className="adasc-stat__icon"><i className="bi bi-x-octagon" /></span>
          </div>
          <div className="adasc-stat__value">{summary.unpaid}</div>
          <div className="adasc-stat__sub">Risque de suspension</div>
        </div>
        <div className="adasc-stat adasc-stat--gradient adasc-stat--suspended">
          <div className="adasc-stat__top">
            <span className="adasc-stat__label">Suspendues</span>
            <span className="adasc-stat__icon"><i className="bi bi-lock-fill" /></span>
          </div>
          <div className="adasc-stat__value">{summary.suspended}</div>
          <div className="adasc-stat__sub">Agents déconnectés</div>
        </div>
        <div className="adasc-stat adasc-stat--gradient adasc-stat--rate">
          <div className="adasc-stat__top">
            <span className="adasc-stat__label">Recouvrement</span>
            <span className="adasc-stat__icon"><i className="bi bi-percent" /></span>
          </div>
          <div className="adasc-stat__value">{summary.collectedRate}%</div>
          <div className="adasc-stat__sub">{formatCurrency(summary.expectedRevenue)} attendus</div>
        </div>
      </div>

      {/* Revenue per company */}
      <div className="adasc-section-header">
        <h2><i className="bi bi-graph-up-arrow" /> Revenu par compagnie <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'var(--adm-text-muted)' }}>— juillet 2026</span></h2>
        <span className="adasc-count">Total : {formatCurrency(summary.totalRevenue)}</span>
      </div>
      <div className="adasc-revenue-grid">
        {revenueByCompany.map((c, idx) => (
          <div key={c.id} className="adasc-company-card" onClick={() => { setCompanyFilter(c.id); setPage(1); }}>
            <div className="adasc-company-card__head">
              <div className="adasc-company-logo" style={{ background: c.color }}>{c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="adasc-company-card__name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div className="adasc-company-card__meta">{c.subscribedCount}/{c.agenciesCount} agences payées • {c.city}</div>
              </div>
              <span className="adasc-company-card__rank">#{idx + 1}</span>
            </div>
            <div className="adasc-company-card__revenue">
              <span className="adasc-company-card__amount">{c.revenue.toLocaleString('fr-FR')} FCFA</span>
              <span className="adasc-company-card__period">/ mois</span>
            </div>
            <div className="adasc-company-card__bar">
              <div className="adasc-company-card__fill" style={{ width: `${c.rate}%`, background: c.color }} />
            </div>
            <div className="adasc-company-card__foot">
              <span>{c.rate}% recouvré</span>
              {c.pendingRevenue > 0
                ? <span style={{ color: 'var(--adm-danger)' }}><i className="bi bi-arrow-down" /> {c.pendingRevenue.toLocaleString('fr-FR')} FCFA manquants</span>
                : <span style={{ color: 'var(--adm-success)' }}><i className="bi bi-check-circle" /> À jour</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="adasc-section-header">
        <h2><i className="bi bi-list-ul" /> Abonnements du mois <span style={{ fontWeight: 500, fontSize: '0.78rem', color: 'var(--adm-text-muted)' }}>— {monthLabel(7, 2026)}</span></h2>
        <button className="adasc-btn adasc-btn--outline" onClick={resetFilters}><i className="bi bi-arrow-counterclockwise" /> Réinitialiser</button>
      </div>
      <div className="adasc-toolbar">
        <div className="adasc-search">
          <i className="bi bi-search" />
          <input placeholder="Rechercher une agence, une ville, une compagnie…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="adasc-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">Tous les statuts</option>
          <option value="paye">Payé</option>
          <option value="en_retard">En retard</option>
          <option value="impaye">Impayé</option>
          <option value="suspendu">Suspendu</option>
        </select>
        <select className="adasc-select" value={companyFilter} onChange={e => { setCompanyFilter(e.target.value); setPage(1); }}>
          <option value="">Toutes les compagnies</option>
          {subscriptionCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="adasc-select" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
          <option value="status">Trier : statut</option>
          <option value="due">Trier : échéance</option>
          <option value="amount_desc">Trier : montant ↓</option>
          <option value="amount_asc">Trier : montant ↑</option>
        </select>
        <div className="adasc-toolbar__spacer" />
        <span className="adasc-count">{filtered.length} abonnement(s)</span>
      </div>

      {/* Table */}
      <div className="adasc-table-wrap">
        <table className="adasc-table">
          <thead>
            <tr>
              <th>Agence</th>
              <th>Compagnie</th>
              <th>Montant / mois</th>
              <th>Échéance</th>
              <th>Statut</th>
              <th>Échéance / retard</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(s => {
              const agency = getAgencyById(s.agencyId);
              const company = getCompanyById(agency?.companyId);
              const isLate = ['en_retard', 'impaye'].includes(s.status);
              const isSuspended = s.status === 'suspendu';
              return (
                <tr key={s.id} onClick={() => handleSelect(s)}>
                  <td>
                    <div className="adasc-agency">
                      <div className="adasc-agency__avatar" style={{ background: company?.color }}>{agency?.name.split(' ')[0][0]}{agency?.name.split(' ')[1]?.[0] || ''}</div>
                      <div>
                        <div className="adasc-agency__name">{agency?.name}</div>
                        <div className="adasc-agency__sub">{agency?.city} • {agency?.agents} agents • {agency?.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="adasc-company-chip">
                      <span className="adasc-company-chip__dot" style={{ background: company?.color }} />
                      {company?.name}
                    </span>
                  </td>
                  <td><span className="adasc-amount">{s.amount.toLocaleString('fr-FR')} FCFA</span></td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-secondary)' }}>
                    {new Date(s.dueDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </td>
                  <td>{statusBadge(s.status)}</td>
                  <td>{dayInfo(s)}</td>
                  <td>
                    <div className="adasc-actions" onClick={e => e.stopPropagation()}>
                      <button className="adasc-icon-btn" title="Détails" onClick={() => handleSelect(s)}><i className="bi bi-eye" /></button>
                      {s.status === 'paye' && (
                        <button className="adasc-icon-btn adasc-icon-btn--warning" title="Envoyer la relance de renouvellement" onClick={() => handleRemind(s)}><i className="bi bi-bell" /></button>
                      )}
                      {isLate && (
                        <>
                          <button className="adasc-icon-btn adasc-icon-btn--success" title="Encaisser le paiement" onClick={() => handleReceive(s)}><i className="bi bi-cash-coin" /></button>
                          <button className="adasc-icon-btn adasc-icon-btn--warning" title="Relancer la compagnie" onClick={() => handleRemind(s)}><i className="bi bi-bell" /></button>
                          <button className="adasc-icon-btn adasc-icon-btn--danger" title="Suspendre — déconnecter les agents" onClick={() => handleSuspend(s)}><i className="bi bi-lock-fill" /></button>
                        </>
                      )}
                      {isSuspended && (
                        <button className="adasc-icon-btn adasc-icon-btn--success" title="Réactiver après paiement" onClick={() => handleReactivate(s)}><i className="bi bi-unlock-fill" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr><td colSpan={7}><div className="adasc-empty"><i className="bi bi-inbox" style={{ fontSize: '1.6rem', display: 'block', marginBottom: '0.4rem' }} /> Aucun abonnement ne correspond aux filtres.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="adasc-cards">
        {paginated.map(s => {
          const agency = getAgencyById(s.agencyId);
          const company = getCompanyById(agency?.companyId);
          const isLate = ['en_retard', 'impaye'].includes(s.status);
          const isSuspended = s.status === 'suspendu';
          return (
            <div key={s.id} className="adasc-company-card" onClick={() => handleSelect(s)}>
              <div className="adasc-company-card__head">
                <div className="adasc-company-logo" style={{ background: company?.color }}>{agency?.name.split(' ')[0][0]}</div>
                <div style={{ flex: 1 }}>
                  <div className="adasc-company-card__name">{agency?.name}</div>
                  <div className="adasc-company-card__meta">{company?.name} • {agency?.city} • {agency?.agents} agents</div>
                </div>
                {statusBadge(s.status)}
              </div>
              <div className="adasc-company-card__revenue">
                <span className="adasc-company-card__amount">{s.amount.toLocaleString('fr-FR')} FCFA</span>
                <span className="adasc-company-card__period">/ mois</span>
              </div>
              <div className="adasc-company-card__foot" style={{ marginBottom: '0.6rem' }}>{dayInfo(s)}</div>
              <div className="adasc-actions" onClick={e => e.stopPropagation()} style={{ justifyContent: 'flex-start' }}>
                <button className="adasc-icon-btn" title="Détails" onClick={() => handleSelect(s)}><i className="bi bi-eye" /></button>
                {s.status === 'paye' && <button className="adasc-icon-btn adasc-icon-btn--warning" title="Relance renouvellement" onClick={() => handleRemind(s)}><i className="bi bi-bell" /></button>}
                {isLate && (
                  <>
                    <button className="adasc-icon-btn adasc-icon-btn--success" title="Encaisser" onClick={() => handleReceive(s)}><i className="bi bi-cash-coin" /></button>
                    <button className="adasc-icon-btn adasc-icon-btn--warning" title="Relancer" onClick={() => handleRemind(s)}><i className="bi bi-bell" /></button>
                    <button className="adasc-icon-btn adasc-icon-btn--danger" title="Suspendre" onClick={() => handleSuspend(s)}><i className="bi bi-lock-fill" /></button>
                  </>
                )}
                {isSuspended && <button className="adasc-icon-btn adasc-icon-btn--success" title="Réactiver" onClick={() => handleReactivate(s)}><i className="bi bi-unlock-fill" /></button>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="adasc-pagination">
          <span>Affichage {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} sur {filtered.length}</span>
          <div className="adasc-pagination-pages">
            <button className="adasc-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><i className="bi bi-chevron-left" /></button>
            {[...Array(totalPages).keys()].slice(Math.max(0, Math.min(page - 3, totalPages - 5)), Math.max(5, Math.min(page + 2, totalPages))).map(i => (
              <button key={i} className={`adasc-page-btn ${page === i + 1 ? 'adasc-page-btn--active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="adasc-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><i className="bi bi-chevron-right" /></button>
          </div>
        </div>
      )}

      {/* Drawer */}
      {selected && selectedAgency && (
        <>
          <div className="adasc-drawer-overlay" onClick={closeDrawer} />
          <div className="adasc-drawer">
            <div className="adasc-drawer-header">
              <h2><i className="bi bi-building" style={{ color: selectedCompany?.color }} /> {selectedAgency.name}</h2>
              <button className="adasc-drawer-close" onClick={closeDrawer}><i className="bi bi-x-lg" /></button>
            </div>
            <div className="adasc-drawer-body">
              <div className="adasc-drawer-tabs">
                {drawerTabs.map(tab => (
                  <button key={tab.id} className={`adasc-drawer-tab ${drawerTab === tab.id ? 'adasc-drawer-tab--active' : ''}`} onClick={() => setDrawerTab(tab.id)}>
                    <i className={`bi ${tab.icon}`} /> {tab.label}
                  </button>
                ))}
              </div>

              {drawerTab === 'infos' && (
                <div className="adasc-drawer-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="adasc-company-logo" style={{ background: selectedCompany?.color, width: 46, height: 46, fontSize: '0.9rem' }}>
                      {selectedCompany?.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--adm-text)' }}>{selectedCompany?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{selectedCompany?.city} • {selectedCompany?.phone} • {selectedCompany?.email}</div>
                    </div>
                  </div>
                  <h3><i className="bi bi-card-checklist" /> Abonnement {monthLabel(selected.month, selected.year)}</h3>
                  <div className="adasc-info-grid">
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Référence</div><div className="adasc-info-item__value">{selected.id}</div></div>
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Statut</div><div className="adasc-info-item__value">{statusBadge(selected.status)}</div></div>
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Montant mensuel</div><div className="adasc-info-item__value">{formatCurrency(selected.amount)}</div></div>
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Échéance de paiement</div><div className="adasc-info-item__value">{new Date(selected.dueDate).toLocaleDateString('fr-FR')}</div></div>
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Fin de période</div><div className="adasc-info-item__value">{new Date(selected.renewedAt).toLocaleDateString('fr-FR')}</div></div>
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Déconnexion auto</div><div className="adasc-info-item__value">{selected.autoDisconnect ? <span style={{ color: 'var(--adm-danger)' }}>Activée</span> : <span style={{ color: 'var(--adm-success)' }}>Désactivée</span>}</div></div>
                  </div>
                  {selected.status === 'paye' ? (
                    <div className="adasc-info-item" style={{ marginTop: '0.75rem', background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
                      <div className="adasc-info-item__label">Dernier paiement</div>
                      <div className="adasc-info-item__value">{selected.reference} • {formatCurrency(selected.amount)} via {selected.method}</div>
                    </div>
                  ) : (
                    <div className="adasc-info-item" style={{ marginTop: '0.75rem', background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
                      <div className="adasc-info-item__label">Alerte</div>
                      <div className="adasc-info-item__value" style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--adm-text-secondary)' }}>
                        {selected.status === 'suspendu'
                          ? `${selectedAgency.agents} agents déconnectés. Encaisser le paiement pour réactiver l'agence.`
                          : `Paiement de ${formatCurrency(selected.amount)} attendu avant le ${new Date(selected.dueDate).toLocaleDateString('fr-FR')} — sinon suspension automatique.`}
                      </div>
                    </div>
                  )}
                  <h3><i className="bi bi-people" /> Agence</h3>
                  <div className="adasc-info-grid">
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Adresse</div><div className="adasc-info-item__value">{selectedAgency.address}</div></div>
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Agents actifs</div><div className="adasc-info-item__value">{selectedAgency.agents}</div></div>
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Téléphone</div><div className="adasc-info-item__value">{selectedAgency.phone}</div></div>
                    <div className="adasc-info-item"><div className="adasc-info-item__label">Ville</div><div className="adasc-info-item__value">{selectedAgency.city}</div></div>
                  </div>
                </div>
              )}

              {drawerTab === 'payments' && (
                <div className="adasc-drawer-section">
                  <h3><i className="bi bi-cash-stack" /> Historique des paiements ({selectedPayments.length})</h3>
                  {selectedPayments.length === 0 ? (
                    <div className="adasc-empty"><i className="bi bi-cash" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.4rem' }} /> Aucun paiement enregistré pour ce mois.</div>
                  ) : (
                    selectedPayments.map(p => (
                      <div key={p.id} className="adasc-list-item">
                        <div className="adasc-list-item__main">
                          <div className="adasc-list-item__icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}><i className="bi bi-cash-coin" /></div>
                          <div>
                            <div className="adasc-list-item__title">{p.period} — {formatCurrency(p.amount)}</div>
                            <div className="adasc-list-item__sub">{p.reference} • {p.method} • {new Date(p.date).toLocaleString('fr-FR')}</div>
                          </div>
                        </div>
                        <span className="adasc-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}><i className="bi bi-check-circle-fill" /> Payé</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {drawerTab === 'reminders' && (
                <div className="adasc-drawer-section">
                  <h3><i className="bi bi-bell" /> Relances envoyées à la compagnie ({selectedReminders.length})</h3>
                  {selectedReminders.length === 0 ? (
                    <div className="adasc-empty"><i className="bi bi-bell-slash" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.4rem' }} /> Aucune relance envoyée.</div>
                  ) : (
                    selectedReminders.map(r => {
                      const cfg = reminderTypeConfig[r.type];
                      return (
                        <div key={r.id} className="adasc-list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
                            <div className="adasc-list-item__main">
                              <div className="adasc-list-item__icon" style={{ background: cfg.bg, color: cfg.color }}><i className={`bi ${r.channel === 'sms' ? 'bi-chat-dots' : 'bi-envelope'}`} /></div>
                              <div>
                                <div className="adasc-list-item__title">{r.subject}</div>
                                <div className="adasc-list-item__sub">{new Date(r.sentAt).toLocaleString('fr-FR')} • {r.channel === 'sms' ? 'SMS' : 'Email'} • {r.status === 'lu' ? 'Lue' : 'Envoyée'}</div>
                              </div>
                            </div>
                            <span className="adasc-badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-secondary)', lineHeight: 1.5 }}>{r.message}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <>
          <div className="adasc-modal-overlay" onClick={() => setModalOpen(false)} />
          <div className="adasc-modal">
            <div className="adasc-modal__icon" style={{ background: modalConfig.iconBg || 'rgba(139,92,246,0.1)', color: modalConfig.iconColor || 'var(--adm-accent)' }}>
              <i className={`bi ${modalConfig.icon || 'bi-question-circle'}`} />
            </div>
            <div className="adasc-modal__title">{modalConfig.title}</div>
            <div className="adasc-modal__msg">{modalConfig.message}</div>
            <div className="adasc-modal__actions">
              <button className="adasc-btn adasc-btn--outline" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className={`adasc-btn ${modalConfig.confirmClass === 'danger' ? 'adasc-btn--danger' : modalConfig.confirmClass === 'success' ? 'adasc-btn--success' : 'adasc-btn--primary'}`} onClick={modalConfig.onConfirm}>
                {modalConfig.confirmLabel || 'Confirmer'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toasts */}
      <div className="adasc-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`adasc-toast adasc-toast--${t.type}`}>
            <i className={`bi ${t.type === 'success' ? 'bi-check-circle-fill' : t.type === 'error' ? 'bi-x-circle-fill' : t.type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'}`} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
