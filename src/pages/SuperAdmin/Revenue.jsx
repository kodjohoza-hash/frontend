import { useEffect, useState, useCallback } from 'react';
import '../../assets/styles/admin-revenue.css';
import useSubscriptionsStore from '../../store/subscriptions.store';

const fmt = (v) => Number(v || 0).toLocaleString('fr-FR');
const fmtK = (v) => {
  const n = Number(v || 0);
  return n >= 1000000 ? `${(n / 1000000).toFixed(1)} M` : n >= 1000 ? `${(n / 1000).toFixed(0)} k` : String(n);
};

const monthLabel = (mois) => {
  const [y, m] = String(mois).split('-');
  const names = ['', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${names[Number(m)] || m} ${y}`;
};

export default function Revenue() {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const store = useSubscriptionsStore.getState();
      const r = await store.loadRevenue();
      if (!cancelled) {
        setRevenue(r);
        setUsingMock(store.usingMock);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const cards = [
    { label: 'MRR (revenus du mois)', value: fmt(revenue?.mrr ?? 0), icon: 'bi-graph-up-arrow', cls: 'adr-card--mrr' },
    { label: 'ARR (projection annuelle)', value: fmt(revenue?.arr ?? 0), icon: 'bi-calendar2-week', cls: 'adr-card--arr' },
    { label: "Aujourd'hui", value: fmt(revenue?.revenuAujourdhui ?? 0), icon: 'bi-sun', cls: 'adr-card--today' },
    { label: 'Cette semaine', value: fmt(revenue?.revenuSemaine ?? 0), icon: 'bi-calendar-week', cls: 'adr-card--week' },
    { label: 'Ce mois', value: fmt(revenue?.revenuMois ?? 0), icon: 'bi-calendar-month', cls: 'adr-card--month' },
    { label: "Cette année", value: fmt(revenue?.revenuAnnee ?? 0), icon: 'bi-calendar3', cls: 'adr-card--year' },
  ];

  const maxGraph = Math.max(...(revenue?.graph || []).map((g) => Number(g.total) || 0), 1);
  const topMax = Math.max(...(revenue?.topCompagnies || []).map((c) => Number(c.total) || 0), 1);

  return (
    <div className="adm-page adr-page">
      <div className="adr-hero">
        <div>
          <h1><i className="bi bi-coin" /> Revenus des abonnements</h1>
          <p>MRR, ARR et performances financières des plans SaaS par compagnie</p>
        </div>
        <div className="adr-hero__right">
          <span className="adr-badge">{usingMock ? 'Mode démo' : 'API connectée'}</span>
          <button className="adr-btn adr-btn--primary" onClick={() => { setLoading(true); useSubscriptionsStore.getState().loadRevenue().then(setRevenue).finally(() => setLoading(false)); }}>
            <i className="bi bi-arrow-clockwise" /> Actualiser
          </button>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="adr-cards">
        {cards.map((c) => (
          <div key={c.label} className={`adr-card ${c.cls}`}>
            <div className="adr-card__icon"><i className={`bi ${c.icon}`} /></div>
            <div className="adr-card__value">{c.value}</div>
            <div className="adr-card__label">FCFA — {c.label}</div>
          </div>
        ))}
      </div>

      {/* Compagnies */}
      <div className="adr-cards adr-cards--companie">
        {[
          { label: 'Compagnies actives', value: revenue?.compagniesActives ?? 0, icon: 'bi-check-circle-fill', color: '#10B981' },
          { label: 'Expirées', value: revenue?.compagniesExpirees ?? 0, icon: 'bi-hourglass-split', color: '#EF4444' },
          { label: 'Suspendues', value: revenue?.compagniesSuspendues ?? 0, icon: 'bi-lock-fill', color: '#F59E0B' },
          { label: 'Total compagnies', value: revenue?.compagniesTotales ?? 0, icon: 'bi-building', color: '#8B5CF6' },
          { label: 'Abonnements expirant ≤ 7j', value: revenue?.abonnementsExpirantBientot ?? 0, icon: 'bi-alarm', color: '#3B82F6' },
        ].map((c) => (
          <div key={c.label} className="adr-card adr-card--companie">
            <div className="adr-card__icon" style={{ color: c.color, background: `${c.color}1a` }}><i className={`bi ${c.icon}`} /></div>
            <div className="adr-card__value" style={{ color: c.color }}>{c.value}</div>
            <div className="adr-card__label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="adr-grid">
        {/* Graphe mensuel */}
        <div className="adr-panel adr-panel--wide">
          <div className="adr-panel__head">
            <h2><i className="bi bi-bar-chart-line" /> Revenus par mois (12 derniers mois)</h2>
            <span className="adr-total">Total : {fmt(revenue?.revenuTotal ?? 0)} FCFA</span>
          </div>
          {loading ? (
            <div className="adr-loading"><i className="bi bi-arrow-repeat" /> Chargement…</div>
          ) : (
            <div className="adr-chart">
              {(revenue?.graph || []).map((g) => (
                <div className="adr-chart__col" key={g.mois} title={`${monthLabel(g.mois)} : ${fmt(g.total)} FCFA`}>
                  <div className="adr-chart__bar" style={{ height: `${Math.max((Number(g.total) / maxGraph) * 100, 2)}%` }} />
                  <div className="adr-chart__value">{fmtK(g.total)}</div>
                  <div className="adr-chart__label">{monthLabel(g.mois).split(' ')[0]}</div>
                </div>
              ))}
              {(revenue?.graph || []).length === 0 && <div className="adr-empty">Aucun paiement enregistré.</div>}
            </div>
          )}
        </div>

        {/* Top compagnies */}
        <div className="adr-panel">
          <div className="adr-panel__head">
            <h2><i className="bi bi-trophy" /> Top compagnies</h2>
          </div>
          {(revenue?.topCompagnies || []).length === 0 ? (
            <div className="adr-empty">Aucune donnée.</div>
          ) : (
            <div className="adr-top">
              {revenue.topCompagnies.map((c, i) => (
                <div className="adr-top__row" key={c.compagnie_id}>
                  <span className="adr-top__rank">#{i + 1}</span>
                  <div className="adr-top__body">
                    <div className="adr-top__name">{c.compagnie_nom}</div>
                    <div className="adr-top__bar"><div className="adr-top__fill" style={{ width: `${(Number(c.total) / topMax) * 100}%` }} /></div>
                  </div>
                  <div className="adr-top__amount">
                    <div>{fmt(c.total)} FCFA</div>
                    <div className="adr-top__count">{c.nb_paiements} paiement{c.nb_paiements > 1 ? 's' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
