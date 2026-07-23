import { useState, useCallback, Suspense } from 'react';
import DbSidebar from '@components/client/DbSidebar';
import DbHeader from '@components/client/DbHeader';
import useAuth from '@hooks/useAuth';
import {
  ProfileHeader,
  ProfileCard,
  PersonalInformationForm,
  ContactInformationForm,
  AddressForm,
  SecurityCard,
  PreferencesCard,
  StatisticsCard,
  ProfileSkeleton,
} from '@components/profile';
import { defaultPreferences } from '@data/profileData';
import '@assets/styles/profile.css';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState(() => ({ ...user }));
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleProfileChange = useCallback((fieldUpdates) => {
    setFormData((prev) => ({ ...prev, ...fieldUpdates }));
    setHasChanges(true);
  }, []);

  const handlePreferenceChange = useCallback((fieldUpdates) => {
    setPreferences((prev) => ({ ...prev, ...fieldUpdates }));
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      updateProfile(formData);
      await new Promise((r) => setTimeout(r, 800));
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setPreferences(defaultPreferences);
    setHasChanges(false);
  };

  return (
    <div className="db-layout">
      <DbSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`db-layout__main ${sidebarCollapsed ? 'db-layout__main--collapsed' : ''}`}>
        <DbHeader onToggleSidebar={toggleSidebar} />
        <main className="db-layout__content pf-page">
          <ProfileHeader hasChanges={hasChanges} onSave={handleSave} saving={saving} />

          <div className="pf-layout">
            <div className="pf-layout__left">
              <ProfileCard user={formData} />
              <StatisticsCard user={user} />
            </div>

            <div className="pf-layout__right">
              <PersonalInformationForm user={formData} onChange={handleProfileChange} />
              <ContactInformationForm user={formData} onChange={handleProfileChange} />
              <AddressForm user={formData} onChange={handleProfileChange} />
              <PreferencesCard preferences={preferences} onChange={handlePreferenceChange} />
              <SecurityCard user={user} />

              <div className="pf-card">
                <div className="pf-actions">
                  <div className="pf-actions__left">
                    <button type="button" className="pf-btn pf-btn--download">
                      <i className="bi bi-download" />
                      Télécharger mes données
                    </button>
                    <button type="button" className="pf-btn pf-btn--danger">
                      <i className="bi bi-trash3" />
                      Supprimer mon compte
                    </button>
                  </div>
                  <div className="pf-actions__right">
                    <button type="button" className="pf-btn pf-btn--secondary" onClick={handleCancel}>
                      Annuler
                    </button>
                    <button
                      type="button"
                      className={`pf-btn pf-btn--primary ${!hasChanges ? '' : ''}`}
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
          </div>
        </main>
      </div>
    </div>
  );
};

const Profile = () => (
  <Suspense fallback={<ProfileSkeleton />}>
    <ProfilePage />
  </Suspense>
);

export default Profile;
