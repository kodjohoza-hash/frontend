import { useState, useMemo, useEffect } from 'react';
import AgencyTripStats from '../../components/agency/AgencyTripStats';
import AgencyTripFilters from '../../components/agency/AgencyTripFilters';
import AgencyTripsTable from '../../components/agency/AgencyTripsTable';
import AgencyTripModal from '../../components/agency/AgencyTripModal';
import AgencyTripSkeleton from '../../components/agency/AgencyTripSkeleton';
import useTripStore from '../../store/trip.store';
import useRouteStore from '../../store/route.store';

export default function Trips() {
  const { trips, stats, loading, error, clearError, fetchTrips, fetchStats, createTrip, updateTrip } = useTripStore();
  const routes = useRouteStore((s) => s.routes);
  const [filters, setFilters] = useState({ search: '', from: '', to: '', status: '', type: '', dateFrom: '', dateTo: '' });
  const [activeStatFilter, setActiveStatFilter] = useState('all');
  const sortField = 'date';
  const [sortDir, setSortDir] = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchTrips();
    fetchStats();
    const routeStore = useRouteStore.getState();
    if (!routeStore.routes.length) routeStore.fetchRoutes().catch(() => {});
  }, [fetchTrips, fetchStats]);

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

  const handleSave = async (formData) => {
    setSaving(true);
    clearError();
    try {
      const options = { routes };
      if (editingTrip) {
        await updateTrip(
          editingTrip.id,
          { ...formData, routeId: editingTrip.routeId },
          { ...options, existing: editingTrip }
        );
      } else {
        await createTrip(formData, options);
      }
      setModalOpen(false);
      setEditingTrip(null);
    } catch {
      // L'erreur est propagée par le store (message backend).
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTrip(null);
    setModalOpen(true);
  };

  if (loading && !trips.length) return <AgencyTripSkeleton />;

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
        <button className="at-btn at-btn--primary at-btn--lg" onClick={handleOpenCreate} disabled={saving}>
          <i className="bi bi-plus-lg" />
          <span>Nouveau voyage</span>
        </button>
      </div>

      {error && (
        <div className="at-alert at-alert--danger">
          <i className="bi bi-exclamation-triangle" />
          <span>{error}</span>
          <button className="at-alert__close" onClick={clearError}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      <AgencyTripStats stats={stats} activeFilter={activeStatFilter} onFilterChange={handleStatFilter} />

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
