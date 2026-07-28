import clsx from 'clsx';
import AgencyClientLoyalty from './AgencyClientLoyalty';
import AgencyClientTimeline from './AgencyClientTimeline';
import AgencyClientNotes from './AgencyClientNotes';

const STATUS_LABELS = {
  actif: 'Actif',
  inactif: 'Inactif',
  suspendu: 'Suspendu',
};

const STATUS_COLORS = {
  actif: 'success',
  inactif: 'muted',
  suspendu: 'danger',
};

const LOYALTY_LABELS = {
  bronze: 'Bronze',
  argent: 'Argent',
  or: 'Or',
  platine: 'Platine',
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function AgencyClientProfile({
  client,
  onBack,
  onEdit,
  onViewBookings,
  onViewTickets,
  onViewPayments,
  onContact,
}) {
  if (!client) return null;

  const initial = (client.firstName || '')[0] || '?';
  const statusColor = STATUS_COLORS[client.status] || 'muted';
  const statusLabel = STATUS_LABELS[client.status] || client.status;

  return (
    <div className="ac-profile">
      <button className="ac-profile__back" onClick={onBack}>
        <i className="bi bi-arrow-left" /> Retour aux clients
      </button>

      <div className="ac-profile__header">
        <div className="ac-profile__avatar">
          {initial}
        </div>
        <div className="ac-profile__header-info">
          <div className="ac-profile__name-row">
            <h2 className="ac-profile__name">
              {client.firstName} {client.lastName}
            </h2>
            <span className={clsx('ac-profile__status', `ac-profile__status--${statusColor}`)}>
              {statusLabel}
            </span>
            {client.vip && (
              <span className="ac-profile__vip">
                <i className="bi bi-star-fill" /> VIP
              </span>
            )}
          </div>
          <div className="ac-profile__meta">
            <span><i className="bi bi-envelope" /> {client.email}</span>
            <span><i className="bi bi-telephone" /> {client.phone}</span>
            <span><i className="bi bi-geo-alt" /> {client.city}</span>
          </div>
        </div>
        <div className="ac-profile__header-actions">
          <button className="ac-profile__action-btn" onClick={() => onEdit(client)}>
            <i className="bi bi-pencil" /> Modifier
          </button>
          <button className="ac-profile__action-btn ac-profile__action-btn--primary" onClick={() => onContact(client)}>
            <i className="bi bi-chat-dots" /> Contacter
          </button>
        </div>
      </div>

      <div className="ac-profile__grid">
        <div className="ac-profile__grid-left">
          <div className="ac-profile__card">
            <h4 className="ac-profile__card-title">
              <i className="bi bi-info-circle" /> Informations
            </h4>
            <div className="ac-profile__fields">
              <div className="ac-profile__field">
                <span className="ac-profile__label">Adresse</span>
                <span className="ac-profile__value">{client.address || '—'}</span>
              </div>
              <div className="ac-profile__field">
                <span className="ac-profile__label">Pays</span>
                <span className="ac-profile__value">{client.country || '—'}</span>
              </div>
              <div className="ac-profile__field">
                <span className="ac-profile__label">Inscrit depuis</span>
                <span className="ac-profile__value">{client.registeredSince ? formatDate(client.registeredSince) : '—'}</span>
              </div>
              <div className="ac-profile__field">
                <span className="ac-profile__label">Siège préféré</span>
                <span className="ac-profile__value">{client.preferredSeat || '—'}</span>
              </div>
              <div className="ac-profile__field">
                <span className="ac-profile__label">Classe</span>
                <span className="ac-profile__value">{client.class || '—'}</span>
              </div>
              <div className="ac-profile__field">
                <span className="ac-profile__label">Moyen de paiement</span>
                <span className="ac-profile__value">{client.paymentMethod || '—'}</span>
              </div>
              {client.documents && client.documents.length > 0 && (
                <div className="ac-profile__field">
                  <span className="ac-profile__label">Documents</span>
                  <span className="ac-profile__value">{client.documents.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="ac-profile__card">
            <AgencyClientLoyalty client={client} />
          </div>
        </div>

        <div className="ac-profile__grid-right">
          <div className="ac-profile__card">
            <AgencyClientNotes
              notes={client.notes}
              onAddNote={() => {}}
            />
          </div>
        </div>
      </div>

      {client.timeline && client.timeline.length > 0 && (
        <div className="ac-profile__card ac-profile__card--full">
          <h4 className="ac-profile__card-title">
            <i className="bi bi-hourglass-split" /> Chronologie
          </h4>
          <AgencyClientTimeline events={client.timeline} />
        </div>
      )}

      <div className="ac-profile__quick-actions">
        <h4 className="ac-profile__quick-actions-title">
          <i className="bi bi-lightning" /> Actions rapides
        </h4>
        <div className="ac-profile__quick-actions-row">
          <button className="ac-profile__qa-btn" onClick={() => onViewBookings(client)}>
            <i className="bi bi-journal" /> Réservations
          </button>
          <button className="ac-profile__qa-btn" onClick={() => onViewTickets(client)}>
            <i className="bi bi-ticket" /> Billets
          </button>
          <button className="ac-profile__qa-btn" onClick={() => onViewPayments(client)}>
            <i className="bi bi-credit-card" /> Paiements
          </button>
          <button className="ac-profile__qa-btn" onClick={() => onContact(client)}>
            <i className="bi bi-envelope" /> Envoyer un message
          </button>
          <button className="ac-profile__qa-btn" onClick={() => onEdit(client)}>
            <i className="bi bi-pencil-square" /> Éditer
          </button>
        </div>
      </div>
    </div>
  );
}
