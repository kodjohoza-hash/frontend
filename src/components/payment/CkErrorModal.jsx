import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

const CkErrorModal = memo(({ message, onRetry, onBack }) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(ROUTES.BOOKING_SEATS));

  return (
    <div className="ck-modal-backdrop" role="dialog" aria-modal="true" aria-label="Échec du paiement">
      <div className="ck-modal ck-modal--error">
        <div className="ck-modal__icon ck-modal__icon--error">
          <i className="bi bi-x-lg" />
        </div>
        <h2 className="ck-modal__title">Échec du paiement</h2>
        <p className="ck-modal__subtitle">
          {message || 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.'}
        </p>
        <div className="ck-modal__actions">
          <button type="button" className="ck-modal__btn ck-modal__btn--primary" onClick={onRetry}>
            <i className="bi bi-arrow-clockwise" /> Réessayer
          </button>
          <button type="button" className="ck-modal__btn ck-modal__btn--ghost" onClick={handleBack}>
            Retour aux sièges
          </button>
        </div>
      </div>
    </div>
  );
});
CkErrorModal.displayName = 'CkErrorModal';
export default CkErrorModal;
