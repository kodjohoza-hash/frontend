import clsx from 'clsx';

const GENDERS = [
  { value: '', label: 'Sexe' },
  { value: 'M', label: 'Homme' },
  { value: 'F', label: 'Femme' },
];

const ID_TYPES = [
  { value: 'cni', label: 'CNI' },
  { value: 'passport', label: 'Passeport' },
  { value: 'other', label: 'Autre' },
];

const PiPassengerCard = ({ index, passenger, onChange, onRemove, canRemove, errors = {} }) => {
  const update = (field, value) => onChange(index, field, value);

  return (
    <div className={clsx('pi-card', errors._hasError && 'pi-card--error')}>
      <div className="pi-card__header">
        <div className="pi-card__badge">{index + 1}</div>
        <div className="pi-card__header-text">
          <h4 className="pi-card__title">Passager {index + 1}</h4>
          {index === 0 && <span className="pi-card__subtitle">Passager principal</span>}
        </div>
        {canRemove && (
          <button type="button" className="pi-card__remove" onClick={() => onRemove(index)} aria-label="Supprimer">
            <i className="bi bi-trash3" />
          </button>
        )}
      </div>

      <div className="pi-card__fields">
        <div className="pi-field-row pi-field-row--2">
          <div className={clsx('pi-field', errors.firstName && 'pi-field--error')}>
            <label className="pi-field__label">Prénom <span className="pi-field__req">*</span></label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-person pi-field__icon" />
              <input
                type="text"
                className="pi-field__input"
                value={passenger.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                placeholder="Jean"
              />
            </div>
            {errors.firstName && <span className="pi-field__error">{errors.firstName}</span>}
          </div>
          <div className={clsx('pi-field', errors.lastName && 'pi-field--error')}>
            <label className="pi-field__label">Nom <span className="pi-field__req">*</span></label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-person pi-field__icon" />
              <input
                type="text"
                className="pi-field__input"
                value={passenger.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                placeholder="Kamga"
              />
            </div>
            {errors.lastName && <span className="pi-field__error">{errors.lastName}</span>}
          </div>
        </div>

        <div className="pi-field-row pi-field-row--2">
          <div className={clsx('pi-field', errors.gender && 'pi-field--error')}>
            <label className="pi-field__label">Sexe <span className="pi-field__req">*</span></label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-gender-ambiguous pi-field__icon" />
              <select
                className="pi-field__input pi-field__select"
                value={passenger.gender}
                onChange={(e) => update('gender', e.target.value)}
              >
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            {errors.gender && <span className="pi-field__error">{errors.gender}</span>}
          </div>
          <div className={clsx('pi-field', errors.dateOfBirth && 'pi-field--error')}>
            <label className="pi-field__label">Date de naissance <span className="pi-field__req">*</span></label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-calendar-date pi-field__icon" />
              <input
                type="date"
                className="pi-field__input"
                value={passenger.dateOfBirth}
                onChange={(e) => update('dateOfBirth', e.target.value)}
              />
            </div>
            {errors.dateOfBirth && <span className="pi-field__error">{errors.dateOfBirth}</span>}
          </div>
        </div>

        <div className="pi-field-row pi-field-row--2">
          <div className={clsx('pi-field', errors.phone && 'pi-field--error')}>
            <label className="pi-field__label">Téléphone <span className="pi-field__req">*</span></label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-telephone pi-field__icon" />
              <input
                type="tel"
                className="pi-field__input"
                value={passenger.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+237 6XX XXX XXX"
              />
            </div>
            {errors.phone && <span className="pi-field__error">{errors.phone}</span>}
          </div>
          <div className={clsx('pi-field', errors.email && 'pi-field--error')}>
            <label className="pi-field__label">Email</label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-envelope pi-field__icon" />
              <input
                type="email"
                className="pi-field__input"
                value={passenger.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="email@exemple.com"
              />
            </div>
            {errors.email && <span className="pi-field__error">{errors.email}</span>}
          </div>
        </div>

        <div className="pi-card__section-divider">
          <i className="bi bi-shield-lock" />
          <span>Pièce d'identité</span>
        </div>

        <div className="pi-field-row pi-field-row--2">
          <div className="pi-field">
            <label className="pi-field__label">Type de pièce <span className="pi-field__req">*</span></label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-credit-card pi-field__icon" />
              <select
                className="pi-field__input pi-field__select"
                value={passenger.idType}
                onChange={(e) => update('idType', e.target.value)}
              >
                {ID_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={clsx('pi-field', errors.idNumber && 'pi-field--error')}>
            <label className="pi-field__label">Numéro de la pièce <span className="pi-field__req">*</span></label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-hash pi-field__icon" />
              <input
                type="text"
                className="pi-field__input"
                value={passenger.idNumber}
                onChange={(e) => update('idNumber', e.target.value)}
                placeholder="123456789"
              />
            </div>
            {errors.idNumber && <span className="pi-field__error">{errors.idNumber}</span>}
          </div>
        </div>

        <div className="pi-card__section-divider">
          <i className="bi bi-telephone-forward" />
          <span>Contact d'urgence</span>
        </div>

        <div className="pi-field-row pi-field-row--2">
          <div className="pi-field">
            <label className="pi-field__label">Nom du contact</label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-person-heart pi-field__icon" />
              <input
                type="text"
                className="pi-field__input"
                value={passenger.emergencyName}
                onChange={(e) => update('emergencyName', e.target.value)}
                placeholder="Nom complet"
              />
            </div>
          </div>
          <div className="pi-field">
            <label className="pi-field__label">Téléphone du contact</label>
            <div className="pi-field__input-wrap">
              <i className="bi bi-telephone-outbound pi-field__icon" />
              <input
                type="tel"
                className="pi-field__input"
                value={passenger.emergencyPhone}
                onChange={(e) => update('emergencyPhone', e.target.value)}
                placeholder="+237 6XX XXX XXX"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiPassengerCard;
