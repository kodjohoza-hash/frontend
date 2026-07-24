import AgencyBusStatus from './AgencyBusStatus';
import { useNavigate } from 'react-router-dom';
import { busBrands } from '../../data/agencyBusData';

export default function AgencyBusCard({ bus }) {
  const navigate = useNavigate();
  const getBrandLabel = (val) => busBrands.find((b) => b.value === val)?.label || val;
  const getAmenitiesCount = (bus) => Object.values(bus.amenities).filter(Boolean).length;

  return (
    <div className="ab-card" onClick={() => navigate(`/company/buses/${bus.id}`)}>
      <div className="ab-card__header">
        <div className="ab-card__photo" style={{ borderColor: bus.color || '#E5E7EB' }}>
          <i className="bi bi-bus-front-fill" style={{ color: bus.color || '#6B7280' }} />
        </div>
        <div className="ab-card__title-group">
          <span className="ab-card__plate">{bus.plate}</span>
          <span className="ab-card__internal">{bus.internalNumber}</span>
        </div>
        <AgencyBusStatus status={bus.status} />
      </div>
      <div className="ab-card__body">
        <div className="ab-card__info-row">
          <span className="ab-card__info-label">Marque</span>
          <span className="ab-card__info-value">{getBrandLabel(bus.brand)} {bus.model}</span>
        </div>
        <div className="ab-card__info-row">
          <span className="ab-card__info-label">Places</span>
          <span className="ab-card__info-value">{bus.seats}</span>
        </div>
        <div className="ab-card__info-row">
          <span className="ab-card__info-label">Type</span>
          <span className="ab-card__info-value ab-card__info-value--capitalize">{bus.type}</span>
        </div>
        <div className="ab-card__info-row">
          <span className="ab-card__info-label">Équipements</span>
          <span className="ab-card__info-value">{getAmenitiesCount(bus)} options</span>
        </div>
        {bus.currentDriver && (
          <div className="ab-card__info-row">
            <span className="ab-card__info-label">Chauffeur</span>
            <span className="ab-card__info-value">{bus.currentDriver.name}</span>
          </div>
        )}
      </div>
      <div className="ab-card__footer">
        <button className="ab-card__btn ab-card__btn--primary" onClick={(e) => { e.stopPropagation(); navigate(`/company/buses/${bus.id}`); }}>
          <i className="bi bi-eye" /> Voir
        </button>
        <button className="ab-card__btn ab-card__btn--outline" onClick={(e) => e.stopPropagation()}>
          <i className="bi bi-pencil" /> Modifier
        </button>
      </div>
    </div>
  );
}
