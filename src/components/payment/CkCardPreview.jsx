import { memo, useMemo } from 'react';

const CkCardPreview = memo(({ cardData = {}, brand }) => {
  const { name, number, expiry } = cardData;
  const displayNumber = number
    ? number.padEnd(19, '•').replace(/(.{4})/g, '$1 ').trim()
    : '•••• •••• •••• ••••';
  const displayName = name || 'VOTRE NOM';
  const displayExpiry = expiry || 'MM/YY';

  const brandGrad = useMemo(() => {
    if (brand === 'visa') return 'linear-gradient(135deg, #1A1F71 0%, #2D3AB5 100%)';
    if (brand === 'mastercard') return 'linear-gradient(135deg, #EB001B 0%, #F79E1B 100%)';
    return 'linear-gradient(135deg, #0B1D51 0%, #1e3a8a 100%)';
  }, [brand]);

  return (
    <div className="ck-preview" aria-label="Aperçu de la carte">
      <div className="ck-preview__bg" style={{ background: brandGrad }} />
      <div className="ck-preview__shine" />
      <div className="ck-preview__chip">
        <div className="ck-preview__chip-line" />
      </div>
      <div className="ck-preview__brand">
        {brand === 'visa' && <span style={{ fontWeight: 800, fontStyle: 'italic', fontSize: '0.95rem' }}>VISA</span>}
        {brand === 'mastercard' && (
          <span style={{ display: 'flex', gap: '-8px', position: 'relative' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#EB001B', opacity: 0.9 }} />
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#F79E1B', opacity: 0.9, marginLeft: -10 }} />
          </span>
        )}
        {!brand && <i className="bi bi-credit-card-2-front" style={{ opacity: 0.3, fontSize: '1.2rem' }} />}
      </div>
      <div className="ck-preview__number">{displayNumber}</div>
      <div className="ck-preview__bottom">
        <div>
          <div className="ck-preview__sub">TITULAIRE</div>
          <div className="ck-preview__val">{displayName}</div>
        </div>
        <div>
          <div className="ck-preview__sub">EXPIRE</div>
          <div className="ck-preview__val">{displayExpiry}</div>
        </div>
      </div>
    </div>
  );
});

CkCardPreview.displayName = 'CkCardPreview';
export default CkCardPreview;
