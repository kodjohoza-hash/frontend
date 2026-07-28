import AgencySettingsSidebar from '@components/agency/AgencySettingsSidebar';

export default function AgencySettingsLayout({ sidebarItems, activeSection, onSectionChange, children }) {
  return (
    <div className="aset-layout">
      <aside className="aset-sidebar">
        <AgencySettingsSidebar
          items={sidebarItems}
          activeId={activeSection}
          onChange={onSectionChange}
        />
      </aside>
      <main className="aset-content">{children}</main>
    </div>
  );
}
