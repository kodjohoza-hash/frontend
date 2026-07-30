import { useState, useEffect, useCallback } from 'react';
import { agentProfile, quickActions, formatCurrency, formatDate, formatTime } from '@data/counterProfileData';

const s = {
  page: { padding: '24px', maxWidth: 1200, margin: '0 auto' },
  skel: { padding: 24, display: 'flex', flexDirection: 'column', gap: 20 },
  skelRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  skelBlock: { height: 100, borderRadius: 16, background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', flex: 1, minWidth: 200 },
  skelText: { height: 20, borderRadius: 8, background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', width: '60%' },
  header: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    borderRadius: 20, padding: '32px', marginBottom: 28,
    display: 'flex', alignItems: 'center', gap: 28,
    flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  headerGlow: {
    position: 'absolute', top: '-60%', right: '-10%', width: 400, height: 400,
    background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  avatarWrap: {
    position: 'relative', width: 100, height: 100, borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF6B35, #ff8f65)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 36, fontWeight: 700, color: '#fff', flexShrink: 0,
    boxShadow: '0 8px 32px rgba(255,107,53,0.3)',
  },
  avatarBadge: {
    position: 'absolute', bottom: 2, right: 2, width: 24, height: 24,
    borderRadius: '50%', background: '#22c55e', border: '3px solid #0f172a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, color: '#fff',
  },
  headerInfo: { flex: 1, minWidth: 200 },
  headerName: { fontSize: 26, fontWeight: 700, color: '#f1f5f9', margin: 0 },
  headerRole: { fontSize: 14, color: '#94a3b8', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 8 },
  statusDot: (active) => ({
    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
    background: active ? '#22c55e' : '#ef4444',
    boxShadow: active ? '0 0 8px rgba(34,197,94,0.5)' : '0 0 8px rgba(239,68,68,0.5)',
    marginRight: 4,
  }),
  statusBadge: (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px',
    borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
    color: active ? '#22c55e' : '#ef4444',
    border: `1px solid ${active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
  }),
  headerActions: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  btn: (bg = '#FF6B35') => ({
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
    borderRadius: 12, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
    background: bg, color: '#fff', transition: 'all 0.25s',
    boxShadow: `0 4px 16px ${bg}33`,
  }),
  btnOutline: {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
    borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    background: 'transparent', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.15)',
    transition: 'all 0.25s',
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16, marginBottom: 28,
  },
  statCard: (color) => ({
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: 16, padding: '22px 24px',
    border: '1px solid rgba(255,255,255,0.05)',
    position: 'relative', overflow: 'hidden',
  }),
  statIcon: (color) => ({
    width: 44, height: 44, borderRadius: 12,
    background: `${color}15`, color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, marginBottom: 14,
  }),
  statValue: { fontSize: 28, fontWeight: 700, color: '#f1f5f9', margin: 0 },
  statLabel: { fontSize: 13, color: '#64748b', margin: '4px 0 0' },
  grid2: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
    marginBottom: 28,
  },
  card: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: 16, padding: 24,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  cardTitle: { fontSize: 15, fontWeight: 600, color: '#f1f5f9', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 },
  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px',
  },
  infoItem: {},
  infoLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 },
  infoValue: { fontSize: 14, color: '#e2e8f0', fontWeight: 500 },
  grid3: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12, marginTop: 16,
  },
  actionCard: (color) => ({
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: 14, padding: 18, cursor: 'pointer',
    border: `1px solid ${color}20`,
    transition: 'all 0.25s', textAlign: 'center',
  }),
  actionIcon: (color) => ({
    width: 40, height: 40, borderRadius: 10,
    background: `${color}15`, color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, margin: '0 auto 10px',
  }),
  actionLabel: { fontSize: 12, color: '#cbd5e1', fontWeight: 600 },
  actionDesc: { fontSize: 11, color: '#64748b', marginTop: 4 },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
  },
  modal: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: 20, padding: 28, width: '100%', maxWidth: 500,
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 },
  field: { marginBottom: 16 },
  fieldLabel: { display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, fontWeight: 500 },
  input: {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f1f5f9', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box',
  },
  modalFooter: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 },
  btnCancel: {
    padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600,
    background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: '#94a3b8',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
    borderRadius: 10, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
    background: '#FF6B35', color: '#fff',
    boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
  },
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
  emptySection: {
    textAlign: 'center', padding: '40px 20px', color: '#64748b',
  },
  emptyIcon: { fontSize: 48, marginBottom: 12, opacity: 0.4 },
  emptyText: { fontSize: 14, fontWeight: 500, margin: 0 },
  subText: { fontSize: 12, color: '#475569', marginTop: 4 },
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

function Skeleton() {
  return (
    <div style={s.skel}>
      <div style={s.skelBlock} />
      <div style={s.skelRow}>
        <div style={s.skelBlock} /><div style={s.skelBlock} /><div style={s.skelBlock} />
      </div>
      <div style={s.skelText} />
    </div>
  );
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(agentProfile);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '', email: '', address: '' });
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

  const openEdit = useCallback(() => {
    setEditForm({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone, email: profile.email, address: profile.address });
    setModal('edit');
  }, [profile]);

  const saveEdit = useCallback((e) => {
    e.preventDefault();
    setProfile((p) => ({
      ...p, firstName: editForm.firstName, lastName: editForm.lastName,
      fullName: `${editForm.firstName} ${editForm.lastName}`,
      phone: editForm.phone, email: editForm.email, address: editForm.address,
    }));
    setModal(null);
    addToast('Profil mis à jour avec succès', 'success');
  }, [editForm, addToast]);

  const savePassword = useCallback((e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { addToast('Les mots de passe ne correspondent pas', 'error'); return; }
    if (pwForm.newPw.length < 6) { addToast('Le mot de passe doit contenir au moins 6 caractères', 'error'); return; }
    setModal(null);
    setPwForm({ current: '', newPw: '', confirm: '' });
    addToast('Mot de passe modifié avec succès', 'success');
  }, [pwForm, addToast]);

  const handlePhoto = useCallback(() => {
    addToast('Photo de profil modifiée avec succès', 'success');
    setModal(null);
  }, [addToast]);

  const handleAction = useCallback((id) => {
    const msgs = {
      edit_profile: { m: 'Ouverture du formulaire de modification du profil', t: 'info' },
      change_password: { m: 'Redirection vers la page de changement de mot de passe', t: 'info' },
      view_notifications: { m: 'Affichage des notifications récentes', t: 'info' },
      open_messages: { m: 'Ouverture de la messagerie interne', t: 'info' },
      contact_supervisor: { m: 'Message envoyé à Jean-Jacques Mvondo', t: 'success' },
      download_documents: { m: 'Téléchargement des documents en cours', t: 'warning' },
    };
    const r = msgs[id] || { m: 'Action en cours de développement', t: 'info' };
    addToast(r.m, r.t);
  }, [addToast]);

  if (loading) return <Skeleton />;

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;
  const isActive = profile.status === 'actif';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerGlow} />
        <div style={s.avatarWrap}>
          {initials}
          <div style={s.avatarBadge}><i className="bi bi-check" /></div>
        </div>
        <div style={s.headerInfo}>
          <h1 style={s.headerName}>{profile.fullName}</h1>
          <p style={s.headerRole}>
            <i className="bi bi-person-badge" style={{ color: '#FF6B35' }} />
            {profile.role}
            <span style={s.statusBadge(isActive)}>
              <span style={s.statusDot(isActive)} />{isActive ? 'Actif' : 'Inactif'}
            </span>
          </p>
        </div>
        <div style={s.headerActions}>
          <button style={s.btn()} onClick={openEdit}>
            <i className="bi bi-pencil-square" /> Modifier
          </button>
          <button style={s.btnOutline} onClick={() => setModal('password')}>
            <i className="bi bi-shield-lock" /> Mot de passe
          </button>
          <button style={s.btnOutline} onClick={() => setModal('photo')}>
            <i className="bi bi-camera" /> Photo
          </button>
        </div>
      </div>

      <div style={s.statsRow}>
        {[
          { icon: 'bi-ticket-perforated', label: 'Billets vendus aujourd\'hui', value: profile.totalTicketsSoldToday, color: '#FF6B35' },
          { icon: 'bi-calendar-check', label: 'Billets vendus ce mois', value: profile.totalTicketsSoldMonth, color: '#3b82f6' },
          { icon: 'bi-journal-text', label: 'Réservations créées', value: profile.totalBookingsCreated, color: '#8b5cf6' },
          { icon: 'bi-emoji-smile', label: 'Taux de satisfaction', value: `${profile.satisfactionRate}%`, color: '#22c55e' },
        ].map((st) => (
          <div key={st.label} style={s.statCard(st.color)}>
            <div style={s.statIcon(st.color)}><i className={`bi ${st.icon}`} /></div>
            <p style={s.statValue}>{st.value}</p>
            <p style={s.statLabel}>{st.label}</p>
          </div>
        ))}
      </div>

      <div style={s.grid2}>
        <div style={s.card}>
          <h3 style={s.cardTitle}><i className="bi bi-person-lines-fill" style={{ color: '#FF6B35' }} />Informations personnelles</h3>
          <div style={s.infoGrid}>
            {[
              ['Matricule', profile.employeeId],
              ['Fonction', profile.role],
              ['Guichet', profile.branch],
              ['Compagnie', profile.company],
              ['Téléphone', profile.phone],
              ['Email', profile.email],
              ['Adresse', profile.address],
              ['Ville', profile.city],
              ['Date d\'embauche', formatDate(profile.hireDate)],
              ['Superviseur', profile.supervisor],
            ].map(([label, val]) => (
              <div key={label} style={s.infoItem}>
                <div style={s.infoLabel}>{label}</div>
                <div style={s.infoValue}>{val || '—'}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={s.card}>
          <h3 style={s.cardTitle}><i className="bi bi-lightning-fill" style={{ color: '#f59e0b' }} />Actions rapides</h3>
          <div style={s.grid3}>
            {quickActions.map((a) => (
              <div key={a.id} style={s.actionCard(a.color)} onClick={() => handleAction(a.id)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${a.color}20`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={s.actionIcon(a.color)}><i className={`bi ${a.icon}`} /></div>
                <div style={s.actionLabel}>{a.label}</div>
                <div style={s.actionDesc}>{a.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal === 'edit' && (
        <Modal title="Modifier le profil" icon="bi-pencil-square" onClose={() => setModal(null)}>
          <form onSubmit={saveEdit}>
            {['firstName', 'lastName', 'phone', 'email', 'address'].map((f) => (
              <div key={f} style={s.field}>
                <label style={s.fieldLabel}>
                  {f === 'firstName' ? 'Prénom' : f === 'lastName' ? 'Nom' :
                   f === 'phone' ? 'Téléphone' : f === 'email' ? 'Email' : 'Adresse'}
                </label>
                <input style={s.input} type={f === 'email' ? 'email' : f === 'phone' ? 'tel' : 'text'}
                  value={editForm[f]} required={f !== 'address'}
                  onChange={(e) => setEditForm((p) => ({ ...p, [f]: e.target.value }))}
                  onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>
            ))}
            <div style={s.modalFooter}>
              <button type="button" style={s.btnCancel} onClick={() => setModal(null)}>Annuler</button>
              <button type="submit" style={s.btnPrimary}><i className="bi bi-check-lg" /> Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'password' && (
        <Modal title="Modifier le mot de passe" icon="bi-shield-lock" onClose={() => setModal(null)}>
          <form onSubmit={savePassword}>
            {[
              { key: 'current', label: 'Mot de passe actuel' },
              { key: 'newPw', label: 'Nouveau mot de passe' },
              { key: 'confirm', label: 'Confirmer le nouveau mot de passe' },
            ].map((f) => (
              <div key={f.key} style={s.field}>
                <label style={s.fieldLabel}>{f.label}</label>
                <input style={s.input} type="password" required
                  value={pwForm[f.key]}
                  onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>
            ))}
            <div style={s.modalFooter}>
              <button type="button" style={s.btnCancel} onClick={() => setModal(null)}>Annuler</button>
              <button type="submit" style={s.btnPrimary}><i className="bi bi-shield-check" /> Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'photo' && (
        <Modal title="Changer la photo de profil" icon="bi-camera" onClose={() => setModal(null)}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ ...s.avatarWrap, width: 120, height: 120, fontSize: 44, margin: '0 auto 20px' }}>
              {initials}
            </div>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>
              Sélectionnez une nouvelle photo (JPG, PNG — max 2 Mo)
            </p>
            <input type="file" accept="image/*" style={{ display: 'none' }} id="photoInput" />
            <label htmlFor="photoInput" style={{ ...s.btn(), cursor: 'pointer', display: 'inline-flex' }}>
              <i className="bi bi-upload" /> Choisir un fichier
            </label>
            <div style={s.modalFooter}>
              <button style={s.btnCancel} onClick={() => setModal(null)}>Annuler</button>
              <button style={s.btnPrimary} onClick={handlePhoto}><i className="bi bi-check-lg" /> Confirmer</button>
            </div>
          </div>
        </Modal>
      )}

      {toasts.length > 0 && (
        <div style={s.toastContainer}>
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
          ))}
        </div>
      )}
    </div>
  );
}
