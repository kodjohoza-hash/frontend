export default function AgencyProfileCoverage({ coverage }) {
  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-globe" /> Zones desservies</h3>
        <span style={{fontSize:'0.8125rem',color:'var(--apro-text-muted)'}}>{coverage.length} villes</span>
      </div>
      <div className="apro-section__body">
        <div className="apro-coverage-grid">
          {coverage.map((zone) => (
            <div key={zone.id} className="apro-coverage-item">
              <div className="apro-coverage-item__city">{zone.city}</div>
              <div className="apro-coverage-item__trips">{zone.trips} trajets</div>
              <div className="apro-coverage-item__departures">
                <i className="bi bi-arrow-right" /> {zone.departures} départs/semaine
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
