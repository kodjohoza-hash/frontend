import AgencyTripStatus from './AgencyTripStatus';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function AgencyTripsTable({ trips, sortField, sortDir, onSort }) {
  const navigate = useNavigate();

  const columns = [
    { key: 'id', label: 'N° Voyage' },
    { key: 'date', label: 'Date' },
    { key: 'route', label: 'Trajet', sortable: false },
    { key: 'departure', label: 'Départ', sortable: true },
    { key: 'bus', label: 'Bus', sortable: false },
    { key: 'driver', label: 'Chauffeur', sortable: false },
    { key: 'seats', label: 'Places', sortable: false },
    { key: 'price', label: 'Tarif', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'actions', label: '', sortable: false },
  ];

  const handleSort = (key) => {
    if (sortField === key) {
      onSort(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSort('asc');
    }
  };

  const occupancyPercent = (trip) => Math.round((trip.soldSeats / trip.totalSeats) * 100);

  const occupancyClass = (trip) => {
    const pct = occupancyPercent(trip);
    if (pct >= 90) return 'at-seats__bar--danger';
    if (pct >= 70) return 'at-seats__bar--warning';
    return 'at-seats__bar--success';
  };

  return (
    <div className="at-table-wrap">
      <table className="at-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx({ 'at-table__sortable': col.sortable })}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="at-table__th-inner">
                  {col.label}
                  {col.sortable && (
                    <span className="at-table__sort-icon">
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
          {trips.map((trip) => (
            <tr key={trip.id} className="at-table__row" onClick={() => navigate(`/company/trips/${trip.id}`)}>
              <td>
                <span className="at-table__id">{trip.id}</span>
              </td>
              <td>
                <div className="at-table__date">
                  <i className="bi bi-calendar3" />
                  <span>{new Date(trip.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </td>
              <td>
                <div className="at-table__route">
                  <span className="at-table__city">{trip.from}</span>
                  <i className="bi bi-arrow-right" />
                  <span className="at-table__city">{trip.to}</span>
                </div>
              </td>
              <td>
                <div className="at-table__time">
                  <i className="bi bi-clock" />
                  <span>{trip.departure}</span>
                  <span className="at-table__arrival">→ {trip.arrival}</span>
                </div>
              </td>
              <td>
                <div className="at-table__bus">
                  <span className="at-table__bus-name">{trip.bus.name}</span>
                  <span className="at-table__bus-plate">{trip.bus.plate}</span>
                </div>
              </td>
              <td>
                <span className="at-table__driver">{trip.driver.name}</span>
              </td>
              <td>
                <div className="at-seats">
                  <span className="at-seats__count">
                    {trip.soldSeats}/{trip.totalSeats}
                  </span>
                  <div className="at-seats__bar-wrap">
                    <div
                      className={clsx('at-seats__bar', occupancyClass(trip))}
                      style={{ width: `${occupancyPercent(trip)}%` }}
                    />
                  </div>
                  <span className="at-seats__pct">{occupancyPercent(trip)}%</span>
                </div>
              </td>
              <td>
                <span className="at-table__price">
                  {trip.price.toLocaleString('fr-FR')} <small>FCFA</small>
                </span>
              </td>
              <td>
                <AgencyTripStatus status={trip.status} />
              </td>
              <td>
                <div className="at-table__actions">
                  <button
                    className="at-table__action"
                    onClick={(e) => { e.stopPropagation(); navigate(`/company/trips/${trip.id}`); }}
                    title="Voir les détails"
                  >
                    <i className="bi bi-eye" />
                  </button>
                  <button
                    className="at-table__action at-table__action--edit"
                    onClick={(e) => { e.stopPropagation(); }}
                    title="Modifier"
                  >
                    <i className="bi bi-pencil" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {trips.length === 0 && (
        <div className="at-table__empty">
          <i className="bi bi-signpost-2" />
          <p>Aucun voyage trouvé</p>
          <span>Modifiez vos filtres pour voir plus de résultats</span>
        </div>
      )}
    </div>
  );
}
