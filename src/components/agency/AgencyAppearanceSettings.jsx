import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appearanceSchema } from '@schemas/settings.schema';

const AgencyAppearanceSettings = ({ data, onSave }) => {
  const [primaryColor, setPrimaryColor] = useState(data.primaryColor || '#0B1D51');
  const [secondaryColor, setSecondaryColor] = useState(data.secondaryColor || '#FF6B35');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      primaryColor: data.primaryColor || '#0B1D51',
      secondaryColor: data.secondaryColor || '#FF6B35',
      logoLight: data.logoLight || null,
      logoDark: data.logoDark || null,
      favicon: data.favicon || null,
      coverImage: data.coverImage || null,
    },
  });

  const onSubmit = (formData) => {
    onSave({ ...formData, primaryColor, secondaryColor });
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h3 className="aset-section__title">
            <i className="bi bi-palette" /> Apparence
          </h3>
          <p className="aset-section__subtitle">
            Personnalisez l&apos;apparence de votre plateforme
          </p>
        </div>
      </div>

      <form className="aset-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Couleur principale</label>
            <div className="aset-color-picker">
              <div className="aset-color-picker__swatch" style={{ background: primaryColor }}>
                <input
                  type="color"
                  className="aset-color-picker__input"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  {...register('primaryColor', {
                    onChange: (e) => setPrimaryColor(e.target.value),
                  })}
                />
              </div>
              <span className="aset-color-picker__value">{primaryColor}</span>
            </div>
            {errors.primaryColor && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.primaryColor.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Couleur secondaire</label>
            <div className="aset-color-picker">
              <div className="aset-color-picker__swatch" style={{ background: secondaryColor }}>
                <input
                  type="color"
                  className="aset-color-picker__input"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  {...register('secondaryColor', {
                    onChange: (e) => setSecondaryColor(e.target.value),
                  })}
                />
              </div>
              <span className="aset-color-picker__value">{secondaryColor}</span>
            </div>
            {errors.secondaryColor && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.secondaryColor.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Logo clair</label>
            <label className="aset-doc-upload">
              <div className="aset-doc-upload__icon">
                <i className="bi bi-sun" />
              </div>
              <div className="aset-doc-upload__info">
                <div className="aset-doc-upload__name">Logo pour fond sombre</div>
                <div className="aset-doc-upload__hint">PNG, SVG • Max 5 Mo</div>
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} {...register('logoLight')} />
            </label>
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Logo sombre</label>
            <label className="aset-doc-upload">
              <div className="aset-doc-upload__icon">
                <i className="bi bi-moon" />
              </div>
              <div className="aset-doc-upload__info">
                <div className="aset-doc-upload__name">Logo pour fond clair</div>
                <div className="aset-doc-upload__hint">PNG, SVG • Max 5 Mo</div>
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} {...register('logoDark')} />
            </label>
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Favicon</label>
            <label className="aset-doc-upload">
              <div className="aset-doc-upload__icon">
                <i className="bi bi-filetype-ico" />
              </div>
              <div className="aset-doc-upload__info">
                <div className="aset-doc-upload__name">Icône de navigateur</div>
                <div className="aset-doc-upload__hint">ICO, PNG 32x32</div>
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} {...register('favicon')} />
            </label>
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Image de couverture</label>
            <label className="aset-doc-upload">
              <div className="aset-doc-upload__icon">
                <i className="bi bi-image" />
              </div>
              <div className="aset-doc-upload__info">
                <div className="aset-doc-upload__name">Bannière de la plateforme</div>
                <div className="aset-doc-upload__hint">PNG, JPG • Max 10 Mo</div>
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} {...register('coverImage')} />
            </label>
          </div>
        </div>

        <div className="aset-preview">
          <div className="aset-preview__header">
            <i className="bi bi-eye" /> Aperçu en direct
          </div>
          <div className="aset-preview__body">
            <div className="aset-preview__navbar" style={{ background: primaryColor, color: '#fff' }}>
              <div className="aset-preview__brand">
                <div className="aset-preview__brand-logo">BTC</div>
                Bus Tix Connect
              </div>
              <div className="aset-preview__btn" style={{ background: secondaryColor, color: '#fff' }}>
                Réserver
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div className="aset-preview__card">
                <div className="aset-preview__card-line" style={{ background: primaryColor, width: '60%' }} />
                <div className="aset-preview__card-line" style={{ background: '#e2e8f0', width: '80%' }} />
                <div className="aset-preview__card-line" style={{ background: '#e2e8f0', width: '40%' }} />
              </div>
              <div className="aset-preview__card">
                <div className="aset-preview__card-line" style={{ background: secondaryColor, width: '50%' }} />
                <div className="aset-preview__card-line" style={{ background: '#e2e8f0', width: '70%' }} />
                <div className="aset-preview__card-line" style={{ background: '#e2e8f0', width: '45%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="aset-btn-group">
          <button
            type="button"
            className="aset-btn aset-btn--ghost"
            onClick={() => {
              reset({
                primaryColor: data.primaryColor || '#0B1D51',
                secondaryColor: data.secondaryColor || '#FF6B35',
                logoLight: data.logoLight || null,
                logoDark: data.logoDark || null,
                favicon: data.favicon || null,
                coverImage: data.coverImage || null,
              });
              setPrimaryColor(data.primaryColor || '#0B1D51');
              setSecondaryColor(data.secondaryColor || '#FF6B35');
            }}
          >
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

export default AgencyAppearanceSettings;
