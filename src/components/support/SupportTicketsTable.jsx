import { myTickets } from '@data/supportData';

const statusConfig = {
  resolved: { label: 'Résolu', color: 'success', icon: 'bi-check-circle-fill' },
  in_progress: { label: 'En cours', color: 'warning', icon: 'bi-hourglass-split' },
  open: { label: 'Ouvert', color: 'danger', icon: 'bi-circle-fill' },
};

const priorityConfig = {
  high: { label: 'Haute', color: 'danger' },
  medium: { label: 'Moyenne', color: 'warning' },
  low: { label: 'Basse', color: 'muted' },
};

const SupportTicketsTable = () => {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="sp-tickets" id="sp-my-tickets">
      <h3 className="sp-section-title">
        <i className="bi bi-clock-history" />
        Mes demandes
      </h3>

      <div className="sp-card">
        <div className="sp-tickets__table-wrapper">
          <table className="sp-tickets__table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Sujet</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myTickets.map((ticket) => {
                const st = statusConfig[ticket.status];
                const pr = priorityConfig[ticket.priority];
                return (
                  <tr key={ticket.id}>
                    <td className="sp-tickets__id">{ticket.id}</td>
                    <td className="sp-tickets__subject">{ticket.subject}</td>
                    <td className="sp-tickets__date">{formatDate(ticket.date)}</td>
                    <td>
                      <span className={`sp-status sp-status--${st.color}`}>
                        <i className={`bi ${st.icon}`} />
                        {st.label}
                      </span>
                    </td>
                    <td>
                      <span className={`sp-priority sp-priority--${pr.color}`}>{pr.label}</span>
                    </td>
                    <td>
                      <button type="button" className="sp-tickets__view-btn" title="Voir les détails">
                        <i className="bi bi-eye" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketsTable;
