import AgencyTripStatus from './AgencyTripStatus';
import AgencyTripTimeline from './AgencyTripTimeline';
import { tripReservations } from '../../data/agencyTripsData';

export default function AgencyTripDetails({ trip }) {
  if (!trip) return null;

  const occupancy = Math.round((trip.soldSeats / trip.totalSeats) * 100);

  return (
    <div className="at-detail">
      <div className="at-detail__header">
        <div className="at-detail__title-row">
          <div>
            <h2 className="at-detail__id">{trip.id}</h2>
            <span className="at-detail__route">
              {trip.from} <i className="bi bi-arrow-right" /> {trip.to}
            </span>
          </div>
          <AgencyTripStatus status={trip.status} size="md" />
        </div>
      </div>

      <div className="at-detail__grid">
        <div className="at-detail__card">
          <h4 className="at-detail__card-title">
            <i className="bi bi-geo-alt" /> Itinéraire
          </h4>
          <div className="at-detail__fields">
            <div className="at-detail__field">
              <span className="at-detail__label">Départ</span>
              <span className="at-detail__value">{trip.from}</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Point de départ</span>
              <span className="at-detail__value">{trip.fromPoint}</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Destination</span>
              <span className="at-detail__value">{trip.to}</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Point d'arrivée</span>
              <span className="at-detail__value">{trip.toPoint}</span>
            </div>
          </div>
        </div>

        <div className="at-detail__card">
          <h4 className="at-detail__card-title">
            <i className="bi bi-clock" /> Horaire
          </h4>
          <div className="at-detail__fields">
            <div className="at-detail__field">
              <span className="at-detail__label">Date</span>
              <span className="at-detail__value">
                {new Date(trip.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Heure de départ</span>
              <span className="at-detail__value">{trip.departure}</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Arrivée estimée</span>
              <span className="at-detail__value">{trip.arrival}</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Créé le</span>
              <span className="at-detail__value">
                {new Date(trip.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        <div className="at-detail__card">
          <h4 className="at-detail__card-title">
            <i className="bi bi-bus-front" /> Véhicule & Personnel
          </h4>
          <div className="at-detail__fields">
            <div className="at-detail__field">
              <span className="at-detail__label">Bus</span>
              <span className="at-detail__value">{trip.bus.name} ({trip.bus.plate})</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Type</span>
              <span className="at-detail__value at-detail__value--type">{trip.type}</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Chauffeur</span>
              <span className="at-detail__value">{trip.driver.name}</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Téléphone</span>
              <span className="at-detail__value">{trip.driver.phone}</span>
            </div>
          </div>
        </div>

        <div className="at-detail__card">
          <h4 className="at-detail__card-title">
            <i className="bi bi-ticket-perforated" /> Réservations
          </h4>
          <div className="at-detail__fields">
            <div className="at-detail__field">
              <span className="at-detail__label">Places totales</span>
              <span className="at-detail__value">{trip.totalSeats}</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Places vendues</span>
              <span className="at-detail__value">{trip.soldSeats}</span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Taux d'occupation</span>
              <span className="at-detail__value">
                <span className={`at-detail__occupancy ${occupancy >= 90 ? 'at-detail__occupancy--full' : occupancy >= 70 ? 'at-detail__occupancy--high' : ''}`}>
                  {occupancy}%
                </span>
              </span>
            </div>
            <div className="at-detail__field">
              <span className="at-detail__label">Tarif</span>
              <span className="at-detail__value">{trip.price.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
          {trip.notes && (
            <div className="at-detail__notes">
              <i className="bi bi-info-circle" />
              <span>{trip.notes}</span>
            </div>
          )}
        </div>
      </div>

      <div className="at-detail__bottom">
        <div className="at-detail__card at-detail__card--timeline">
          <h4 className="at-detail__card-title">
            <i className="bi bi-hourglass-split" /> Chronologie
          </h4>
          <AgencyTripTimeline status={trip.status} />
        </div>

        <div className="at-detail__card at-detail__card--reservations">
          <h4 className="at-detail__card-title">
            <i className="bi bi-list-check" /> Dernières réservations
          </h4>
          <div className="at-detail__res-list">
            {tripReservations.slice(0, 5).map((res) => (
              <div key={res.id} className="at-detail__res-item">
                <div className="at-detail__res-info">
                  <span className="at-detail__res-id">{res.id}</span>
                  <span className="at-detail__res-name">{res.passenger}</span>
                  <span className="at-detail__res-seats">Places: {res.seats.join(', ')}</span>
                </div>
                <div className="at-detail__res-meta">
                  <span className="at-detail__res-total">{res.total.toLocaleString('fr-FR')} FCFA</span>
                  <span className={`at-detail__res-status at-detail__res-status--${res.status}`}>
                    {res.status === 'confirmee' ? 'Confirmée' : 'Annulée'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
