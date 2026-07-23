import { useState } from 'react';
import clsx from 'clsx';
import { securityInfo } from '@data/profileData';

const SecurityCard = ({ user }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
    if (!passwords.current) errs.current = 'Mot de passe actuel requis';
    if (!passwords.new) errs.new = 'Nouveau mot de passe requis';
    else if (passwords.new.length < 8) errs.new = 'Minimum 8 caractères';
    if (passwords.new !== passwords.confirm) errs.confirm = 'Les mots de passe ne correspondent pas';
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
    <div className="pf-card pf-card--security">
      <div className="pf-card__header">
        <div className="pf-card__header-icon pf-card__header-icon--danger">
          <i className="bi bi-shield-lock" />
        </div>
        <span className="pf-card__header-label">Sécurité</span>
      </div>

      <div className="pf-security__items">
        <div className="pf-security__item">
          <div className="pf-security__item-left">
            <div className="pf-security__item-icon">
              <i className="bi bi-key" />
            </div>
            <div className="pf-security__item-info">
              <span className="pf-security__item-label">Mot de passe</span>
              <span className="pf-security__item-value">
                Dernière modification il y a 3 mois
              </span>
            </div>
          </div>
          <button
            type="button"
            className="pf-security__item-btn"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            <i className="bi bi-pencil" />
            Modifier
          </button>
        </div>

        {showChangePassword && (
          <div className="pf-security__password-form">
            <div className={clsx('pf-field', passwordErrors.current && 'pf-field--error')}>
              <label className="pf-field__label" htmlFor="currentPassword">Mot de passe actuel</label>
              <div className="pf-field__input-wrapper">
                <i className="bi bi-lock pf-field__icon" />
                <input
                  id="currentPassword"
                  type="password"
                  className="pf-field__input"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(e) => handlePasswordChange('current', e.target.value)}
                />
              </div>
              {passwordErrors.current && <span className="pf-field__error">{passwordErrors.current}</span>}
            </div>

            <div className={clsx('pf-field', passwordErrors.new && 'pf-field--error')}>
              <label className="pf-field__label" htmlFor="newPassword">Nouveau mot de passe</label>
              <div className="pf-field__input-wrapper">
                <i className="bi bi-key pf-field__icon" />
                <input
                  id="newPassword"
                  type="password"
                  className="pf-field__input"
                  placeholder="Minimum 8 caractères"
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange('new', e.target.value)}
                />
              </div>
              {passwordErrors.new && <span className="pf-field__error">{passwordErrors.new}</span>}
            </div>

            <div className={clsx('pf-field', passwordErrors.confirm && 'pf-field--error')}>
              <label className="pf-field__label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <div className="pf-field__input-wrapper">
                <i className="bi bi-lock pf-field__icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  className="pf-field__input"
                  placeholder="Retapez le mot de passe"
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                />
              </div>
              {passwordErrors.confirm && <span className="pf-field__error">{passwordErrors.confirm}</span>}
            </div>

            <div className="pf-security__password-actions">
              <button type="button" className="pf-btn pf-btn--secondary" onClick={() => setShowChangePassword(false)}>
                Annuler
              </button>
              <button type="button" className="pf-btn pf-btn--primary" onClick={handlePasswordSubmit}>
                Mettre à jour
              </button>
            </div>
          </div>
        )}

        <div className="pf-security__item">
          <div className="pf-security__item-left">
            <div className="pf-security__item-icon pf-security__item-icon--warning">
              <i className="bi bi-shield-check" />
            </div>
            <div className="pf-security__item-info">
              <span className="pf-security__item-label">Authentification à deux facteurs</span>
              <span className="pf-security__item-value">
                {securityInfo.twoFactorEnabled ? 'Activée' : 'Non activée'}
              </span>
            </div>
          </div>
          <div className={clsx(
            'pf-security__toggle',
            securityInfo.twoFactorEnabled && 'pf-security__toggle--active'
          )}>
            <div className="pf-security__toggle-knob" />
          </div>
        </div>

        <div className="pf-security__divider" />

        <div className="pf-security__item">
          <div className="pf-security__item-left">
            <div className="pf-security__item-icon pf-security__item-icon--info">
              <i className="bi bi-clock-history" />
            </div>
            <div className="pf-security__item-info">
              <span className="pf-security__item-label">Dernière connexion</span>
              <span className="pf-security__item-value">
                {formatDateTime(securityInfo.lastLogin)} — {securityInfo.lastLoginDevice}
              </span>
            </div>
          </div>
        </div>

        <div className="pf-security__item">
          <div className="pf-security__item-left">
            <div className="pf-security__item-icon pf-security__item-icon--success">
              <i className="bi bi-laptop" />
            </div>
            <div className="pf-security__item-info">
              <span className="pf-security__item-label">Appareils connectés</span>
              <span className="pf-security__item-value">
                {securityInfo.connectedDevices.length} appareil{securityInfo.connectedDevices.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <button type="button" className="pf-security__item-btn">
            Gérer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityCard;
