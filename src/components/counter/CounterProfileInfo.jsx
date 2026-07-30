import clsx from 'clsx';
import { formatDate } from '@data/counterProfileData';

const FIELDS = [
  { key: 'prenom', label: 'Prénom', icon: 'bi-person' },
  { key: 'nom', label: 'Nom', icon: 'bi-person' },
  { key: 'dateNaissance', label: 'Date de naissance', icon: 'bi-calendar-heart', format: 'date' },
  { key: 'sexe', label: 'Sexe', icon: 'bi-gender-ambiguous' },
  { key: 'telephone', label: 'Téléphone', icon: 'bi-telephone', link: 'tel' },
  { key: 'email', label: 'Email', icon: 'bi-envelope', link: 'mailto' },
  { key: 'adresse', label: 'Adresse', icon: 'bi-house-door' },
  { key: 'ville', label: 'Ville', icon: 'bi-building' },
  { key: 'pays', label: 'Pays', icon: 'bi-globe2' },
  { key: 'langue', label: 'Langue', icon: 'bi-chat-dots' },
];

const CounterProfileInfo = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="acpr-card">
      <div className="acpr-card-header">
        <i className="bi bi-person-vcard" />
        <span>Informations personnelles</span>
      </div>
      <div className="acpr-info-grid">
        {FIELDS.map((field) => {
          const raw = profile[field.key];
          let value = raw ?? '—';
          if (field.format === 'date' && raw) value = formatDate(raw);
          if (field.link && raw) {
            const href = field.link === 'tel' ? `tel:${raw}` : `mailto:${raw}`;
            value = (
              <a href={href} className="acpr-info-link">
                {raw}
              </a>
            );
          }
          return (
            <div key={field.key} className="acpr-info-field">
              <span className="acpr-info-label">
                <i className={clsx('bi', field.icon)} /> {field.label}
              </span>
              <span className="acpr-info-value">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CounterProfileInfo;
