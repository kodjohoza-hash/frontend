const statusIcon = (s) => {
  if (s === 'active') return 'bi-check-circle-fill';
  if (s === 'pending') return 'bi-clock';
  return 'bi-x-circle-fill';
};
const statusLabel = (s) => {
  if (s === 'active') return 'Active';
  if (s === 'pending') return 'En attente';
  return 'Suspendue';
};
const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

export default function AgencyProfileHeader({ profile, onEdit }) {
  return (
    <div className="apro-hero">
      <div className="apro-hero__cover">
        <div className="apro-hero__cover-placeholder">
          <i className="bi bi-image" />
        </div>
      </div>
      <div className="apro-hero__body">
        <div className="apro-hero__logo-wrapper">
          <div className="apro-hero__logo">
            {profile.logo ? <img src={profile.logo} alt={profile.name} /> : <span>BTC</span>}
          </div>
        </div>
        <div className="apro-hero__info">
          <div className="apro-hero__name-row">
            <h1 className="apro-hero__name">{profile.name}</h1>
            {profile.verified && (
              <span className="apro-hero__badge">
                <i className="bi bi-patch-check-fill" /> Vérifié
              </span>
            )}
            <span className={`apro-hero__status apro-hero__status--${profile.status}`}>
              <i className={`bi ${statusIcon(profile.status)}`} /> {statusLabel(profile.status)}
            </span>
          </div>
          <p className="apro-hero__slogan">"{profile.slogan}"</p>
          <div className="apro-hero__meta">
            <span className="apro-hero__meta-item">
              <i className="bi bi-geo-alt" /> {profile.city}, {profile.country}
            </span>
            <span className="apro-hero__meta-item">
              <i className="bi bi-calendar" /> Créée le {formatDate(profile.createdAt)}
            </span>
            <span className="apro-hero__meta-item">
              <i className="bi bi-star-fill" style={{color:'#f59e0b'}} /> {profile.rating}/5
            </span>
          </div>
        </div>
        <div className="apro-hero__actions">
          <button className="apro-btn apro-btn--primary" onClick={onEdit}>
            <i className="bi bi-pencil" /> Modifier le profil
          </button>
        </div>
      </div>
    </div>
  );
}
