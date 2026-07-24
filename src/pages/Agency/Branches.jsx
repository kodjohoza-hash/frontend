import { useState, useMemo } from 'react';
import AgencyBranchStats from '../../components/agency/AgencyBranchStats';
import AgencyBranchFilters from '../../components/agency/AgencyBranchFilters';
import AgencyBranchTable from '../../components/agency/AgencyBranchTable';
import AgencyBranchCard from '../../components/agency/AgencyBranchCard';
import AgencyBranchModal from '../../components/agency/AgencyBranchModal';
import AgencyBranchSkeleton from '../../components/agency/AgencyBranchSkeleton';
import { mockBranches } from '../../data/agencyBranchData';

export default function Branches() {
  const [branches, setBranches] = useState(mockBranches);
  const [filters, setFilters] = useState({ search: '', city: '', region: '', status: '', type: '' });
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const [loading] = useState(false);
  const perPage = 10;

  const filteredBranches = useMemo(() => {
    let result = [...branches];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((b) => `${b.name} ${b.city} ${b.fullAddress} ${b.code}`.toLowerCase().includes(q));
    }
    if (filters.city) result = result.filter((b) => b.city === filters.city);
    if (filters.region) result = result.filter((b) => b.region === filters.region);
    if (filters.status) result = result.filter((b) => b.status === filters.status);
    if (filters.type) result = result.filter((b) => b.type === filters.type);
    result.sort((a, b) => {
      const valA = a[sort.key] || a.id;
      const valB = b[sort.key] || b.id;
      if (typeof valA === 'string') return sort.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sort.dir === 'asc' ? valA - valB : valB - valA;
    });
    return result;
  }, [branches, filters, sort]);

  const paginatedBranches = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredBranches.slice(start, start + perPage);
  }, [filteredBranches, page]);

  const totalPages = Math.ceil(filteredBranches.length / perPage);

  const handleReset = () => { setFilters({ search: '', city: '', region: '', status: '', type: '' }); setPage(1); };
  const handleSort = (key) => { setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' })); };

  const handleAction = (action, branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    if (action === 'view') {
      window.location.href = `/company/branches/${branchId}`;
    } else if (action === 'edit') {
      setEditingBranch(branch);
      setModalOpen(true);
    } else if (action === 'delete' && branch) {
      if (window.confirm(`Supprimer ${branch.name} ?`)) {
        setBranches((prev) => prev.filter((b) => b.id !== branchId));
      }
    } else if (action === 'suspend' && branch) {
      setBranches((prev) => prev.map((b) => b.id === branchId ? { ...b, status: 'temporairement_ferme' } : b));
    } else if (action === 'agents') {
      window.location.href = `/company/counter-agents?branch=${branchId}`;
    } else if (action === 'map') {
      if (branch?.lat && branch?.lng) {
        window.open(`https://www.google.com/maps?q=${branch.lat},${branch.lng}`, '_blank');
      }
    } else {
      alert(`Action "${action}" sur ${branch?.name}`);
    }
  };

  const handleSave = (formData) => {
    if (editingBranch) {
      setBranches((prev) => prev.map((b) => b.id === editingBranch.id ? { ...b, ...formData, manager: { ...b.manager, name: formData.managerName } } : b));
    } else {
      const newBranch = {
        id: `BR-${String(branches.length + 1).padStart(3, '0')}`,
        ...formData,
        lat: parseFloat(formData.lat) || 0, lng: parseFloat(formData.lng) || 0,
        manager: { name: formData.managerName, id: null, phone: null },
        agentCount: 0, counters: 0, photoUrl: null,
        stats: { todayBookings: 0, todayRevenue: 0, totalBookings: 0, totalRevenue: 0, avgDaily: 0, satisfaction: 0 },
        reservations: [], history: [],
      };
      setBranches((prev) => [newBranch, ...prev]);
    }
    setModalOpen(false);
    setEditingBranch(null);
  };

  if (loading) return <AgencyBranchSkeleton count={6} />;

  return (
    <div className="abr-page">
      <div className="abr-page__header">
        <div className="abr-page__title-group">
          <h1 className="abr-page__title"><i className="bi bi-building" /> Points de vente</h1>
          <p className="abr-page__subtitle">{filteredBranches.length} agence{filteredBranches.length > 1 ? 's' : ''} trouvée{filteredBranches.length > 1 ? 's' : ''}</p>
        </div>
        <div className="abr-page__header-actions">
          <div className="abr-page__view-toggle">
            <button className={`abr-page__view-btn ${viewMode === 'table' ? 'abr-page__view-btn--active' : ''}`} onClick={() => setViewMode('table')}><i className="bi bi-list-ul" /></button>
            <button className={`abr-page__view-btn ${viewMode === 'cards' ? 'abr-page__view-btn--active' : ''}`} onClick={() => setViewMode('cards')}><i className="bi bi-grid-3x3-gap" /></button>
          </div>
          <button className="abr-btn abr-btn--primary abr-btn--lg" onClick={() => { setEditingBranch(null); setModalOpen(true); }}>
            <i className="bi bi-plus-lg" /><span>Ajouter un point de vente</span>
          </button>
        </div>
      </div>

      <AgencyBranchStats />
      <AgencyBranchFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} onReset={handleReset} />

      <div className="abr-page__content">
        {viewMode === 'table' ? (
          <>
            <AgencyBranchTable branches={paginatedBranches} sort={sort} onSort={handleSort} onAction={handleAction} />
            {paginatedBranches.length === 0 && (
              <div className="abr-page__empty"><i className="bi bi-building" /><h3>Aucune agence trouvée</h3><p>Modifiez vos filtres ou ajoutez une nouvelle agence.</p></div>
            )}
          </>
        ) : (
          <div className="abr-page__cards">
            {paginatedBranches.map((b) => <AgencyBranchCard key={b.id} branch={b} onAction={handleAction} />)}
            {paginatedBranches.length === 0 && (
              <div className="abr-page__empty"><i className="bi bi-building" /><h3>Aucune agence trouvée</h3><p>Modifiez vos filtres ou ajoutez une nouvelle agence.</p></div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="abr-pagination">
          <button className="abr-pagination__btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><i className="bi bi-chevron-left" /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`abr-pagination__btn ${p === page ? 'abr-pagination__btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="abr-pagination__btn" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><i className="bi bi-chevron-right" /></button>
          <span className="abr-pagination__info">Page {page} sur {totalPages}</span>
        </div>
      )}

      <AgencyBranchModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingBranch(null); }} branch={editingBranch} onSave={handleSave} />
    </div>
  );
}
