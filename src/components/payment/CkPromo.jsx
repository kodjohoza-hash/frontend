import { useState, useCallback, memo } from 'react';
import { PROMO_CODES } from '@data/payment';

const CkPromo = memo(({ onApply }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApply = useCallback(async () => {
    if (!code.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const found = PROMO_CODES[code.trim().toUpperCase()];
    if (found) {
      setStatus({ ok: true, label: found.label });
      onApply(found);
    } else {
      setStatus({ ok: false, label: 'Code invalide ou expiré' });
      onApply(null);
    }
    setLoading(false);
  }, [code, onApply]);

  return (
    <div className="ck-promo">
      <h3 className="ck-promo__title">
        <i className="bi bi-tag" />
        Code promotionnel
      </h3>
      <div className="ck-promo__row">
        <input
          className="ck-promo__input"
          type="text"
          placeholder="Entrez votre code"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus(null); }}
          aria-label="Code promotionnel"
        />
        <button
          type="button"
          className="ck-promo__btn"
          onClick={handleApply}
          disabled={loading || !code.trim()}
        >
          {loading ? <i className="bi bi-arrow-repeat ck-spin" /> : 'Appliquer'}
        </button>
      </div>
      {status && (
        <p className={`ck-promo__status ${status.ok ? 'ck-promo__status--ok' : 'ck-promo__status--err'}`}>
          <i className={`bi ${status.ok ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} />
          {status.label}
        </p>
      )}
    </div>
  );
});

CkPromo.displayName = 'CkPromo';
export default CkPromo;
