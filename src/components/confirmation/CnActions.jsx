import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

const CnActions = memo(({ bookingId }) => {
  const navigate = useNavigate();
  const handlePrint = useCallback(() => window.print(), []);
  const handleDownload = useCallback(() => window.print(), []);
  const handleShare = useCallback(async () => {
    const data = { title: 'BUS TIX CONNECT — Billet', text: `Billet BUS TIX CONNECT — Réservation ${bookingId}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(`${data.text}\n${data.url}`); }
    } catch (e) { if (e.name !== 'AbortError') { /* noop */ } }
  }, [bookingId]);

  return (
    <div className="cn-actions">
      <button type="button" className="cn-actions__btn cn-actions__btn--primary" onClick={handleDownload}>
        <i className="bi bi-download" /> Télécharger
      </button>
      <button type="button" className="cn-actions__btn cn-actions__btn--outline" onClick={handlePrint}>
        <i className="bi bi-printer" /> Imprimer
      </button>
      <button type="button" className="cn-actions__btn cn-actions__btn--outline" onClick={handleShare}>
        <i className="bi bi-share-fill" /> Partager
      </button>
      <span className="cn-actions__sep" />
      <button type="button" className="cn-actions__btn cn-actions__btn--ghost" onClick={() => navigate(ROUTES.CLIENT_BOOKINGS)}>
        <i className="bi bi-list-check" /> Mes réservations
      </button>
      <button type="button" className="cn-actions__btn cn-actions__btn--ghost" onClick={() => navigate(ROUTES.HOME)}>
        <i className="bi bi-house" /> Accueil
      </button>
    </div>
  );
});
CnActions.displayName = 'CnActions';
export default CnActions;
