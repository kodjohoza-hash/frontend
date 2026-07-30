import clsx from 'clsx';
import { formatDate, formatTime } from '@data/counterProfileData';

const CounterProfileLoginHistory = ({ loginHistory = [] }) => {
  if (!loginHistory.length) {
    return (
      <div className="acpr-card">
        <div className="acpr-card-header">
          <i className="bi bi-shield-check" />
          <span>Historique de connexion</span>
        </div>
        <div className="acpr-timeline-empty">
          <i className="bi bi-clock-history" />
          <span>Aucun historique de connexion.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="acpr-card">
      <div className="acpr-card-header">
        <i className="bi bi-shield-check" />
        <span>Historique de connexion</span>
        <span className="acpr-login-count">{loginHistory.length} connexions</span>
      </div>

      <div className="acpr-login-table-wrap">
        <table className="acpr-login-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Adresse IP</th>
              <th>Navigateur</th>
              <th>Appareil</th>
              <th>Localisation</th>
            </tr>
          </thead>
          <tbody>
            {loginHistory.map((entry) => (
              <tr key={entry.id}>
                <td className="acpr-login-cell-date">{formatDate(entry.date)}</td>
                <td>{formatTime(entry.date)}</td>
                <td><code className="acpr-login-ip">{entry.ip}</code></td>
                <td>{entry.navigateur || '—'}</td>
                <td>{entry.appareil || '—'}</td>
                <td>{entry.localisation || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="acpr-login-cards">
        {loginHistory.map((entry) => (
          <div key={entry.id} className="acpr-login-card">
            <div className="acpr-login-card-row">
              <span className="acpr-info-label"><i className="bi bi-calendar" /> Date</span>
              <span className="acpr-info-value">{formatDate(entry.date)}</span>
            </div>
            <div className="acpr-login-card-row">
              <span className="acpr-info-label"><i className="bi bi-clock" /> Heure</span>
              <span className="acpr-info-value">{formatTime(entry.date)}</span>
            </div>
            <div className="acpr-login-card-row">
              <span className="acpr-info-label"><i className="bi bi-globe" /> IP</span>
              <span className="acpr-info-value"><code className="acpr-login-ip">{entry.ip}</code></span>
            </div>
            <div className="acpr-login-card-row">
              <span className="acpr-info-label"><i className="bi bi-browser-chrome" /> Navigateur</span>
              <span className="acpr-info-value">{entry.navigateur || '—'}</span>
            </div>
            <div className="acpr-login-card-row">
              <span className="acpr-info-label"><i className="bi bi-phone" /> Appareil</span>
              <span className="acpr-info-value">{entry.appareil || '—'}</span>
            </div>
            <div className="acpr-login-card-row">
              <span className="acpr-info-label"><i className="bi bi-geo-alt" /> Localisation</span>
              <span className="acpr-info-value">{entry.localisation || '—'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterProfileLoginHistory;
