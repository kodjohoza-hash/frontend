export default function AgencyProfileManager({ manager }) {
  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-person-badge" /> Responsable</h3>
      </div>
      <div className="apro-section__body">
        <div className="apro-manager">
          <div className="apro-manager__photo">
            {manager.photo ? (
              <img src={manager.photo} alt={`${manager.firstName} ${manager.lastName}`} />
            ) : (
              <i className="bi bi-person" />
            )}
          </div>
          <div className="apro-manager__info">
            <div className="apro-manager__name">{manager.firstName} {manager.lastName}</div>
            <div className="apro-manager__role">{manager.role}</div>
            <div className="apro-manager__contact">
              <span className="apro-manager__contact-item">
                <i className="bi bi-envelope" /> {manager.email}
              </span>
              <span className="apro-manager__contact-item">
                <i className="bi bi-telephone" /> {manager.phone}
              </span>
              {manager.signature && (
                <span className="apro-manager__contact-item">
                  <i className="bi bi-pen" /> Signature numérique
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
