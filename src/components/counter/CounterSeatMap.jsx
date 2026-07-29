import { useState } from 'react';
import clsx from 'clsx';

const CounterSeatMap = ({ trip, seatMap, selectedSeats, onSelect, onBack }) => {
  const [localSelected, setLocalSelected] = useState(selectedSeats);

  const toggleSeat = (seat) => {
    if (seat.isReserved) return;
    setLocalSelected((prev) =>
      prev.includes(seat.id) ? prev.filter((s) => s !== seat.id) : [...prev, seat.id]
    );
  };

  return (
    <div>
      <div className="acs-step__header">
        <h2 className="acs-step__title">Choix des sièges</h2>
        <p className="acs-step__desc">
          {trip?.from} → {trip?.to} · {trip?.bus} · {trip?.departure}
        </p>
      </div>

      <div className="acs-seatmap">
        <div className="acs-seatmap__header">
          <div className="acs-seatmap__info">
            <i className="bi bi-bus-front-fill" /> Plan du bus
          </div>
          <div className="acs-seatmap__legend">
            <div className="acs-seatmap__legend-item">
              <div className="acs-seatmap__legend-dot acs-seatmap__legend-dot--available" />
              Libre
            </div>
            <div className="acs-seatmap__legend-item">
              <div className="acs-seatmap__legend-dot acs-seatmap__legend-dot--reserved" />
              Occupé
            </div>
            <div className="acs-seatmap__legend-item">
              <div className="acs-seatmap__legend-dot acs-seatmap__legend-dot--selected" />
              Sélectionné
            </div>
          </div>
        </div>

        <div className="acs-seatmap__grid">
          {seatMap.map((row, ri) => (
            <div key={ri} className="acs-seatmap__row">
              {row.filter((s) => s.side === 'left').map((seat) => (
                <button
                  key={seat.id}
                  type="button"
                  className={clsx('acs-seatmap__seat', seat.isReserved && 'acs-seatmap__seat--reserved', localSelected.includes(seat.id) && 'acs-seatmap__seat--selected')}
                  disabled={seat.isReserved}
                  onClick={() => toggleSeat(seat)}
                  title={`Siège ${seat.number}`}
                >
                  {seat.number}
                </button>
              ))}
              <div className="acs-seatmap__aisle" />
              {row.filter((s) => s.side === 'right').map((seat) => (
                <button
                  key={seat.id}
                  type="button"
                  className={clsx('acs-seatmap__seat', seat.isReserved && 'acs-seatmap__seat--reserved', localSelected.includes(seat.id) && 'acs-seatmap__seat--selected')}
                  disabled={seat.isReserved}
                  onClick={() => toggleSeat(seat)}
                  title={`Siège ${seat.number}`}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="acs-seatmap__footer">
          <span className="acs-seatmap__count">
            <strong>{localSelected.length}</strong> siège{localSelected.length > 1 ? 's' : ''} sélectionné{localSelected.length > 1 ? 's' : ''}
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="acs-btn acs-btn--ghost" onClick={onBack}>
              <i className="bi bi-arrow-left" /> Retour
            </button>
            <button type="button" className="acs-btn acs-btn--primary" disabled={localSelected.length === 0} onClick={() => onSelect(localSelected)}>
              Continuer <i className="bi bi-arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterSeatMap;
