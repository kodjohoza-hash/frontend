import clsx from 'clsx';

const statusConfig = {
  en_cours: { label: 'En cours', color: 'info', icon: 'bi-play-circle-fill' },
  programme: { label: 'Programmé', color: 'primary', icon: 'bi-clock-fill' },
  termine: { label: 'Terminé', color: 'success', icon: 'bi-check-circle-fill' },
  retard: { label: 'En retard', color: 'danger', icon: 'bi-exclamation-circle-fill' },
};

const AgencyTripCard = ({ trip }) => {
  const st = statusConfig[trip.status] || statusConfig.programme;
  const occupancy = Math.round((trip.seats.sold / trip.seats.total) * 100);

  return (
    <div className="ag-trip-card">
      <div className="ag-trip-card__header">
        <span className="ag-trip-card__id">{trip.id}</span>
        <span className={clsx(`ag-status ag-status--${st.color}`)}>
          <i className={`bi ${st.icon}`} />
          {st.label}
        </span>
      </div>

      <div className="ag-trip-card__route">
        <div className="ag-trip-card__city">
          <span className="ag-trip-card__city-name">{trip.from}</span>
          <span className="ag-trip-card__time">{trip.departure}</span>
        </div>
        <div className="ag-trip-card__arrow">
          <div className="ag-trip-card__arrow-line" />
          <i className="bi bi-bus-front-fill" />
          <div className="ag-trip-card__arrow-line" />
        </div>
        <div className="ag-trip-card__city ag-trip-card__city--end">
          <span className="ag-trip-card__city-name">{trip.to}</span>
          <span className="ag-trip-card__time">{trip.arrival}</span>
        </div>
      </div>

      <div className="ag-trip-card__meta">
        <div className="ag-trip-card__meta-item">
          <i className="bi bi-bus-front" />
          <span>{trip.bus}</span>
        </div>
        <div className="ag-trip-card__meta-item">
          <i className="bi bi-person-badge" />
          <span>{trip.driver}</span>
        </div>
      </div>

      <div className="ag-trip-card__seats">
        <div className="ag-trip-card__seats-info">
          <span>{trip.seats.sold}/{trip.seats.total} places</span>
          <span className="ag-trip-card__seats-pct">{occupancy}%</span>
        </div>
        <div className="ag-trip-card__progress">
          <div
            className={clsx('ag-trip-card__progress-bar', occupancy >= 90 && 'ag-trip-card__progress-bar--high')}
            style={{ width: `${occupancy}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AgencyTripCard;
