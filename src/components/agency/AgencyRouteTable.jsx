import { useState } from 'react';
import AgencyRouteStatus from './AgencyRouteStatus';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function AgencyRouteTable({ routes, sortField, sortDir, onSort, onDelete, onEdit, onStatus }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const columns = [
    { key: 'name', label: 'Itinéraire', sortable: true },
    { key: 'departCity', label: 'Départ', sortable: false },
    { key: 'arrivalCity', label: 'Arrivée', sortable: false },
    { key: 'distanceKm', label: 'Distance', sortable: true },
    { key: 'durationLabel', label: 'Durée', sortable: true },
    { key: 'priceMin', label: 'Prix', sortable: true },
    { key: 'stopCount', label: 'Escales', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'actions', label: '', sortable: false },
  ];

  const handleSort = (key) => {
    if (sortField === key) {
      onSort(key, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenu(openMenu === id ? null : id);
  };

  const formatPrice = (min, max) => {
    const fmt = (v) => (v === null || v === undefined ? '—' : Number(v).toLocaleString('fr-FR'));
    if (min === null && max === null) return '—';
    if (min === null) return `${fmt(max)} XAF`;
    if (max === null) return `${fmt(min)} XAF`;
    return `${fmt(min)} – ${fmt(max)} XAF`;
  };

  return (
    <div className="ab-table-wrap">
      <table className="ab-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx({ 'ab-table__sortable': col.sortable })}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="ab-table__th-inner">
                  {col.label}
                  {col.sortable && (
                    <span className="ab-table__sort-icon">
                      <i className={clsx(
                        'bi',
                        sortField === col.key
                          ? sortDir === 'asc' ? 'bi-sort-up' : 'bi-sort-down'
                          : 'bi-arrow-down-up'
                      )} />
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id} className="ab-table__row" onClick={() => navigate(`/agency/routes/${route.id}`)}>
              <td>
                <div className="ab-table__route">
                  <div className="ab-table__route-icon">
                    <i className="bi bi-signpost-split" />
                  </div>
                  <div className="ab-table__route-text">
                    <span className="ab-table__route-name">{route.name}</span>
                    <span className="ab-table__route-code">{route.code || route.id}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="ab-table__city">{route.departCity || '—'}</span>
              </td>
              <td>
                <span className="ab-table__city">{route.arrivalCity || '—'}</span>
              </td>
              <td>
                <span className="ab-table__distance">
                  {route.distanceKm !== null && route.distanceKm !== undefined
                    ? `${Number(route.distanceKm).toLocaleString('fr-FR')} km`
                    : '—'}
                </span>
              </td>
              <td>
                <span className="ab-table__duration">{route.durationLabel || '—'}</span>
              </td>
              <td>
                <span className="ab-table__price">{formatPrice(route.priceMin, route.priceMax)}</span>
              </td>
              <td>
                <span className="ab-table__stops">
                  <i className="bi bi-pin-map" /> {route.stopCount}
                </span>
              </td>
              <td>
                <AgencyRouteStatus status={route.status} />
              </td>
              <td>
                <div className="ab-table__actions-cell">
                  <button className="ab-table__action" onClick={(e) => { e.stopPropagation(); navigate(`/agency/routes/${route.id}`); }} title="Voir">
                    <i className="bi bi-eye" />
                  </button>
                  <button className="ab-table__action ab-table__action--edit" onClick={(e) => { e.stopPropagation(); onEdit?.(route); }} title="Modifier">
                    <i className="bi bi-pencil" />
                  </button>
                  <div className="ab-table__menu-wrap">
                    <button className="ab-table__action" onClick={(e) => toggleMenu(e, route.id)} title="Plus d'actions">
                      <i className="bi bi-three-dots-vertical" />
                    </button>
                    {openMenu === route.id && (
                      <div className="ab-table__menu">
                        {route.status === 'active' ? (
                          <button className="ab-table__menu-item" onClick={(e) => { e.stopPropagation(); setOpenMenu(null); onStatus?.(route, 'inactive'); }}>
                            <i className="bi bi-pause-circle" /> Désactiver
                          </button>
                        ) : (
                          <button className="ab-table__menu-item" onClick={(e) => { e.stopPropagation(); setOpenMenu(null); onStatus?.(route, 'active'); }}>
                            <i className="bi bi-play-circle" /> Activer
                          </button>
                        )}
                        <div className="ab-table__menu-divider" />
                        <button className="ab-table__menu-item ab-table__menu-item--danger" onClick={(e) => { e.stopPropagation(); setOpenMenu(null); onDelete?.(route); }}>
                          <i className="bi bi-trash" /> Archiver
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {routes.length === 0 && (
        <div className="ab-table__empty">
          <i className="bi bi-signpost-split" />
          <p>Aucun itinéraire trouvé</p>
          <span>Modifiez vos filtres ou créez un nouvel itinéraire</span>
        </div>
      )}
    </div>
  );
}
