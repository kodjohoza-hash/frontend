import { useState } from 'react';
import clsx from 'clsx';
import { activeSessions } from '@data/settingsData';

const SecuritySettings = ({ user }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState({});

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const validatePassword = () => {
    const errs = {};
    if (!passwords.current) errs.current = 'Requis';
    if (!passwords.new) errs.new = 'Requis';
    else if (passwords.new.length < 8) errs.new = 'Min. 8 caractères';
    if (passwords.new !== passwords.confirm) errs.confirm = 'Ne correspondent pas';
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordSubmit = () => {
    if (validatePassword()) {
      setShowChangePassword(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordErrors({});
    }
  };

  return (
    <div className="st-section">
      <div className="st-section__header">
        <div className="st-section__icon st-section__icon--danger">
          <i className="bi bi-key" />
        </div>
        <div>
          <h3 className="st-section__title">Sécurité</h3>
          <p className="st-section__desc">Protégez votre compte et vos données</p>
        </div>
      </div>

      <div className="st-card">
        <div className="st-security__items">
          <div className="st-security__item">
            <div className="st-security__item-left">
              <div className="st-security__item-icon">
                <i className="bi bi-key" />
              </div>
              <div className="st-security__item-info">
                <span className="st-security__item-label">Mot de passe</span>
                <span className="st-security__item-value">
                  Dernière modification : {formatDateTime(user?.lastPasswordChange || '2026-04-15T10:00:00')}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="st-btn st-btn--outline"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              <i className="bi bi-pencil" />
              Modifier
            </button>
          </div>

          {showChangePassword && (
            <div className="st-security__password-form">
              <div className={clsx('st-field', passwordErrors.current && 'st-field--error')}>
                <label className="st-field__label" htmlFor="st-cur-pw">Mot de passe actuel</label>
                <div className="st-field__input-wrapper">
                  <i className="bi bi-lock st-field__icon" />
                  <input
                    id="st-cur-pw"
                    type="password"
                    className="st-field__input"
                    placeholder="••••••••"
                    value={passwords.current}
                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                  />
                </div>
                {passwordErrors.current && <span className="st-field__error">{passwordErrors.current}</span>}
              </div>
              <div className={clsx('st-field', passwordErrors.new && 'st-field--error')}>
                <label className="st-field__label" htmlFor="st-new-pw">Nouveau mot de passe</label>
                <div className="st-field__input-wrapper">
                  <i className="bi bi-key st-field__icon" />
                  <input
                    id="st-new-pw"
                    type="password"
                    className="st-field__input"
                    placeholder="Min. 8 caractères"
                    value={passwords.new}
                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                  />
                </div>
                {passwordErrors.new && <span className="st-field__error">{passwordErrors.new}</span>}
              </div>
              <div className={clsx('st-field', passwordErrors.confirm && 'st-field--error')}>
                <label className="st-field__label" htmlFor="st-confirm-pw">Confirmer</label>
                <div className="st-field__input-wrapper">
                  <i className="bi bi-lock st-field__icon" />
                  <input
                    id="st-confirm-pw"
                    type="password"
                    className="st-field__input"
                    placeholder="Retapez"
                    value={passwords.confirm}
                    onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                  />
                </div>
                {passwordErrors.confirm && <span className="st-field__error">{passwordErrors.confirm}</span>}
              </div>
              <div className="st-security__password-actions">
                <button type="button" className="st-btn st-btn--outline" onClick={() => setShowChangePassword(false)}>
                  Annuler
                </button>
                <button type="button" className="st-btn st-btn--primary" onClick={handlePasswordSubmit}>
                  Mettre à jour
                </button>
              </div>
            </div>
          )}

          <div className="st-security__item">
            <div className="st-security__item-left">
              <div className="st-security__item-icon st-security__item-icon--warning">
                <i className="bi bi-shield-check" />
              </div>
              <div className="st-security__item-info">
                <div className="st-toggle-item__label-row">
                  <span className="st-security__item-label">Double authentification</span>
                  <span className="st-badge st-badge--muted">Bientôt</span>
                </div>
                <span className="st-security__item-value">Protection supplémentaire pour votre compte</span>
              </div>
            </div>
            <div className="st-switch st-switch--disabled">
              <span className="st-switch__knob" />
            </div>
          </div>

          <div className="st-security__divider" />

          <div className="st-security__item">
            <div className="st-security__item-left">
              <div className="st-security__item-icon st-security__item-icon--info">
                <i className="bi bi-clock-history" />
              </div>
              <div className="st-security__item-info">
                <span className="st-security__item-label">Dernière connexion</span>
                <span className="st-security__item-value">
                  {formatDateTime(activeSessions[0]?.lastActive)} — {activeSessions[0]?.device}
                </span>
              </div>
            </div>
          </div>

          <div className="st-security__item">
            <div className="st-security__item-left">
              <div className="st-security__item-icon st-security__item-icon--muted">
                <i className="bi bi-globe" />
              </div>
              <div className="st-security__item-info">
                <span className="st-security__item-label">Adresse IP</span>
                <span className="st-security__item-value">{activeSessions[0]?.ip}</span>
              </div>
            </div>
          </div>

          <div className="st-security__divider" />

          <div className="st-security__item">
            <div className="st-security__item-left">
              <div className="st-security__item-icon st-security__item-icon--danger">
                <i className="bi bi-box-arrow-right" />
              </div>
              <div className="st-security__item-info">
                <span className="st-security__item-label">Déconnecter toutes les autres sessions</span>
                <span className="st-security__item-value">
                  {activeSessions.filter((s) => !s.current).length} autre(s) session(s) active(s)
                </span>
              </div>
            </div>
            <button type="button" className="st-btn st-btn--danger-outline">
              Déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
