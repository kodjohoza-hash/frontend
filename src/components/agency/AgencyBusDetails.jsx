import clsx from 'clsx';
import AgencyBusStatus from './AgencyBusStatus';
import AgencySeatConfigurator from './AgencySeatConfigurator';
import AgencyMaintenanceHistory from './AgencyMaintenanceHistory';
import { busBrands, amenities as amenitiesList } from '../../data/agencyBusData';

export default function AgencyBusDetails({ bus }) {
  if (!bus) return null;

  const getBrandLabel = (val) => busBrands.find((b) => b.value === val)?.label || val;

  const getActiveAmenities = () => {
    return amenitiesList.filter((a) => bus.amenities?.[a.key]);
  };

  const activeAmenities = getActiveAmenities();

  return (
    <div className="abd">
      <div className="abd__header">
        <div className="abd__header-left">
          <div className="abd__photo" style={{ borderColor: bus.color || '#E5E7EB' }}>
            <i className="bi bi-bus-front-fill" style={{ color: bus.color || '#6B7280', fontSize: '2rem' }} />
          </div>
          <div>
            <div className="abd__title-row">
              <h2 className="abd__id">{bus.plate}</h2>
              <span className="abd__internal">{bus.internalNumber}</span>
              <AgencyBusStatus status={bus.status} size="md" />
            </div>
            <p className="abd__subtitle">{getBrandLabel(bus.brand)} {bus.model} — {bus.year}</p>
          </div>
        </div>
        <div className="abd__header-stats">
          <div className="abd__header-stat">
            <span className="abd__header-stat-value">{bus.tripCount}</span>
            <span className="abd__header-stat-label">Voyages</span>
          </div>
          <div className="abd__header-stat">
            <span className="abd__header-stat-value">{(bus.totalKm || 0).toLocaleString('fr-FR')}</span>
            <span className="abd__header-stat-label">km total</span>
          </div>
          <div className="abd__header-stat">
            <span className="abd__header-stat-value">{bus.avgOccupancy}%</span>
            <span className="abd__header-stat-label">Occupation</span>
          </div>
        </div>
      </div>

      <div className="abd__grid">
        <div className="abd__card">
          <h4 className="abd__card-title"><i className="bi bi-info-circle" /> Informations générales</h4>
          <div className="abd__fields">
            <div className="abd__field"><span className="abd__label">Immatriculation</span><span className="abd__value">{bus.plate}</span></div>
            <div className="abd__field"><span className="abd__label">N° interne</span><span className="abd__value">{bus.internalNumber}</span></div>
            <div className="abd__field"><span className="abd__label">Marque</span><span className="abd__value">{getBrandLabel(bus.brand)}</span></div>
            <div className="abd__field"><span className="abd__label">Modèle</span><span className="abd__value">{bus.model}</span></div>
            <div className="abd__field"><span className="abd__label">Année</span><span className="abd__value">{bus.year}</span></div>
            <div className="abd__field"><span className="abd__label">Type</span><span className="abd__value abd__value--capitalize">{bus.type}</span></div>
            <div className="abd__field"><span className="abd__label">Classe</span><span className="abd__value abd__value--capitalize">{bus.class}</span></div>
            <div className="abd__field"><span className="abd__label">Places</span><span className="abd__value">{bus.seats}</span></div>
            <div className="abd__field"><span className="abd__label">Carburant</span><span className="abd__value abd__value--capitalize">{bus.fuelType}</span></div>
            <div className="abd__field"><span className="abd__label">Couleur</span><span className="abd__value"><span className="abd__color-dot" style={{ background: bus.color }} /> {bus.color}</span></div>
          </div>
          {bus.notes && <div className="abd__notes"><i className="bi bi-info-circle" /> {bus.notes}</div>}
        </div>

        <div className="abd__card">
          <h4 className="abd__card-title"><i className="bi bi-speedometer" /> Statistiques</h4>
          <div className="abd__fields">
            <div className="abd__field"><span className="abd__label">Total voyages</span><span className="abd__value">{bus.tripCount}</span></div>
            <div className="abd__field"><span className="abd__label">Kilométrage</span><span className="abd__value">{(bus.totalKm || 0).toLocaleString('fr-FR')} km</span></div>
            <div className="abd__field"><span className="abd__label">Occupation moy.</span><span className="abd__value">{bus.avgOccupancy}%</span></div>
            <div className="abd__field"><span className="abd__label">Mise en service</span><span className="abd__value">{new Date(bus.serviceDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
            <div className="abd__field"><span className="abd__label">Dernière maintenance</span><span className="abd__value">{new Date(bus.lastMaintenance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
            <div className="abd__field"><span className="abd__label">Prochaine maintenance</span><span className="abd__value">{new Date(bus.nextMaintenance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
          </div>
        </div>

        <div className="abd__card">
          <h4 className="abd__card-title"><i className="bi bi-gear" /> Équipements</h4>
          <div className="abd__amenities-grid">
            {amenitiesList.map((a) => (
              <div key={a.key} className={clsx('abd__amenity', { 'abd__amenity--active': bus.amenities?.[a.key] })}>
                <i className={`bi ${a.icon}`} />
                <span>{a.label}</span>
                <i className={clsx('bi', bus.amenities?.[a.key] ? 'bi-check-circle-fill' : 'bi-x-circle')} />
              </div>
            ))}
          </div>
        </div>

        <div className="abd__card">
          <h4 className="abd__card-title"><i className="bi bi-person-badge" /> Chauffeur actuel</h4>
          {bus.currentDriver ? (
            <div className="abd__driver">
              <div className="abd__driver-avatar"><i className="bi bi-person-fill" /></div>
              <div className="abd__driver-info">
                <span className="abd__driver-name">{bus.currentDriver.name}</span>
                <span className="abd__driver-id">{bus.currentDriver.id}</span>
                <span className="abd__driver-phone"><i className="bi bi-telephone" /> {bus.currentDriver.phone}</span>
              </div>
            </div>
          ) : (
            <div className="abd__no-driver">
              <i className="bi bi-person-x" />
              <span>Aucun chauffeur assigné</span>
            </div>
          )}
        </div>
      </div>

      <div className="abd__card abd__card--full">
        <h4 className="abd__card-title"><i className="bi bi-grid-3x3-gap" /> Plan des sièges</h4>
        <AgencySeatConfigurator
          layout={bus.seatLayout || { rows: 12, seatsPerSide: 2, aisleAfter: [6], vipRows: [], pmrSeats: [] }}
          totalSeats={bus.seats}
          readonly
        />
      </div>

      <div className="abd__card abd__card--full">
        <h4 className="abd__card-title"><i className="bi bi-wrench" /> Historique des maintenances</h4>
        <AgencyMaintenanceHistory busId={bus.id} />
      </div>
    </div>
  );
}
