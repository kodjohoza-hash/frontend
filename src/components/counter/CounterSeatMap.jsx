import { useState } from 'react';
import clsx from 'clsx';

const CounterSeatMap = ({ trip, seatMap, selectedSeats, maxSeats = 1, loading, error, onSelect, onBack }) => {
  const [localSelected, setLocalSelected] = useState(selectedSeats);

  const toggleSeat = (seat) => {
    if (seat.isReserved) return;
    setLocalSelected((prev) => {
      if (prev.includes(seat.id)) return prev.filter((s) => s !== seat.id);
      if (prev.length >= maxSeats) return prev;
      return [...prev, seat.id];
    });
  };

  if (loading) {
    return (
      <div className="acs-step__header">
        <h2 className="acs-step__title">Choix des sièges</h2>
        <div className="acs-empty" style={{ padding: '40px' }}>
          <i className="bi bi-arrow-repeat" style={{ fontSize: 28, animation: 'btcSpin 1s linear infinite', color: 'var(--act-text-muted)' }} />
          <p className="acs-empty__desc">Chargement du plan du bus…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="acs-step__header">
        <h2 className="acs-step__title">Choix des sièges</h2>
        <div className="acs-empty" style={{ padding: '40px' }}>
          <div className="acs-empty__icon"><i className="bi bi-exclamation-triangle" /></div>
          <p className="acs-empty__desc">{error}</p>
        </div>
        <div className="acs-step__nav">
          <button type="button" className="acs-btn acs-btn--ghost" onClick={onBack}>
            <i className="bi bi-arrow-left" /> Retour
          </button>
        </div>
      </div>
    );
  }

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
            <strong>{localSelected.length}</strong>/{maxSeats} siège{maxSeats > 1 ? 's' : ''} sélectionné{maxSeats > 1 ? 's' : ''}
            {maxSeats > 1 && localSelected.length >= maxSeats && (
              <span style={{ color: 'var(--act-text-muted)' }}> — maximum atteint</span>
            )}
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
