const AddressForm = ({ user, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="pf-card pf-card--form">
      <div className="pf-card__header">
        <div className="pf-card__header-icon pf-card__header-icon--accent">
          <i className="bi bi-geo-alt" />
        </div>
        <span className="pf-card__header-label">Adresse</span>
      </div>

      <div className="pf-form">
        <div className="pf-form__row pf-form__row--2">
          <div className="pf-field">
            <label className="pf-field__label" htmlFor="country">Pays</label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-flag pf-field__icon" />
              <input
                id="country"
                type="text"
                className="pf-field__input"
                placeholder="Votre pays"
                value={user?.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-field__label" htmlFor="region">Région</label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-map pf-field__icon" />
              <input
                id="region"
                type="text"
                className="pf-field__input"
                placeholder="Votre région"
                value={user?.region || ''}
                onChange={(e) => handleChange('region', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pf-form__row pf-form__row--2">
          <div className="pf-field">
            <label className="pf-field__label" htmlFor="city">Ville</label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-building pf-field__icon" />
              <input
                id="city"
                type="text"
                className="pf-field__input"
                placeholder="Votre ville"
                value={user?.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-field__label" htmlFor="address">
              Adresse
              <span className="pf-field__badge">Bientôt disponible</span>
            </label>
            <div className="pf-field__input-wrapper pf-field__input-wrapper--disabled">
              <i className="bi bi-signpost-2 pf-field__icon" />
              <input
                id="address"
                type="text"
                className="pf-field__input"
                placeholder="Adresse postale"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
