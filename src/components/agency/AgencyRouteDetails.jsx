import { useState } from 'react';
import AgencyRouteStatus from './AgencyRouteStatus';
import { formatMinutes } from '../../services/route.service';

export default function AgencyRouteDetails({ route, calculs, onCalculs }) {
  const [heureDepart, setHeureDepart] = useState('');

  const handleHeureDepart = (value) => {
    setHeureDepart(value);
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
      onCalculs?.(value);
    }
  };

  if (!route) return null;

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  const formatPrice = (min, max) => {
    const fmt = (v) => (v === null || v === undefined ? '—' : Number(v).toLocaleString('fr-FR'));
    if (min === null && max === null) return '—';
    if (min === null) return `${fmt(max)} XAF`;
    if (max === null) return `${fmt(min)} XAF`;
    return `${fmt(min)} – ${fmt(max)} XAF`;
  };

  return (
    <div className="abd">
      <div className="abd__header">
        <div className="abd__header-left">
          <div className="abd__photo abd__photo--route">
            <i className="bi bi-signpost-split" />
          </div>
          <div>
            <div className="abd__title-row">
              <h2 className="abd__id">{route.name}</h2>
              <span className="abd__internal">{route.code || route.id}</span>
              <AgencyRouteStatus status={route.status} size="md" />
            </div>
            <p className="abd__subtitle">
              {route.departCity} → {route.arrivalCity} · {route.durationLabel || '—'}
              {route.companyName ? ` · ${route.companyName}` : ''}
            </p>
          </div>
        </div>
        <div className="abd__header-stats">
          <div className="abd__header-stat">
            <span className="abd__header-stat-value">
              {route.distanceKm !== null && route.distanceKm !== undefined ? `${Number(route.distanceKm).toLocaleString('fr-FR')} km` : '—'}
            </span>
            <span className="abd__header-stat-label">Distance</span>
          </div>
          <div className="abd__header-stat">
            <span className="abd__header-stat-value">{route.stopCount}</span>
            <span className="abd__header-stat-label">Escales</span>
          </div>
          <div className="abd__header-stat">
            <span className="abd__header-stat-value">{route.departCount}</span>
            <span className="abd__header-stat-label">Voyages</span>
          </div>
        </div>
      </div>

      <div className="abd__grid">
        <div className="abd__card">
          <h4 className="abd__card-title"><i className="bi bi-info-circle" /> Informations générales</h4>
          <div className="abd__fields">
            <div className="abd__field"><span className="abd__label">Itinéraire</span><span className="abd__value">{route.name}</span></div>
            <div className="abd__field"><span className="abd__label">Code</span><span className="abd__value">{route.code || '—'}</span></div>
            <div className="abd__field"><span className="abd__label">Départ</span><span className="abd__value">{route.departCity || '—'}</span></div>
            <div className="abd__field"><span className="abd__label">Arrivée</span><span className="abd__value">{route.arrivalCity || '—'}</span></div>
            <div className="abd__field"><span className="abd__label">Distance</span><span className="abd__value">{route.distanceKm !== null && route.distanceKm !== undefined ? `${Number(route.distanceKm).toLocaleString('fr-FR')} km` : '—'}</span></div>
            <div className="abd__field"><span className="abd__label">Durée</span><span className="abd__value">{route.durationLabel || '—'}</span></div>
            <div className="abd__field"><span className="abd__label">Prix</span><span className="abd__value">{formatPrice(route.priceMin, route.priceMax)}</span></div>
            <div className="abd__field"><span className="abd__label">Compagnie</span><span className="abd__value">{route.companyName || '—'}</span></div>
            <div className="abd__field"><span className="abd__label">Créé le</span><span className="abd__value">{formatDate(route.createdAt)}</span></div>
          </div>
          {route.description && <div className="abd__notes"><i className="bi bi-info-circle" /> {route.description}</div>}
        </div>

        <div className="abd__card">
          <h4 className="abd__card-title"><i className="bi bi-calculator" /> Calculs</h4>
          <div className="abd__fields">
            <div className="abd__field"><span className="abd__label">Durée de base</span><span className="abd__value">{calculs ? formatMinutes(calculs.durationBaseMinutes) : route.durationLabel || '—'}</span></div>
            <div className="abd__field"><span className="abd__label">Arrêts</span><span className="abd__value">{calculs ? formatMinutes(calculs.stopsMinutes) : '—'}</span></div>
            <div className="abd__field"><span className="abd__label">Durée totale</span><span className="abd__value">{calculs ? formatMinutes(calculs.totalMinutes) : '—'}</span></div>
            <div className="abd__field"><span className="abd__label">Durée estimée</span><span className="abd__value">{calculs?.estimatedDuration || '—'}</span></div>
          </div>
          <div className="abd__calculs-depart">
            <label className="abd__label">Heure de départ (estimation arrivée)</label>
            <input
              type="time"
              className="ab-input"
              value={heureDepart}
              onChange={(e) => handleHeureDepart(e.target.value)}
            />
            {calculs?.estimatedArrival && (
              <div className="abd__calculs-result">
                <i className="bi bi-clock" />
                Arrivée estimée : <strong>{calculs.estimatedArrival}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="abd__card">
          <h4 className="abd__card-title"><i className="bi bi-map" /> Trajet</h4>
          <div className="abd__journey">
            <div className="abd__journey-item">
              <span className="abd__journey-dot abd__journey-dot--start" />
              <span className="abd__journey-name">{route.departCity || '—'}</span>
              <span className="abd__journey-badge">Départ</span>
            </div>
            {(route.stops || []).map((stop) => (
              <div className="abd__journey-item" key={stop.id}>
                <span className="abd__journey-dot" />
                <span className="abd__journey-name">{stop.cityName || '—'}</span>
                <span className="abd__journey-meta">
                  {stop.dureeArret ? `${stop.dureeArret} min` : 'halte'}
                  {stop.heureEstimee ? ` · ${stop.heureEstimee}` : ''}
                </span>
              </div>
            ))}
            <div className="abd__journey-item">
              <span className="abd__journey-dot abd__journey-dot--end" />
              <span className="abd__journey-name">{route.arrivalCity || '—'}</span>
              <span className="abd__journey-badge">Arrivée</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
