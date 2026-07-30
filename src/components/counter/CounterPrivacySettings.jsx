import { useState } from 'react';
import clsx from 'clsx';

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', desc: 'Visible par tous les utilisateurs', icon: 'bi-globe2' },
  { value: 'interne', label: 'Interne', desc: 'Visible uniquement par les membres de l\'agence', icon: 'bi-people' },
  { value: 'prive', label: 'Privé', desc: 'Visible par vous uniquement', icon: 'bi-lock' },
];

const CounterPrivacySettings = ({ settings, onChange }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!settings) return null;

  const handleChange = (key, value) => {
    onChange?.({ ...settings, [key]: value });
  };

  return (
    <div className="acs2-card">
      <div className="acs2-card__header">
        <i className="bi bi-shield-lock acs2-card__header-icon acs2-card__header-icon--accent" />
        <span>Confidentialité</span>
      </div>

      <div className="acs2-card__subtitle">
        <i className="bi bi-eye" />
        Visibilité du profil
      </div>
      <div className="acs2-radio-group acs2-radio-group--cards">
        {VISIBILITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={clsx('acs2-radio-card', {
              'acs2-radio-card--active': settings.profileVisibility === opt.value,
            })}
            onClick={() => handleChange('profileVisibility', opt.value)}
          >
            <i className={clsx('bi', opt.icon, 'acs2-radio-card__icon')} />
            <span className="acs2-radio-card__label">{opt.label}</span>
            <span className="acs2-radio-card__desc">{opt.desc}</span>
          </button>
        ))}
      </div>

      <div className="acs2-toggle-row">
        <div className="acs2-toggle-row__info">
          <span className="acs2-toggle-row__label">Partager mes informations</span>
          <span className="acs2-toggle-row__desc">
            Autoriser le partage de vos données avec les partenaires
          </span>
        </div>
        <button
          type="button"
          className={clsx('acs2-switch', { 'acs2-switch--active': settings.shareInformation })}
          onClick={() => handleChange('shareInformation', !settings.shareInformation)}
          aria-label="Partager mes informations"
        >
          <span className="acs2-switch__knob" />
        </button>
      </div>

      <div className="acs2-toggle-row">
        <div className="acs2-toggle-row__info">
          <span className="acs2-toggle-row__label">Gestion des consentements</span>
          <span className="acs2-toggle-row__desc">
            Gérer vos préférences de consentement pour le traitement des données
          </span>
        </div>
        <button
          type="button"
          className={clsx('acs2-switch', { 'acs2-switch--active': settings.consentManagement })}
          onClick={() => handleChange('consentManagement', !settings.consentManagement)}
          aria-label="Gestion des consentements"
        >
          <span className="acs2-switch__knob" />
        </button>
      </div>

      <div className="acs2-separator" />

      <div className="acs2-card__actions acs2-card__actions--column">
        <button className="acs2-btn acs2-btn--outline">
          <i className="bi bi-download" />
          Télécharger mes données
        </button>
        {!showDeleteConfirm ? (
          <button
            className="acs2-btn acs2-btn--danger-outline"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <i className="bi bi-trash" />
            Demander la suppression du compte
          </button>
        ) : (
          <div className="acs2-confirm">
            <span className="acs2-confirm__text">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </span>
            <div className="acs2-confirm__actions">
              <button
                className="acs2-btn acs2-btn--sm acs2-btn--danger"
                onClick={() => handleChange('deleteRequested', true)}
              >
                Confirmer la suppression
              </button>
              <button
                className="acs2-btn acs2-btn--sm acs2-btn--secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterPrivacySettings;
