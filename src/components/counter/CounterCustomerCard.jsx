import clsx from 'clsx';

const STATUS_CONFIG = {
  nouveau: { color: '#10B981', label: 'Nouveau' },
  actif: { color: '#3B82F6', label: 'Actif' },
  vip: { color: '#8B5CF6', label: 'VIP' },
  inactif: { color: '#6B7280', label: 'Inactif' },
  suspendu: { color: '#EF4444', label: 'Suspendu' },
};

const CounterCustomerCard = ({ customer, onAction, index = 0 }) => {
  const st = STATUS_CONFIG[customer.status] || STATUS_CONFIG.actif;
  const initials = (customer.nom || '')
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="acc-mobile-card" style={{ '--i': index }}>
      <div className="acc-mobile-card-top">
        <div className="acc-mobile-card-photo">
          {customer.photo ? (
            <img src={customer.photo} alt={customer.nom} />
          ) : (
            <span>{initials}</span>
          )}
          <span className="acc-mobile-card-online" style={{ background: customer.online ? '#10B981' : '#9CA3AF' }} />
        </div>
        <div className="acc-mobile-card-info">
          <div className="acc-mobile-card-name">{customer.nom}</div>
          <div className="acc-mobile-card-phone">
            <i className="bi bi-telephone" /> {customer.telephone}
          </div>
          <div className="acc-mobile-card-email">
            <i className="bi bi-envelope" /> {customer.email}
          </div>
          <div className="acc-mobile-card-city">
            <i className="bi bi-geo-alt" /> {customer.ville}
          </div>
        </div>
        <span
          className="acc-status-badge"
          style={{ background: `${st.color}15`, color: st.color, borderColor: `${st.color}30` }}
        >
          {st.label}
        </span>
      </div>
      <div className="acc-mobile-card-trips">
        <i className="bi bi-bus-front" /> {customer.totalVoyages || 0} voyages
      </div>
      <div className="acc-mobile-card-actions">
        <button className="acc-action-btn" onClick={() => onAction?.('view', customer)} title="Voir">
          <i className="bi bi-eye" />
        </button>
        <button className="acc-action-btn" onClick={() => onAction?.('edit', customer)} title="Modifier">
          <i className="bi bi-pencil" />
        </button>
        <button className="acc-action-btn" onClick={() => onAction?.('reservation', customer)} title="Nouvelle réservation">
          <i className="bi bi-plus-circle" />
        </button>
        <button className="acc-action-btn" onClick={() => onAction?.('sale', customer)} title="Nouvelle vente">
          <i className="bi bi-cart-plus" />
        </button>
        <button className="acc-action-btn" onClick={() => onAction?.('notes', customer)} title="Notes">
          <i className="bi bi-sticky" />
        </button>
      </div>
    </div>
  );
};

export default CounterCustomerCard;
