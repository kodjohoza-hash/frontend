import { useState, useCallback, useEffect, memo } from 'react';

const formatCardNum = (v) => {
  const c = v.replace(/\D/g, '').slice(0, 16);
  return c.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (v) => {
  const c = v.replace(/\D/g, '').slice(0, 4);
  if (c.length > 2) return c.slice(0, 2) + '/' + c.slice(2);
  return c;
};

const detectCardBrand = (num) => {
  const c = num.replace(/\s/g, '');
  if (/^4/.test(c)) return 'visa';
  if (/^5[1-5]/.test(c) || /^2[2-7]/.test(c)) return 'mastercard';
  return null;
};

const CkCardForm = memo(({ onValid }) => {
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [brand, setBrand] = useState(null);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validate = useCallback((f) => {
    const errs = {};
    const numClean = f.number.replace(/\s/g, '');
    if (f.number && numClean.length < 16) errs.number = '16 chiffres requis';
    if (f.expiry && !/^\d{2}\/\d{2}$/.test(f.expiry)) errs.expiry = 'Format MM/YY';
    if (f.cvv && (f.cvv.length < 3 || f.cvv.length > 4)) errs.cvv = '3 à 4 chiffres';
    if (f.name && f.name.trim().length < 2) errs.name = 'Nom trop court';
    setErrors(errs);
    const valid = numClean.length === 16 && /^\d{2}\/\d{2}$/.test(f.expiry) && f.cvv.length >= 3 && f.name.trim().length >= 2;
    onValid(valid, { ...f, cardBrand: brand });
    return errs;
  }, [brand, onValid]);

  const handleChange = useCallback((field) => (e) => {
    let val = e.target.value;
    if (field === 'number') { val = formatCardNum(val); setBrand(detectCardBrand(val)); }
    if (field === 'expiry') val = formatExpiry(val);
    if (field === 'cvv') val = val.replace(/\D/g, '').slice(0, 4);
    if (field === 'name') val = e.target.value;
    const next = { ...form, [field]: val };
    setForm(next);
    validate(next);
  }, [form, validate]);

  const handleBlur = useCallback((field) => () => setTouched((p) => ({ ...p, [field]: true })), []);

  useEffect(() => {
    onValid(false, {});
  }, [onValid]);

  const fields = [
    { id: 'ck-card-name', key: 'name', label: 'Nom sur la carte', icon: 'bi-person', placeholder: 'Jean Kamga', type: 'text', autoComplete: 'cc-name' },
    { id: 'ck-card-number', key: 'number', label: 'Numéro de carte', icon: 'bi-credit-card-2-front', placeholder: '4242 4242 4242 4242', type: 'text', inputMode: 'numeric', autoComplete: 'cc-number' },
    { id: 'ck-card-expiry', key: 'expiry', label: 'Expiration', icon: 'bi-calendar3', placeholder: 'MM/YY', type: 'text', inputMode: 'numeric', col: true },
    { id: 'ck-card-cvv', key: 'cvv', label: 'CVV', icon: 'bi-lock', placeholder: '123', type: 'password', inputMode: 'numeric', col: true, autoComplete: 'cc-csc' },
  ];

  return (
    <div className="ck-form ck-form--slide">
      {brand && (
        <div className="ck-card-brand">
          <i className={`bi bi-${brand === 'visa' ? 'credit-card' : 'credit-card-fill'}`} />
          <span>{brand === 'visa' ? 'VISA' : 'MASTERCARD'}</span>
        </div>
      )}

      <div className="ck-form__row">
        {fields.filter((f) => !f.col).map((f) => (
          <div className="ck-field" key={f.id}>
            <label className="ck-field__label" htmlFor={f.id}>{f.label}</label>
            <div className={`ck-field__input-wrap ${errors[f.key] && touched[f.key] ? 'ck-field__input-wrap--error' : ''}`}>
              <input
                id={f.id}
                className="ck-field__input"
                type={f.type}
                inputMode={f.inputMode}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={handleChange(f.key)}
                onBlur={handleBlur(f.key)}
                autoComplete={f.autoComplete}
              />
              <i className={`bi ${f.icon} ck-field__icon`} />
            </div>
            {errors[f.key] && touched[f.key] && <p className="ck-field__error" role="alert">{errors[f.key]}</p>}
          </div>
        ))}
      </div>

      <div className="ck-form__row ck-form__row--half">
        {fields.filter((f) => f.col).map((f) => (
          <div className="ck-field" key={f.id}>
            <label className="ck-field__label" htmlFor={f.id}>{f.label}</label>
            <div className={`ck-field__input-wrap ${errors[f.key] && touched[f.key] ? 'ck-field__input-wrap--error' : ''}`}>
              <input
                id={f.id}
                className="ck-field__input"
                type={f.type}
                inputMode={f.inputMode}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={handleChange(f.key)}
                onBlur={handleBlur(f.key)}
                autoComplete={f.autoComplete}
              />
              <i className={`bi ${f.icon} ck-field__icon`} />
            </div>
            {errors[f.key] && touched[f.key] && <p className="ck-field__error" role="alert">{errors[f.key]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
});

CkCardForm.displayName = 'CkCardForm';
export default CkCardForm;
