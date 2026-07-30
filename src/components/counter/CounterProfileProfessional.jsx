import clsx from 'clsx';
import { formatDate, formatTime } from '@data/counterProfileData';

const FIELDS = [
  { key: 'employeeId', label: 'Matricule', icon: 'bi-credit-card-2-front' },
  { key: 'compagnie', label: 'Compagnie', icon: 'bi-building' },
  { key: 'pointVente', label: 'Point de vente', icon: 'bi-shop' },
  { key: 'supervisor', label: 'Responsable direct', icon: 'bi-person-up' },
  { key: 'dateEmbauche', label: "Date d'embauche", icon: 'bi-calendar-plus', format: 'date' },
  { key: 'schedule', label: 'Horaires', icon: 'bi-clock' },
  { key: 'statut', label: 'Statut', icon: 'bi-shield-check' },
];

const CounterProfileProfessional = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="acpr-card">
      <div className="acpr-card-header">
        <i className="bi bi-briefcase" />
        <span>Informations professionnelles</span>
      </div>
      <div className="acpr-info-grid">
        {FIELDS.map((field) => {
          const raw = profile[field.key];
          let value = raw ?? '—';
          if (field.format === 'date' && raw) value = formatDate(raw);
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

export default CounterProfileProfessional;
