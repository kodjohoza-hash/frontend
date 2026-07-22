import { memo } from 'react';

const CkInsurance = memo(({ insurance, isSelected, onToggle }) => (
  <label className={`ck-insurance ${isSelected ? 'ck-insurance--on' : ''}`} htmlFor="ck-insurance-toggle">
    <div className="ck-insurance__icon">
      <i className="bi bi-shield-check" />
    </div>
    <div className="ck-insurance__body">
      <div className="ck-insurance__head">
        <h4 className="ck-insurance__title">{insurance.name}</h4>
        <span className="ck-insurance__price">+{insurance.price.toLocaleString()} FCFA</span>
      </div>
      <p className="ck-insurance__desc">{insurance.description}</p>
      <div className="ck-insurance__features">
        {insurance.features.map((f, i) => (
          <span key={i} className="ck-insurance__feat">
            <i className="bi bi-check2" /> {f}
          </span>
        ))}
      </div>
    </div>
    <div className="ck-insurance__toggle">
      <input
        id="ck-insurance-toggle"
        type="checkbox"
        className="ck-insurance__checkbox"
        checked={isSelected}
        onChange={() => onToggle(!isSelected)}
        aria-label="Activer l'assurance voyage"
      />
      <span className="ck-insurance__slider" />
    </div>
  </label>
));
CkInsurance.displayName = 'CkInsurance';
export default CkInsurance;
