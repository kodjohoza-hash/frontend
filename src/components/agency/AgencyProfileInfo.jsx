export default function AgencyProfileInfo({ profile }) {
  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-building" /> Informations générales</h3>
      </div>
      <div className="apro-section__body">
        <div className="apro-info-grid">
          <div className="apro-info-item">
            <span className="apro-info-item__label">Nom officiel</span>
            <span className="apro-info-item__value">{profile.commercialName}</span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Nom commercial</span>
            <span className="apro-info-item__value">{profile.name}</span>
          </div>
          <div className="apro-info-item apro-info-item--full">
            <span className="apro-info-item__label">Description</span>
            <span className="apro-info-item__value">{profile.description}</span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Email</span>
            <span className="apro-info-item__value"><a href={`mailto:${profile.email}`}>{profile.email}</a></span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Téléphone</span>
            <span className="apro-info-item__value"><a href={`tel:${profile.phone}`}>{profile.phone}</a></span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Site Web</span>
            <span className="apro-info-item__value"><a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Adresse</span>
            <span className="apro-info-item__value">{profile.address}</span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Ville</span>
            <span className="apro-info-item__value">{profile.city}</span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Pays</span>
            <span className="apro-info-item__value">{profile.country}</span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Coordonnées GPS</span>
            <span className="apro-info-item__value">{profile.gpsLat}, {profile.gpsLng}</span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Horaires (Semaine)</span>
            <span className="apro-info-item__value">{profile.hours.weekdays}</span>
          </div>
          <div className="apro-info-item">
            <span className="apro-info-item__label">Horaires (Week-end)</span>
            <span className="apro-info-item__value">{profile.hours.weekends}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
