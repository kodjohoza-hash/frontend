import { memo } from 'react';

const CkTerms = memo(({ reservation, isAccepted, onAccept }) => (
  <div className={`ck-terms ${isAccepted ? 'ck-terms--ok' : ''}`}>
    <label className="ck-terms__label" htmlFor="ck-terms-cb">
      <input
        id="ck-terms-cb"
        type="checkbox"
        className="ck-terms__checkbox"
        checked={isAccepted}
        onChange={(e) => onAccept(e.target.checked)}
        aria-label="Accepter les conditions"
      />
      <span className="ck-terms__check" />
      <span className="ck-terms__text">
        J'accepte les{' '}
        <button type="button" className="ck-terms__link">conditions générales de vente</button>
        {' '}et la{' '}
        <button type="button" className="ck-terms__link">politique d'annulation</button>
        {' '}de Bus Tix Connect.
      </span>
    </label>
    <div className="ck-terms__policies">
      <div className="ck-terms__policy">
        <i className="bi bi-arrow-counterclockwise" />
        <span>{reservation.policies.cancellation}</span>
      </div>
      <div className="ck-terms__policy">
        <i className="bi bi-arrow-return-left" />
        <span>{reservation.policies.refund}</span>
      </div>
    </div>
  </div>
));
CkTerms.displayName = 'CkTerms';
export default CkTerms;
