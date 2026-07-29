import { useState } from 'react';
import CounterTicketStatus from './CounterTicketStatus';
import { formatDateTime } from '@data/counterScannerData';

const CounterScannerHistory = ({ history = [], onSelect }) => {
  const [filter, setFilter] = useState('all');

  if (!history || history.length === 0) {
    return (
      <div className="acv-history">
        <div className="acv-history-header">
          <h3 className="acv-history-title">
            <i className="bi bi-clock-history" /> Historique des contrôles
          </h3>
        </div>
        <div className="acv-history-empty">
          <i className="bi bi-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 8 }} />
          Aucun contrôle effectué aujourd'hui
        </div>
      </div>
    );
  }

  const filtered = filter === 'all' ? history : history.filter((h) => h.status === filter);

  return (
    <div className="acv-history">
      <div className="acv-history-header">
        <h3 className="acv-history-title">
          <i className="bi bi-clock-history" /> Historique des contrôles
          <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 400, marginLeft: 8 }}>
            ({filtered.length} contrôle{filtered.length > 1 ? 's' : ''})
          </span>
        </h3>
        <select
          style={{
            padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: 6,
            fontSize: 12, color: '#374151', outline: 'none',
          }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tous</option>
          <option value="boarded">Embarqués</option>
          <option value="refused">Refusés</option>
        </select>
      </div>

      <table className="acv-history-table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Passager</th>
            <th>Trajet</th>
            <th>Date/Heure</th>
            <th>Statut</th>
            <th>Agent</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((h, i) => (
            <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onSelect?.(h)}>
              <td style={{ fontFamily: 'Courier New', fontWeight: 600, color: '#0B1D51', fontSize: 12 }}>
                {h.reference}
              </td>
              <td>
                <div style={{ fontWeight: 500 }}>{h.passengerName}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{h.phone}</div>
              </td>
              <td style={{ fontSize: 12 }}>
                {h.from} → {h.to}
              </td>
              <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                {formatDateTime(h.scannedAt)}
              </td>
              <td>
                <CounterTicketStatus status={h.result} size="sm" />
              </td>
              <td style={{ fontSize: 12, color: '#6B7280' }}>{h.agent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CounterScannerHistory;
