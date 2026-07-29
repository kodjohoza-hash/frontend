import clsx from 'clsx';
import { companies } from '@data/counterSaleData';

const CounterTripCard = ({ trip, selected, onSelect, disabled }) => {
  const company = companies.find((c) => trip.company.startsWith(c.name.split(' ')[0])) || companies[0];

  const seatsLabel = () => {
    if (trip.seats.available === 0) return { label: 'Complet', className: 'full' };
    if (trip.seats.available <= 5) return { label: `${trip.seats.available} places`, className: 'low' };
    return { label: `${trip.seats.available} places`, className: 'available' };
  };

  const st = seatsLabel();

  return (
    <div className={clsx('acs-trip-card', selected && 'acs-trip-card--selected', disabled && 'acs-trip-card--disabled')} onClick={() => !disabled && onSelect?.(trip)}>
      <div className="acs-trip-card__company">
        <div className="acs-trip-card__company-badge" style={{ background: company.color }}>
          {company.id}
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
        <span className="acs-trip-card__price-suffix"> FCFA</span>
      </div>

      <button type="button" className="acs-trip-card__select-btn" disabled={disabled || trip.seats.available === 0} onClick={(e) => { e.stopPropagation(); onSelect?.(trip); }}>
        {trip.seats.available === 0 ? 'Complet' : 'Sélectionner'}
      </button>
    </div>
  );
};

export default CounterTripCard;
