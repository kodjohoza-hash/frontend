import AgencyDriverStatus from './AgencyDriverStatus';
import AgencyDriverPerformance from './AgencyDriverPerformance';
import AgencyDriverDocuments from './AgencyDriverDocuments';

export default function AgencyDriverDetails({ driver }) {
  if (!driver) return null;
  const getInitials = (d) => `${(d.firstName || '')[0] || ''}${(d.lastName || '')[0] || ''}`;
  const genderColor = (g) => g === 'F' ? '#EC4899' : '#3B82F6';
  const age = driver.dateOfBirth ? Math.floor((Date.now() - new Date(driver.dateOfBirth).getTime()) / 31557600000) : '—';

  return (
    <div className="add">
      <div className="add__header">
        <div className="add__header-left">
          <div className="add__avatar" style={{ background: genderColor(driver.gender) }}>{getInitials(driver)}</div>
          <div>
            <div className="add__title-row">
              <h2 className="add__name">{driver.firstName} {driver.lastName}</h2>
              <span className="add__id">{driver.id}</span>
              <AgencyDriverStatus status={driver.status} size="md" />
            </div>
            <p className="add__subtitle">{driver.phone} · {driver.email}</p>
          </div>
        </div>
        <div className="add__header-stats">
          <div className="add__header-stat"><span className="add__header-stat-value">{driver.performance.totalTrips}</span><span className="add__header-stat-label">Voyages</span></div>
          <div className="add__header-stat"><span className="add__header-stat-value">{(driver.performance.totalKm / 1000).toFixed(0)}k</span><span className="add__header-stat-label">km</span></div>
          <div className="add__header-stat"><span className="add__header-stat-value">{driver.performance.satisfaction}/5</span><span className="add__header-stat-label">Satisfaction</span></div>
        </div>
      </div>

      <div className="add__grid">
        <div className="add__card">
          <h4 className="add__card-title"><i className="bi bi-person" /> Informations personnelles</h4>
          <div className="add__fields">
            <div className="add__field"><span className="add__label">Nom complet</span><span className="add__value">{driver.firstName} {driver.lastName}</span></div>
            <div className="add__field"><span className="add__label">Date de naissance</span><span className="add__value">{driver.dateOfBirth ? new Date(driver.dateOfBirth).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} ({age} ans)</span></div>
            <div className="add__field"><span className="add__label">Sexe</span><span className="add__value">{driver.gender === 'M' ? 'Masculin' : 'Féminin'}</span></div>
            <div className="add__field"><span className="add__label">Ville</span><span className="add__value">{driver.city}, {driver.country}</span></div>
            <div className="add__field"><span className="add__label">Adresse</span><span className="add__value">{driver.address || '—'}</span></div>
            <div className="add__field"><span className="add__label">Date d'embauche</span><span className="add__value">{new Date(driver.hireDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
            <div className="add__field"><span className="add__label">Expérience</span><span className="add__value">{driver.experience} ans</span></div>
          </div>
        </div>

        <div className="add__card">
          <h4 className="add__card-title"><i className="bi bi-card-heading" /> Permis de conduire</h4>
          <div className="add__fields">
            <div className="add__field"><span className="add__label">N° permis</span><span className="add__value add__value--mono">{driver.licenseNumber}</span></div>
            <div className="add__field"><span className="add__label">Catégorie</span><span className="add__value">Cat. {driver.licenseCategory}</span></div>
            <div className="add__field"><span className="add__label">Obtention</span><span className="add__value">{new Date(driver.licenseObtained).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
            <div className="add__field"><span className="add__label">Expiration</span><span className="add__value">{new Date(driver.licenseExpiry).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
          </div>
        </div>

        <div className="add__card">
          <h4 className="add__card-title"><i className="bi bi-bus-front" /> Affectation</h4>
          <div className="add__fields">
            <div className="add__field"><span className="add__label">Bus actuel</span><span className="add__value">{driver.assignedBus || 'Non assigné'}</span></div>
            <div className="add__field"><span className="add__label">Voyage actuel</span><span className="add__value">{driver.currentTrip || 'Aucun'}</span></div>
            <div className="add__field"><span className="add__label">Téléphone</span><span className="add__value">{driver.phone}</span></div>
            <div className="add__field"><span className="add__label">Email</span><span className="add__value">{driver.email}</span></div>
          </div>
          {driver.observations && <div className="add__notes"><i className="bi bi-info-circle" /> {driver.observations}</div>}
        </div>

        <div className="add__card">
          <h4 className="add__card-title"><i className="bi bi-speedometer2" /> Statistiques</h4>
          <div className="add__perf-stats">
            <div className="add__perf-stat"><div className="add__perf-stat__ring" style={{ '--pct': driver.performance.punctuation }}><span>{driver.performance.punctuation}%</span></div><span className="add__perf-stat__label">Ponctualité</span></div>
            <div className="add__perf-stat"><div className="add__perf-stat__ring" style={{ '--pct': driver.performance.satisfaction * 20 }}><span>{driver.performance.satisfaction}/5</span></div><span className="add__perf-stat__label">Satisfaction</span></div>
            <div className="add__perf-stat"><div className="add__perf-stat__ring" style={{ '--pct': Math.max(0, 100 - driver.performance.incidents * 5) }}><span>{driver.performance.incidents}</span></div><span className="add__perf-stat__label">Incidents</span></div>
          </div>
        </div>
      </div>

      <div className="add__card add__card--full">
        <h4 className="add__card-title"><i className="bi bi-bar-chart-line" /> Tableau de bord performance</h4>
        <AgencyDriverPerformance driver={driver} />
      </div>

      <div className="add__card add__card--full">
        <h4 className="add__card-title"><i className="bi bi-folder2-open" /> Documents</h4>
        <AgencyDriverDocuments driver={driver} />
      </div>
    </div>
  );
}
