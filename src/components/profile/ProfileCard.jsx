import { useState } from 'react';
import clsx from 'clsx';

const genderLabel = (g) => {
  const map = { male: 'Homme', female: 'Femme', other: 'Autre' };
  return map[g] || 'Non renseigné';
};

const ProfileCard = ({ user }) => {
  const [avatarHover, setAvatarHover] = useState(false);

  const initials = ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase();
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '';

  const fields = [
    { icon: 'bi-envelope-fill', label: 'Email', value: user?.email },
    { icon: 'bi-telephone-fill', label: 'Téléphone', value: user?.phone || 'Non renseigné' },
    { icon: 'bi-gender-ambiguous', label: 'Sexe', value: genderLabel(user?.gender) },
    { icon: 'bi-calendar3', label: 'Date de naissance', value: user?.birthDate
      ? new Date(user.birthDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Non renseigné'
    },
    { icon: 'bi-geo-alt-fill', label: 'Ville', value: user?.city || 'Non renseigné' },
    { icon: 'bi-flag-fill', label: 'Pays', value: user?.country || 'Non renseigné' },
    { icon: 'bi-translate', label: 'Langue', value: 'Français' },
  ];

  return (
    <div className="pf-card pf-card--profile">
      <div className="pf-card__header">
        <div className="pf-card__header-line" />
        <span className="pf-card__header-label">
          <i className="bi bi-person-badge" />
          Profil
        </span>
        <div className="pf-card__header-line" />
      </div>

      <div
        className="pf-profile"
        onMouseEnter={() => setAvatarHover(true)}
        onMouseLeave={() => setAvatarHover(false)}
      >
        <div className="pf-profile__avatar-wrapper">
          {user?.avatar ? (
            <img src={user.avatar} alt={fullName} className="pf-profile__avatar-img" />
          ) : (
            <div className="pf-profile__avatar-initials">{initials}</div>
          )}
          <button
            type="button"
            className={clsx('pf-profile__avatar-btn', avatarHover && 'pf-profile__avatar-btn--visible')}
            aria-label="Modifier la photo de profil"
          >
            <i className="bi bi-camera-fill" />
          </button>
        </div>

        <div className="pf-profile__info">
          <h2 className="pf-profile__name">{fullName}</h2>
          <p className="pf-profile__email">{user?.email}</p>
          {memberSince && (
            <span className="pf-profile__member">
              <i className="bi bi-calendar2-check" />
              Membre depuis {memberSince}
            </span>
          )}
        </div>
      </div>

      <div className="pf-profile__fields">
        {fields.map((f) => (
          <div key={f.label} className="pf-profile__field">
            <div className="pf-profile__field-icon">
              <i className={f.icon} />
            </div>
            <div className="pf-profile__field-content">
              <span className="pf-profile__field-label">{f.label}</span>
              <span className="pf-profile__field-value">{f.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
