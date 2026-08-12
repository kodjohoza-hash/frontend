import { useState, useCallback, useEffect } from 'react';
import useAdminStore from '../../store/admin.store';
import '../../assets/styles/admin-audit.css';

const PER_PAGE = 10;

const STATUS_META = {
  initie: { label: 'Initie', color: '#94A3B8' },
  en_attente: { label: 'En attente', color: '#F59E0B' },
  paye: { label: 'Paye', color: '#10B981' },
  partiellement_rembourse: { label: 'Partiel', color: '#F59E0B' },
  rembourse: { label: 'Rembourse', color: '#EF4444' },
  echoue: { label: 'Echoue', color: '#EF4444' },
  annule: { label: 'Annule', color: '#6B7280' },
};

const METHODE_LABELS = {
  mobile_money: 'Mobile Money',
  carte_bancaire: 'Carte bancaire',
  especes: 'Especes',
  virement: 'Virement',
  abonnement: 'Abonnement',
};

const METHODE_ICONS = {
  mobile_money: 'bi-phone',
  carte_bancaire: 'bi-credit-card',
  especes: 'bi-cash-stack',
  virement: 'bi-bank',
  abonnement: 'bi-box-seam',
};

const fmtXAF = (v) => `${Number(v || 0).toLocaleString('fr-FR')} XAF`;
const fmtDate = (v) => (v ? new Date(v).toLocaleString('fr-FR') : '—');

const Payments = () => {
  const { payments, paymentsTotal, paymentsStats, paymentsLoading, fetchPayments, fetchPaymentsStats } = useAdminStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const load = useCallback(async (q) => {
    try {
      await fetchPayments(q);
    } catch {
      /* l'erreur est exposée par le store */
    }
  }, [fetchPayments]);

  useEffect(() => {
    fetchPaymentsStats().catch(() => {});
    load({ page: 1, limit: PER_PAGE });
  }, [fetchPaymentsStats, load]);

  const totalPages = Math.ceil((paymentsTotal || 0) / PER_PAGE);

  const handleSearch = () => {
    setPage(1);
    load({ page: 1, limit: PER_PAGE, recherche: search || undefined, statut: status || undefined });
  };

  const handleStatus = (value) => {
    setStatus(value);
    setPage(1);
    load({ page: 1, limit: PER_PAGE, recherche: search || undefined, statut: value || undefined });
  };

  const handleRefresh = async () => {
    setToast({ type: 'info', message: 'Actualisation…' });
    try {
      await Promise.all([
        fetchPayments({ page, limit: PER_PAGE, recherche: search || undefined, statut: status || undefined }),
        fetchPaymentsStats(),
      ]);
      setToast({ type: 'success', message: 'Paiements actualisés' });
    } catch {
      setToast({ type: 'error', message: "Échec de l'actualisation" });
    }
  };

  const goPage = (p) => {
    setPage(p);
    load({ page: p, limit: PER_PAGE, recherche: search || undefined, statut: status || undefined });
  };

  const s = paymentsStats || {};
  const kpis = [
    { id: 'total', label: 'Total paiements', value: Number(s.total || 0).toLocaleString('fr-FR'), icon: 'bi-receipt', color: '#3B82F6' },
    { id: 'encaisse', label: 'Encaissé', value: fmtXAF(s.encaisse), icon: 'bi-cash-stack', color: '#10B981' },
    { id: 'rembourse', label: 'Remboursé', value: fmtXAF(s.rembourse), icon: 'bi-arrow-counterclockwise', color: '#EF4444' },
    { id: 'net', label: 'Revenu net', value: fmtXAF(s.netRevenu), icon: 'bi-graph-up-arrow', color: '#8B5CF6' },
    { id: 'today', label: "Aujourd'hui", value: `${Number(s.today?.total || 0).toLocaleString('fr-FR')} · ${fmtXAF(s.today?.encaisse)}`, icon: 'bi-calendar-day', color: '#F59E0B' },
    { id: 'week', label: '7 derniers jours', value: Number(s.week || 0).toLocaleString('fr-FR'), icon: 'bi-calendar-week', color: '#06B6D4' },
  ];

  return (
    <div className="ada-dashboard">
      <div className="ada-hero">
        <div className="ada-hero-content">
          <h1><i className="bi bi-credit-card-2-front" style={{ color: '#3B82F6' }} /> Paiements opérationnels</h1>
          <p>Encaissements de billets et réservations de toutes les compagnies</p>
          <div className="ada-hero-badge">
            <i className="bi bi-globe-americas" /> Toutes compagnies · Devise XAF
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
            <div className="ada-kpi-value" style={{ fontSize: '0.95rem' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="ada-controls">
        <div className="ada-control-group" style={{ flex: 1 }}>
          <label>Recherche</label>
          <input
            className="ada-control-input"
            placeholder="Référence, client, réservation…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="ada-control-group">
          <label>Statut</label>
          <select value={status} onChange={(e) => handleStatus(e.target.value)}>
            <option value="">Tous</option>
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        </div>
        <button className="ada-control-btn" onClick={handleSearch}>
          <i className="bi bi-search" /> Filtrer
        </button>
        <button className="ada-control-btn ada-control-btn-outline" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise" /> Actualiser
        </button>
      </div>

      <div className="ada-table-wrapper">
        {paymentsLoading ? (
          <div className="ada-skeleton" style={{ margin: '1rem', padding: '2rem' }}>
            <div className="ada-skeleton-pulse" style={{ height: 18, marginBottom: 12 }} />
            <div className="ada-skeleton-pulse" style={{ height: 18, marginBottom: 12 }} />
            <div className="ada-skeleton-pulse" style={{ height: 18 }} />
          </div>
        ) : payments.length === 0 ? (
          <div className="ada-empty">
            <i className="bi bi-inbox" />
            <p>Aucun paiement trouvé pour ces critères.</p>
          </div>
        ) : (
          <table className="ada-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Client</th>
                <th>Réservation / Trajet</th>
                <th>Méthode</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const meta = STATUS_META[p.statut] || { label: p.statut, color: '#94A3B8' };
                const trajet = p.reservation?.depart?.trajet;
                const trajetLabel = trajet?.villeDepart && trajet?.villeArrivee
                  ? `${trajet.villeDepart} → ${trajet.villeArrivee}`
                  : (p.reservation?.depart?.trajetLabel || '—');
                return (
                  <tr key={p.id}>
                    <td style={{ color: '#60A5FA', fontWeight: 600 }}>{p.reference}</td>
                    <td>
                      <div style={{ color: '#fff' }}>{p.clientName || '—'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{p.clientPhone || p.clientEmail || ''}</div>
                    </td>
                    <td>
                      <div>{p.reservation?.reference || '—'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{trajetLabel}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className={`bi ${METHODE_ICONS[p.methode] || 'bi-credit-card'}`} />
                        {METHODE_LABELS[p.methode] || p.methode || '—'}
                      </div>
                    </td>
                    <td style={{ color: '#fff', fontWeight: 600 }}>{fmtXAF(p.montant)}</td>
                    <td>
                      <span className="ada-status-badge" style={{ background: `${meta.color}1A`, color: meta.color }}>
                        {meta.label}
                      </span>
                    </td>
                    <td>{fmtDate(p.creeLe)}</td>
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
          <span className="ada-page-info">Page {page} / {totalPages} — {paymentsTotal} paiements</span>
        </div>
      )}
    </div>
  );
};

export default Payments;
