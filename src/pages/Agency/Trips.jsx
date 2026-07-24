import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AgencyTripStats from '../../components/agency/AgencyTripStats';
import AgencyTripFilters from '../../components/agency/AgencyTripFilters';
import AgencyTripsTable from '../../components/agency/AgencyTripsTable';
import AgencyTripModal from '../../components/agency/AgencyTripModal';
import AgencyTripSkeleton from '../../components/agency/AgencyTripSkeleton';
import { mockTrips, tripStats } from '../../data/agencyTripsData';

export default function Trips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState(mockTrips);
  const [filters, setFilters] = useState({ search: '', from: '', to: '', status: '', type: '', dateFrom: '', dateTo: '' });
  const [activeStatFilter, setActiveStatFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filteredTrips = useMemo(() => {
    let result = [...trips];

    if (activeStatFilter !== 'all') {
      result = result.filter((t) => t.status === activeStatFilter);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) =>
        t.id.toLowerCase().includes(q) ||
        t.bus.name.toLowerCase().includes(q) ||
        t.bus.plate.toLowerCase().includes(q) ||
        t.driver.name.toLowerCase().includes(q)
      );
    }
    if (filters.from) result = result.filter((t) => t.from === filters.from);
    if (filters.to) result = result.filter((t) => t.to === filters.to);
    if (filters.status) result = result.filter((t) => t.status === filters.status);
    if (filters.type) result = result.filter((t) => t.type === filters.type);
    if (filters.dateFrom) result = result.filter((t) => t.date >= filters.dateFrom);
    if (filters.dateTo) result = result.filter((t) => t.date <= filters.dateTo);

    result.sort((a, b) => {
      let valA = a[sortField] || a.id;
      let valB = b[sortField] || b.id;
      if (sortField === 'date') { valA = a.date + a.departure; valB = b.date + b.departure; }
      if (typeof valA === 'string') return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [trips, filters, activeStatFilter, sortField, sortDir]);

  const paginatedTrips = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredTrips.slice(start, start + perPage);
  }, [filteredTrips, page]);

  const totalPages = Math.ceil(filteredTrips.length / perPage);

  const handleReset = () => {
    setFilters({ search: '', from: '', to: '', status: '', type: '', dateFrom: '', dateTo: '' });
    setActiveStatFilter('all');
    setPage(1);
  };

  const handleStatFilter = (key) => {
    setActiveStatFilter(key === activeStatFilter ? 'all' : key);
    setPage(1);
  };

  const handleSave = (formData) => {
    if (editingTrip) {
      setTrips((prev) => prev.map((t) => t.id === editingTrip.id ? { ...t, ...formData } : t));
    } else {
      const newTrip = {
        id: `VYG-2026-${String(trips.length + 1).padStart(3, '0')}`,
        company: 'Guillaume Express',
        bus: formData.bus,
        driver: formData.driver,
        from: formData.from,
        to: formData.to,
        date: formData.date,
        departure: formData.departure,
        arrival: formData.arrival || '--:--',
        price: formData.price,
        totalSeats: 45,
        soldSeats: 0,
        status: 'programmee',
        type: formData.type,
        luggage: formData.luggage,
        notes: formData.notes,
        fromPoint: formData.fromPoint,
        toPoint: formData.toPoint,
        createdAt: new Date().toISOString(),
      };
      setTrips((prev) => [newTrip, ...prev]);
    }
    setModalOpen(false);
    setEditingTrip(null);
  };

  const handleOpenCreate = () => {
    setEditingTrip(null);
    setModalOpen(true);
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setModalOpen(true);
  };

  const currentStats = useMemo(() => ({
    total: trips.length,
    today: trips.filter((t) => t.date === '2026-07-25').length,
    active: trips.filter((t) => t.status === 'en_cours').length,
    completed: trips.filter((t) => t.status === 'terminee').length,
    cancelled: trips.filter((t) => t.status === 'annulee').length,
    occupancy: Math.round(trips.reduce((acc, t) => acc + (t.soldSeats / t.totalSeats) * 100, 0) / trips.length),
  }), [trips]);

  if (loading) return <AgencyTripSkeleton />;

  return (
    <div className="at-page">
      <div className="at-page__header">
        <div className="at-page__title-group">
          <h1 className="at-page__title">
            <i className="bi bi-signpost-2" />
            Gestion des voyages
          </h1>
          <p className="at-page__subtitle">
            {filteredTrips.length} voyage{filteredTrips.length > 1 ? 's' : ''} trouvé{filteredTrips.length > 1 ? 's' : ''}
          </p>
        </div>
        <button className="at-btn at-btn--primary at-btn--lg" onClick={handleOpenCreate}>
          <i className="bi bi-plus-lg" />
          <span>Nouveau voyage</span>
        </button>
      </div>

      <AgencyTripStats stats={currentStats} activeFilter={activeStatFilter} onFilterChange={handleStatFilter} />

      <AgencyTripFilters
        filters={filters}
        onFiltersChange={(f) => { setFilters(f); setPage(1); }}
        onReset={handleReset}
      />

      <div className="at-page__content">
        <AgencyTripsTable
          trips={paginatedTrips}
          sortField={sortField}
          sortDir={sortDir}
          onSort={(dir) => { setSortDir(dir); }}
        />
      </div>

      {totalPages > 1 && (
        <div className="at-pagination">
          <button
            className="at-pagination__btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <i className="bi bi-chevron-left" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`at-pagination__btn ${p === page ? 'at-pagination__btn--active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="at-pagination__btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <i className="bi bi-chevron-right" />
          </button>
          <span className="at-pagination__info">
            Page {page} sur {totalPages} — {filteredTrips.length} résultat{filteredTrips.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      <AgencyTripModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTrip(null); }}
        trip={editingTrip}
        onSave={handleSave}
      />
    </div>
  );
}
