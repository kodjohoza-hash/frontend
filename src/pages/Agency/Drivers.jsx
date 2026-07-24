import { useState, useMemo } from 'react';
import AgencyDriverStats from '../../components/agency/AgencyDriverStats';
import AgencyDriverFilters from '../../components/agency/AgencyDriverFilters';
import AgencyDriverTable from '../../components/agency/AgencyDriverTable';
import AgencyDriverCard from '../../components/agency/AgencyDriverCard';
import AgencyDriverModal from '../../components/agency/AgencyDriverModal';
import AgencyDriverSkeleton from '../../components/agency/AgencyDriverSkeleton';
import { mockDrivers, driverStats } from '../../data/agencyDriverData';

export default function Drivers() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [filters, setFilters] = useState({ search: '', lastName: '', firstName: '', phone: '', status: '', licenseCategory: '', assignedBus: '', city: '', experience: '', available: '' });
  const [activeStatFilter, setActiveStatFilter] = useState('all');
  const [sortField, setSortField] = useState('lastName');
  const [sortDir, setSortDir] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filteredDrivers = useMemo(() => {
    let result = [...drivers];
    if (activeStatFilter !== 'all') result = result.filter((d) => d.status === activeStatFilter);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((d) => `${d.firstName} ${d.lastName} ${d.phone} ${d.email} ${d.id}`.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter((d) => d.status === filters.status);
    if (filters.licenseCategory) result = result.filter((d) => d.licenseCategory === filters.licenseCategory);
    if (filters.city) result = result.filter((d) => d.city === filters.city);
    if (filters.assignedBus === 'yes') result = result.filter((d) => d.assignedBus);
    if (filters.assignedBus === 'no') result = result.filter((d) => !d.assignedBus);
    if (filters.available === 'yes') result = result.filter((d) => d.status === 'disponible');
    if (filters.available === 'no') result = result.filter((d) => d.status !== 'disponible');
    if (filters.experience) {
      const [min, max] = filters.experience.includes('+') ? [parseInt(filters.experience), 99] : filters.experience.split('-').map(Number);
      result = result.filter((d) => d.experience >= min && d.experience <= (max || 99));
    }
    result.sort((a, b) => {
      let valA = a[sortField] || a.id;
      let valB = b[sortField] || b.id;
      if (typeof valA === 'string') return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
    return result;
  }, [drivers, filters, activeStatFilter, sortField, sortDir]);

  const paginatedDrivers = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredDrivers.slice(start, start + perPage);
  }, [filteredDrivers, page]);

  const totalPages = Math.ceil(filteredDrivers.length / perPage);

  const handleReset = () => { setFilters({ search: '', lastName: '', firstName: '', phone: '', status: '', licenseCategory: '', assignedBus: '', city: '', experience: '', available: '' }); setActiveStatFilter('all'); setPage(1); };
  const handleStatFilter = (key) => { setActiveStatFilter(key === activeStatFilter ? 'all' : key); setPage(1); };

  const handleSave = (formData) => {
    if (editingDriver) {
      setDrivers((prev) => prev.map((d) => d.id === editingDriver.id ? { ...d, ...formData } : d));
    } else {
      const newDriver = { id: `DRV-${String(drivers.length + 1).padStart(3, '0')}`, ...formData, assignedBus: formData.assignedBus || null, currentTrip: null, photoUrl: null, performance: { totalTrips: 0, totalKm: 0, punctuality: 0, satisfaction: 0, incidents: 0, yearsService: 0 }, documents: { license: true, nationalId: true, contract: true, medical: false, certificates: false } };
      setDrivers((prev) => [newDriver, ...prev]);
    }
    setModalOpen(false); setEditingDriver(null);
  };

  const handleDelete = (driver) => {
    if (window.confirm(`Supprimer le chauffeur ${driver.firstName} ${driver.lastName} ?`)) {
      setDrivers((prev) => prev.filter((d) => d.id !== driver.id));
    }
  };

  const currentStats = useMemo(() => ({
    total: drivers.length,
    disponible: drivers.filter((d) => d.status === 'disponible').length,
    en_mission: drivers.filter((d) => d.status === 'en_mission').length,
    conge: drivers.filter((d) => d.status === 'conge').length,
    suspendu: drivers.filter((d) => d.status === 'suspendu').length,
    avgExperience: Math.round(drivers.reduce((acc, d) => acc + d.experience, 0) / drivers.length),
  }), [drivers]);

  return (
    <div className="ad-page">
      <div className="ad-page__header">
        <div className="ad-page__title-group">
          <h1 className="ad-page__title"><i className="bi bi-person-badge" /> Chauffeurs</h1>
          <p className="ad-page__subtitle">{filteredDrivers.length} chauffeur{filteredDrivers.length > 1 ? 's' : ''} trouvé{filteredDrivers.length > 1 ? 's' : ''}</p>
        </div>
        <div className="ad-page__header-actions">
          <div className="ad-page__view-toggle">
            <button className={`ad-page__view-btn ${viewMode === 'table' ? 'ad-page__view-btn--active' : ''}`} onClick={() => setViewMode('table')}><i className="bi bi-list-ul" /></button>
            <button className={`ad-page__view-btn ${viewMode === 'cards' ? 'ad-page__view-btn--active' : ''}`} onClick={() => setViewMode('cards')}><i className="bi bi-grid-3x3-gap" /></button>
          </div>
          <button className="ad-btn ad-btn--primary ad-btn--lg" onClick={() => { setEditingDriver(null); setModalOpen(true); }}><i className="bi bi-plus-lg" /><span>Ajouter un chauffeur</span></button>
        </div>
      </div>
      <AgencyDriverStats stats={currentStats} activeFilter={activeStatFilter} onFilterChange={handleStatFilter} />
      <AgencyDriverFilters filters={filters} onFiltersChange={(f) => { setFilters(f); setPage(1); }} onReset={handleReset} />
      <div className="ad-page__content">
        {viewMode === 'table' ? (
          <AgencyDriverTable drivers={paginatedDrivers} sortField={sortField} sortDir={sortDir} onSort={(dir) => setSortDir(dir)} onDelete={handleDelete} />
        ) : (
          <div className="ad-page__cards">
            {paginatedDrivers.map((d) => <AgencyDriverCard key={d.id} driver={d} />)}
            {paginatedDrivers.length === 0 && <div className="ad-page__empty-cards"><i className="bi bi-person-badge" /><p>Aucun chauffeur trouvé</p></div>}
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="ad-pagination">
          <button className="ad-pagination__btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><i className="bi bi-chevron-left" /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => <button key={p} className={`ad-pagination__btn ${p === page ? 'ad-pagination__btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>)}
          <button className="ad-pagination__btn" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><i className="bi bi-chevron-right" /></button>
          <span className="ad-pagination__info">Page {page} sur {totalPages}</span>
        </div>
      )}
      <AgencyDriverModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingDriver(null); }} driver={editingDriver} onSave={handleSave} />
    </div>
  );
}
