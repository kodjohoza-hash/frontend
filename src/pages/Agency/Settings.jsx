import { useState, useCallback } from 'react';
import { companySettings, settingsSidebarItems } from '@data/settingsData';
import AgencySettingsLayout from '@components/agency/AgencySettingsLayout';
import AgencySettingsSkeleton from '@components/agency/AgencySettingsSkeleton';
import AgencySettingsConfirm from '@components/agency/AgencySettingsConfirm';
import { useToast } from '@components/agency/AgencySettingsToast';
import AgencyGeneralSettings from '@components/agency/AgencyGeneralSettings';
import AgencyManagerInfo from '@components/agency/AgencyManagerInfo';
import AgencyAppearanceSettings from '@components/agency/AgencyAppearanceSettings';
import AgencyPaymentSettings from '@components/agency/AgencyPaymentSettings';
import AgencyReservationSettings from '@components/agency/AgencyReservationSettings';
import AgencyNotificationSettings from '@components/agency/AgencyNotificationSettings';
import AgencySecuritySettings from '@components/agency/AgencySecuritySettings';
import AgencyRegionalSettings from '@components/agency/AgencyRegionalSettings';
import AgencyDocumentSettings from '@components/agency/AgencyDocumentSettings';
import AgencyIntegrationSettings from '@components/agency/AgencyIntegrationSettings';

const SECTION_COMPONENTS = {
  general: AgencyGeneralSettings,
  manager: AgencyManagerInfo,
  appearance: AgencyAppearanceSettings,
  payments: AgencyPaymentSettings,
  reservations: AgencyReservationSettings,
  notifications: AgencyNotificationSettings,
  security: AgencySecuritySettings,
  regional: AgencyRegionalSettings,
  documents: AgencyDocumentSettings,
  integrations: AgencyIntegrationSettings,
};

const SECTION_DATA_KEYS = {
  general: 'general',
  manager: 'manager',
  appearance: 'appearance',
  payments: 'payments',
  reservations: 'reservations',
  notifications: 'notifications',
  security: 'security',
  regional: 'regional',
  documents: 'documents',
  integrations: 'integrations',
};

export default function AgencySettings() {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [confirm, setConfirm] = useState(null);
  const [settings, setSettings] = useState(companySettings);
  const { addToast } = useToast();

  const handleSave = useCallback((sectionKey, data) => {
    setConfirm({
      title: 'Enregistrer les modifications',
      message: 'Êtes-vous sûr de vouloir enregistrer les modifications ?',
      type: 'warning',
      confirmLabel: 'Enregistrer',
      onConfirm: () => {
        setConfirm(null);
        setLoading(true);
        setSettings((prev) => ({ ...prev, [sectionKey]: data }));
        setTimeout(() => {
          setLoading(false);
          addToast('Modifications enregistrées avec succès', 'success');
        }, 800);
      },
    });
  }, [addToast]);

  const handleReset = useCallback((sectionKey) => {
    setConfirm({
      title: 'Réinitialiser',
      message: 'Voulez-vous vraiment réinitialiser cette section ? Les modifications non sauvegardées seront perdues.',
      type: 'danger',
      confirmLabel: 'Réinitialiser',
      onConfirm: () => {
        setConfirm(null);
        setSettings((prev) => ({ ...prev, [sectionKey]: companySettings[sectionKey] }));
        addToast('Section réinitialisée', 'warning');
      },
    });
  }, [addToast]);

  const handleSectionChange = useCallback((id) => {
    setConfirm({
      title: 'Changer de section',
      message: 'Vous avez des modifications non enregistrées. Voulez-vous vraiment changer de section ?',
      type: 'warning',
      confirmLabel: 'Quitter',
      onConfirm: () => {
        setConfirm(null);
        setActiveSection(id);
      },
      onCancel: () => setConfirm(null),
    });
  }, []);

  if (loading) {
    return <AgencySettingsSkeleton />;
  }

  const SectionComponent = SECTION_COMPONENTS[activeSection];
  const dataKey = SECTION_DATA_KEYS[activeSection];
  const sectionData = settings[dataKey];

  const sectionDataForNotifications = activeSection === 'notifications'
    ? { channels: settings.notifications, events: companySettings.notificationEvents || [] }
    : null;

  return (
    <>
      <AgencySettingsLayout
        sidebarItems={settingsSidebarItems}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {SectionComponent && (
          <SectionComponent
            data={activeSection === 'notifications' ? sectionDataForNotifications : sectionData}
            onSave={(data) => handleSave(dataKey, data)}
            onReset={() => handleReset(dataKey)}
          />
        )}
      </AgencySettingsLayout>

      {confirm && (
        <AgencySettingsConfirm
          show={!!confirm}
          title={confirm.title}
          message={confirm.message}
          type={confirm.type}
          confirmLabel={confirm.confirmLabel}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel || (() => setConfirm(null))}
          loading={false}
        />
      )}
    </>
  );
}
