const CounterBoardingConfirmation = ({ type, ticket, onClose, onAction }) => {
  const isSuccess = type === 'success';

  return (
    <div className="acv-boarding-confirm" onClick={onClose}>
      <div className="acv-boarding-card" onClick={(e) => e.stopPropagation()}>
        <div className={`acv-boarding-icon ${isSuccess ? 'success' : 'error'}`}>
          <i className={`bi ${isSuccess ? 'bi-check-lg' : 'bi-x-lg'}`} />
        </div>
        <div className="acv-boarding-title">
          {isSuccess ? 'Embarquement validé' : 'Embarquement refusé'}
        </div>
        <div className="acv-boarding-text">
          {isSuccess
            ? `${ticket.passenger.name} a embarqué avec succès sur le trajet ${ticket.trip.from} → ${ticket.trip.to}.`
            : `L'embarquement de ${ticket.passenger.name} a été refusé.`}
        </div>
        <div className="acv-boarding-detail">
          {isSuccess
            ? `Bus ${ticket.bus.plate} · Siège ${ticket.bus.seat} · ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
            : `Motif : billet ${ticket.status === 'used' ? 'déjà utilisé' : ticket.status === 'expired' ? 'expiré' : ticket.status === 'cancelled' ? 'annulé' : 'non valide'}`}
        </div>
        <div className="acv-boarding-actions">
          <button className="acv-btn acv-btn-primary" onClick={onClose}>
            <i className="bi bi-check-lg" /> Fermer
          </button>
          {isSuccess && (
            <button className="acv-btn acv-btn-secondary" onClick={() => { onClose(); onAction?.('print', ticket); }}>
              <i className="bi bi-printer" /> Imprimer le bordereau
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounterBoardingConfirmation;
