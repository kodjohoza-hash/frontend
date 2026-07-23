import { useState, useCallback, Suspense } from 'react';
import DbSidebar from '@components/client/DbSidebar';
import DbHeader from '@components/client/DbHeader';
import useAuth from '@hooks/useAuth';
import {
  SettingsTabs,
  GeneralSettings,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  AppearanceSettings,
  LanguageSettings,
  TravelPreferences,
  ActiveSessions,
  SettingsSkeleton,
} from '@components/settings';
import { defaultSettings } from '@data/settingsData';
import '@assets/styles/settings.css';

const SettingsPage = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleSettingChange = useCallback((update) => {
    setSettings((prev) => {
      const key = Object.keys(update)[0];
      const currentSection = prev[key] || {};
      const newSection = typeof update[key] === 'object' && !Array.isArray(update[key])
        ? { ...currentSection, ...update[key] }
        : update[key];
      return { ...prev, [key]: newSection };
    });
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
  };

  const handleRestoreDefaults = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings settings={settings} onChange={handleSettingChange} />;
      case 'notifications':
        return <NotificationSettings settings={settings} onChange={handleSettingChange} />;
      case 'privacy':
        return <PrivacySettings settings={settings} onChange={handleSettingChange} />;
      case 'security':
        return <SecuritySettings user={user} />;
      case 'appearance':
        return <AppearanceSettings settings={settings} onChange={handleSettingChange} />;
      case 'language':
        return <LanguageSettings settings={settings} onChange={handleSettingChange} />;
      case 'travel':
        return <TravelPreferences settings={settings} onChange={handleSettingChange} />;
      case 'sessions':
        return <ActiveSessions />;
      default:
        return <GeneralSettings settings={settings} onChange={handleSettingChange} />;
    }
  };

  return (
    <div className="db-layout">
      <DbSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`db-layout__main ${sidebarCollapsed ? 'db-layout__main--collapsed' : ''}`}>
        <DbHeader onToggleSidebar={toggleSidebar} />
        <main className="db-layout__content st-page">
          <div className="st-page__header">
            <div className="st-page__title-group">
              <h1 className="st-page__title">Paramètres</h1>
              <p className="st-page__subtitle">Personnalisez votre expérience BUS TIX CONNECT.</p>
            </div>
            <div className="st-page__actions">
              <button
                type="button"
                className="st-page__save"
                onClick={handleSave}
                disabled={!hasChanges || saving}
              >
                {saving ? (
                  <>
                    <i className="bi bi-arrow-repeat st-page__save-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="st-layout">
            <div className="st-layout__sidebar">
              <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="st-layout__content">
              {renderTab()}

              <div className="st-actions">
                <div className="st-actions__group">
                  <button type="button" className="st-btn st-btn--secondary" onClick={handleReset}>
                    <i className="bi bi-arrow-counterclockwise" />
                    Réinitialiser
                  </button>
                  <button type="button" className="st-btn st-btn--secondary" onClick={handleRestoreDefaults}>
                    <i className="bi bi-arrow-return-left" />
                    Restaurer les défauts
                  </button>
                </div>
                <div className="st-actions__group">
                  <button
                    type="button"
                    className="st-btn st-btn--primary"
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    style={!hasChanges ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const Settings = () => (
  <Suspense fallback={<SettingsSkeleton />}>
    <SettingsPage />
  </Suspense>
);

export default Settings;
