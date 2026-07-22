import { memo } from 'react';

const CnSuccessCard = memo(({ booking }) => {
  const date = new Date(booking.createdAt);
  return (
    <div className="cn-success">
      <div className="cn-success__confetti" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="cn-success__dot" style={{ '--d': `${i * 30}deg`, '--delay': `${i * 0.06}s` }} />
        ))}
      </div>
      <div className="cn-success__icon">
        <div className="cn-success__circle">
          <i className="bi bi-check-lg" />
        </div>
      </div>
      <h2 className="cn-success__title">Réservation confirmée !</h2>
      <p className="cn-success__subtitle">
        Merci d'avoir choisi <strong>BUS TIX CONNECT</strong>.<br />
        Votre billet électronique est prêt.
      </p>
      <div className="cn-success__pills">
        <div className="cn-pill">
          <span className="cn-pill__label">Référence</span>
          <span className="cn-pill__value">{booking.reference}</span>
        </div>
        <div className="cn-pill">
          <span className="cn-pill__label">Réservation</span>
          <span className="cn-pill__value">{booking.id}</span>
        </div>
        <div className="cn-pill">
          <span className="cn-pill__label">Date</span>
          <span className="cn-pill__value">{date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="cn-pill cn-pill--ok">
          <i className="bi bi-check-circle-fill" />
          Confirmée
        </div>
      </div>
    </div>
  );
});
CnSuccessCard.displayName = 'CnSuccessCard';
export default CnSuccessCard;
