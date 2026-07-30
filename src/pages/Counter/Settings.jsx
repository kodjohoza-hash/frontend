import { useState, useEffect, useCallback } from 'react';
import {
  settingsSections, accountSettings, securitySettings, notificationSettings,
  appearanceSettings, languageSettings, workPreferences, privacySettings,
  sessions as initialSessions, aboutInfo, saveSettings, formatDate, formatTime,
} from '@data/counterSettingsData';

const s = {
  page: { display: 'flex', gap: 24, padding: 24, maxWidth: 1200, margin: '0 auto', minHeight: 'calc(100vh - 140px)', alignItems: 'flex-start' },
  sidebar: {
    width: 220, flexShrink: 0, position: 'sticky', top: 24,
    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: 16, padding: 12, border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  sidebarItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
    borderRadius: 10, fontSize: 13, fontWeight: active ? 600 : 400,
    color: active ? '#f1f5f9' : '#94a3b8', cursor: 'pointer',
    background: active ? 'rgba(255,107,53,0.12)' : 'transparent',
    border: active ? '1px solid rgba(255,107,53,0.2)' : '1px solid transparent',
    transition: 'all 0.2s', textAlign: 'left', width: '100%',
  }),
  sidebarIcon: (active) => ({ fontSize: 16, color: active ? '#FF6B35' : '#64748b', width: 20, textAlign: 'center' }),
  content: { flex: 1, minWidth: 0 },
  card: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: 16, padding: 28, border: '1px solid rgba(255,255,255,0.05)',
  },
  cardTitle: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' },
  cardDesc: { fontSize: 13, color: '#64748b', margin: '0 0 24px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, fontWeight: 500 },
  input: {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f1f5f9', outline: 'none', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f1f5f9', outline: 'none', cursor: 'pointer', appearance: 'none',
  },
  toggleRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  toggleLabel: { fontSize: 14, color: '#e2e8f0', fontWeight: 500 },
  toggleDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  toggle: (on) => ({
    width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative',
    background: on ? '#FF6B35' : 'rgba(255,255,255,0.15)',
    transition: 'all 0.25s', border: 'none', flexShrink: 0,
  }),
  toggleKnob: (on) => ({
    width: 18, height: 18, borderRadius: '50%', background: '#fff',
    position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'all 0.25s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }),
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
    borderRadius: 10, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
    background: '#FF6B35', color: '#fff',
    boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
  },
  btnOutline: {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
    borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)',
  },
  btnCancel: {
    padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600,
    background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: '#94a3b8',
  },
  sessionCard: {
    background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16,
    border: '1px solid rgba(255,255,255,0.06)', marginBottom: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    flexWrap: 'wrap',
  },
  sessionInfo: { display: 'flex', alignItems: 'center', gap: 14 },
  sessionIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: 'rgba(59,130,246,0.12)', color: '#3b82f6',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
  },
  sessionBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px',
    borderRadius: 10, fontSize: 11, fontWeight: 600,
    background: 'rgba(34,197,94,0.12)', color: '#22c55e',
  },
  skel: { display: 'flex', gap: 24 },
  skelSide: { width: 220, borderRadius: 16, background: '#1e293b', padding: 12 },
  skelItem: { height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', marginBottom: 8 },
  skelMain: { flex: 1, borderRadius: 16, background: '#1e293b', padding: 28 },
  skelField: { height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
  },
  modal: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: 20, padding: 28, width: '100%', maxWidth: 480,
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 },
  modalFooter: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 },
  toastContainer: {
    position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column',
    gap: 8, zIndex: 1100,
  },
  toast: (t) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px',
    borderRadius: 12, fontSize: 13, fontWeight: 500,
    background: t === 'success' ? 'rgba(34,197,94,0.15)' : t === 'warning' ? 'rgba(245,158,11,0.15)' :
      t === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
    border: `1px solid ${t === 'success' ? 'rgba(34,197,94,0.3)' : t === 'warning' ? 'rgba(245,158,11,0.3)' :
      t === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`,
    color: t === 'success' ? '#22c55e' : t === 'warning' ? '#f59e0b' :
      t === 'error' ? '#ef4444' : '#3b82f6',
    backdropFilter: 'blur(12px)', minWidth: 300,
    animation: 'slideUp 0.3s ease',
  }),
  toastClose: {
    marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit',
    cursor: 'pointer', fontSize: 16, opacity: 0.7, padding: 0,
  },
};

