import { useEffect, useState } from 'react';
import clsx from 'clsx';
import bookingService from '@services/booking.service';

const ACTION_META = {
  'Paiement': { icon: 'bi-credit-card-fill', color: 'primary' },
  'annul': { icon: 'bi-x-circle-fill', color: 'danger' },
  'confirm': { icon: 'bi-check-circle-fill', color: 'success' },
  'créée': { icon: 'bi-ticket-detailed-fill', color: 'accent' },
  'billet': { icon: 'bi-ticket-perforated-fill', color: 'info' },
};

const metaFor = (action) => {
  const key = Object.keys(ACTION_META).find((k) => String(action || '').toLowerCase().includes(k));
  return ACTION_META[key] || { icon: 'bi-clock-history', color: 'info' };
};

const DbActivityTimeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    bookingService
      .listBookings({ limit: 5, sort: 'newest' })
      .then((data) => {
        if (!mounted) return;
        const items = [];
        (data.items || []).forEach((r) => {
          (r.historique || [])
            .filter((h) => h.action)
            .forEach((h) => {
              const meta = metaFor(h.action);
              items.push({
                id: `${r.id}-${items.length}`,
                action: h.action,
                detail: r.reference || r.id,
                icon: meta.icon,
                color: meta.color,
                date: h.timestamp || r.dateCreation,
              });
            });
        });
        setTimeline(items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
      })
      .catch(() => { if (mounted) setTimeline([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="db-card db-timeline">
      <div className="db-card__header">
        <h3 className="db-card__title">
          <i className="bi bi-clock-history" />
          Activité récente
        </h3>
      </div>
      <div className="db-timeline__list">
        {loading ? (
          <div className="db-timeline__item"><span className="db-timeline__empty">Chargement…</span></div>
        ) : timeline.length === 0 ? (
          <div className="db-timeline__item"><span className="db-timeline__empty">Aucune activité récente.</span></div>
        ) : (
          timeline.map((item, idx) => (
            <div key={item.id} className="db-timeline__item">
              <div className={clsx('db-timeline__node', `db-timeline__node--${item.color}`)}>
                <i className={clsx('bi', item.icon)} />
              </div>
              {idx < timeline.length - 1 && <div className="db-timeline__line" />}
              <div className="db-timeline__content">
                <span className="db-timeline__action">{item.action}</span>
                <span className="db-timeline__detail">{item.detail}</span>
                <span className="db-timeline__time">{formatTime(item.date)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default DbActivityTimeline;
