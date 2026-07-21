import { memo } from 'react';

const DestinationCard = memo(({ destination }) => {
  const { image, name, badge, trips, price, description } = destination;

  return (
    <div className="btc-dest-card" tabIndex={0} role="article" aria-label={`Destination ${name}`}>
      <img
        src={image}
        alt={name}
        className="btc-dest-img"
        loading="lazy"
        decoding="async"
      />
      <div className="btc-dest-overlay">
        {badge && (
          <span className="btc-dest-badge">
            <i className="bi bi-fire" /> {badge}
          </span>
        )}
        <div className="btc-dest-content">
          <h3 className="btc-dest-name">{name}</h3>
          <p className="btc-dest-desc">{description}</p>
          <div className="btc-dest-meta">
            <span className="btc-dest-trips">
              <i className="bi bi-bus-front" /> {trips} trajets
            </span>
            <span className="btc-dest-price">
              À partir de <strong>{price.toLocaleString('fr-FR')} FCFA</strong>
            </span>
          </div>
        </div>
        <div className="btc-dest-cta">
          <button className="btc-dest-cta-btn" tabIndex={-1}>
            Voir les trajets <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
});

DestinationCard.displayName = 'DestinationCard';
export default DestinationCard;
