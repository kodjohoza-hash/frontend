import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generalInfoSchema } from '@schemas/settings.schema';

function mapDataToDefaults(data) {
  return {
    name: data.name || '',
    slogan: data.slogan || '',
    email: data.email || '',
    phone: data.phone || '',
    website: data.website || '',
    address: data.address || '',
    city: data.city || '',
    country: data.country || '',
    gpsLat: data.gpsLat || '',
    gpsLng: data.gpsLng || '',
    hours: {
      weekdayOpen: data.hours?.weekdays?.open || '',
      weekdayClose: data.hours?.weekdays?.close || '',
      weekendOpen: data.hours?.weekends?.open || '',
      weekendClose: data.hours?.weekends?.close || '',
    },
    description: data.description || '',
  };
}

function mapFormToOutput(formData) {
  return {
    ...formData,
    hours: {
      weekdays: { open: formData.hours.weekdayOpen, close: formData.hours.weekdayClose },
      weekends: { open: formData.hours.weekendOpen, close: formData.hours.weekendClose },
    },
  };
}

const AgencyGeneralSettings = ({ data, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: mapDataToDefaults(data),
  });

  const onSubmit = (formData) => {
    onSave(mapFormToOutput(formData));
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h3 className="aset-section__title">
            <i className="bi bi-building" /> Informations générales
          </h3>
          <p className="aset-section__subtitle">
            Modifiez les informations de votre compagnie
          </p>
        </div>
      </div>

      <form className="aset-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="aset-form__row">
          <div className="aset-form__group aset-form__group--full">
            <label className="aset-form__label">
              Nom de la compagnie <span className="aset-required">*</span>
            </label>
            <input
              className={`aset-form__input ${errors.name ? 'aset-form__input--error' : ''}`}
              {...register('name')}
            />
            {errors.name && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.name.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Slogan</label>
            <input
              className={`aset-form__input ${errors.slogan ? 'aset-form__input--error' : ''}`}
              {...register('slogan')}
            />
            {errors.slogan && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.slogan.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">
              Email <span className="aset-required">*</span>
            </label>
            <input
              className={`aset-form__input ${errors.email ? 'aset-form__input--error' : ''}`}
              {...register('email')}
            />
            {errors.email && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.email.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">
              Téléphone <span className="aset-required">*</span>
            </label>
            <input
              className={`aset-form__input ${errors.phone ? 'aset-form__input--error' : ''}`}
              {...register('phone')}
            />
            {errors.phone && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.phone.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Site Web</label>
            <input
              className={`aset-form__input ${errors.website ? 'aset-form__input--error' : ''}`}
              {...register('website')}
            />
            {errors.website && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.website.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group aset-form__group--full">
            <label className="aset-form__label">Adresse</label>
            <input
              className={`aset-form__input ${errors.address ? 'aset-form__input--error' : ''}`}
              {...register('address')}
            />
            {errors.address && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.address.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">
              Ville <span className="aset-required">*</span>
            </label>
            <input
              className={`aset-form__input ${errors.city ? 'aset-form__input--error' : ''}`}
              {...register('city')}
            />
            {errors.city && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.city.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">
              Pays <span className="aset-required">*</span>
            </label>
            <input
              className={`aset-form__input ${errors.country ? 'aset-form__input--error' : ''}`}
              {...register('country')}
            />
            {errors.country && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.country.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Coordonnées GPS — Latitude</label>
            <input
              className={`aset-form__input ${errors.gpsLat ? 'aset-form__input--error' : ''}`}
              {...register('gpsLat')}
            />
            {errors.gpsLat && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.gpsLat.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Coordonnées GPS — Longitude</label>
            <input
              className={`aset-form__input ${errors.gpsLng ? 'aset-form__input--error' : ''}`}
              {...register('gpsLng')}
            />
            {errors.gpsLng && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.gpsLng.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Horaires semaine — Ouverture</label>
            <input
              type="time"
              className={`aset-form__input ${errors.hours?.weekdayOpen ? 'aset-form__input--error' : ''}`}
              {...register('hours.weekdayOpen')}
            />
            {errors.hours?.weekdayOpen && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.hours.weekdayOpen.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Horaires semaine — Fermeture</label>
            <input
              type="time"
              className={`aset-form__input ${errors.hours?.weekdayClose ? 'aset-form__input--error' : ''}`}
              {...register('hours.weekdayClose')}
            />
            {errors.hours?.weekdayClose && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.hours.weekdayClose.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Horaires week-end — Ouverture</label>
            <input
              type="time"
              className={`aset-form__input ${errors.hours?.weekendOpen ? 'aset-form__input--error' : ''}`}
              {...register('hours.weekendOpen')}
            />
            {errors.hours?.weekendOpen && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.hours.weekendOpen.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Horaires week-end — Fermeture</label>
            <input
              type="time"
              className={`aset-form__input ${errors.hours?.weekendClose ? 'aset-form__input--error' : ''}`}
              {...register('hours.weekendClose')}
            />
            {errors.hours?.weekendClose && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.hours.weekendClose.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group aset-form__group--full">
            <label className="aset-form__label">Description</label>
            <textarea
              className={`aset-form__textarea ${errors.description ? 'aset-form__input--error' : ''}`}
              rows={4}
              {...register('description')}
            />
            {errors.description && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.description.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-btn-group">
          <button type="button" className="aset-btn aset-btn--ghost" onClick={() => reset(mapDataToDefaults(data))}>
            <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
          </button>
          <button type="submit" className="aset-btn aset-btn--primary">
            <i className="bi bi-check-lg" /> Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgencyGeneralSettings;
