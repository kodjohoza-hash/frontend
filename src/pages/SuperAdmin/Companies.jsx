import { useState, useMemo, useEffect } from 'react';
import { filterCompanies, sortCompanies, buildFilterOptions } from '../../services/companies.service';
import useCompaniesStore from '../../store/companies.store';
import AdminCompanyStats from '../../components/admin/AdminCompanyStats';
import AdminCompanyFilters from '../../components/admin/AdminCompanyFilters';
import AdminCompanyTable from '../../components/admin/AdminCompanyTable';
import AdminCompanyCards from '../../components/admin/AdminCompanyCards';
import AdminCompanyProfile from '../../components/admin/AdminCompanyProfile';
import AdminCompanyTimeline from '../../components/admin/AdminCompanyTimeline';
import AdminCompanyDocuments from '../../components/admin/AdminCompanyDocuments';
import AdminCompanyValidation from '../../components/admin/AdminCompanyValidation';
import AdminCompanySkeleton from '../../components/admin/AdminCompanySkeleton';

const ITEMS_PER_PAGE = 8;

const defaultFilters = {
  search: '', city: 'all', country: 'all', subscription: 'all', status: 'all',
  busesMin: '', busesMax: '', agentsMin: '', agentsMax: '',
};

const Companies = () => {
  const {
    companies, stats, loading, refresh, suspend, reactivate, refuse, validate, removeCompany,
  } = useCompaniesStore();
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showValidation, setShowValidation] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  useEffect(() => {
    refresh().catch((err) => {
      addToast('error', err.message || 'Impossible de charger les compagnies.');
    });
  }, [refresh]);

  const filtered = useMemo(() => filterCompanies(companies, filters), [companies, filters]);
  const sorted = useMemo(() => sortCompanies(filtered, sortBy), [filtered, sortBy]);
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const filterOptions = useMemo(() => buildFilterOptions(companies), [companies]);

  /* Activité récente dérivée des compagnies réelles (timeline sans mock). */
  const timelineEvents = useMemo(
    () =>
      [...companies]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8)
        .map((c) => ({
          id: `tl-${c.id}`,
          action: 'Nouvelle compagnie',
          detail: `${c.name} a rejoint la plateforme`,
          time: c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : '',
          icon: 'bi-building-add',
          color: 'success',
        })),
    [companies]
  );

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handleAction = (action, company) => {
    switch (action) {
      case 'view':
        setSelectedCompany(company);
        break;
      case 'edit':
        addToast('info', `Modification de ${company.name} (à venir)`);
        break;
      case 'validate':
        setShowValidation(company);
        break;
      case 'suspend':
        setConfirmAction({ action: 'suspend', company, message: `Suspendre ${company.name} ?`, icon: 'warning' });
        break;
      case 'reactivate':
        setConfirmAction({ action: 'reactivate', company, message: `Réactiver ${company.name} ?`, icon: 'success' });
        break;
      case 'refuse':
        setConfirmAction({ action: 'refuse', company, message: `Refuser ${company.name} ?`, icon: 'danger' });
        break;
      case 'delete':
        setConfirmAction({ action: 'delete', company, message: `Supprimer ${company.name} ? Cette action est irréversible.`, icon: 'danger' });
        break;
      case 'stats':
        addToast('info', `Statistiques de ${company.name} (à venir)`);
        break;
      default:
        addToast('info', `${action} — ${company.name} (à venir)`);
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { action, company } = confirmAction;
    setConfirming(true);
    try {
      switch (action) {
        case 'suspend':
          await suspend(company);
          addToast('success', `${company.name} suspendue`);
          break;
        case 'reactivate':
          await reactivate(company);
          addToast('success', `${company.name} réactivée`);
          break;
        case 'refuse':
          await refuse(company);
          addToast('success', `${company.name} refusée`);
          break;
        case 'delete':
          await removeCompany(company);
          addToast('success', `${company.name} supprimée`);
          break;
        default:
          addToast('success', `${company.name} — action effectuée`);
      }
    } catch (err) {
      addToast('error', err.message || 'Action impossible.');
    } finally {
      setConfirming(false);
      setConfirmAction(null);
    }
  };

  const handleValidationComplete = async (decision) => {
    const target = showValidation;
    if (!target) return;
    setConfirming(true);
    try {
      if (decision === 'validated') {
        await validate(target);
        addToast('success', `${target.name} validée`);
      } else {
        await refuse(target);
        addToast('success', `${target.name} refusée`);
      }
    } catch (err) {
      addToast('error', err.message || 'Validation impossible.');
    } finally {
      setConfirming(false);
      setShowValidation(null);
    }
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSortBy('newest');
    setPage(1);
    addToast('info', 'Filtres réinitialisés');
  };

  if (loading && companies.length === 0) return <AdminCompanySkeleton />;

  return (
    <div className="admc-page">
      {/* Hero */}
      <div className="admc-hero">
        <div className="admc-hero-content">
          <div>
            <h1>Gestion des compagnies</h1>
            <p>Gérez, validez et supervisez toutes les compagnies de transport de la plateforme.</p>
          </div>
          <div className="admc-hero-actions">
            <button className="admc-btn admc-btn--primary" onClick={() => addToast('info', 'Création de compagnie (à venir)')}>
              <i className="bi bi-plus-lg" /> Nouvelle compagnie
            </button>
            <button className="admc-btn admc-btn--outline" onClick={() => addToast('info', 'Export (à venir)')}>
              <i className="bi bi-download" /> Exporter
            </button>
          </div>
        </div>
      </div>

      {/* KPI */}
      <AdminCompanyStats stats={stats} />

      {/* Filters */}
      <AdminCompanyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        total={companies.length}
        filtered={filtered.length}
        options={filterOptions}
      />

      {/* Sort */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem', gap: '0.5rem', alignItems: 'center' }}>
        <label style={{ fontSize: '0.8rem', color: '#6B7280' }}>Trier par :</label>
        <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}
          style={{ padding: '0.35rem 0.6rem', borderRadius: 6, border: '1.5px solid #E5E7EB', fontSize: '0.8rem', background: '#fff' }}>
          <option value="newest">Plus récentes</option>
          <option value="oldest">Plus anciennes</option>
          <option value="name_asc">Nom A-Z</option>
          <option value="name_desc">Nom Z-A</option>
          <option value="revenue_desc">Revenu ↓</option>
          <option value="revenue_asc">Revenu ↑</option>
          <option value="tickets_desc">Billets ↓</option>
        </select>
      </div>

      {/* Table */}
      <AdminCompanyTable companies={paginated} onAction={handleAction} onSelect={(c) => setSelectedCompany(c)} />

      {/* Cards (mobile) */}
      <AdminCompanyCards companies={paginated} onAction={handleAction} onSelect={(c) => setSelectedCompany(c)} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admc-table-wrapper">
          <div className="admc-pagination">
            <div className="admc-pagination-info">
              Page {page} sur {totalPages} — {sorted.length} compagnie{sorted.length !== 1 ? 's' : ''}
            </div>
            <div className="admc-pagination-pages">
              <button className="admc-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <i className="bi bi-chevron-left" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`admc-page-btn ${p === page ? 'admc-page-btn--active' : ''}`}
                  onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="admc-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline + Documents side by side (desktop) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="admc-drawer-section">
          <AdminCompanyTimeline events={timelineEvents} />
        </div>
        <div>
          <AdminCompanyDocuments documents={[]} />
        </div>
      </div>

      {/* Drawer — Company Profile */}
      {selectedCompany && (
        <AdminCompanyProfile company={selectedCompany} onClose={() => setSelectedCompany(null)} />
      )}

      {/* Validation Wizard */}
      {showValidation && (
        <AdminCompanyValidation
          company={showValidation}
          onComplete={handleValidationComplete}
          onCancel={() => setShowValidation(null)}
        />
      )}

      {/* Confirm Modal */}
      {confirmAction && (
        <div className="admc-modal-overlay" onClick={() => !confirming && setConfirmAction(null)}>
          <div className="admc-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`admc-modal-icon admc-modal-icon--${confirmAction.icon}`}>
              <i className={`bi ${confirmAction.icon === 'danger' ? 'bi-exclamation-triangle' : confirmAction.icon === 'success' ? 'bi-check-circle' : 'bi-question-circle'}`} />
            </div>
            <h3>Confirmation</h3>
            <p>{confirmAction.message}</p>
            <div className="admc-modal-actions">
              <button className="admc-btn--cancel" disabled={confirming} onClick={() => setConfirmAction(null)}>Annuler</button>
              <button className={`admc-btn--${confirmAction.icon === 'danger' ? 'danger' : 'primary'}`} disabled={confirming} onClick={handleConfirm}>
                {confirming ? 'En cours…' : confirmAction.action === 'reactivate' ? 'Réactiver' : confirmAction.action.charAt(0).toUpperCase() + confirmAction.action.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="admc-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`admc-toast admc-toast--${t.type}`}>
            <i className={`bi ${t.type === 'success' ? 'bi-check-circle' : t.type === 'error' ? 'bi-x-circle' : t.type === 'warning' ? 'bi-exclamation-triangle' : 'bi-info-circle'}`} />
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Companies;
