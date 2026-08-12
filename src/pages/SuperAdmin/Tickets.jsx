import { useState, useCallback, useEffect } from 'react';
import ticketService from '../../services/ticket.service';
import '../../assets/styles/admin-audit.css';

const PER_PAGE = 10;

const STATUS_META = {
  valide: { label: 'Valide', color: '#10B981' },
  utilise: { label: 'Utilisé', color: '#3B82F6' },
  annule: { label: 'Annulé', color: '#6B7280' },
  rembourse: { label: 'Remboursé', color: '#F59E0B' },
  expire: { label: 'Expiré', color: '#EF4444' },
};

const fmtDate = (v) => (v ? new Date(v).toLocaleString('fr-FR') : '—');
const fmtXAF = (v) => `${Number(v || 0).toLocaleString('fr-FR')} XAF`;

const Tickets = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [toast, setToast] = useState(null);

  const load = useCallback(async (q, p) => {
    setLoading(true);
    try {
      const data = await ticketService.search(q, p, PER_PAGE);
      setItems(data.items || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const s = await ticketService.stats();
      setStats(s);
    } catch {
      /* KPIs indisponibles */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, data] = await Promise.all([
          ticketService.stats(),
          ticketService.search('', 1, PER_PAGE),
        ]);
        if (cancelled) return;
        setStats(s);
        setItems(data.items || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.pages || 0);
      } catch {
        /* erreur silencieuse au chargement initial */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = () => {
    setPage(1);
    load(search, 1);
  };

  const handleRefresh = async () => {
    setToast({ type: 'info', message: 'Actualisation…' });
    try {
      await Promise.all([load(search, page), loadStats()]);
      setToast({ type: 'success', message: 'Billets actualisés' });
    } catch {
      setToast({ type: 'error', message: "Échec de l'actualisation" });
    }
  };

  const goPage = (p) => {
    setPage(p);
    load(search, p);
  };

  const kpis = [
    { id: 'total', label: 'Total billets', value: Number(stats.total || 0).toLocaleString('fr-FR'), icon: 'bi-ticket-perforated', color: '#3B82F6' },
    { id: 'today', label: "Émis aujourd'hui", value: Number(stats.today || 0).toLocaleString('fr-FR'), icon: 'bi-calendar-day', color: '#F59E0B' },
    { id: 'valides', label: 'Valides', value: Number(stats.valides || 0).toLocaleString('fr-FR'), icon: 'bi-check-circle', color: '#10B981' },
    { id: 'utilises', label: 'Utilisés', value: Number(stats.utilises || 0).toLocaleString('fr-FR'), icon: 'bi-bus-front', color: '#8B5CF6' },
    { id: 'verifies', label: 'Vérifiés', value: Number(stats.verifies || 0).toLocaleString('fr-FR'), icon: 'bi-qr-code-scan', color: '#06B6D4' },
    { id: 'rembourses', label: 'Remboursés', value: Number(stats.rembourses || 0).toLocaleString('fr-FR'), icon: 'bi-arrow-counterclockwise', color: '#F59E0B' },
    { id: 'expires', label: 'Expirés', value: Number(stats.expires || 0).toLocaleString('fr-FR'), icon: 'bi-hourglass-split', color: '#EF4444' },
  ];

  return (
    <div className="ada-dashboard">
      <div className="ada-hero">
        <div className="ada-hero-content">
          <h1><i className="bi bi-ticket-perforated" style={{ color: '#3B82F6' }} /> Billets</h1>
          <p>Billets émis sur l'ensemble de la plateforme (toutes compagnies)</p>
          <div className="ada-hero-badge">
            <i className="bi bi-globe-americas" /> Toutes compagnies · QR sécurisés
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
            placeholder="Référence billet, passager, téléphone, siège…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button className="ada-control-btn" onClick={handleSearch}>
          <i className="bi bi-search" /> Rechercher
        </button>
        <button className="ada-control-btn ada-control-btn-outline" onClick={handleRefresh}>
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
        ) : items.length === 0 ? (
          <div className="ada-empty">
            <i className="bi bi-inbox" />
            <p>Aucun billet trouvé pour ces critères.</p>
          </div>
        ) : (
          <table className="ada-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Passager</th>
                <th>Trajet</th>
                <th>Siège</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Date d'émission</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => {
                const meta = STATUS_META[t.statut] || { label: t.statut, color: '#94A3B8' };
                const trajetLabel = t.tripFrom && t.tripTo ? `${t.tripFrom} → ${t.tripTo}` : (t.depart?.trajetLabel || '—');
                return (
                  <tr key={t.id}>
                    <td style={{ color: '#60A5FA', fontWeight: 600 }}>{t.reference}</td>
                    <td>
                      <div style={{ color: '#fff' }}>{t.passengerName || t.nomPassager || t.clientName || '—'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{t.client?.phone || ''}</div>
                    </td>
                    <td>
                      <div>{trajetLabel}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                        {t.depart?.compagnie?.nom || ''}
                      </div>
                    </td>
                    <td>{t.siege || '—'}</td>
                    <td style={{ color: '#fff', fontWeight: 600 }}>{fmtXAF(t.prix)}</td>
                    <td>
                      <span className="ada-status-badge" style={{ background: `${meta.color}1A`, color: meta.color }}>
                        {meta.label}
                      </span>
                    </td>
                    <td>{fmtDate(t.creeLe)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="ada-pagination">
          <button className="ada-page-btn" disabled={page <= 1} onClick={() => goPage(page - 1)}>
            <i className="bi bi-chevron-left" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`ada-page-btn ${p === page ? 'active' : ''}`} onClick={() => goPage(p)}>{p}</button>
          ))}
          <button className="ada-page-btn" disabled={page >= totalPages} onClick={() => goPage(page + 1)}>
            <i className="bi bi-chevron-right" />
          </button>
          <span className="ada-page-info">Page {page} / {totalPages} — {total} billets</span>
        </div>
      )}
    </div>
  );
};

export default Tickets;
