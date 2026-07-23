import { useState } from 'react';
import clsx from 'clsx';
import { genderOptions } from '@data/profileData';

const PersonalInformationForm = ({ user, onChange }) => {
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
    if ((field === 'firstName' || field === 'lastName') && (!value || !value.trim())) {
      newErrors[field] = 'Ce champ est requis';
    }
    if (field === 'gender' && value && !['male', 'female', 'other', ''].includes(value)) {
      newErrors[field] = 'Veuillez sélectionner un genre valide';
    }
    setErrors(newErrors);
  };

  return (
    <div className="pf-card pf-card--form">
      <div className="pf-card__header">
        <div className="pf-card__header-icon pf-card__header-icon--accent">
          <i className="bi bi-person" />
        </div>
        <span className="pf-card__header-label">Informations personnelles</span>
      </div>

      <div className="pf-form">
        <div className="pf-form__row pf-form__row--2">
          <div className={clsx('pf-field', errors.firstName && touched.firstName && 'pf-field--error')}>
            <label className="pf-field__label" htmlFor="firstName">
              Nom <span className="pf-field__required">*</span>
            </label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-person pf-field__icon" />
              <input
                id="firstName"
                type="text"
                className="pf-field__input"
                placeholder="Votre nom"
                value={user?.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
              />
            </div>
            {errors.firstName && touched.firstName && (
              <span className="pf-field__error">{errors.firstName}</span>
            )}
          </div>

          <div className="pf-field">
            <label className="pf-field__label" htmlFor="lastName">
              Prénom
            </label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-person pf-field__icon" />
              <input
                id="lastName"
                type="text"
                className="pf-field__input"
                placeholder="Votre prénom"
                value={user?.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
              />
            </div>
          </div>
        </div>

        <div className="pf-form__row pf-form__row--2">
          <div className={clsx('pf-field', errors.gender && touched.gender && 'pf-field--error')}>
            <label className="pf-field__label" htmlFor="gender">
              Sexe
            </label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-gender-ambiguous pf-field__icon" />
              <select
                id="gender"
                className="pf-field__select"
                value={user?.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                onBlur={() => handleBlur('gender')}
              >
                {genderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {errors.gender && touched.gender && (
              <span className="pf-field__error">{errors.gender}</span>
            )}
          </div>

          <div className="pf-field">
            <label className="pf-field__label" htmlFor="birthDate">
              Date de naissance
            </label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-calendar3 pf-field__icon" />
              <input
                id="birthDate"
                type="date"
                className="pf-field__input"
                value={user?.birthDate || ''}
                onChange={(e) => handleChange('birthDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationForm;
