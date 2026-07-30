import { useState } from 'react';
import clsx from 'clsx';
import { formatDate } from '@data/counterSettingsData';

const PASSWORD_HISTORY = [
  { date: '2026-04-15T10:00:00', label: 'Modification du mot de passe' },
  { date: '2025-12-01T08:30:00', label: 'Modification du mot de passe' },
  { date: '2025-07-20T14:00:00', label: 'Création du compte' },
];

const CounterSecuritySettings = ({ settings, onSave }) => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [twoFactor, setTwoFactor] = useState(settings?.twoFactorEnabled ?? false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    onSave?.({ ...form, twoFactorEnabled: twoFactor });
  };

  const PASSWORD_FIELDS = [
    { name: 'currentPassword', label: 'Mot de passe actuel', showKey: 'current' },
    { name: 'newPassword', label: 'Nouveau mot de passe', showKey: 'new' },
    { name: 'confirmPassword', label: 'Confirmer le mot de passe', showKey: 'confirm' },
  ];

  return (
    <div className="acs2-card">
      <div className="acs2-card__header">
        <i className="bi bi-shield-lock acs2-card__header-icon acs2-card__header-icon--accent" />
        <span>Sécurité</span>
      </div>

      <div className="acs2-card__subtitle">
        <i className="bi bi-key" />
        Changer le mot de passe
      </div>
      <div className="acs2-security__password-form">
        {PASSWORD_FIELDS.map((field) => (
          <div key={field.name} className="acs2-field">
            <label className="acs2-field__label">{field.label}</label>
            <div className="acs2-field__input-wrapper">
              <input
                type={show[field.showKey] ? 'text' : 'password'}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="acs2-field__input"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="acs2-field__toggle-vis"
                onClick={() => toggleShow(field.showKey)}
                tabIndex={-1}
              >
                <i className={clsx('bi', show[field.showKey] ? 'bi-eye-slash' : 'bi-eye')} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="acs2-card__subtitle">
        <i className="bi bi-shield-check" />
        Authentification à deux facteurs (2FA)
      </div>
      <div className="acs2-toggle-row">
        <div className="acs2-toggle-row__info">
          <span className="acs2-toggle-row__label">Activer l'authentification à deux facteurs</span>
          <span className="acs2-toggle-row__desc">
            Renforcez la sécurité de votre compte avec une vérification en deux étapes
          </span>
        </div>
        <button
          type="button"
          className={clsx('acs2-switch', { 'acs2-switch--active': twoFactor })}
          onClick={() => setTwoFactor(!twoFactor)}
          aria-label="Activer l'authentification à deux facteurs"
        >
          <span className="acs2-switch__knob" />
        </button>
      </div>

      <div className="acs2-card__subtitle">
        <i className="bi bi-question-circle" />
        Question de sécurité
      </div>
      <div className="acs2-placeholder">
        <div className="acs2-placeholder__icon">
          <i className="bi bi-lock" />
        </div>
        <div className="acs2-placeholder__text">
          <span className="acs2-placeholder__label">Bientôt disponible</span>
          <span className="acs2-placeholder__desc">
            La configuration des questions de sécurité sera disponible prochainement
          </span>
        </div>
      </div>

      <div className="acs2-card__subtitle">
        <i className="bi bi-clock-history" />
        Historique des modifications
      </div>
      <div className="acs2-timeline">
        {PASSWORD_HISTORY.map((entry, i) => (
          <div key={i} className="acs2-timeline__item">
            <div className="acs2-timeline__dot" />
            <div className="acs2-timeline__content">
              <span className="acs2-timeline__label">{entry.label}</span>
              <span className="acs2-timeline__date">{formatDate(entry.date)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="acs2-card__actions">
        <button className="acs2-btn acs2-btn--primary" onClick={handleSave}>
          <i className="bi bi-check-lg" />
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default CounterSecuritySettings;
