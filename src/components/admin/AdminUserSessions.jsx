const AdminUserSessions = ({ sessions }) => {
  if (!sessions?.length) return null;
  return (
    <div className="admu-drawer-section">
      <h3><i className="bi bi-laptop" /> Connexions récentes</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="admu-sessions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Adresse IP</th>
              <th>Navigateur</th>
              <th>Appareil</th>
              <th>Localisation</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{s.date}</td>
                <td>{s.time}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{s.ip}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{s.browser}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{s.device}</td>
                <td>{s.city}, {s.country}</td>
                <td>
                  <span className="admu-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 3,
                    background: s.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: s.success ? '#065F46' : '#991B1B' }}>
                    <span className={`admu-session-dot admu-session-dot--${s.success ? 'success' : 'fail'}`} />
                    {s.success ? 'Succès' : 'Échec'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminUserSessions;