const TOAST_DURATION = 3500;

function Toast({ toast, onClose }) {
  const icons = { success: 'bi-check-circle-fill', warning: 'bi-exclamation-triangle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
  return (
    <div style={s.toast(toast.type)}>
      <i className={`bi ${icons[toast.type] || icons.info}`} />
      <span>{toast.message}</span>
      <button style={s.toastClose} onClick={onClose}><i className="bi bi-x" /></button>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button style={s.toggle(value)} onClick={onChange} type="button">
      <div style={s.toggleKnob(value)} />
    </button>
  );
}

function SectionTitle({ icon, title, desc }) {
  return (
    <>
      <h2 style={s.cardTitle}><i className={`bi ${icon}`} style={{ color: '#FF6B35', marginRight: 8 }} />{title}</h2>
      {desc && <p style={s.cardDesc}>{desc}</p>}
    </>
  );
}

function Skeleton() {
  return (
    <div style={s.skel}>
      <div style={s.skelSide}>{Array.from({ length: 8 }).map((_, i) => <div key={i} style={s.skelItem} />)}</div>
      <div style={s.skelMain}>
        <div style={{ ...s.skelField, width: '40%' }} />
        {Array.from({ length: 5 }).map((_, i) => <div key={i} style={s.skelField} />)}
      </div>
    </div>
  );
}

function Modal({ title, icon, children, onClose }) {
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalTitle}>
          {icon && <i className={`bi ${icon}`} style={{ color: '#FF6B35' }} />}
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState({
    account: accountSettings, security: securitySettings, notifications: notificationSettings,
    appearance: appearanceSettings, language: languageSettings, work: workPreferences, privacy: privacySettings,
  });
  const [sessions, setSessions] = useState(initialSessions);
  const [toasts, setToasts] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), TOAST_DURATION);
  }, []);

  const handleToggle = useCallback((section, key) => {
    setSettings((p) => saveSettings(p, section, { [key]: !p[section][key] }));
    addToast('Paramètre mis à jour', 'success');
  }, [addToast]);

  const handleChange = useCallback((section, key, value) => {
    setSettings((p) => saveSettings(p, section, { [key]: value }));
    addToast('Paramètre mis à jour', 'success');
  }, [addToast]);

  const handleTerminateSession = useCallback((id) => {
    setSessions((p) => p.filter((s) => s.id !== id));
    addToast('Session terminée', 'info');
  }, [addToast]);

  const handleTerminateAll = useCallback(() => {
    setSessions((p) => p.filter((s) => s.isCurrent));
    addToast('Toutes les autres sessions ont été terminées', 'success');
  }, [addToast]);

  const savePassword = useCallback((e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { addToast('Les mots de passe ne correspondent pas', 'error'); return; }
    if (pwForm.newPw.length < 6) { addToast('Le mot de passe doit contenir au moins 6 caractères', 'error'); return; }
    setShowPasswordModal(false);
    setPwForm({ current: '', newPw: '', confirm: '' });
    setSettings((p) => saveSettings(p, 'security', { passwordLastChanged: new Date().toISOString().split('T')[0] }));
    addToast('Mot de passe modifié avec succès', 'success');
  }, [pwForm, addToast]);

  if (loading) return <div style={s.page}><Skeleton /></div>;

  const sec = settings;
  const ac = sec.account;
  const notif = sec.notifications;
  const app = sec.appearance;
  const lang = sec.language;
  const work = sec.work;

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div style={s.card}>
            <SectionTitle icon="bi-person-circle" title="Mon compte" desc="Gérez vos informations personnelles et coordonnées" />
            <div style={s.grid2}>
              {[
                { label: 'Prénom', key: 'firstName', val: ac.firstName },
                { label: 'Nom', key: 'lastName', val: ac.lastName },
                { label: 'Téléphone', key: 'phone', val: ac.phone },
                { label: 'Email', key: 'email', val: ac.email },
                { label: 'Adresse', key: 'address', val: ac.address },
                { label: 'Ville', key: 'city', val: ac.city },
                { label: 'Pays', key: 'country', val: ac.country },
                { label: 'Langue', key: 'language', val: ac.language },
              ].map((f) => (
                <div key={f.key} style={s.field}>
                  <label style={s.label}>{f.label}</label>
                  <input style={s.input} defaultValue={f.val}
                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    onChange={(e) => handleChange('account', f.key, e.target.value)} />
                </div>
              ))}
            </div>
            <div style={s.field}>
              <label style={s.label}>Fuseau horaire</label>
              <select style={s.select} value={ac.timezone} onChange={(e) => handleChange('account', 'timezone', e.target.value)}>
                <option value="Africa/Douala">Africa/Douala (UTC+1)</option>
                <option value="Africa/Yaounde">Africa/Yaounde (UTC+1)</option>
              </select>
            </div>
          </div>
        );

      case 'security':
        return (
          <div style={s.card}>
            <SectionTitle icon="bi-shield-check" title="Sécurité" desc="Protégez votre compte et vos données" />
            <div style={s.toggleRow}>
              <div>
                <div style={s.toggleLabel}>Authentification à deux facteurs (2FA)</div>
                <div style={s.toggleDesc}>Ajoutez une couche de sécurité supplémentaire à votre compte</div>
              </div>
              <Toggle value={sec.security.twoFactorEnabled} onChange={() => handleToggle('security', 'twoFactorEnabled')} />
            </div>
            <div style={s.toggleRow}>
              <div>
                <div style={s.toggleLabel}>Question de sécurité</div>
                <div style={s.toggleDesc}>Définissez une question secrète pour récupérer votre compte</div>
              </div>
              <Toggle value={!!sec.security.securityQuestion} onChange={() => handleToggle('security', 'securityQuestion')} />
            </div>
            <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
              <div style={s.toggleLabel}>Dernière modification du mot de passe</div>
              <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>{formatDate(sec.security.passwordLastChanged)}</div>
            </div>
            <div style={{ marginTop: 20 }}>
              <button style={s.btnPrimary} onClick={() => setShowPasswordModal(true)}>
                <i className="bi bi-shield-lock" /> Changer le mot de passe
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div style={s.card}>
            <SectionTitle icon="bi-bell" title="Notifications" desc="Configurez vos alertes et notifications" />
            {[
              { key: 'bookings', label: 'Réservations', desc: 'Notifications lors de nouvelles réservations' },
              { key: 'payments', label: 'Paiements', desc: 'Alertes pour les encaissements et transactions' },
              { key: 'messages', label: 'Messages', desc: 'Notifications de nouveaux messages internes' },
              { key: 'alerts', label: 'Alertes', desc: 'Alertes système et informations importantes' },
              { key: 'departures', label: 'Départs', desc: 'Notifications des départs imminents' },
              { key: 'maintenance', label: 'Maintenance', desc: 'Informations sur la maintenance du système' },
              { key: 'support', label: 'Support', desc: 'Réponses et mises à jour des tickets support' },
            ].map((n) => (
              <div key={n.key} style={s.toggleRow}>
                <div>
                  <div style={s.toggleLabel}>{n.label}</div>
                  <div style={s.toggleDesc}>{n.desc}</div>
                </div>
                <Toggle value={notif[n.key]} onChange={() => handleToggle('notifications', n.key)} />
              </div>
            ))}
            <div style={{ marginTop: 24 }}>
              <div style={s.toggleLabel}>Canaux de notification</div>
              <div style={s.grid3}>
                {[
                  { key: 'pushEnabled', label: 'Push', icon: 'bi-bell-fill' },
                  { key: 'emailEnabled', label: 'Email', icon: 'bi-envelope-fill' },
                  { key: 'smsEnabled', label: 'SMS', icon: 'bi-chat-fill' },
                ].map((c) => (
                  <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                    <i className={`bi ${c.icon}`} style={{ color: '#FF6B35' }} />
                    <span style={{ flex: 1, fontSize: 13, color: '#e2e8f0' }}>{c.label}</span>
                    <Toggle value={notif[c.key]} onChange={() => handleToggle('notifications', c.key)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div style={s.card}>
            <SectionTitle icon="bi-palette" title="Apparence" desc="Personnalisez l'affichage du tableau de bord" />
            <div style={s.toggleRow}>
              <div>
                <div style={s.toggleLabel}>Mode sombre</div>
                <div style={s.toggleDesc}>Passer en interface sombre pour réduire la fatigue oculaire</div>
              </div>
              <Toggle value={app.theme === 'dark'} onChange={() => handleChange('appearance', 'theme', app.theme === 'dark' ? 'light' : 'dark')} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Couleur d'accentuation</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['#FF6B35', '#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'].map((c) => (
                  <button key={c} type="button"
                    onClick={() => handleChange('appearance', 'accentColor', c)}
                    style={{
                      width: 36, height: 36, borderRadius: 10, background: c, border: app.accentColor === c ? '2px solid #f1f5f9' : '2px solid transparent',
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: app.accentColor === c ? `0 0 16px ${c}66` : 'none',
                    }} />
                ))}
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Taille de police</label>
              <select style={s.select} value={app.fontSize} onChange={(e) => handleChange('appearance', 'fontSize', e.target.value)}>
                <option value="small">Petite</option>
                <option value="medium">Moyenne</option>
                <option value="large">Grande</option>
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Densité d'affichage</label>
              <select style={s.select} value={app.density} onChange={(e) => handleChange('appearance', 'density', e.target.value)}>
                <option value="compact">Compact</option>
                <option value="comfortable">Confortable</option>
                <option value="spacious">Espacé</option>
              </select>
            </div>
            <div style={s.toggleRow}>
              <div>
                <div style={s.toggleLabel}>Animations</div>
                <div style={s.toggleDesc}>Activer les animations et transitions de l'interface</div>
              </div>
              <Toggle value={app.animations} onChange={() => handleToggle('appearance', 'animations')} />
            </div>
          </div>
        );

      case 'language':
        return (
          <div style={s.card}>
            <SectionTitle icon="bi-globe2" title="Langue et région" desc="Configurez vos préférences linguistiques et régionales" />
            <div style={s.grid2}>
              {[
                { label: 'Langue', key: 'language', options: ['Français', 'English', 'Español'] },
                { label: 'Fuseau horaire', key: 'timezone', options: ['Africa/Douala', 'Africa/Yaounde', 'Africa/Dakar'] },
                { label: 'Pays', key: 'country', options: ['Cameroun', 'Sénégal', 'Côte d\'Ivoire'] },
              ].map((f) => (
                <div key={f.key} style={s.field}>
                  <label style={s.label}>{f.label}</label>
                  <select style={s.select} value={lang[f.key]} onChange={(e) => handleChange('language', f.key, e.target.value)}>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              {[
                { label: 'Monnaie', key: 'currency', options: ['XAF (FCFA)', 'XOF (FCFA)', 'EUR (€)', 'USD ($)'] },
                { label: 'Format de date', key: 'dateFormat', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
                { label: 'Format horaire', key: 'timeFormat', options: ['24h', '12h (AM/PM)'] },
              ].map((f) => (
                <div key={f.key} style={s.field}>
                  <label style={s.label}>{f.label}</label>
                  <select style={s.select} value={lang[f.key]} onChange={(e) => handleChange('language', f.key, e.target.value)}>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );

      case 'work':
        return (
          <div style={s.card}>
            <SectionTitle icon="bi-briefcase" title="Préférences de travail" desc="Personnalisez votre environnement de travail" />
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Point de vente favori</label>
                <select style={s.select} value={work.favoriteBranch} onChange={(e) => handleChange('work', 'favoriteBranch', e.target.value)}>
                  <option value="Douala Central">Douala Central</option>
                  <option value="Yaoundé Mfoundi">Yaoundé Mfoundi</option>
                  <option value="Bafoussam">Bafoussam</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Résultats par page</label>
                <select style={s.select} value={work.resultsPerPage} onChange={(e) => handleChange('work', 'resultsPerPage', Number(e.target.value))}>
                  <option value={10}>10</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            {[
              { key: 'autoOpenScanner', label: 'Ouvrir automatiquement le scanner', desc: 'Lance le scanner de billets au démarrage' },
              { key: 'autoPrintReceipt', label: 'Imprimer automatiquement les reçus', desc: 'Imprime un reçu après chaque vente' },
              { key: 'confirmBeforeDelete', label: 'Confirmer avant la suppression', desc: 'Demander une confirmation avant de supprimer un élément' },
            ].map((t) => (
              <div key={t.key} style={s.toggleRow}>
                <div>
                  <div style={s.toggleLabel}>{t.label}</div>
                  <div style={s.toggleDesc}>{t.desc}</div>
                </div>
                <Toggle value={work[t.key]} onChange={() => handleToggle('work', t.key)} />
              </div>
            ))}
          </div>
        );

      case 'privacy':
        return (
          <div style={s.card}>
            <SectionTitle icon="bi-shield-lock" title="Confidentialité" desc="Gérez vos données et votre vie privée" />
            <div style={s.toggleRow}>
              <div>
                <div style={s.toggleLabel}>Visibilité du profil</div>
                <div style={s.toggleDesc}>Contrôlez qui peut voir vos informations</div>
              </div>
              <select style={{ ...s.select, width: 'auto' }} value={sec.privacy.profileVisibility}
                onChange={(e) => handleChange('privacy', 'profileVisibility', e.target.value)}>
                <option value="internal">Interne uniquement</option>
                <option value="company">Toute la compagnie</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div style={s.toggleRow}>
              <div>
                <div style={s.toggleLabel}>Partager les informations</div>
                <div style={s.toggleDesc}>Autoriser le partage de vos données avec la hiérarchie</div>
              </div>
              <Toggle value={sec.privacy.shareInfo} onChange={() => handleToggle('privacy', 'shareInfo')} />
            </div>
            <div style={s.toggleRow}>
              <div>
                <div style={s.toggleLabel}>Consentement</div>
                <div style={s.toggleDesc}>J'accepte le traitement de mes données personnelles</div>
              </div>
              <Toggle value={sec.privacy.consentGiven} onChange={() => handleToggle('privacy', 'consentGiven')} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <button style={s.btnPrimary} onClick={() => addToast('Téléchargement de vos données démarré. Vous recevrez un email sous 48h.', 'success')}>
                <i className="bi bi-download" /> Télécharger mes données
              </button>
              <button style={s.btnOutline} onClick={() => addToast('Demande de suppression de compte envoyée.', 'warning')}>
                <i className="bi bi-trash3-fill" /> Supprimer le compte
              </button>
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div style={s.card}>
            <SectionTitle icon="bi-laptop" title="Sessions actives" desc="Consultez et gérez vos sessions de connexion" />
            {sessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <i className="bi bi-laptop" style={{ fontSize: 48, opacity: 0.3, display: 'block', marginBottom: 12 }} />
                <p style={{ fontWeight: 500, margin: 0 }}>Aucune session active</p>
              </div>
            ) : (
              <>
                {sessions.map((sess) => (
                  <div key={sess.id} style={s.sessionCard}>
                    <div style={s.sessionInfo}>
                      <div style={s.sessionIcon}><i className="bi bi-laptop" /></div>
                      <div>
                        <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 500 }}>
                          {sess.device} {sess.isCurrent && <span style={s.sessionBadge}><i className="bi bi-dot" />Actuelle</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                          {sess.browser} · {sess.ip} · {sess.location}
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                          Dernière activité : {formatDate(sess.lastActive)} à {formatTime(sess.lastActive)}
                        </div>
                      </div>
                    </div>
                    {!sess.isCurrent && (
                      <button style={{ ...s.btnCancel, fontSize: 12, padding: '6px 14px' }}
                        onClick={() => handleTerminateSession(sess.id)}>
                        <i className="bi bi-x-lg" /> Terminer
                      </button>
                    )}
                  </div>
                ))}
                {sessions.filter((s) => !s.isCurrent).length > 0 && (
                  <button style={{ ...s.btnOutline, marginTop: 8 }} onClick={handleTerminateAll}>
                    <i className="bi bi-x-circle" /> Terminer toutes les autres sessions
                  </button>
                )}
              </>
            )}
          </div>
        );

      case 'about':
        return (
          <div style={s.card}>
            <SectionTitle icon="bi-info-circle" title="À propos" desc="Informations sur l'application" />
            <div style={s.grid2}>
              {[
                ['Application', aboutInfo.appName],
                ['Version', aboutInfo.version],
                ['Frontend', aboutInfo.frontendVersion],
                ['API', aboutInfo.apiVersion],
                ['Licence', aboutInfo.license],
                ['Support', aboutInfo.supportEmail],
                ['Téléphone', aboutInfo.supportPhone],
              ].map(([l, v]) => (
                <div key={l} style={s.field}>
                  <div style={s.label}>{l}</div>
                  <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>Section en cours de développement</div>;
    }
  };

  return (
    <>
      <div style={s.page}>
        <aside style={s.sidebar}>
          {settingsSections.map((sec) => (
            <button key={sec.id} style={s.sidebarItem(activeSection === sec.id)}
              onClick={() => setActiveSection(sec.id)}
              onMouseEnter={(e) => { if (activeSection !== sec.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#cbd5e1'; }}}
              onMouseLeave={(e) => { if (activeSection !== sec.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}}>
              <i className={`bi ${sec.icon}`} style={s.sidebarIcon(activeSection === sec.id)} />
              {sec.label}
            </button>
          ))}
        </aside>
        <div style={s.content}>{renderContent()}</div>
      </div>

      {showPasswordModal && (
        <Modal title="Changer le mot de passe" icon="bi-shield-lock" onClose={() => setShowPasswordModal(false)}>
          <form onSubmit={savePassword}>
            {[
              { key: 'current', label: 'Mot de passe actuel' },
              { key: 'newPw', label: 'Nouveau mot de passe' },
              { key: 'confirm', label: 'Confirmer le nouveau mot de passe' },
            ].map((f) => (
              <div key={f.key} style={s.field}>
                <label style={s.label}>{f.label}</label>
                <input style={s.input} type="password" required
                  value={pwForm[f.key]}
                  onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>
            ))}
            <div style={s.modalFooter}>
              <button type="button" style={s.btnCancel} onClick={() => setShowPasswordModal(false)}>Annuler</button>
              <button type="submit" style={s.btnPrimary}><i className="bi bi-shield-check" /> Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}

      {toasts.length > 0 && (
        <div style={s.toastContainer}>
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
          ))}
        </div>
      )}
    </>
  );
}
