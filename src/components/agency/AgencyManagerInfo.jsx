import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerInfoSchema } from '@schemas/settings.schema';

const roles = [
  'Directeur Général',
  'Directeur Commercial',
  "Directeur d'Exploitation",
  'Responsable Marketing',
  'Autre',
];

const AgencyManagerInfo = ({ data, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(managerInfoSchema),
    defaultValues: {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      phone: data.phone || '',
      email: data.email || '',
      role: data.role || '',
      photo: data.photo || null,
      signature: data.signature || null,
    },
  });

  const onSubmit = (formData) => {
    onSave(formData);
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h3 className="aset-section__title">
            <i className="bi bi-person-badge" /> Responsable
          </h3>
          <p className="aset-section__subtitle">
            Gérez les informations du responsable de la compagnie
          </p>
        </div>
      </div>

      <form className="aset-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="aset-manager-photo" style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '2.5rem',
              color: '#94a3b8',
              position: 'relative',
              overflow: 'hidden',
              border: '3px dashed var(--aset-border)',
            }}
          >
            <i className="bi bi-camera" />
            <input
              type="file"
              accept="image/*"
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              {...register('photo')}
            />
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: 8 }}>
            Photo du responsable
          </p>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">
              Nom <span className="aset-required">*</span>
            </label>
            <input
              className={`aset-form__input ${errors.lastName ? 'aset-form__input--error' : ''}`}
              {...register('lastName')}
            />
            {errors.lastName && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.lastName.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">
              Prénom <span className="aset-required">*</span>
            </label>
            <input
              className={`aset-form__input ${errors.firstName ? 'aset-form__input--error' : ''}`}
              {...register('firstName')}
            />
            {errors.firstName && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.firstName.message}
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
          <div className="aset-form__group aset-form__group--full">
            <label className="aset-form__label">
              Fonction <span className="aset-required">*</span>
            </label>
            <select
              className={`aset-form__select ${errors.role ? 'aset-form__input--error' : ''}`}
              {...register('role')}
            >
              <option value="">Sélectionnez une fonction</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.role.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group aset-form__group--full">
            <label className="aset-form__label">Signature numérique</label>
            <label className="aset-doc-upload">
              <div className="aset-doc-upload__icon">
                <i className="bi bi-file-earmark-image" />
              </div>
              <div className="aset-doc-upload__info">
                <div className="aset-doc-upload__name">Télécharger la signature</div>
                <div className="aset-doc-upload__hint">PNG, JPG • Max 2 Mo</div>
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                {...register('signature')}
              />
            </label>
            {errors.signature && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.signature.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-btn-group">
          <button type="button" className="aset-btn aset-btn--ghost" onClick={() => reset({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            email: data.email || '',
            role: data.role || '',
            photo: data.photo || null,
            signature: data.signature || null,
          })}>
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

export default AgencyManagerInfo;
