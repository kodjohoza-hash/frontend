import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

const CkSuccessModal = memo(({ transaction }) => {
  const navigate = useNavigate();
  const goToTicket = useCallback(() => navigate(ROUTES.BOOKING_CONFIRMATION), [navigate]);
  const goHome = useCallback(() => navigate(ROUTES.HOME), [navigate]);

  return (
    <div className="ck-modal-backdrop" role="dialog" aria-modal="true" aria-label="Paiement réussi">
      <div className="ck-modal ck-modal--success">
        <div className="ck-modal__icon ck-modal__icon--success">
          <i className="bi bi-check-lg" />
        </div>
        <h2 className="ck-modal__title">Paiement réussi !</h2>
        <p className="ck-modal__subtitle">Votre réservation a été confirmée avec succès.</p>

        {transaction && (
          <div className="ck-modal__details">
            <div className="ck-modal__detail">
              <span>Référence</span>
              <strong>{transaction.transactionId}</strong>
            </div>
            <div className="ck-modal__detail">
              <span>Montant</span>
              <strong>{transaction.amount?.toLocaleString()} {transaction.currency}</strong>
            </div>
            <div className="ck-modal__detail">
              <span>Date</span>
              <strong>{new Date(transaction.timestamp).toLocaleString('fr-FR')}</strong>
            </div>
          </div>
        )}

        <div className="ck-modal__actions">
          <button type="button" className="ck-modal__btn ck-modal__btn--primary" onClick={goToTicket}>
            <i className="bi bi-ticket-perforated" /> Voir mon billet
          </button>
          <button type="button" className="ck-modal__btn ck-modal__btn--ghost" onClick={goHome}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
});
CkSuccessModal.displayName = 'CkSuccessModal';
export default CkSuccessModal;
