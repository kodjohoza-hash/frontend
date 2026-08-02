import { useEffect, useState, useCallback } from 'react';
import '../../assets/styles/agency-subscription.css';
import useSubscriptionsStore from '../../store/subscriptions.store';

const STATUS_CFG = {
  active: { label: 'Actif', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  trial: { label: 'En attente', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  overdue: { label: 'En retard', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  expired: { label: 'Expiré', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  suspended: { label: 'Suspendu', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  cancelled: { label: 'Résilié', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

const fmt = (v) => Number(v || 0).toLocaleString('fr-FR');

export default function AgencySubscription() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const store = useSubscriptionsStore.getState();
      const res = await store.loadMySubscription();
      if (!cancelled) {
        if (res.ok) {
          setSub(res.data);
        } else {
          setNotice(res.error);
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleRenew = useCallback(async () => {
    if (!sub) return;
    setBusy(true);
    const res = await useSubscriptionsStore.getState().renewSubscription(sub.companyId, {
      plan_id: Number(sub.planId),
      renouvellement_auto: true,
    });
    setBusy(false);
    if (res.ok) {
      const mine = await useSubscriptionsStore.getState().loadMySubscription();
      if (mine.ok) setSub(mine.data);
      setNotice('Abonnement renouvelé avec succès.');
    } else {
      setNotice(res.error);
    }
  }, [sub]);

  const cfg = STATUS_CFG[sub?.status] || STATUS_CFG.active;
  const joursRestants = sub?.joursRestants ?? (sub?.endDate ? Math.ceil((new Date(sub.endDate) - new Date()) / 86400000) : 0);

  if (loading) {
    return (
      <div className="agsub-page">
        <div className="agsub-hero"><h1><i className="bi bi-box-seam" /> Mon abonnement</h1></div>
        <div className="agsub-loading"><i className="bi bi-arrow-repeat" /> Chargement de votre abonnement…</div>
      </div>
    );
  }

  return (
    <div className="agsub-page">
      <div className="agsub-hero">
        <div>
          <h1><i className="bi bi-box-seam" /> Mon abonnement</h1>
          <p>Gérez votre plan SaaS, vos échéances et le renouvellement automatique</p>
        </div>
        <span className="agsub-badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
      </div>

      {notice && (
        <div className={`agsub-notice ${String(notice).toLowerCase().includes('succès') || String(notice).toLowerCase().includes('renouvelé') ? 'agsub-notice--ok' : 'agsub-notice--err'}`}>
          <i className={`bi ${String(notice).toLowerCase().includes('succès') || String(notice).toLowerCase().includes('renouvelé') ? 'bi-check-circle-fill' : 'bi-info-circle-fill'}`} />
          {notice}
          <button className="agsub-notice__close" onClick={() => setNotice(null)}><i className="bi bi-x-lg" /></button>
        </div>
      )}

      {!sub ? (
        <div className="agsub-empty">
          <i className="bi bi-inbox" />
          <p>Aucun abonnement SaaS actif pour votre compagnie.</p>
          <p className="agsub-empty__sub">Contactez le support ou le super administrateur pour souscrire un plan.</p>
        </div>
      ) : (
        <>
          <div className="agsub-cards">
            <div className="agsub-card agsub-card--plan">
              <div className="agsub-card__icon"><i className="bi bi-box-seam" /></div>
              <div>
                <div className="agsub-card__label">Plan actuel</div>
                <div className="agsub-card__value">{sub.planName || '—'}</div>
              </div>
            </div>
            <div className="agsub-card">
              <div className="agsub-card__icon"><i className="bi bi-calendar-event" /></div>
              <div>
                <div className="agsub-card__label">Échéance</div>
                <div className="agsub-card__value">{sub.endDate ? new Date(sub.endDate).toLocaleDateString('fr-FR') : '—'}</div>
              </div>
            </div>
            <div className="agsub-card">
              <div className="agsub-card__icon"><i className="bi bi-hourglass-split" /></div>
              <div>
                <div className="agsub-card__label">Jours restants</div>
                <div className="agsub-card__value">{joursRestants}</div>
              </div>
            </div>
            <div className="agsub-card">
              <div className="agsub-card__icon"><i className="bi bi-cash-stack" /></div>
              <div>
                <div className="agsub-card__label">Montant / cycle</div>
                <div className="agsub-card__value">{fmt(sub.amount)} FCFA</div>
              </div>
            </div>
          </div>

          <div className="agsub-grid">
            <div className="agsub-panel">
              <h2><i className="bi bi-card-checklist" /> Détails de l'abonnement</h2>
              <div className="agsub-info">
                {[
                  ['Début de période', sub.startDate ? new Date(sub.startDate).toLocaleDateString('fr-FR') : '—'],
                  ['Fin de période', sub.endDate ? new Date(sub.endDate).toLocaleDateString('fr-FR') : '—'],
                  ['Prochain prélèvement', sub.nextBilling ? new Date(sub.nextBilling).toLocaleDateString('fr-FR') : '—'],
                  ['Renouvellement automatique', sub.autoRenew ? <span style={{ color: '#10B981', fontWeight: 700 }}>Activé</span> : <span style={{ color: '#64748B' }}>Désactivé</span>],
                  ['Compagnie', sub.companyName],
                ].map(([k, v]) => (
                  <div className="agsub-info__row" key={k}>
                    <span className="agsub-info__label">{k}</span>
                    <span className="agsub-info__value">{v}</span>
                  </div>
                ))}
              </div>
              <div className="agsub-actions">
                <button className="agsub-btn agsub-btn--primary" onClick={handleRenew} disabled={busy}>
                  <i className="bi bi-arrow-repeat" /> {busy ? 'Renouvellement…' : 'Renouveler maintenant'}
                </button>
              </div>
            </div>

            <div className="agsub-panel">
              <h2><i className="bi bi-shield-check" /> Ce que vous offre le plan</h2>
              <ul className="agsub-features">
                <li><i className="bi bi-check-circle-fill" /> Gestion des bus et voyages</li>
                <li><i className="bi bi-check-circle-fill" /> Réservations en ligne et guichet</li>
                <li><i className="bi bi-check-circle-fill" /> Notifications par email / SMS</li>
                <li><i className="bi bi-check-circle-fill" /> Rapports et statistiques</li>
                <li><i className="bi bi-check-circle-fill" /> Support dédié</li>
              </ul>
              <p className="agsub-features__note">Les fonctionnalités exactes dépendent du plan souscrit. En cas de doute, contactez votre administrateur.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
