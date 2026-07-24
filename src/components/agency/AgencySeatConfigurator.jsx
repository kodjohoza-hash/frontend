import { useState } from 'react';
import clsx from 'clsx';

export default function AgencySeatConfigurator({ layout, totalSeats, readonly = false, onLayoutChange }) {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const generateSeats = () => {
    const seats = [];
    const { rows, seatsPerSide, aisleAfter, vipRows, pmrSeats } = layout;
    let seatNum = 1;

    for (let r = 1; r <= rows; r++) {
      const left = [];
      const right = [];

      for (let s = 1; s <= seatsPerSide; s++) {
        const id = `${String.fromCharCode(64 + r)}${s}`;
        const type = vipRows?.includes(r) ? 'vip' : pmrSeats?.includes(seatNum) ? 'pmr' : 'standard';
        left.push({ id, number: seatNum++, type, row: r, side: 'left' });
      }

      for (let s = 1; s <= seatsPerSide; s++) {
        const id = `${String.fromCharCode(64 + r)}${s + seatsPerSide}`;
        const type = vipRows?.includes(r) ? 'vip' : pmrSeats?.includes(seatNum) ? 'pmr' : 'standard';
        right.push({ id, number: seatNum++, type, row: r, side: 'right' });
      }

      seats.push({ row: r, left, right, hasAisle: aisleAfter?.includes(r) });
    }

    return seats;
  };

  const rows = generateSeats();
  const displayedSeats = totalSeats ? Math.min(totalSeats, rows.reduce((acc, r) => acc + r.left.length + r.right.length, 0)) : undefined;

  return (
    <div className="ab-seat-config">
      <div className="ab-seat-config__legend">
        <div className="ab-seat-config__legend-item">
          <span className="ab-seat-config__legend-dot ab-seat-config__legend-dot--standard" />
          <span>Standard</span>
        </div>
        <div className="ab-seat-config__legend-item">
          <span className="ab-seat-config__legend-dot ab-seat-config__legend-dot--vip" />
          <span>VIP</span>
        </div>
        <div className="ab-seat-config__legend-item">
          <span className="ab-seat-config__legend-dot ab-seat-config__legend-dot--pmr" />
          <span>PMR</span>
        </div>
        <div className="ab-seat-config__legend-item">
          <span className="ab-seat-config__legend-dot ab-seat-config__legend-dot--aisle" />
          <span>Allée</span>
        </div>
      </div>

      <div className="ab-seat-config__bus">
        <div className="ab-seat-config__front">
          <i className="bi bi-steering-wheel" />
          <span>Chauffeur</span>
        </div>

        <div className="ab-seat-config__cabin">
          {rows.map((row) => (
            <div key={row.row} className="ab-seat-config__row">
              <div className="ab-seat-config__side ab-seat-config__side--left">
                {row.left.map((seat) => (
                  <button
                    key={seat.id}
                    className={clsx(
                      'ab-seat-config__seat',
                      `ab-seat-config__seat--${seat.type}`,
                      { 'ab-seat-config__seat--selected': selectedSeat === seat.id }
                    )}
                    onClick={() => !readonly && setSelectedSeat(selectedSeat === seat.id ? null : seat.id)}
                    type="button"
                    disabled={readonly && seat.type !== 'standard'}
                    title={`Place ${seat.number} — ${seat.type}`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>

              <div className="ab-seat-config__aisle">
                {row.hasAisle && <div className="ab-seat-config__aisle-marker"><i className="bi bi-arrow-left-right" /></div>}
              </div>

              <div className="ab-seat-config__side ab-seat-config__side--right">
                {row.right.map((seat) => (
                  <button
                    key={seat.id}
                    className={clsx(
                      'ab-seat-config__seat',
                      `ab-seat-config__seat--${seat.type}`,
                      { 'ab-seat-config__seat--selected': selectedSeat === seat.id }
                    )}
                    onClick={() => !readonly && setSelectedSeat(selectedSeat === seat.id ? null : seat.id)}
                    type="button"
                    disabled={readonly && seat.type !== 'standard'}
                    title={`Place ${seat.number} — ${seat.type}`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="ab-seat-config__rear">
          <i className="bi bi-door-closed" />
          <span>Sortie</span>
        </div>
      </div>

      {displayedSeats && (
        <div className="ab-seat-config__info">
          <span>{displayedSeats} places configurées</span>
        </div>
      )}
    </div>
  );
}
