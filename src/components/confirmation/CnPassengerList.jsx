import { memo } from 'react';

const CnPassengerList = memo(({ passengers }) => (
  <div className="cn-card">
    <h3 className="cn-card__title">
      <i className="bi bi-people-fill" />
      Passagers ({passengers.length})
    </h3>
    <div className="cn-pax-list">
      {passengers.map((pax, i) => (
        <div key={pax.id} className={`cn-pax ${i < passengers.length - 1 ? 'cn-pax--bordered' : ''}`}>
          <div className="cn-pax__avatar">
            {pax.firstName.charAt(0)}{pax.lastName.charAt(0)}
          </div>
          <div className="cn-pax__info">
            <span className="cn-pax__name">{pax.firstName} {pax.lastName}</span>
            <span className="cn-pax__meta">
              <i className="bi bi-grid-3x3-gap-fill" /> Siège {pax.seat.number} · {pax.seat.type}
            </span>
          </div>
          <span className="cn-pax__price">{pax.seat.price.toLocaleString()} FCFA</span>
        </div>
      ))}
    </div>
  </div>
));
CnPassengerList.displayName = 'CnPassengerList';
export default CnPassengerList;
