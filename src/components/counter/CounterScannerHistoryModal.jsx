import CounterTicketStatus from './CounterTicketStatus';
import { formatDateTime } from '@data/ticketScanner';

/**
 * Modal « Historique des contrôles » d'un billet (Module 15).
 * Affiche le journal réel retourné par GET /tickets/:id/check-in-history :
 * scans de vérification + contrôles d'embarquement, du plus récent au plus ancien.
 */
const CounterScannerHistoryModal = ({ ticket, entries = [], loading, error, onClose }) => {
  return (
    <div className="acv-history-modal" onClick={onClose}>
      <div className="acv-history-card" onClick={(e) => e.stopPropagation()}>
        <div className="acv-history-card-header">
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Historique du billet</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0B1D51', fontFamily: 'Courier New' }}>
              {ticket.reference}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CounterTicketStatus status={ticket.status} size="sm" />
            <button className="acv-btn acv-btn-secondary acv-btn-sm" onClick={onClose}>
              <i className="bi bi-x-lg" /> Fermer
            </button>
          </div>
        </div>

        <div className="acv-history-card-body">
          {loading && (
            <div className="acv-history-empty">
              <i className="bi bi-arrow-repeat" style={{ display: 'inline-block', animation: 'acvSpin 0.8s linear infinite' }} /> Chargement…
            </div>
          )}

          {!loading && error && (
            <div className="acv-history-empty" style={{ color: '#DC2626' }}>
              <i className="bi bi-exclamation-triangle" style={{ display: 'block', fontSize: 28, marginBottom: 8 }} />
              {error}
            </div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="acv-history-empty">
              <i className="bi bi-inbox" style={{ display: 'block', fontSize: 28, marginBottom: 8 }} />
              Aucun contrôle enregistré pour ce billet.
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <ul className="acv-history-timeline">
              {entries.map((entry) => {
                const isOk = entry.type === 'checkin' ? entry.statut === 'embarque' : entry.statut === 'valide';
                const label = entry.type === 'checkin'
                  ? (entry.statut === 'embarque' ? 'Embarquement validé' : 'Embarquement refusé')
                  : (entry.statut === 'valide' ? 'Vérification OK' : 'Vérification refusée');
                return (
                  <li key={entry.id || `${entry.type}-${entry.date}`}>
                    <span className={`acv-history-dot ${isOk ? 'ok' : 'ko'}`}>
                      <i className={`bi ${isOk ? 'bi-check-lg' : 'bi-x-lg'}`} />
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#0B1D51' }}>{label}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>
                          {entry.agent?.nom || 'Agent'} — {formatDateTime(entry.date)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
                          borderRadius: 4, fontSize: 11, fontWeight: 600,
                          background: isOk ? '#D1FAE5' : '#FEE2E2',
                          color: isOk ? '#059669' : '#DC2626',
                        }}>
                          {entry.type === 'checkin' ? (entry.statut === 'embarque' ? 'EMBARQUÉ' : 'REFUSÉ') : (entry.statut === 'valide' ? 'VALIDE' : 'REFUSÉ')}
                        </span>
                      </div>
                    </div>
                    {entry.raison && (
                      <div style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>
                        <i className="bi bi-info-circle" style={{ marginRight: 4 }} />
                        {entry.raison}
                      </div>
                    )}
                    {(entry.guichetId || entry.compagnieId || entry.agenceId) && (
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                        Guichet {entry.guichetId || '—'} · Compagnie {entry.compagnieId || '—'} · Agence {entry.agenceId || '—'}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounterScannerHistoryModal;
