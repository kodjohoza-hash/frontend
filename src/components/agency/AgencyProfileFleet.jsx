export default function AgencyProfileFleet({ fleet }) {
  const total = fleet.length;
  const active = fleet.filter(b => b.status === 'active').length;
  const maintenance = fleet.filter(b => b.status === 'maintenance').length;
  const inactive = fleet.filter(b => b.status === 'inactive').length;

  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-truck" /> Flotte</h3>
        <span style={{fontSize:'0.8125rem',color:'var(--apro-text-muted)'}}>{total} bus</span>
      </div>
      <div className="apro-section__body">
        <div className="apro-fleet-stats">
          <div className="apro-fleet-stat">
            <span className="apro-fleet-stat__dot" style={{background:'#22c55e'}} />
            <div>
              <div className="apro-fleet-stat__value">{active}</div>
              <div className="apro-fleet-stat__label">Actifs</div>
            </div>
          </div>
          <div className="apro-fleet-stat">
            <span className="apro-fleet-stat__dot" style={{background:'#f59e0b'}} />
            <div>
              <div className="apro-fleet-stat__value">{maintenance}</div>
              <div className="apro-fleet-stat__label">En maintenance</div>
            </div>
          </div>
          <div className="apro-fleet-stat">
            <span className="apro-fleet-stat__dot" style={{background:'#94a3b8'}} />
            <div>
              <div className="apro-fleet-stat__value">{inactive}</div>
              <div className="apro-fleet-stat__label">Inactifs</div>
            </div>
          </div>
        </div>
        <div className="apro-fleet-grid">
          {fleet.map((bus) => (
            <div key={bus.id} className="apro-fleet-card">
              <div className="apro-fleet-card__header">
                <span className="apro-fleet-card__immat">{bus.immatriculation}</span>
                <span className={`apro-fleet-card__status apro-fleet-card__status--${bus.status}`}>
                  {bus.status === 'active' ? 'Actif' : bus.status === 'maintenance' ? 'Maintenance' : 'Inactif'}
                </span>
              </div>
              <div className="apro-fleet-card__model">{bus.model} • {bus.capacity} places</div>
              <div className="apro-fleet-card__driver">
                <i className="bi bi-person" /> {bus.driver || 'Non assigné'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
