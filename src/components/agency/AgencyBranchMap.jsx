import React from 'react';

export default function AgencyBranchMap({ lat, lng, name, address }) {
  return (
    <div className="abr-map">
      <h4><i className="bi bi-map" /> Carte</h4>
      <div className="abr-map__placeholder">
        <div className="abr-map__inner">
          <i className="bi bi-geo-alt-fill" />
          <h5>Carte interactive</h5>
          <p>{address}</p>
          <div className="abr-map__coords">
            <span><i className="bi bi-crosshair" /> Lat: {lat}</span>
            <span><i className="bi bi-crosshair" /> Lng: {lng}</span>
          </div>
          <button className="abr-map__open-btn">
            <i className="bi bi-box-arrow-up-right" /> Ouvrir dans Google Maps
          </button>
        </div>
      </div>
    </div>
  );
}
