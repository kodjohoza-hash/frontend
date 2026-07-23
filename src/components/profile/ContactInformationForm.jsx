import { useState } from 'react';
import clsx from 'clsx';

const ContactInformationForm = ({ user, onChange }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    onChange({ [field]: value });
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, user?.[field]);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    delete newErrors[field];

    if (field === 'email') {
      if (!value || !value.trim()) {
        newErrors.email = 'L\'email est requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Adresse email invalide';
      }
    }
    if (field === 'phone' && value && !/^[+]?[0-9\s\-()]{8,}$/.test(value)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    setErrors(newErrors);
  };

  return (
    <div className="pf-card pf-card--form">
      <div className="pf-card__header">
        <div className="pf-card__header-icon pf-card__header-icon--info">
          <i className="bi bi-chat-dots" />
        </div>
        <span className="pf-card__header-label">Coordonnées</span>
      </div>

      <div className="pf-form">
        <div className="pf-form__row pf-form__row--2">
          <div className={clsx('pf-field', errors.email && touched.email && 'pf-field--error')}>
            <label className="pf-field__label" htmlFor="email">
              Email <span className="pf-field__required">*</span>
            </label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-envelope pf-field__icon" />
              <input
                id="email"
                type="email"
                className="pf-field__input"
                placeholder="votre@email.com"
                value={user?.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
            </div>
            {errors.email && touched.email && (
              <span className="pf-field__error">{errors.email}</span>
            )}
          </div>

          <div className={clsx('pf-field', errors.phone && touched.phone && 'pf-field--error')}>
            <label className="pf-field__label" htmlFor="phone">
              Téléphone
            </label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-telephone pf-field__icon" />
              <input
                id="phone"
                type="tel"
                className="pf-field__input"
                placeholder="+237 6XX XXX XXX"
                value={user?.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
              />
            </div>
            {errors.phone && touched.phone && (
              <span className="pf-field__error">{errors.phone}</span>
            )}
          </div>
        </div>

        <div className="pf-contact__verify">
          <div className="pf-contact__verify-info">
            <i className={clsx(
              'bi',
              user?.emailVerified ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill',
              user?.emailVerified ? 'pf-contact__verify-icon--success' : 'pf-contact__verify-icon--warning'
            )} />
            <span className="pf-contact__verify-text">
              {user?.emailVerified
                ? 'Votre adresse email est vérifiée'
                : 'Votre adresse email n\'est pas vérifiée'}
            </span>
          </div>
          {!user?.emailVerified && (
            <button type="button" className="pf-contact__verify-btn">
              Vérifier maintenant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInformationForm;
