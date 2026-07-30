import { useState } from 'react';
import { apiLogs } from '../../../data/adminIntegrationData';

const methodClass = (m) => {
  if (m === 'GET') return 'get'; if (m === 'POST') return 'post'; if (m === 'PUT') return 'put'; if (m === 'DELETE') return 'delete'; return '';
};
const statusClass = (c) => { if (c < 300) return 'success'; if (c < 500) return 'warning'; return 'error'; };

const AdminApiLogs = () => {
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = apiLogs.filter(l => {
    if (search && !l.endpoint.toLowerCase().includes(search.toLowerCase()) && !l.user?.toLowerCase().includes(search.toLowerCase())) return false;
    if (method && l.method !== method) return false;
    if (statusFilter) {
      if (statusFilter === 'success' && l.status >= 300) return false;
      if (statusFilter === 'error' && l.status < 400) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="adi-filters-bar" style={{ padding: '0 0 16px', borderBottom: 'none' }}>
        <div className="adi-search-box">
          <i className="fa-solid fa-search"></i>
          <input type="text" placeholder="Rechercher endpoint ou utilisateur..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adi-filter-select" value={method} onChange={e => setMethod(e.target.value)}>
          <option value="">Toutes méthodes</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <select className="adi-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tous statuts</option>
          <option value="success">Succès (2xx)</option>
          <option value="error">Erreurs (4xx/5xx)</option>
        </select>
        <div className="adi-filter-stats">{filtered.length} requête{filtered.length !== 1 ? 's' : ''}</div>
      </div>
      {filtered.length === 0 ? (
        <div className="adi-logs-empty">
          <i className="fa-solid fa-file-lines" style={{ fontSize: 40, color: '#D1D5DB', marginBottom: 12 }}></i>
          <p>Aucun log trouvé</p>
        </div>
      ) : (
        <div className="adi-table-wrapper">
          <table className="adi-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Heure</th>
                <th>Méthode</th>
                <th>Endpoint</th>
                <th>Statut</th>
                <th>Durée</th>
                <th>Utilisateur</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: 12, color: '#6B7280' }}>{log.date}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.time}</td>
                  <td><span className={`adi-method ${methodClass(log.method)}`}>{log.method}</span></td>
                  <td><span className="adi-endpoint">{log.endpoint}</span></td>
                  <td><span className={`adi-status-code ${statusClass(log.status)}`}>{log.status}</span></td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: log.duration > 1000 ? '#EF4444' : log.duration > 300 ? '#F59E0B' : '#6B7280' }}>{log.duration}ms</td>
                  <td style={{ fontSize: 12 }}>{log.user}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#9CA3AF' }}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminApiLogs;
