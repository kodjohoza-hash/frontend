import AgencyDriverStatus from './AgencyDriverStatus';
import { useNavigate } from 'react-router-dom';

export default function AgencyDriverCard({ driver }) {
  const navigate = useNavigate();
  const getInitials = (d) => `${(d.firstName || '')[0] || ''}${(d.lastName || '')[0] || ''}`;
  const genderColor = (g) => g === 'F' ? '#EC4899' : '#3B82F6';

  return (
    <div className="ad-card" onClick={() => navigate(`/company/drivers/${driver.id}`)}>
      <div className="ad-card__header">
        <div className="ad-card__avatar" style={{ background: genderColor(driver.gender) }}>{getInitials(driver)}</div>
        <div className="ad-card__title-group">
          <span className="ad-card__name">{driver.firstName} {driver.lastName}</span>
          <span className="ad-card__id">{driver.id}</span>
        </div>
        <AgencyDriverStatus status={driver.status} />
      </div>
      <div className="ad-card__body">
        <div className="ad-card__info-row"><span className="ad-card__info-label">Téléphone</span><span className="ad-card__info-value">{driver.phone}</span></div>
        <div className="ad-card__info-row"><span className="ad-card__info-label">Ville</span><span className="ad-card__info-value">{driver.city}</span></div>
        <div className="ad-card__info-row"><span className="ad-card__info-label">Permis</span><span className="ad-card__info-value">Cat. {driver.licenseCategory}</span></div>
        <div className="ad-card__info-row"><span className="ad-card__info-label">Expérience</span><span className="ad-card__info-value">{driver.experience} ans</span></div>
        {driver.assignedBus && <div className="ad-card__info-row"><span className="ad-card__info-label">Bus</span><span className="ad-card__info-value">{driver.assignedBus}</span></div>}
        {driver.currentTrip && <div className="ad-card__info-row"><span className="ad-card__info-label">Voyage</span><span className="ad-card__info-value">{driver.currentTrip}</span></div>}
      </div>
      <div className="ad-card__footer">
        <button className="ad-card__btn ad-card__btn--primary" onClick={(e) => { e.stopPropagation(); navigate(`/company/drivers/${driver.id}`); }}><i className="bi bi-eye" /> Voir</button>
        <button className="ad-card__btn ad-card__btn--outline" onClick={(e) => e.stopPropagation()}><i className="bi bi-pencil" /> Modifier</button>
      </div>
    </div>
  );
}
