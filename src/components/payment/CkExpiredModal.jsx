import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

const CkExpiredModal = memo(() => {
  const navigate = useNavigate();
  const goSearch = useCallback(() => navigate(ROUTES.BOOKING_SEARCH), [navigate]);

  return (
    <div className="ck-modal-backdrop" role="dialog" aria-modal="true" aria-label="Délai expiré">
      <div className="ck-modal ck-modal--expired">
        <div className="ck-modal__icon ck-modal__icon--expired">
          <i className="bi bi-clock-history" />
        </div>
        <h2 className="ck-modal__title">Délai expiré</h2>
        <p className="ck-modal__subtitle">
          Le temps imparti pour compléter votre réservation a expiré.
          Les sièges ont été libérés et sont à nouveau disponibles.
        </p>
        <div className="ck-modal__actions">
          <button type="button" className="ck-modal__btn ck-modal__btn--primary" onClick={goSearch}>
            <i className="bi bi-search" /> Nouvelle recherche
          </button>
        </div>
      </div>
    </div>
  );
});
CkExpiredModal.displayName = 'CkExpiredModal';
export default CkExpiredModal;
