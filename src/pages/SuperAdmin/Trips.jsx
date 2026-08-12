import { useState, useEffect, useMemo } from 'react';
import useTripStore from '../../store/trip.store';
import '../../assets/styles/admin-audit.css';

const ITEMS_PER_PAGE = 10;

const STATUS_META = {
  programmee: { label: 'Programmée', color: '#3B82F6' },
  embarquement: { label: 'Embarquement', color: '#F59E0B' },
  en_cours: { label: 'En cours', color: '#10B981' },
  terminee: { label: 'Terminée', color: '#6B7280' },
  annulee: { label: 'Annulée', color: '#EF4444' },
};

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('fr-FR') : '—');
const fmtXAF = (v) => `${Number(v || 0).toLocaleString('fr-FR')} XAF`;

const Trips = () => {
  const { trips, stats, loading, refresh } = useTripStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const filtered = useMemo(() => {
    let result = [...trips];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) =>
        String(t.code || '').toLowerCase().includes(q) ||
        String(t.from || '').toLowerCase().includes(q) ||
        String(t.to || '').toLowerCase().includes(q) ||
        String(t.company || '').toLowerCase().includes(q) ||
        String(t.bus?.plate || t.bus?.name || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter);
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === 'departure') {
      result.sort((a, b) => {
        const d = new Date(a.date) - new Date(b.date);
        return d !== 0 ? d : String(a.departure || '').localeCompare(String(b.departure || ''));
      });
    }
    return result;
  }, [trips, search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleReset = () => {
    setSearch('');
    setStatusFilter('all');
    setSortBy('newest');
    setPage(1);
  };

  const handleRefresh = async () => {
    setToast({ type: 'info', message: 'Actualisation…' });
    try {
      await refresh();
      setToast({ type: 'success', message: 'Voyages actualisés' });
    } catch {
      setToast({ type: 'error', message: "Échec de l'actualisation" });
    }
  };

  const kpis = [
    { id: 'total', label: 'Total voyages', value: Number(stats.total || 0).toLocaleString('fr-FR'), icon: 'bi-bus-front', color: '#3B82F6' },
    { id: 'today', label: "Aujourd'hui", value: Number(stats.today || 0).toLocaleString('fr-FR'), icon: 'bi-calendar-day', color: '#F59E0B' },
    { id: 'planned', label: 'Programmés', value: Number(stats.planned || 0).toLocaleString('fr-FR'), icon: 'bi-clock-history', color: '#06B6D4' },
    { id: 'active', label: 'En cours', value: Number(stats.active || 0).toLocaleString('fr-FR'), icon: 'bi-play-circle', color: '#10B981' },
    { id: 'completed', label: 'Terminés', value: Number(stats.completed || 0).toLocaleString('fr-FR'), icon: 'bi-check-circle', color: '#8B5CF6' },
    { id: 'cancelled', label: 'Annulés', value: Number(stats.cancelled || 0).toLocaleString('fr-FR'), icon: 'bi-x-circle', color: '#EF4444' },
    { id: 'full', label: 'Complets', value: Number(stats.full || 0).toLocaleString('fr-FR'), icon: 'bi-grid-3x3-gap-fill', color: '#EC4899' },
    { id: 'occupancy', label: 'Taux de remplissage', value: `${Number(stats.occupancy || 0)}%`, icon: 'bi-graph-up-arrow', color: '#10B981' },
  ];

  return (
    <div className="ada-dashboard">
      <div className="ada-hero">
        <div className="ada-hero-content">
          <h1><i className="bi bi-bus-front" style={{ color: '#3B82F6' }} /> Voyages</h1>
          <p>Suivi des départs programmés par toutes les compagnies de la plateforme</p>
          <div className="ada-hero-badge">
            <i className="bi bi-globe-americas" /> Toutes compagnies
          </div>
        </div>
      </div>

      {toast && (
        <div className={`ada-toast ${toast.type}`} style={{ position: 'static', marginBottom: 12 }}>
          <i className={`bi ${toast.type === 'success' ? 'bi-check-circle' : toast.type === 'error' ? 'bi-exclamation-circle' : 'bi-info-circle'}`} />
          {toast.message}
        </div>
      )}

      <div className="ada-kpi-grid">
        {kpis.map((k) => (
          <div key={k.id} className="ada-kpi-card">
            <div className="ada-kpi-icon" style={{ background: `${k.color}1A`, color: k.color }}>
              <i className={`bi ${k.icon}`} />
            </div>
            <div className="ada-kpi-label">{k.label}</div>
            <div className="ada-kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="ada-controls">
        <div className="ada-control-group" style={{ flex: 1 }}>
          <label>Recherche</label>
          <input
            className="ada-control-input"
            placeholder="Ville de départ, ville d'arrivée, code…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="ada-control-group">
          <label>Statut</label>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">Tous</option>
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        </div>
        <div className="ada-control-group">
          <label>Trier</label>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="departure">Départ ascendant</option>
          </select>
        </div>
        <button className="ada-control-btn ada-control-btn-outline" onClick={handleReset}>
          <i className="bi bi-x-circle" /> Réinitialiser
        </button>
        <button className="ada-control-btn" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise" /> Actualiser
        </button>
      </div>

      <div className="ada-table-wrapper">
        {loading ? (
          <div className="ada-skeleton" style={{ margin: '1rem', padding: '2rem' }}>
            <div className="ada-skeleton-pulse" style={{ height: 18, marginBottom: 12 }} />
            <div className="ada-skeleton-pulse" style={{ height: 18, marginBottom: 12 }} />
            <div className="ada-skeleton-pulse" style={{ height: 18 }} />
          </div>
        ) : paginated.length === 0 ? (
          <div className="ada-empty">
            <i className="bi bi-inbox" />
            <p>Aucun voyage trouvé pour ces critères.</p>
          </div>
        ) : (
          <table className="ada-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Trajet</th>
                <th>Date / Heure</th>
                <th>Compagnie</th>
                <th>Bus</th>
                <th>Prix</th>
                <th>Sièges</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => {
                const meta = STATUS_META[t.status] || { label: t.status, color: '#94A3B8' };
                const soldPct = t.totalSeats ? Math.round((t.soldSeats / t.totalSeats) * 100) : 0;
                return (
                  <tr key={t.id}>
                    <td style={{ color: '#60A5FA', fontWeight: 600 }}>{t.code || '—'}</td>
                    <td>
                      <div style={{ color: '#fff' }}>{t.from} → {t.to}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{t.fromPoint || 'Quai central'}</div>
                    </td>
                    <td>
                      <div>{fmtDate(t.date)}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{t.departure || '—'}</div>
                    </td>
                    <td>
                      {t.company ? (
                        <div className="ada-user-cell">
                          <div className="ada-user-avatar" style={{ background: t.companyColor || undefined }}>{t.company.charAt(0)}</div>
                          <span>{t.company}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td>{t.bus?.plate || t.bus?.name || '—'}</td>
                    <td style={{ color: '#fff', fontWeight: 600 }}>{fmtXAF(t.price)}</td>
                    <td>
                      <div>{t.soldSeats} / {t.totalSeats}</div>
                      <div style={{ height: 3, width: 60, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 3 }}>
                        <div style={{ height: '100%', width: `${soldPct}%`, background: soldPct >= 90 ? '#EF4444' : '#10B981', borderRadius: 2 }} />
                      </div>
                    </td>
                    <td>
                      <span className="ada-status-badge" style={{ background: `${meta.color}1A`, color: meta.color }}>
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="ada-pagination">
          <button className="ada-page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <i className="bi bi-chevron-left" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`ada-page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="ada-page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <i className="bi bi-chevron-right" />
          </button>
          <span className="ada-page-info">Page {page} / {totalPages} — {filtered.length} voyages</span>
        </div>
      )}
    </div>
  );
};

export default Trips;
