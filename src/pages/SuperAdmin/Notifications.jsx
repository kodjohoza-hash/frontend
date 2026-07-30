import React, { useState, useMemo } from 'react';
import '../../../src/assets/styles/admin-notifications.css';
import {
  AdminNotificationStats,
  AdminNotificationFilters,
  AdminNotificationComposer,
  AdminNotificationTemplates,
  AdminNotificationHistory,
  AdminNotificationTimeline,
  AdminNotificationCharts,
  AdminNotificationPreview,
  AdminNotificationRecipients,
  AdminNotificationSkeleton,
} from '../../../src/components/admin/notifications';
import {
  notifChannels, notifCategories, notifSenders, notifNotifications,
  notifTemplates, notifDailyData, notifByChannel, notifByCategory,
  notifTimeline, notifKPI, filterNotifications,
} from '../../../src/data/adminNotificationData';

const Notifications = () => {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [cat, setCat] = useState('all');
  const [ch, setCh] = useState('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [previewNotif, setPreviewNotif] = useState(null);
  const [recipientSegment, setRecipientSegment] = useState('all');

  const filtered = useMemo(() => {
    if (search || cat !== 'all' || ch !== 'all') {
      return filterNotifications(notifNotifications, { category: cat, channel: ch, search });
    }
    return notifNotifications;
  }, [cat, ch, search]);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSend = (form) => {
    showToast('Notification envoyée avec succès', 'success');
  };

  const totalKPI = Object.entries(notifKPI).reduce((acc, [k, v]) => { acc[k] = v.value; return acc; }, {});

  return (
    <div className="adn-dashboard">
      <div className="adn-hero">
        <div className="adn-hero-content">
          <h1><i className="fas fa-bell" /> Centre de notifications</h1>
          <p>Gérez, composez et analysez toutes les notifications de la plateforme</p>
        </div>
      </div>
      <AdminNotificationStats loading={loading} />
      <div className="adn-tabs">
        {[
          { id: 'dashboard', label: 'Tableau de bord', icon: 'fa-chart-pie' },
          { id: 'composer', label: 'Composer', icon: 'fa-pen' },
          { id: 'history', label: 'Historique', icon: 'fa-clock-rotate' },
          { id: 'templates', label: 'Gabarits', icon: 'fa-file-lines' },
          { id: 'recipients', label: 'Segments', icon: 'fa-users' },
        ].map(t => (
          <button key={t.id} className={`adn-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <i className={`fas ${t.icon}`} />{t.label}
          </button>
        ))}
      </div>
      {tab === 'dashboard' && (
        <>
          <AdminNotificationCharts dailyData={notifDailyData} byChannelData={notifByChannel} byCategoryData={notifByCategory} />
          <div className="adn-section-header"><h3><i className="fas fa-clock" style={{ color: '#8B5CF6' }} /> Activité récente</h3></div>
          <div style={{ background: '#13132B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '0.5rem 1.25rem' }}>
            <AdminNotificationTimeline events={notifTimeline} />
          </div>
          <div className="adn-section-header" style={{ marginTop: '1.5rem' }}><h3><i className="fas fa-bolt" style={{ color: '#FBBF24' }} /> Aperçu rapide</h3></div>
          <AdminNotificationPreview notification={previewNotif || (filtered.length > 0 ? filtered[0] : null)} />
        </>
      )}
      {tab === 'composer' && (
        <>
          <div className="adn-section-header"><h3><i className="fas fa-pen" style={{ color: '#8B5CF6' }} /> Nouvelle notification</h3></div>
          <AdminNotificationComposer senders={notifSenders} channels={notifChannels} onSend={handleSend} />
          <div style={{ marginTop: '1.5rem' }}>
            <div className="adn-section-header"><h3><i className="fas fa-users" style={{ color: '#3B82F6' }} /> Segment cible</h3></div>
            <AdminNotificationRecipients selected={recipientSegment} onChange={setRecipientSegment} />
          </div>
        </>
      )}
      {tab === 'history' && (
        <>
          <AdminNotificationFilters cat={cat} setCat={setCat} search={search} setSearch={setSearch} channels={notifChannels} ch={ch} setCh={setCh} />
          <div className="adn-section-header"><h3><i className="fas fa-clock-rotate" style={{ color: '#3B82F6' }} /> Toutes les notifications</h3></div>
          {loading ? <AdminNotificationSkeleton rows={5} /> : (
            <AdminNotificationHistory notifications={filtered} onView={setPreviewNotif} onDelete={(id) => showToast('Notification supprimée', 'info')} />
          )}
          {previewNotif && (
            <div style={{ marginTop: '1rem' }}>
              <div className="adn-section-header"><h3><i className="fas fa-eye" style={{ color: '#8B5CF6' }} /> Détails</h3></div>
              <AdminNotificationPreview notification={previewNotif} onClose={() => setPreviewNotif(null)} />
            </div>
          )}
        </>
      )}
      {tab === 'templates' && (
        <>
          <div className="adn-section-header"><h3><i className="fas fa-file-lines" style={{ color: '#10B981' }} /> Gabarits disponibles</h3></div>
          <AdminNotificationTemplates templates={notifTemplates} onSelect={(t) => showToast(`Gabarit "${t.name}" sélectionné`, 'info')} onPreview={(t) => setPreviewNotif({ title: t.name, body: t.template, category: t.category, channel: 'inapp', recipients: 0 })} />
        </>
      )}
      {tab === 'recipients' && (
        <>
          <div className="adn-section-header"><h3><i className="fas fa-users" style={{ color: '#EC4899' }} /> Segments de destinataires</h3></div>
          <AdminNotificationRecipients selected={recipientSegment} onChange={setRecipientSegment} />
          <div style={{ marginTop: '1.5rem', background: '#13132B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem' }}>
            <div className="adn-chart-title"><i className="fas fa-chart-bar" style={{ color: '#8B5CF6' }} /> Répartition par segment</div>
            <div className="adn-hbar-list">
              {[
                { label: 'Tous', value: 100, color: '#8B5CF6' },
                { label: 'Clients', value: 72, color: '#3B82F6' },
                { label: 'Agents', value: 45, color: '#10B981' },
                { label: 'Partenaires', value: 28, color: '#FBBF24' },
                { label: 'Premium', value: 12, color: '#EC4899' },
              ].map((d, i) => (
                <div key={i} className="adn-hbar-item">
                  <span className="adn-hbar-label">{d.label}</span>
                  <div className="adn-hbar-track"><div className="adn-hbar-fill" style={{ width: `${d.value}%`, background: `linear-gradient(90deg, ${d.color}, ${d.color}88)` }}>{d.value}%</div></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {toast && <div className={`adn-toast ${toast.type}`}><i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}`} />{toast.msg}</div>}
    </div>
  );
};
export default Notifications;
