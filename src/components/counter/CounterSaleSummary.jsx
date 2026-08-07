import { paymentMethods } from '@data/counterSaleData';

const methodLabels = {};
paymentMethods.forEach((pm) => { methodLabels[pm.id] = pm.label; });

const CounterSaleSummary = ({ state, onConfirm, onBack }) => {
  const { search, selectedTrip, selectedSeats, passenger, payment } = state;
  const client = passenger.isExisting && passenger.existingClient ? passenger.existingClient : passenger;
  const payMethod = methodLabels[payment.method] || payment.method;

  const formatPrice = (v) => (v || 0).toLocaleString('fr-FR');

  return (
    <div>
      <div className="acs-step__header">
        <h2 className="acs-step__title">Confirmation</h2>
        <p className="acs-step__desc">Vérifiez les informations avant de finaliser la vente</p>
      </div>

      <div className="acs-confirm">
        <div className="acs-confirm__section">
          <div className="acs-confirm__section-title"><i className="bi bi-signpost-2" /> Voyage</div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Trajet</span><span className="acs-confirm__value">{selectedTrip.from} → {selectedTrip.to}</span></div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Date</span><span className="acs-confirm__value">{search.date || "Aujourd'hui"}</span></div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Horaire</span><span className="acs-confirm__value">{selectedTrip.departure} - {selectedTrip.arrival}</span></div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Bus</span><span className="acs-confirm__value">{selectedTrip.bus}</span></div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Compagnie</span><span className="acs-confirm__value">{selectedTrip.company}</span></div>
        </div>

        <div className="acs-confirm__section">
          <div className="acs-confirm__section-title"><i className="bi bi-person" /> Passager</div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Nom</span><span className="acs-confirm__value">{client.firstName} {client.lastName}</span></div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Téléphone</span><span className="acs-confirm__value">{client.phone || '—'}</span></div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Email</span><span className="acs-confirm__value">{client.email || '—'}</span></div>
          {client.idType && client.idType !== 'none' && (
            <div className="acs-confirm__row"><span className="acs-confirm__label">Pièce</span><span className="acs-confirm__value">{client.idNumber || '—'}</span></div>
          )}
        </div>

        <div className="acs-confirm__section">
          <div className="acs-confirm__section-title"><i className="bi bi-grid-3x3-gap" /> Sièges</div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Nombre</span><span className="acs-confirm__value">{search.passengers} passager{search.passengers > 1 ? 's' : ''}</span></div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Sièges</span><span className="acs-confirm__value">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '—'}</span></div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Classe</span><span className="acs-confirm__value">{search.busClass}</span></div>
        </div>

        <div className="acs-confirm__section">
          <div className="acs-confirm__section-title"><i className="bi bi-credit-card" /> Paiement</div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Méthode</span><span className="acs-confirm__value">{payMethod}</span></div>
          <div className="acs-confirm__row"><span className="acs-confirm__label">Montant</span><span className="acs-confirm__value">{formatPrice(payment.amount)} XAF</span></div>
          {payment.discount > 0 && (
            <div className="acs-confirm__row"><span className="acs-confirm__label">Réduction</span><span className="acs-confirm__value" style={{ color: 'var(--act-success)' }}>-{formatPrice(payment.discount)} XAF</span></div>
          )}
          <div className="acs-confirm__row"><span className="acs-confirm__label">Taxes</span><span className="acs-confirm__value">+{formatPrice(payment.taxes)} XAF</span></div>
        </div>

        <div className="acs-confirm__total">
          <span className="acs-confirm__total-label">Total à payer</span>
          <span>{formatPrice(payment.total)} XAF</span>
        </div>

        <div className="acs-step__nav" style={{ gridColumn: '1 / -1' }}>
          <button type="button" className="acs-btn acs-btn--ghost" onClick={onBack}>
            <i className="bi bi-arrow-left" /> Retour
          </button>
          <button type="button" className="acs-btn acs-btn--success" onClick={onConfirm}>
            <i className="bi bi-check-lg" /> Confirmer et finaliser
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterSaleSummary;
