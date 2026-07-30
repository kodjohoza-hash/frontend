import clsx from 'clsx';
import { formatDate } from '@data/counterProfileData';

const STATUS_STYLES = {
  actif: { color: '#10B981', bg: '#ECFDF5', label: 'Actif' },
  en_conge: { color: '#F59E0B', bg: '#FFFBEB', label: 'En congé' },
  hors_ligne: { color: '#6B7280', bg: '#F3F4F6', label: 'Hors ligne' },
};

const CounterProfileHeader = ({ profile }) => {
  if (!profile) return null;

  const initials = [profile.prenom, profile.nom]
    .filter(Boolean)
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const st = STATUS_STYLES[profile.statut] || STATUS_STYLES.hors_ligne;

  return (
    <div className="acpr-header-card">
      <div className="acpr-header-bg" />
      <div className="acpr-header-content">
        <div className="acpr-header-left">
          <div className="acpr-avatar-circle">
            <span className="acpr-avatar-initials">{initials || '?'}</span>
            {profile.verifie && (
              <span className="acpr-verified-badge" title="Compte vérifié">
                <i className="bi bi-patch-check-fill" />
              </span>
            )}
          </div>
          <div className="acpr-header-info">
            <h1 className="acpr-header-name">
              {profile.prenom} {profile.nom}
            </h1>
            <div className="acpr-header-meta">
              <span
                className="acpr-role-badge"
                style={{ background: '#FFF0EA', color: '#FF6B35' }}
              >
                <i className="bi bi-person-badge" /> {profile.role || 'Agent'}
              </span>
              <span
                className="acpr-status-badge"
                style={{ background: st.bg, color: st.color }}
              >
                <i className="bi bi-circle-fill" style={{ fontSize: 8 }} /> {st.label}
              </span>
            </div>
            <div className="acpr-header-details">
              {profile.compagnie && (
                <span><i className="bi bi-building" /> {profile.compagnie}</span>
              )}
              {profile.pointVente && (
                <span><i className="bi bi-geo-alt" /> {profile.pointVente}</span>
              )}
              {profile.ville && profile.pays && (
                <span><i className="bi bi-globe" /> {profile.ville}, {profile.pays}</span>
              )}
              {profile.dateEmbauche && (
                <span><i className="bi bi-calendar-plus" /> Embauché le {formatDate(profile.dateEmbauche)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="acpr-header-actions">
          <button className="acpr-btn-secondary">
            <i className="bi bi-pencil-square" /> Modifier mon profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterProfileHeader;
