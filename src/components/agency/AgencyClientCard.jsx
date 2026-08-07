import clsx from 'clsx';
import AgencyClientStatus from './AgencyClientStatus';

const formatCurrency = (v) => (v ?? 0).toLocaleString('fr-FR') + ' XAF';

export default function AgencyClientCard({ client, onView }) {
  return (
    <div className="ac-card" onClick={() => onView?.(client)}>
      <div className="ac-card__top">
        <div className="ac-avatar ac-avatar--lg">{client.firstName?.charAt(0).toUpperCase()}</div>
        <div className="ac-card__info">
          <span className="ac-card__name">{client.firstName} {client.lastName}</span>
          <span className="ac-card__phone">{client.phone}</span>
        </div>
        <AgencyClientStatus status={client.status} />
      </div>
      <div className="ac-card__stats">
        <div className="ac-card__stat">
          <i className="bi bi-bus-front" />
          <span>{client.totalTrips ?? 0} voyages</span>
        </div>
        <div className="ac-card__stat">
          <i className="bi bi-credit-card" />
          <span>{formatCurrency(client.totalSpent)}</span>
        </div>
      </div>
      <div className="ac-card__email">
        <i className="bi bi-envelope" />
        <span>{client.email}</span>
      </div>
    </div>
  );
}
