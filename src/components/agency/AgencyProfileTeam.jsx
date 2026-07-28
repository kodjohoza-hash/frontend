export default function AgencyProfileTeam({ team }) {
  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-people" /> Équipe</h3>
        <span style={{fontSize:'0.8125rem',color:'var(--apro-text-muted)'}}>{team.length} membres</span>
      </div>
      <div className="apro-section__body">
        <div className="apro-team-grid">
          {team.map((member) => (
            <div key={member.id} className="apro-team-card">
              <div className="apro-team-card__photo">
                {member.photo ? <img src={member.photo} alt={member.firstName} /> : <i className="bi bi-person" />}
              </div>
              <div className="apro-team-card__name">{member.firstName} {member.lastName}</div>
              <div className="apro-team-card__role">{member.role}</div>
              <div className="apro-team-card__contact">
                <a href={`mailto:${member.email}`} title="Email"><i className="bi bi-envelope" /></a>
                <a href={`tel:${member.phone}`} title="Téléphone"><i className="bi bi-telephone" /></a>
              </div>
              <span className="apro-team-card__badge">
                {member.type === 'manager' ? 'Responsable' : member.type === 'driver' ? 'Chauffeur' : 'Agent'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
