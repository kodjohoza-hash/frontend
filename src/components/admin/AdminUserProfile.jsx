import { statusConfig } from '../../data/adminUserData';
import { formatDate, getAvatarClass, getRoleConfig } from './userHelpers';

const AdminUserProfile = ({ user, onClose }) => {
  if (!user) return null;
  const st = statusConfig[user.status] || { label: user.status, class: '', icon: '' };
  const role = getRoleConfig(user.role);
  const avCls = getAvatarClass(user.id);

  return (
    <>
      <div className="admu-drawer-overlay" onClick={onClose} />
      <div className="admu-drawer">
        <div className="admu-drawer-header">
          <h2><i className="bi bi-person-badge" /> Fiche Utilisateur</h2>
          <button className="admu-drawer-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="admu-drawer-body">
          {/* Profile Header */}
          <div className="admu-drawer-section">
            <div className="admu-profile-header">
              <div className={`admu-profile-avatar ${avCls}`}>{user.initials}</div>
              <div className="admu-profile-meta">
                <h4>{user.firstName} {user.lastName}</h4>
                <p>
                  <span className={`admu-role-badge admu-role-badge--${user.role}`}>
                    <i className={`bi ${role.icon}`} /> {role.label}
                  </span>
                  <span className={`admu-badge ${st.class}`} style={{ marginLeft: 6 }}>
                    {st.icon && <i className={`bi ${st.icon}`} style={{ fontSize: '0.55rem' }} />} {st.label}
                  </span>
                </p>
              </div>
            </div>
            <div className="admu-profile-grid">
              {[
                { label: 'Prénom', value: user.firstName },
                { label: 'Nom', value: user.lastName },
                { label: 'Email', value: user.email },
                { label: 'Téléphone', value: user.phone },
                { label: 'Adresse', value: user.address },
                { label: 'Ville', value: user.city },
                { label: 'Pays', value: user.country },
                { label: 'Date de naissance', value: formatDate(user.dob) },
                { label: 'Sexe', value: user.gender === 'M' ? 'Masculin' : 'Féminin' },
                { label: 'Langue', value: user.language === 'fr' ? 'Français' : 'English' },
                { label: 'Fuseau horaire', value: user.timezone },
                { label: 'Rôle', value: role.label },
                { label: 'Compagnie', value: user.company || '—' },
                { label: 'Point de vente', value: user.branch || '—' },
                { label: 'Date d\'inscription', value: formatDate(user.createdAt) },
                { label: 'Dernière connexion', value: user.lastLogin || '—' },
              ].map((f) => (
                <div className="admu-profile-field" key={f.label}><label>{f.label}</label><span>{f.value}</span></div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[
              { label: 'Voir réservations', icon: 'bi-ticket-perforated', key: 'bookings' },
              { label: 'Voir billets', icon: 'bi-ticket', key: 'tickets' },
              { label: 'Voir paiements', icon: 'bi-cash-coin', key: 'payments' },
              { label: 'Voir connexions', icon: 'bi-laptop', key: 'sessions' },
              { label: 'Voir permissions', icon: 'bi-shield-check', key: 'permissions' },
              { label: 'Historique', icon: 'bi-clock-history', key: 'history' },
              { label: 'Journal activité', icon: 'bi-journal-text', key: 'activity' },
            ].map((a) => (
              <button key={a.key} className="admu-filters-toggler" style={{ fontSize: '0.7rem', padding: '0.35rem 0.65rem' }}
                onClick={() => alert(`${a.label} (mock)`)}>
                <i className={`bi ${a.icon}`} /> {a.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="admu-drawer-section">
            <h3><i className="bi bi-bar-chart-line" /> Statistiques</h3>
            <div className="admu-profile-grid">
              <div className="admu-profile-field"><label>Réservations</label><span>{user.bookings}</span></div>
              <div className="admu-profile-field"><label>Billets</label><span>{user.tickets}</span></div>
              <div className="admu-profile-field"><label>Paiements</label><span>{user.payments}</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminUserProfile;
