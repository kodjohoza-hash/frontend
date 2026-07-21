import React from 'react';

const DestinationCard = React.memo(({ destination, index }) => (
  <div className={`btc-dest-card ${index >= 4 ? 'btc-dest-card--wide' : ''}`}>
    <img src={destination.image} alt={destination.name} className="btc-dest-img" loading="lazy" />
    <div className="btc-dest-overlay">
      <div className="btc-dest-content">
        <h3 className="btc-dest-name">{destination.name}</h3>
        <span className="btc-dest-trips">
          <i className="bi bi-bus-front me-1" />
          {destination.trips} voyages
        </span>
        {destination.price && (
          <span className="btc-dest-price">À partir de <strong>{destination.price.toLocaleString('fr-FR')} FCFA</strong></span>
        )}
      </div>
      <div className="btc-dest-cta">
        <span className="btc-dest-cta-btn">
          Explorer <i className="bi bi-arrow-right" />
        </span>
      </div>
    </div>
  </div>
));

DestinationCard.displayName = 'DestinationCard';
export default DestinationCard;
