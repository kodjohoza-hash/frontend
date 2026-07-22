import { memo, useCallback } from 'react';

const CkMethodCard = memo(({ method, isSelected, onSelect }) => {
  const handleClick = useCallback(() => onSelect(method.id), [method.id, onSelect]);

  return (
    <button
      type="button"
      className={`ck-method ${isSelected ? 'ck-method--selected' : ''} ${!method.available ? 'ck-method--disabled' : ''}`}
      onClick={handleClick}
      disabled={!method.available}
      aria-pressed={isSelected}
      aria-label={`Payer avec ${method.name}`}
      style={{ '--method-color': method.color, '--method-bg': method.bg, '--method-accent': method.accentBg }}
    >
      <div className="ck-method__icon-wrap">
        <i className={`bi ${method.icon}`} />
      </div>
      <div className="ck-method__body">
        <div className="ck-method__top">
          <span className="ck-method__name">{method.name}</span>
          {method.badge && <span className="ck-method__badge">{method.badge}</span>}
        </div>
        <span className="ck-method__tagline">{method.tagline}</span>
      </div>
      <div className="ck-method__check">
        <i className="bi bi-check-lg" />
      </div>
    </button>
  );
});
CkMethodCard.displayName = 'CkMethodCard';

const CkMethodGrid = memo(({ methods, selectedMethod, onSelect }) => (
  <div className="ck-methods" role="radiogroup" aria-label="Modes de paiement">
    {methods.map((m) => (
      <CkMethodCard key={m.id} method={m} isSelected={selectedMethod === m.id} onSelect={onSelect} />
    ))}
  </div>
));
CkMethodGrid.displayName = 'CkMethodGrid';

export default CkMethodGrid;
