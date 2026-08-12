import clsx from 'clsx';

const CounterTripCard = ({ trip, selected, onSelect, disabled }) => {
  const company = trip.company || 'Bus Tix Connect';
  const companyColor = trip.companyColor || '#0B1D51';
  const badge = company.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'BT';

  const seatsLabel = () => {
    if (trip.seats.available === 0) return { label: 'Complet', className: 'full' };
    if (trip.seats.available <= 5) return { label: `${trip.seats.available} places`, className: 'low' };
    return { label: `${trip.seats.available} places`, className: 'available' };
  };

  const st = seatsLabel();

  return (
    <div className={clsx('acs-trip-card', selected && 'acs-trip-card--selected', disabled && 'acs-trip-card--disabled')} onClick={() => !disabled && onSelect?.(trip)}>
      <div className="acs-trip-card__company">
        <div className="acs-trip-card__company-badge" style={{ background: companyColor }}>
          {badge}
        </div>
        <div>
          <div className="acs-trip-card__company-name">{trip.company}</div>
          <div className="acs-trip-card__bus-name">{trip.bus} · {trip.busClass}</div>
        </div>
      </div>

      <div className="acs-trip-card__route">
        <span className="acs-trip-card__city">{trip.from}</span>
        <i className="bi bi-arrow-right acs-trip-card__arrow" />
        <span className="acs-trip-card__city">{trip.to}</span>
        <span className="acs-trip-card__time">{trip.departure} - {trip.arrival}</span>
      </div>

      <div className="acs-trip-card__meta">
        <span className="acs-trip-card__duration">
          <i className="bi bi-clock" /> {trip.duration}
        </span>
        <span className={clsx('acs-trip-card__seats', `acs-trip-card__seats--${st.className}`)}>
          <i className="bi bi-person" /> {st.label}
        </span>
      </div>

      <div className="acs-trip-card__price">
        {trip.basePrice.toLocaleString('fr-FR')}
        <span className="acs-trip-card__price-suffix"> XAF</span>
      </div>

      <button type="button" className="acs-trip-card__select-btn" disabled={disabled || trip.seats.available === 0} onClick={(e) => { e.stopPropagation(); onSelect?.(trip); }}>
        {trip.seats.available === 0 ? 'Complet' : 'Sélectionner'}
      </button>
    </div>
  );
};

export default CounterTripCard;
