import { useState, useCallback, memo } from 'react';

const validatePhone = (v) => {
  const clean = v.replace(/\s/g, '');
  if (!clean) return '';
  if (!/^[0-9]{9,12}$/.test(clean)) return 'Numéro invalide (9 à 12 chiffres)';
  return '';
};

const validateName = (v) => {
  if (!v.trim()) return '';
  if (v.trim().length < 2) return 'Nom trop court';
  return '';
};

const CkMobileForm = memo(({ onValid }) => {
  const [phone, setPhone] = useState('');
  const [holderName, setHolderName] = useState('');
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validate = useCallback((p, n) => {
    const pe = validatePhone(p);
    const ne = validateName(n);
    const errs = {};
    if (pe) errs.phone = pe;
    if (ne) errs.holderName = ne;
    setErrors(errs);
    const valid = p.replace(/\s/g, '').length >= 9 && n.trim().length >= 2;
    onValid(valid, { phone: p, holderName: n });
    return errs;
  }, [onValid]);

  const handlePhone = useCallback((e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
    setPhone(val);
    validate(val, holderName);
  }, [holderName, validate]);

  const handleName = useCallback((e) => {
    const val = e.target.value;
    setHolderName(val);
    validate(phone, val);
  }, [phone, validate]);

  const handleBlur = useCallback((field) => () => setTouched((p) => ({ ...p, [field]: true })), []);

  return (
    <div className="ck-form ck-form--slide">
      <div className="ck-field">
        <label className="ck-field__label" htmlFor="ck-phone">
          Numéro de téléphone
        </label>
        <div className={`ck-field__input-wrap ${errors.phone && touched.phone ? 'ck-field__input-wrap--error' : ''}`}>
          <span className="ck-field__prefix">+237</span>
          <input
            id="ck-phone"
            className="ck-field__input"
            type="tel"
            inputMode="numeric"
            placeholder="6XX XXX XXX"
            value={phone}
            onChange={handlePhone}
            onBlur={handleBlur('phone')}
            autoComplete="tel-national"
          />
          <i className="bi bi-phone ck-field__icon" />
        </div>
        {errors.phone && touched.phone && <p className="ck-field__error" role="alert">{errors.phone}</p>}
      </div>

      <div className="ck-field">
        <label className="ck-field__label" htmlFor="ck-holder">
          Nom du titulaire
        </label>
        <div className={`ck-field__input-wrap ${errors.holderName && touched.holderName ? 'ck-field__input-wrap--error' : ''}`}>
          <input
            id="ck-holder"
            className="ck-field__input"
            type="text"
            placeholder="Nom complet"
            value={holderName}
            onChange={handleName}
            onBlur={handleBlur('holderName')}
            autoComplete="name"
          />
          <i className="bi bi-person ck-field__icon" />
        </div>
        {errors.holderName && touched.holderName && <p className="ck-field__error" role="alert">{errors.holderName}</p>}
      </div>

      <div className="ck-form__hint">
        <i className="bi bi-info-circle" />
        Vous recevrez une demande de confirmation sur votre téléphone
      </div>
    </div>
  );
});

CkMobileForm.displayName = 'CkMobileForm';
export default CkMobileForm;
