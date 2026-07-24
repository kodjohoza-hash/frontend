import { useState, useMemo } from 'react';
import AgencyBusStats from '../../components/agency/AgencyBusStats';
import AgencyBusFilters from '../../components/agency/AgencyBusFilters';
import AgencyBusTable from '../../components/agency/AgencyBusTable';
import AgencyBusCard from '../../components/agency/AgencyBusCard';
import AgencyBusModal from '../../components/agency/AgencyBusModal';
import AgencyBusSkeleton from '../../components/agency/AgencyBusSkeleton';
import { mockBuses, busStats } from '../../data/agencyBusData';

export default function Bus() {
  const [buses, setBuses] = useState(mockBuses);
  const [filters, setFilters] = useState({
    search: '', type: '', status: '', seatsMin: '', seatsMax: '',
    climatisation: '', wifi: '', serviceDateFrom: '', serviceDateTo: '',
  });
  const [activeStatFilter, setActiveStatFilter] = useState('all');
  const [sortField, setSortField] = useState('internalNumber');
  const [sortDir, setSortDir] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filteredBuses = useMemo(() => {
    let result = [...buses];

    if (activeStatFilter !== 'all') {
      result = result.filter((b) => b.status === activeStatFilter);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((b) =>
        b.plate.toLowerCase().includes(q) || b.internalNumber.toLowerCase().includes(q) ||
        b.model.toLowerCase().includes(q) || (b.brand || '').toLowerCase().includes(q)
      );
    }
    if (filters.type) result = result.filter((b) => b.type === filters.type);
    if (filters.status) result = result.filter((b) => b.status === filters.status);
    if (filters.seatsMin) result = result.filter((b) => b.seats >= Number(filters.seatsMin));
    if (filters.seatsMax) result = result.filter((b) => b.seats <= Number(filters.seatsMax));
    if (filters.climatisation === 'true') result = result.filter((b) => b.amenities?.climatisation);
    if (filters.climatisation === 'false') result = result.filter((b) => !b.amenities?.climatisation);
    if (filters.wifi === 'true') result = result.filter((b) => b.amenities?.wifi);
    if (filters.wifi === 'false') result = result.filter((b) => !b.amenities?.wifi);
    if (filters.serviceDateFrom) result = result.filter((b) => b.serviceDate >= filters.serviceDateFrom);
    if (filters.serviceDateTo) result = result.filter((b) => b.serviceDate <= filters.serviceDateTo);

    result.sort((a, b) => {
      let valA = a[sortField] || a.id;
      let valB = b[sortField] || b.id;
      if (typeof valA === 'string') return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [buses, filters, activeStatFilter, sortField, sortDir]);

  const paginatedBuses = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredBuses.slice(start, start + perPage);
  }, [filteredBuses, page]);

  const totalPages = Math.ceil(filteredBuses.length / perPage);

  const handleReset = () => {
    setFilters({ search: '', type: '', status: '', seatsMin: '', seatsMax: '', climatisation: '', wifi: '', serviceDateFrom: '', serviceDateTo: '' });
    setActiveStatFilter('all');
    setPage(1);
  };

  const handleStatFilter = (key) => {
    setActiveStatFilter(key === activeStatFilter ? 'all' : key);
    setPage(1);
  };

  const handleSave = (formData) => {
    if (editingBus) {
      setBuses((prev) => prev.map((b) => b.id === editingBus.id ? { ...b, ...formData, amenities: formData.amenities } : b));
    } else {
      const newBus = {
        id: `BUS-${String(buses.length + 1).padStart(3, '0')}`,
        ...formData,
        amenities: formData.amenities,
        currentDriver: null, lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        serviceDate: new Date().toISOString().split('T')[0], mileage: 0,
        tripCount: 0, totalKm: 0, avgOccupancy: 0,
        photoUrl: null,
        seatLayout: { rows: Math.ceil(formData.seats / 4), seatsPerSide: 2, aisleAfter: [Math.ceil(formData.seats / 8)], vipRows: [], pmrSeats: [] },
      };
      setBuses((prev) => [newBus, ...prev]);
    }
    setModalOpen(false);
    setEditingBus(null);
  };

  const handleDelete = (bus) => {
    if (window.confirm(`Supprimer le bus ${bus.plate} ? Cette action est irréversible.`)) {
      setBuses((prev) => prev.filter((b) => b.id !== bus.id));
    }
  };

  const handleDuplicate = (bus) => {
    const dup = {
      ...bus,
      id: `BUS-${String(buses.length + 1).padStart(3, '0')}`,
      internalNumber: `GE-${String(buses.length + 1).padStart(3, '0')}`,
      plate: bus.plate.replace(/.$/, 'D'),
      status: 'disponible',
      currentDriver: null,
      tripCount: 0, totalKm: 0,
    };
    setBuses((prev) => [dup, ...prev]);
  };

  const currentStats = useMemo(() => ({
    total: buses.length,
    disponible: buses.filter((b) => b.status === 'disponible').length,
    en_voyage: buses.filter((b) => b.status === 'en_voyage').length,
    maintenance: buses.filter((b) => b.status === 'maintenance').length,
    hors_service: buses.filter((b) => b.status === 'hors_service').length,
    reserve: buses.filter((b) => b.status === 'reserve').length,
    avgOccupancy: Math.round(buses.reduce((acc, b) => acc + b.avgOccupancy, 0) / buses.length),
  }), [buses]);

  return (
    <div className="ab-page">
      <div className="ab-page__header">
        <div className="ab-page__title-group">
          <h1 className="ab-page__title">
            <i className="bi bi-bus-front-fill" />
            Flotte de bus
          </h1>
          <p className="ab-page__subtitle">{filteredBuses.length} bus trouvé{filteredBuses.length > 1 ? 's' : ''}</p>
        </div>
        <div className="ab-page__header-actions">
          <div className="ab-page__view-toggle">
            <button className={`ab-page__view-btn ${viewMode === 'table' ? 'ab-page__view-btn--active' : ''}`} onClick={() => setViewMode('table')}>
              <i className="bi bi-list-ul" />
            </button>
            <button className={`ab-page__view-btn ${viewMode === 'cards' ? 'ab-page__view-btn--active' : ''}`} onClick={() => setViewMode('cards')}>
              <i className="bi bi-grid-3x3-gap" />
            </button>
          </div>
          <button className="ab-btn ab-btn--primary ab-btn--lg" onClick={() => { setEditingBus(null); setModalOpen(true); }}>
            <i className="bi bi-plus-lg" />
            <span>Ajouter un bus</span>
          </button>
        </div>
      </div>

      <AgencyBusStats stats={currentStats} activeFilter={activeStatFilter} onFilterChange={handleStatFilter} />

      <AgencyBusFilters filters={filters} onFiltersChange={(f) => { setFilters(f); setPage(1); }} onReset={handleReset} />

      <div className="ab-page__content">
        {viewMode === 'table' ? (
          <AgencyBusTable
            buses={paginatedBuses}
            sortField={sortField}
            sortDir={sortDir}
            onSort={(dir) => setSortDir(dir)}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        ) : (
          <div className="ab-page__cards">
            {paginatedBuses.map((bus) => (
              <AgencyBusCard key={bus.id} bus={bus} />
            ))}
            {paginatedBuses.length === 0 && (
              <div className="ab-page__empty-cards">
                <i className="bi bi-bus-front" />
                <p>Aucun bus trouvé</p>
              </div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="ab-pagination">
          <button className="ab-pagination__btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <i className="bi bi-chevron-left" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`ab-pagination__btn ${p === page ? 'ab-pagination__btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="ab-pagination__btn" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <i className="bi bi-chevron-right" />
          </button>
          <span className="ab-pagination__info">Page {page} sur {totalPages} — {filteredBuses.length} résultat{filteredBuses.length > 1 ? 's' : ''}</span>
        </div>
      )}

      <AgencyBusModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingBus(null); }} bus={editingBus} onSave={handleSave} />
    </div>
  );
}
