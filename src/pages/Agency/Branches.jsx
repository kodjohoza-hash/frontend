import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgencyBranchStats from '../../components/agency/AgencyBranchStats';
import AgencyBranchFilters from '../../components/agency/AgencyBranchFilters';
import AgencyBranchTable from '../../components/agency/AgencyBranchTable';
import AgencyBranchCard from '../../components/agency/AgencyBranchCard';
import AgencyBranchModal from '../../components/agency/AgencyBranchModal';
import AgencyBranchSkeleton from '../../components/agency/AgencyBranchSkeleton';
import useAgencyStore from '../../store/agency.store';
import { UI_TO_STATUS } from '../../services/agency.service';

export default function Branches() {
  const navigate = useNavigate();
  const { branches, stats, villes, loading, fetchBranches, fetchStats, fetchVilles, createBranch, updateBranch, removeBranch, suspend } = useAgencyStore();

  const [filters, setFilters] = useState({ search: '', city: '', region: '', status: '', type: '' });
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const perPage = 10;

  useEffect(() => {
    fetchBranches();
    fetchStats();
    fetchVilles();
  }, [fetchBranches, fetchStats, fetchVilles]);

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

  const handleAction = async (action, branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    if (action === 'view') {
      navigate(`/agency/branches/${branchId}`);
    } else if (action === 'edit') {
      setEditingBranch(branch);
      setModalOpen(true);
    } else if (action === 'map') {
      if (branch?.lat && branch?.lng) {
        window.open(`https://www.google.com/maps?q=${branch.lat},${branch.lng}`, '_blank');
      }
    } else if (action === 'agents') {
      navigate(`/agency/counter-agents?branch=${branchId}`);
    } else if (action === 'stats') {
      navigate(`/agency/branches/${branchId}`);
    } else if (action === 'delete' && branch) {
      if (window.confirm(`Supprimer ${branch.name} ?`)) {
        try {
          setBusy(true);
          await removeBranch(branch);
        } catch (err) {
          window.alert(err.message || 'Impossible de supprimer cette agence.');
        } finally {
          setBusy(false);
        }
      }
    } else if (action === 'suspend' && branch) {
      if (window.confirm(`Suspendre ${branch.name} ?`)) {
        try {
          setBusy(true);
          await suspend(branch);
        } catch (err) {
          window.alert(err.message || 'Impossible de suspendre cette agence.');
        } finally {
          setBusy(false);
        }
      }
    } else {
      alert(`Action "${action}" sur ${branch?.name}`);
    }
  };

  const handleSave = async (formData) => {
    const ville = villes.find((v) => v.nom === formData.city);
    if (!ville) {
      window.alert(`La ville "${formData.city}" n'existe pas dans la base. Sélectionnez une ville de la liste.`);
      return;
    }
    const payload = {
      nom: formData.name,
      villeId: ville.id,
      region: formData.region,
      adresse: formData.fullAddress,
      quartier: formData.quartier,
      telephone: formData.phone,
      email: formData.email,
      description: formData.description,
      statut: UI_TO_STATUS[formData.status] || 'actif',
      type: formData.type,
      latitude: formData.lat ? parseFloat(formData.lat) : null,
      longitude: formData.lng ? parseFloat(formData.lng) : null,
      heureOuverture: formData.openTime,
      heureFermeture: formData.closeTime,
      joursOuverture: formData.openDays,
      services: formData.services,
    };
    try {
      setBusy(true);
      if (editingBranch) {
        await updateBranch(editingBranch.id, payload);
      } else {
        await createBranch(payload);
      }
      setModalOpen(false);
      setEditingBranch(null);
    } catch (err) {
      window.alert(err.message || 'Impossible d\'enregistrer ce point de vente.');
    } finally {
      setBusy(false);
    }
  };

  if (loading && branches.length === 0) return <AgencyBranchSkeleton count={6} />;

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
          <button className="abr-btn abr-btn--primary abr-btn--lg" disabled={busy} onClick={() => { setEditingBranch(null); setModalOpen(true); }}>
            <i className="bi bi-plus-lg" /><span>Ajouter un point de vente</span>
          </button>
        </div>
      </div>

      <AgencyBranchStats stats={stats} />
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

      <AgencyBranchModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingBranch(null); }} branch={editingBranch} onSave={handleSave} villes={villes} />
    </div>
  );
}
