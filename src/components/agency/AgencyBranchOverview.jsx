import React from 'react';

function formatMoney(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  return (n || 0).toLocaleString('fr-FR');
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AgencyBranchOverview({ branch }) {
  const reservations = branch.reservations || [];
  const history = branch.history || [];

  return (
    <div className="abr-overview">
      {reservations.length > 0 && (
        <div className="abr-overview__section">
          <h4><i className="bi bi-ticket-perforated" /> Réservations récentes</h4>
          <div className="abr-overview__table-wrapper">
            <table className="abr-overview__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Trajet</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td className="abr-overview__id">{r.id}</td>
                    <td>{r.client}</td>
                    <td>{r.route}</td>
                    <td>{formatDate(r.date)}</td>
                    <td className="abr-overview__amount">{formatMoney(r.amount)} FCFA</td>
                    <td>
                      <span className={`abr-overview__status abr-overview__status--${r.status}`}>
                        {r.status === 'confirmée' ? 'Confirmée' : r.status === 'en_attente' ? 'En attente' : r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="abr-overview__section">
          <h4><i className="bi bi-clock-history" /> Historique</h4>
          <div className="abr-overview__history">
            {history.map((h, i) => {
              const typeColors = { ouverture: '#10b981', fermeture: '#6b7280', reservation: '#8b5cf6', alerte: '#f59e0b', construction: '#3b82f6' };
              const typeIcons = { ouverture: 'bi-door-open', fermeture: 'bi-lock', reservation: 'bi-ticket-perforated', alerte: 'bi-exclamation-triangle', construction: 'bi-hammer' };
              return (
                <div key={i} className="abr-overview__history-item">
                  <div className="abr-overview__history-dot" style={{ background: typeColors[h.type] || '#6b7280' }} />
                  <div className="abr-overview__history-content">
                    <span className="abr-overview__history-badge" style={{ background: (typeColors[h.type] || '#6b7280') + '20', color: typeColors[h.type] || '#6b7280' }}>
                      <i className={`bi ${typeIcons[h.type] || 'bi-info-circle'}`} /> {h.type}
                    </span>
                    <span className="abr-overview__history-time">{formatDate(h.date)}</span>
                    <p>{h.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reservations.length === 0 && history.length === 0 && (
        <div className="abr-overview__empty">
          <i className="bi bi-inbox" /><p>Aucune donnée disponible</p>
        </div>
      )}
    </div>
  );
}
