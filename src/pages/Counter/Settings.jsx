import { useState, useEffect, useCallback } from 'react';

import CounterAccountSettings from '@components/counter/CounterAccountSettings';
import CounterSecuritySettings from '@components/counter/CounterSecuritySettings';
import CounterNotificationSettings from '@components/counter/CounterNotificationSettings';
import CounterAppearanceSettings from '@components/counter/CounterAppearanceSettings';
import CounterLanguageSettings from '@components/counter/CounterLanguageSettings';
import CounterWorkPreferences from '@components/counter/CounterWorkPreferences';
import CounterPrivacySettings from '@components/counter/CounterPrivacySettings';
import CounterSessionsSettings from '@components/counter/CounterSessionsSettings';
import CounterAboutSettings from '@components/counter/CounterAboutSettings';

import {
  settingsSections,
  accountSettings,
  securitySettings,
  notificationSettings,
  appearanceSettings,
  languageSettings,
  workPreferences,
  privacySettings,
  sessions as initialSessions,
  aboutInfo,
  saveSettings,
  formatDate,
  formatTime,
} from '@data/counterSettingsData';
import '@assets/styles/counter-settings.css';

const TOAST_DURATION = 3500;

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState({
    account: accountSettings,
    security: securitySettings,
    notifications: notificationSettings,
    appearance: appearanceSettings,
    language: languageSettings,
    work: workPreferences,
    privacy: privacySettings,
  });
  const [sessions, setSessions] = useState(initialSessions);
  const [toasts, setToasts] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDataDownload, setShowDataDownload] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  const handleSettingChange = useCallback((section, key, value) => {
    setSettings((prev) => saveSettings(prev, section, { [key]: value }));
    addToast('Paramètre mis à jour', 'success');
  }, [addToast]);

  const handleToggle = useCallback((section, key) => {
    setSettings((prev) => {
      const current = prev[section][key];
      return saveSettings(prev, section, { [key]: !current });
    });
    addToast('Paramètre mis à jour', 'success');
  }, [addToast]);

  const handleTerminateSession = useCallback((sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    addToast('Session terminée', 'info');
  }, [addToast]);

  const handleTerminateAllOther = useCallback(() => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    addToast('Toutes les autres sessions ont été terminées', 'success');
  }, [addToast]);

  const handleDataDownload = useCallback(() => {
    setShowDataDownload(true);
  }, []);

  const confirmDataDownload = useCallback(() => {
    setSettings((prev) => saveSettings(prev, 'privacy', { dataDownloadRequested: new Date().toISOString() }));
    setShowDataDownload(false);
    addToast('Téléchargement de vos données démarré. Vous recevrez un email sous 48h.', 'success');
  }, [addToast]);

  const handleDeleteAccount = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const confirmDeleteAccount = useCallback(() => {
    setSettings((prev) => saveSettings(prev, 'privacy', { accountDeletionRequested: new Date().toISOString() }));
    setShowDeleteConfirm(false);
    addToast('Demande de suppression de compte envoyée. Un email de confirmation vous a été adressé.', 'warning');
  }, [addToast]);

  const handleSavePassword = useCallback(() => {
    setShowPasswordModal(false);
    setSettings((prev) => saveSettings(prev, 'security', { passwordLastChanged: new Date().toISOString().split('T')[0] }));
    addToast('Mot de passe modifié avec succès', 'success');
  }, [addToast]);

  const sectionComponents = {
    account: CounterAccountSettings,
    security: CounterSecuritySettings,
    notifications: CounterNotificationSettings,
    appearance: CounterAppearanceSettings,
    language: CounterLanguageSettings,
    work: CounterWorkPreferences,
    privacy: CounterPrivacySettings,
    sessions: CounterSessionsSettings,
    about: CounterAboutSettings,
  };

  const ActiveComponent = sectionComponents[activeSection];

  if (loading) {
    return (
      <div className="acs2-skeleton">
        <div className="acs2-skel-sidebar">
          <div className="acs2-skel-sidebar-item" />
          <div className="acs2-skel-sidebar-item" />
          <div className="acs2-skel-sidebar-item" />
          <div className="acs2-skel-sidebar-item" />
          <div className="acs2-skel-sidebar-item" />
          <div className="acs2-skel-sidebar-item" />
          <div className="acs2-skel-sidebar-item" />
          <div className="acs2-skel-sidebar-item" />
          <div className="acs2-skel-sidebar-item" />
        </div>
        <div className="acs2-skel-content">
          <div className="acs2-skel-title" />
          <div className="acs2-skel-field" />
          <div className="acs2-skel-field" />
          <div className="acs2-skel-field" />
          <div className="acs2-skel-field" />
          <div className="acs2-skel-field" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="acs2-wrapper">
        <aside className="acs2-sidebar">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              className={`acs2-sidebar-item${activeSection === section.id ? ' active' : ''}`}
              onClick={() => handleSectionChange(section.id)}
            >
              <i className={`bi ${section.icon}`} />
              <span>{section.label}</span>
            </button>
          ))}
        </aside>

        <div className="acs2-content">
          <ActiveComponent
            settings={settings[activeSection]}
            accountSettings={settings.account}
            securitySettings={settings.security}
            notificationSettings={settings.notifications}
            appearanceSettings={settings.appearance}
            languageSettings={settings.language}
            workPreferences={settings.work}
            privacySettings={settings.privacy}
            sessions={sessions}
            aboutInfo={aboutInfo}
            onChange={handleSettingChange}
            onToggle={handleToggle}
            onTerminateSession={handleTerminateSession}
            onTerminateAllOther={handleTerminateAllOther}
            onDataDownload={handleDataDownload}
            onDeleteAccount={handleDeleteAccount}
            onOpenPasswordModal={() => setShowPasswordModal(true)}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        </div>
      </div>

      {showPasswordModal && (
        <div className="acs2-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="acs2-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acs2-modal-header">
              <h3 className="acs2-modal-title">Changer le mot de passe</h3>
              <button className="acs2-modal-close" onClick={() => setShowPasswordModal(false)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="acs2-modal-body">
              <form className="acs2-password-form" onSubmit={(e) => { e.preventDefault(); handleSavePassword(); }}>
                <div className="acs2-form-group">
                  <label className="acs2-label">Mot de passe actuel</label>
                  <input type="password" className="acs2-input" required />
                </div>
                <div className="acs2-form-group">
                  <label className="acs2-label">Nouveau mot de passe</label>
                  <input type="password" className="acs2-input" required />
                </div>
                <div className="acs2-form-group">
                  <label className="acs2-label">Confirmer le nouveau mot de passe</label>
                  <input type="password" className="acs2-input" required />
                </div>
                <div className="acs2-modal-footer">
                  <button type="button" className="acs2-btn acs2-btn-secondary" onClick={() => setShowPasswordModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="acs2-btn acs2-btn-primary">
                    <i className="bi bi-check-lg" />
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="acs2-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="acs2-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acs2-modal-header">
              <h3 className="acs2-modal-title">Supprimer le compte</h3>
              <button className="acs2-modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="acs2-modal-body">
              <div className="acs2-confirm-icon danger">
                <i className="bi bi-exclamation-triangle-fill" />
              </div>
              <p className="acs2-confirm-text">
                Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                Êtes-vous sûr de vouloir continuer ?
              </p>
            </div>
            <div className="acs2-modal-footer">
              <button className="acs2-btn acs2-btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </button>
              <button className="acs2-btn acs2-btn-danger" onClick={confirmDeleteAccount}>
                <i className="bi bi-trash3-fill" />
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {showDataDownload && (
        <div className="acs2-overlay" onClick={() => setShowDataDownload(false)}>
          <div className="acs2-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acs2-modal-header">
              <h3 className="acs2-modal-title">Télécharger mes données</h3>
              <button className="acs2-modal-close" onClick={() => setShowDataDownload(false)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="acs2-modal-body">
              <div className="acs2-confirm-icon info">
                <i className="bi bi-download" />
              </div>
              <p className="acs2-confirm-text">
                Vous allez recevoir un fichier contenant l&apos;ensemble de vos données personnelles
                (informations de compte, historique de connexion, préférences).
                Un email vous sera envoyé sous 48 heures avec un lien de téléchargement sécurisé.
              </p>
            </div>
            <div className="acs2-modal-footer">
              <button className="acs2-btn acs2-btn-secondary" onClick={() => setShowDataDownload(false)}>
                Annuler
              </button>
              <button className="acs2-btn acs2-btn-primary" onClick={confirmDataDownload}>
                <i className="bi bi-check-lg" />
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {toasts.length > 0 && (
        <div className="acs2-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`acs2-toast acs2-toast--${toast.type}`}>
              <i className={`bi bi-${toast.type === 'success' ? 'check-circle-fill' : toast.type === 'warning' ? 'exclamation-triangle-fill' : toast.type === 'error' ? 'x-circle-fill' : 'info-circle-fill'}`} />
              <span>{toast.message}</span>
              <button className="acs2-toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SettingsPage;
