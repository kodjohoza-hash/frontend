import { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import SeatTooltip from './SeatTooltip';

const seatStateConfig = {
  available: { className: 'btc-seat-available', cursor: 'pointer', label: 'Disponible' },
  occupied: { className: 'btc-seat-occupied', cursor: 'not-allowed', label: 'Occupe' },
  reserved: { className: 'btc-seat-reserved', cursor: 'not-allowed', label: 'Reserve' },
  selected: { className: 'btc-seat-selected', cursor: 'pointer', label: 'Selectionne' },
  vip: { className: 'btc-seat-vip', cursor: 'pointer', label: 'VIP' },
  pmr: { className: 'btc-seat-pmr', cursor: 'pointer', label: 'PMR' },
};

const SeatMap = ({ layout, seats, selectedSeats, onSeatToggle }) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  const handleMouseEnter = useCallback((seat, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mapRect = mapRef.current?.getBoundingClientRect();
    if (mapRect) {
      setTooltipPos({
        x: rect.left - mapRect.left + rect.width / 2,
        y: rect.top - mapRect.top - 8,
      });
    }
    setHoveredSeat(seat);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSeat(null);
  }, []);

  const getSeatState = useCallback((seat) => {
    if (selectedSeats.includes(seat.id)) return 'selected';
    if (seat.isPMR) return 'pmr';
    if (seat.isVIP && seat.state === 'available') return 'vip';
    return seat.state;
  }, [selectedSeats]);

  const rows = [];
  for (let r = 1; r <= layout.rows; r++) {
    rows.push(r);
  }

  return (
    <div className="btc-seat-map-wrapper" ref={mapRef} role="application" aria-label="Plan du bus">
      <div className="btc-bus">
        {/* Front Windshield */}
        <div className="btc-bus-front">
          <div className="btc-bus-windshield">
            <div className="btc-windshield-glass" />
          </div>
          <div className="btc-bus-front-label">
            <i className="bi bi-signpost-2-fill" style={{ fontSize: '0.65rem' }} />
            AVANT
          </div>
        </div>

        {/* Driver Area */}
        <div className="btc-bus-driver-area">
          <div className="btc-driver">
            <div className="btc-steering-wheel">
              <i className="bi bi-circle" />
            </div>
            <span className="btc-driver-label">Conducteur</span>
          </div>
          <div className="btc-bus-door">
            <div className="btc-door-line" />
            <span className="btc-door-label">
              <i className="bi bi-box-arrow-in-right" style={{ fontSize: '0.55rem' }} />
              Porte
            </span>
          </div>
        </div>

        {/* Windows */}
        <div className="btc-bus-windows-left">
          {rows.map((r) => (
            <div key={`wl-${r}`} className="btc-bus-window" />
          ))}
        </div>
        <div className="btc-bus-windows-right">
          {rows.map((r) => (
            <div key={`wr-${r}`} className="btc-bus-window" />
          ))}
        </div>

        {/* Seats Area */}
        <div className="btc-bus-seats-area">
          {rows.map((rowNum) => {
            const leftSeats = seats.filter((s) => s.row === rowNum && s.side === 'left');
            const rightSeats = seats.filter((s) => s.row === rowNum && s.side === 'right');
            const isLastRow = rowNum === layout.rows;

            return (
              <div
                key={`row-${rowNum}`}
                className={clsx('btc-seat-row', isLastRow && 'btc-seat-row-last')}
              >
                <div className="btc-row-number" aria-hidden="true">{rowNum}</div>

                <div className="btc-seat-group btc-seat-group-left">
                  {leftSeats.map((seat) => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      state={getSeatState(seat)}
                      isHovered={hoveredSeat?.id === seat.id}
                      onToggle={onSeatToggle}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      disabled={seat.state === 'occupied' || seat.state === 'reserved'}
                    />
                  ))}
                </div>

                <div className="btc-bus-aisle" aria-hidden="true">
                  <div className="btc-aisle-line" />
                </div>

                <div className="btc-seat-group btc-seat-group-right">
                  {rightSeats.map((seat) => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      state={getSeatState(seat)}
                      isHovered={hoveredSeat?.id === seat.id}
                      onToggle={onSeatToggle}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      disabled={seat.state === 'occupied' || seat.state === 'reserved'}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Toilet */}
        {layout.hasToilet && (
          <div className="btc-bus-toilet">
            <i className="bi bi-droplet-fill" />
            <span>Toilettes</span>
          </div>
        )}

        {/* Back */}
        <div className="btc-bus-back">
          <div className="btc-bus-back-label">
            ARR
            <i className="bi bi-signpost-2-fill" style={{ fontSize: '0.65rem' }} />
          </div>
        </div>
      </div>

      {hoveredSeat && (
        <SeatTooltip seat={hoveredSeat} state={getSeatState(hoveredSeat)} position={tooltipPos} />
      )}
    </div>
  );
};

const SeatButton = ({ seat, state, isHovered, onToggle, onMouseEnter, onMouseLeave, disabled }) => {
  const config = seatStateConfig[state] || seatStateConfig.available;
  const isSelected = state === 'selected';

  return (
    <button
      className={clsx('btc-seat', config.className, isHovered && 'btc-seat-hover', isSelected && 'btc-seat-pulse')}
      onClick={() => !disabled && onToggle(seat)}
      onMouseEnter={(e) => onMouseEnter(seat, e)}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      aria-label={`Siege ${seat.number} - ${config.label} ${seat.position === 'window' ? 'Fenetre' : 'Couloir'}`}
      aria-pressed={isSelected}
      type="button"
    >
      <span className="btc-seat-number">{seat.number}</span>
      {seat.isPMR && <i className="bi bi-universal-access btc-seat-pmr-icon" />}
      {seat.isVIP && state !== 'selected' && state !== 'occupied' && (
        <i className="bi bi-star-fill btc-seat-vip-icon" />
      )}
    </button>
  );
};

export default SeatMap;
