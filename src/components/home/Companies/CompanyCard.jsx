import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AMENITY_MAP = {
  wifi: { icon: 'bi-wifi', label: 'Wi-Fi' },
  usb: { icon: 'bi-usb-c', label: 'Chargeur USB' },
  climatisation: { icon: 'bi-snow', label: 'Climatisation' },
  toilettes: { icon: 'bi-droplet', label: 'Toilettes' },
};

const CompanyCard = React.memo(({ company }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="btc-company-card">
      <div className="btc-company-img-wrap">
        {!imgLoaded && <div className="btc-company-img-skeleton" />}
        <img
          src={company.image}
          alt={`Bus ${company.name}`}
          className={`btc-company-img ${imgLoaded ? 'is-loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&q=80';
            setImgLoaded(true);
          }}
        />
        {company.verified && (
          <span className="btc-company-badge">
            <i className="bi bi-patch-check-fill" /> Vérifié
          </span>
        )}
        <div className="btc-company-rating">
          <i className="bi bi-star-fill" /> {company.rating}
        </div>
      </div>

      <div className="btc-company-body">
        <h3 className="btc-company-name">{company.name}</h3>

        <div className="btc-company-cities">
          <i className="bi bi-geo-alt" />
          <span>{company.cities.join(' · ')}</span>
        </div>

        <div className="btc-company-meta">
          <span><i className="bi bi-bus-front" /> {company.trips} voyages</span>
        </div>

        <div className="btc-company-amenities">
          {(company.amenities || []).map((a) => (
            AMENITY_MAP[a] ? (
              <span key={a} className="btc-company-amenity" title={AMENITY_MAP[a].label}>
                <i className={`bi ${AMENITY_MAP[a].icon}`} />
              </span>
            ) : null
          ))}
        </div>

        <div className="btc-company-footer">
          <span className="btc-company-price">
            À partir de <strong>{company.price.toLocaleString('fr-FR')} FCFA</strong>
          </span>
          <button className="btc-company-btn" onClick={() => navigate('/booking/search')} aria-label={`Voir les trajets de ${company.name}`}>
            Voir les trajets <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
});

CompanyCard.displayName = 'CompanyCard';
export default CompanyCard;
