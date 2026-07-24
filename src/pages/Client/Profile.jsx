import { useState, useCallback, Suspense } from 'react';
import DashboardLayout from '@components/client/DashboardLayout';
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
  const [formData, setFormData] = useState(() => ({ ...user }));
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

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
    <DashboardLayout>
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
    </DashboardLayout>
  );
};

const Profile = () => (
  <Suspense fallback={<ProfileSkeleton />}>
    <ProfilePage />
  </Suspense>
);

export default Profile;
