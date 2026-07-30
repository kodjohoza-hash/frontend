import React, { useState, useMemo, useCallback } from 'react';
import AdminSettingsSidebar from '../../components/admin/settings/AdminSettingsSidebar';
import AdminSettingsSearch from '../../components/admin/settings/AdminSettingsSearch';
import AdminSettingsForm from '../../components/admin/settings/AdminSettingsForm';
import AdminSettingsHistory from '../../components/admin/settings/AdminSettingsHistory';
import AdminSettingsFavorite from '../../components/admin/settings/AdminSettingsFavorite';
import AdminSettingsImport from '../../components/admin/settings/AdminSettingsImport';
import AdminSettingsExport from '../../components/admin/settings/AdminSettingsExport';
import AdminSettingsSkeleton from '../../components/admin/settings/AdminSettingsSkeleton';
import { settingsCategories, allSettings, searchSettings, defaultFavorites, updateField } from '../../data/adminSettingsData';

const tabs = [
  { id: 'settings', label: 'Paramètres', icon: 'fa-sliders' },
  { id: 'favorites', label: 'Favoris', icon: 'fa-star' },
  { id: 'history', label: 'Historique', icon: 'fa-clock-rotate-left' },
  { id: 'import', label: 'Import / Export', icon: 'fa-arrows-rotate' },
];

const AdminSettings = () => {
  const [categories, setCategories] = useState(settingsCategories);
  const [activeCat, setActiveCat] = useState(categories[0]?.id);
  const [activeTab, setActiveTab] = useState('settings');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(defaultFavorites);
  const [loading, setLoading] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const currentCategory = categories.find(c => c.id === activeCat);

  const searchResults = useMemo(() => {
    if (!search || !search.trim()) return [];
    return searchSettings(search, allSettings);
  }, [search]);

  const handleToggleFavorite = useCallback((fieldId) => {
    setFavorites(prev => prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]);
    setToast({ show: true, type: 'success', message: 'Favori mis à jour' });
  }, []);

  const handleSave = useCallback((catId, fieldId, value) => {
    setCategories(prev => updateField(prev, catId, fieldId, value));
    setToast({ show: true, type: 'success', message: 'Paramètre sauvegardé' });
  }, []);

  const handleSelectCategory = useCallback((catId) => {
    setActiveCat(catId);
    setActiveTab('settings');
    setSearch('');
  }, []);

  const handleClearSearch = useCallback(() => setSearch(''), []);

  return (
    <div className="adst-dashboard">
      <AdminSettingsSidebar
        categories={categories}
        activeCat={activeCat}
        onSelect={handleSelectCategory}
        search={search}
        setSearch={setSearch}
      />

      <div className="adst-main">
        <div className="adst-hero">
          <h1><i className="fas fa-gear" /> Paramètres de la plateforme</h1>
          <p>Configurez tous les aspects de Bus Tix Connect</p>
        </div>

        <div className="adst-tabs">
          {tabs.map(tab => (
            <button key={tab.id} className={`adst-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setSearch(''); }}>
              <i className={`fas ${tab.icon}`} /> {tab.label}
            </button>
          ))}
          {hasUnsaved && (
            <span style={{ marginLeft: 12, fontSize: '0.75rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="fas fa-circle" style={{ fontSize: 6 }} /> Modifications non sauvegardées
            </span>
          )}
        </div>

        {search && activeTab === 'settings' ? (
          <AdminSettingsSearch query={search} results={searchResults} onSelect={handleSelectCategory} onClear={handleClearSearch} />
        ) : null}

        {loading ? (
          <AdminSettingsSkeleton />
        ) : (
          <>
            {activeTab === 'settings' && (
              <AdminSettingsForm
                category={currentCategory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSave={handleSave}
                onUnsavedChange={setHasUnsaved}
              />
            )}

            {activeTab === 'favorites' && (
              <AdminSettingsFavorite favorites={favorites} allFields={allSettings} onSelect={handleSelectCategory} />
            )}

            {activeTab === 'history' && (
              <AdminSettingsHistory categoryId={activeCat} />
            )}

            {activeTab === 'import' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem' }}>
                    <i className="fas fa-file-import" style={{ color: '#8B5CF6', marginRight: 8 }} /> Import
                  </h3>
                  <AdminSettingsImport setToast={setToast} />
                </div>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem' }}>
                    <i className="fas fa-file-export" style={{ color: '#3B82F6', marginRight: 8 }} /> Export
                  </h3>
                  <AdminSettingsExport setToast={setToast} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {toast.show && (
        <div className={`adst-toast ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`} />
          {toast.message}
          <button className="adst-toast-close" onClick={() => setToast({ ...toast, show: false })}>
            <i className="fas fa-times" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
