import { useState, useMemo, useEffect } from 'react';
import AgencyRouteStats from '../../components/agency/AgencyRouteStats';
import AgencyRouteFilters from '../../components/agency/AgencyRouteFilters';
import AgencyRouteTable from '../../components/agency/AgencyRouteTable';
import AgencyRouteCard from '../../components/agency/AgencyRouteCard';
import AgencyRouteModal from '../../components/agency/AgencyRouteModal';
import AgencyRouteSkeleton from '../../components/agency/AgencyRouteSkeleton';
import AgencyRouteVilles from '../../components/agency/AgencyRouteVilles';
import useRouteStore from '../../store/route.store';

const emptyFilters = {
  search: '', status: '', villeDepart: '', villeArrivee: '',
  priceMin: '', priceMax: '', sort: 'newest',
};

export default function Routes() {
  const {
    routes, stats, villes, loading, error,
    refresh, fetchVilles, createRoute, updateRoute, updateStatus, removeRoute,
    createVille, updateVille, removeVille,
  } = useRouteStore();

  const [filters, setFilters] = useState(emptyFilters);
  const [activeStatFilter, setActiveStatFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [showVilles, setShowVilles] = useState(false);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const perPage = 10;

  useEffect(() => {
    refresh().catch(() => {});
    fetchVilles().catch(() => {});
  }, [refresh, fetchVilles]);

  const filteredRoutes = useMemo(() => {
    let result = [...routes];

    if (activeStatFilter !== 'all') {
      result = result.filter((r) => r.status === activeStatFilter);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((r) =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.code || '').toLowerCase().includes(q) ||
        (r.id || '').toLowerCase().includes(q) ||
        (r.departCity || '').toLowerCase().includes(q) ||
        (r.arrivalCity || '').toLowerCase().includes(q) ||
        (r.companyName || '').toLowerCase().includes(q)
      );
    }
    if (filters.status) result = result.filter((r) => r.status === filters.status);
    if (filters.villeDepart) result = result.filter((r) => r.departCityId === filters.villeDepart);
    if (filters.villeArrivee) result = result.filter((r) => r.arrivalCityId === filters.villeArrivee);
    if (filters.priceMin) result = result.filter((r) => (r.priceMin ?? r.priceMax ?? 0) >= Number(filters.priceMin));
    if (filters.priceMax) result = result.filter((r) => (r.priceMax ?? r.priceMin ?? Infinity) <= Number(filters.priceMax));

    if (filters.sort && filters.sort !== 'newest') {
      const [sortKey, sortAsc] = filters.sort.split('_');
      result.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];
        if (typeof valA === 'string') return sortAsc === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        return sortAsc === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
      });
      return result;
    }

    if (filters.sort === 'oldest') {
      result.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
      return result;
    }

    result.sort((a, b) => {
      let valA = a[sortField] || a.id;
      let valB = b[sortField] || b.id;
      if (typeof valA === 'string') return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [routes, filters, activeStatFilter, sortField, sortDir]);

  const paginatedRoutes = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRoutes.slice(start, start + perPage);
  }, [filteredRoutes, page]);

  const totalPages = Math.ceil(filteredRoutes.length / perPage);

  const handleReset = () => {
    setFilters(emptyFilters);
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
      if (editingRoute) {
        await updateRoute(editingRoute.id, formData);
      } else {
        await createRoute(formData);
      }
      setModalOpen(false);
      setEditingRoute(null);
    } catch (err) {
      window.alert(err.message || 'Impossible d\'enregistrer cet itinéraire.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (route) => {
    if (window.confirm(`Archiver l'itinéraire « ${route.name} » ?`)) {
      try {
        setBusy(true);
        await removeRoute(route);
      } catch (err) {
        window.alert(err.message || 'Impossible d\'archiver cet itinéraire.');
      } finally {
        setBusy(false);
      }
    }
  };

  const handleStatus = async (route, statut) => {
    try {
      setBusy(true);
      await updateStatus(route.id, statut);
    } catch (err) {
      window.alert(err.message || 'Impossible de changer le statut.');
    } finally {
      setBusy(false);
    }
  };

  if (loading && routes.length === 0) return <AgencyRouteSkeleton />;

  return (
    <div className="ab-page">
      <div className="ab-page__header">
        <div className="ab-page__title-group">
          <h1 className="ab-page__title">
            <i className="bi bi-signpost-split" />
            Itinéraires
          </h1>
          <p className="ab-page__subtitle">{filteredRoutes.length} itinéraire{filteredRoutes.length > 1 ? 's' : ''}</p>
        </div>
        <div className="ab-page__header-actions">
          <button className="ab-btn ab-btn--outline" onClick={() => { setShowVilles(!showVilles); setPage(1); }}>
            <i className="bi bi-geo-alt" />
            <span>{showVilles ? 'Itinéraires' : 'Villes'}</span>
          </button>
          {!showVilles && (
            <div className="ab-page__view-toggle">
              <button className={`ab-page__view-btn ${viewMode === 'table' ? 'ab-page__view-btn--active' : ''}`} onClick={() => setViewMode('table')}>
                <i className="bi bi-list-ul" />
              </button>
              <button className={`ab-page__view-btn ${viewMode === 'cards' ? 'ab-page__view-btn--active' : ''}`} onClick={() => setViewMode('cards')}>
                <i className="bi bi-grid-3x3-gap" />
              </button>
            </div>
          )}
          {!showVilles && (
            <button className="ab-btn ab-btn--primary ab-btn--lg" disabled={busy} onClick={() => { setEditingRoute(null); setModalOpen(true); }}>
              <i className="bi bi-plus-lg" />
              <span>Ajouter un itinéraire</span>
            </button>
          )}
        </div>
      </div>

      {error && <div className="ab-page__error"><i className="bi bi-exclamation-triangle" /> {error}</div>}

      {showVilles ? (
        <AgencyRouteVilles
          villes={villes}
          busy={busy}
          onAdd={async (form) => { setBusy(true); try { await createVille(form); } finally { setBusy(false); } }}
          onUpdate={async (id, form) => { setBusy(true); try { await updateVille(id, form); } finally { setBusy(false); } }}
          onRemove={async (id) => { setBusy(true); try { await removeVille(id); } finally { setBusy(false); } }}
        />
      ) : (
        <>
          <AgencyRouteStats stats={stats} activeFilter={activeStatFilter} onFilterChange={handleStatFilter} />

          <AgencyRouteFilters
            filters={filters}
            onFiltersChange={(f) => { setFilters(f); setPage(1); }}
            onReset={handleReset}
            villes={villes}
          />

          <div className="ab-page__content">
            {viewMode === 'table' ? (
              <AgencyRouteTable
                routes={paginatedRoutes}
                sortField={sortField}
                sortDir={sortDir}
                onSort={(key, dir) => { setSortField(key); setSortDir(dir); }}
                onDelete={handleDelete}
                onStatus={handleStatus}
                onEdit={(r) => { setEditingRoute(r); setModalOpen(true); }}
              />
            ) : (
              <div className="ab-page__cards">
                {paginatedRoutes.map((route) => (
                  <AgencyRouteCard key={route.id} route={route} onEdit={(r) => { setEditingRoute(r); setModalOpen(true); }} />
                ))}
                {paginatedRoutes.length === 0 && (
                  <div className="ab-page__empty-cards">
                    <i className="bi bi-signpost-split" />
                    <p>Aucun itinéraire trouvé</p>
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
              <span className="ab-pagination__info">Page {page} sur {totalPages} — {filteredRoutes.length} résultat{filteredRoutes.length > 1 ? 's' : ''}</span>
            </div>
          )}

          <AgencyRouteModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingRoute(null); }} route={editingRoute} villes={villes} onSave={handleSave} />
        </>
      )}
    </div>
  );
}
