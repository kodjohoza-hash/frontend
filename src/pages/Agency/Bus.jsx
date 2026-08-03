import { useState, useMemo, useEffect } from 'react';
import AgencyBusStats from '../../components/agency/AgencyBusStats';
import AgencyBusFilters from '../../components/agency/AgencyBusFilters';
import AgencyBusTable from '../../components/agency/AgencyBusTable';
import AgencyBusCard from '../../components/agency/AgencyBusCard';
import AgencyBusModal from '../../components/agency/AgencyBusModal';
import AgencyBusSkeleton from '../../components/agency/AgencyBusSkeleton';
import useBusStore from '../../store/bus.store';

export default function Bus() {
  const { buses, stats, loading, fetchBuses, createBus, updateBus, deleteBus } = useBusStore();
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
  const [busy, setBusy] = useState(false);
  const perPage = 10;

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

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

  const handleSave = async (formData) => {
    try {
      setBusy(true);
      if (editingBus) {
        await updateBus(editingBus.id, formData);
      } else {
        await createBus(formData);
      }
      setModalOpen(false);
      setEditingBus(null);
    } catch (err) {
      window.alert(err.message || 'Impossible d\'enregistrer ce bus.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (bus) => {
    if (window.confirm(`Supprimer le bus ${bus.plate} ? Cette action est irréversible.`)) {
      try {
        setBusy(true);
        await deleteBus(bus);
      } catch (err) {
        window.alert(err.message || 'Impossible de supprimer ce bus.');
      } finally {
        setBusy(false);
      }
    }
  };

  const handleDuplicate = async (bus) => {
    const duplicate = {
      plate: bus.plate.replace(/.$/, 'D'),
      internalNumber: `${bus.internalNumber}-COPY`,
      brand: bus.brand, model: bus.model, year: bus.year,
      seats: bus.seats, type: bus.type, class: bus.class,
      status: 'disponible', color: bus.color, amenities: bus.amenities || {},
      notes: bus.notes || '', fuelType: bus.fuelType, currentDriver: '',
    };
    try {
      setBusy(true);
      await createBus(duplicate);
    } catch (err) {
      window.alert(err.message || 'Impossible de dupliquer ce bus.');
    } finally {
      setBusy(false);
    }
  };

  if (loading && buses.length === 0) return <AgencyBusSkeleton />;

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
          <button className="ab-btn ab-btn--primary ab-btn--lg" disabled={busy} onClick={() => { setEditingBus(null); setModalOpen(true); }}>
            <i className="bi bi-plus-lg" />
            <span>Ajouter un bus</span>
          </button>
        </div>
      </div>

      <AgencyBusStats stats={stats} activeFilter={activeStatFilter} onFilterChange={handleStatFilter} />

      <AgencyBusFilters filters={filters} onFiltersChange={(f) => { setFilters(f); setPage(1); }} onReset={handleReset} />

      <div className="ab-page__content">
        {viewMode === 'table' ? (
          <AgencyBusTable
            buses={paginatedBuses}
            sortField={sortField}
            sortDir={sortDir}
            onSort={(key, dir) => { setSortField(key); setSortDir(dir); }}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onEdit={(b) => { setEditingBus(b); setModalOpen(true); }}
          />
        ) : (
          <div className="ab-page__cards">
            {paginatedBuses.map((bus) => (
              <AgencyBusCard key={bus.id} bus={bus} onEdit={(b) => { setEditingBus(b); setModalOpen(true); }} />
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
