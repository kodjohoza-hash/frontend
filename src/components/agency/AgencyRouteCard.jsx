import AgencyRouteStatus from './AgencyRouteStatus';
import { useNavigate } from 'react-router-dom';

export default function AgencyRouteCard({ route, onEdit }) {
  const navigate = useNavigate();

  const formatPrice = (min, max) => {
    const fmt = (v) => (v === null || v === undefined ? '—' : Number(v).toLocaleString('fr-FR'));
    if (min === null && max === null) return '—';
    if (min === null) return `${fmt(max)} XAF`;
    if (max === null) return `${fmt(min)} XAF`;
    return `${fmt(min)} – ${fmt(max)} XAF`;
  };

  return (
    <div className="ab-card" onClick={() => navigate(`/agency/routes/${route.id}`)}>
      <div className="ab-card__header">
        <div className="ab-card__route-flag">
          <i className="bi bi-signpost-split" />
        </div>
        <div className="ab-card__title-group">
          <span className="ab-card__route-name">{route.name}</span>
          <span className="ab-card__internal">{route.code || route.id}</span>
        </div>
        <AgencyRouteStatus status={route.status} />
      </div>
      <div className="ab-card__route-journey">
        <div className="ab-card__journey-city">
          <span className="ab-card__journey-dot ab-card__journey-dot--start" />
          <span className="ab-card__journey-name">{route.departCity || '—'}</span>
        </div>
        <div className="ab-card__journey-line">
          <i className="bi bi-arrow-right" />
          <span className="ab-card__journey-dist">
            {route.distanceKm !== null && route.distanceKm !== undefined
              ? `${Number(route.distanceKm).toLocaleString('fr-FR')} km · ${route.durationLabel || '—'}`
              : route.durationLabel || ''}
          </span>
        </div>
        <div className="ab-card__journey-city">
          <span className="ab-card__journey-dot ab-card__journey-dot--end" />
          <span className="ab-card__journey-name">{route.arrivalCity || '—'}</span>
        </div>
      </div>
      <div className="ab-card__body">
        <div className="ab-card__info-row">
          <span className="ab-card__info-label">Prix</span>
          <span className="ab-card__info-value">{formatPrice(route.priceMin, route.priceMax)}</span>
        </div>
        <div className="ab-card__info-row">
          <span className="ab-card__info-label">Escales</span>
          <span className="ab-card__info-value">{route.stopCount} arrêt{route.stopCount > 1 ? 's' : ''}</span>
        </div>
        {route.companyName && (
          <div className="ab-card__info-row">
            <span className="ab-card__info-label">Compagnie</span>
            <span className="ab-card__info-value">{route.companyName}</span>
          </div>
        )}
      </div>
      <div className="ab-card__footer">
        <button className="ab-card__btn ab-card__btn--primary" onClick={(e) => { e.stopPropagation(); navigate(`/agency/routes/${route.id}`); }}>
          <i className="bi bi-eye" /> Voir
        </button>
        <button className="ab-card__btn ab-card__btn--outline" onClick={(e) => { e.stopPropagation(); onEdit?.(route); }}>
          <i className="bi bi-pencil" /> Modifier
        </button>
      </div>
    </div>
  );
}
