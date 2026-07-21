const positionLabels = {
  window: 'Fenetre',
  aisle: 'Couloir',
};

const stateLabels = {
  available: 'Disponible',
  occupied: 'Occupe',
  reserved: 'Reserve',
  selected: 'Selectionne',
  vip: 'VIP',
  pmr: 'PMR (Accessible)',
};

const SeatTooltip = ({ seat, state, position }) => {
  if (!seat) return null;

  return (
    <div
      className="btc-seat-tooltip"
      role="tooltip"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="btc-seat-tooltip-header">
        <span className="btc-seat-tooltip-number">Siege {seat.number}</span>
        <span className={`btc-seat-tooltip-state btc-tooltip-state-${state}`}>
          {stateLabels[state]}
        </span>
      </div>
      <div className="btc-seat-tooltip-divider" />
      <div className="btc-seat-tooltip-body">
        <div className="btc-tooltip-row">
          <i className="bi bi-cash-stack" />
          <span>{seat.price?.toLocaleString()} FCFA</span>
        </div>
        <div className="btc-tooltip-row">
          <i className="bi bi-door-open" />
          <span>{positionLabels[seat.position] || seat.position}</span>
        </div>
        <div className="btc-tooltip-row">
          <i className="bi bi-signpost-split" />
          <span>Rangee {seat.row}</span>
        </div>
        {seat.legroom && (
          <div className="btc-tooltip-row">
            <i className="bi bi-arrows-expand" />
            <span>Espace {seat.legroom === 'extended' ? 'etendu' : seat.legroom === 'standard' ? 'standard' : 'compact'}</span>
          </div>
        )}
      </div>
      <div className="btc-seat-tooltip-arrow" />
    </div>
  );
};

export default SeatTooltip;
