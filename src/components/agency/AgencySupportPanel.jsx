import clsx from 'clsx';
import { supportTickets, supportTicketStatuses } from '@data/messageData';

const priorityLabels = { urgent: 'Urgent', high: 'Élevée', medium: 'Moyenne', low: 'Faible' };

export default function AgencySupportPanel({ onSelectTicket }) {
  return (
    <div className="amsg-support">
      <button className="amsg-support__new-btn"><i className="bi bi-plus-lg" /> Nouveau ticket</button>
      {supportTickets.map((ticket) => {
        const statusObj = supportTicketStatuses.find((s) => s.id === ticket.status);
        return (
          <div key={ticket.id} className="amsg-support__ticket" onClick={() => onSelectTicket?.(ticket.id)}>
            <div className="amsg-support__ticket-top">
              <span className="amsg-support__ticket-subject">{ticket.subject}</span>
              <span className={clsx('amsg-support__ticket-status', `amsg-support__ticket-status--${ticket.status}`)}>
                {statusObj?.label || ticket.status}
              </span>
            </div>
            <div className="amsg-support__ticket-meta">
              <span><i className="bi bi-flag" /> {priorityLabels[ticket.priority] || ticket.priority}</span>
              <span><i className="bi bi-calendar3" /> {new Date(ticket.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
              <span><i className="bi bi-chat-dots" /> {ticket.messages}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
