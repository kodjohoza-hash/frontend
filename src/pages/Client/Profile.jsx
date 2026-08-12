import { useState, useCallback, Suspense } from 'react';
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
  const { user, updateProfileAsync, changePasswordAsync } = useAuth();
  const [formData, setFormData] = useState(() => ({ ...user }));
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleProfileChange = useCallback((fieldUpdates) => { setFormData((prev) => ({ ...prev, ...fieldUpdates })); setHasChanges(true); }, []);
  const handlePreferenceChange = useCallback((fieldUpdates) => { setPreferences((prev) => ({ ...prev, ...fieldUpdates })); setHasChanges(true); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileAsync(formData);
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    await changePasswordAsync({ currentPassword, newPassword });
  };

  const handleCancel = () => { setFormData({ ...user }); setPreferences(defaultPreferences); setHasChanges(false); };

  return (
    <>
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
          <SecurityCard user={user} onChangePassword={handleChangePassword} />
          <div className="pf-card">
            <div className="pf-actions">
              <div className="pf-actions__left">
                <button type="button" className="pf-btn pf-btn--download"><i className="bi bi-download" /> Télécharger mes données</button>
                <button type="button" className="pf-btn pf-btn--danger"><i className="bi bi-trash3" /> Supprimer mon compte</button>
              </div>
              <div className="pf-actions__right">
                <button type="button" className="pf-btn pf-btn--secondary" onClick={handleCancel}>Annuler</button>
                <button type="button" className="pf-btn pf-btn--primary" onClick={handleSave} disabled={!hasChanges || saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Profile = () => (
  <Suspense fallback={<ProfileSkeleton />}>
    <ProfilePage />
  </Suspense>
);

export default Profile;
