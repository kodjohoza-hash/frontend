import clsx from 'clsx';
import { seatOptions, luggageOptions } from '@data/settingsData';

const TravelPreferences = ({ settings, onChange }) => {
  const t = settings?.travel || {};

  const handleChange = (field, value) => {
    onChange({ travel: { ...t, [field]: value } });
  };

  return (
    <div className="st-section">
      <div className="st-section__header">
        <div className="st-section__icon st-section__icon--success">
          <i className="bi bi-bus-front" />
        </div>
        <div>
          <h3 className="st-section__title">Préférences de voyage</h3>
          <p className="st-section__desc">Personnalisez vos préférences de trajet</p>
        </div>
      </div>

      <div className="st-card">
        <div className="st-form">
          <div className="st-form__row st-form__row--2">
            <div className="st-field">
              <label className="st-field__label" htmlFor="st-tp-seat">Siège préféré</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-bookmark-star st-field__icon" />
                <select
                  id="st-tp-seat"
                  className="st-field__select"
                  value={t.seatPreference || 'any'}
                  onChange={(e) => handleChange('seatPreference', e.target.value)}
                >
                  {seatOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="st-field">
              <label className="st-field__label" htmlFor="st-tp-luggage">Bagage habituel</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-bag st-field__icon" />
                <select
                  id="st-tp-luggage"
                  className="st-field__select"
                  value={t.luggage || 'medium'}
                  onChange={(e) => handleChange('luggage', e.target.value)}
                >
                  {luggageOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="st-toggle-list st-toggle-list--single">
            <div className="st-toggle-item">
              <div className="st-toggle-item__info">
                <span className="st-toggle-item__label">Climatisation</span>
                <span className="st-toggle-item__desc">Préférer les bus climatisés lorsque disponibles</span>
              </div>
              <button
                type="button"
                className={clsx('st-switch', t.airConditioning && 'st-switch--active')}
                onClick={() => handleChange('airConditioning', !t.airConditioning)}
                role="switch"
                aria-checked={t.airConditioning}
              >
                <span className="st-switch__knob" />
              </button>
            </div>
          </div>
        </div>

        <div className="st-card__placeholder-section">
          <div className="st-placeholder">
            <div className="st-placeholder__icon">
              <i className="bi bi-building" />
            </div>
            <div className="st-placeholder__text">
              <span className="st-placeholder__label">Compagnies favorites</span>
              <span className="st-placeholder__desc">Sélectionnez vos compagnies préférées pour des recommandations personnalisées</span>
            </div>
            <span className="st-badge st-badge--muted">Bientôt disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPreferences;
