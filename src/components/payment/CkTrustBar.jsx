import { memo } from 'react';
import { TRUST_BADGES } from '@data/payment';

const CkTrustBar = memo(() => (
  <div className="ck-trust" aria-label="Sécurité du paiement">
    <div className="ck-trust__badges">
      {TRUST_BADGES.map((b, i) => (
        <div key={i} className="ck-trust__badge" style={{ '--tb-color': b.color }}>
          <i className={`bi ${b.icon}`} />
          <span>{b.label}</span>
        </div>
      ))}
    </div>
    <p className="ck-trust__text">
      <i className="bi bi-shield-lock-fill" />
      Transaction sécurisée par Bus Tix Connect. Vos données bancaires ne sont jamais stockées sur nos serveurs.
    </p>
  </div>
));
CkTrustBar.displayName = 'CkTrustBar';
export default CkTrustBar;
