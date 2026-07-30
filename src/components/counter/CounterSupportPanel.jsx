import { useState } from 'react';
import clsx from 'clsx';
import { formatDate } from '@data/counterMessageData';

const STATUS_CONFIG = {
  open: { label: 'Ouvert', color: '#10B981' },
  in_progress: { label: 'En cours', color: '#3B82F6' },
  waiting: { label: 'En attente', color: '#F59E0B' },
  resolved: { label: 'Résolu', color: '#6B7280' },
  closed: { label: 'Fermé', color: '#475569' },
};

const PRIORITY_CONFIG = {
  low: { label: 'Faible', color: '#9CA3AF' },
  normal: { label: 'Normale', color: '#3B82F6' },
  high: { label: 'Haute', color: '#F59E0B' },
  urgent: { label: 'Urgente', color: '#EF4444' },
};

const CounterSupportPanel = ({ tickets, onTicketSelect, activeTicket, onStatusChange, onNewTicket }) => {
  const [showDetail, setShowDetail] = useState(false);

  const handleSelect = (ticket) => {
    onTicketSelect?.(ticket);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
  };

  if (showDetail && activeTicket) {
    const st = STATUS_CONFIG[activeTicket.status] || STATUS_CONFIG.open;
    return (
      <div className="acm-support">
        <div className="acm-support__header">
          <button type="button" className="acm-support__back" onClick={handleBack}>
            <i className="bi bi-arrow-left" />
          </button>
          <h4 className="acm-support__title">Ticket {activeTicket.id}</h4>
        </div>
        <div className="acm-support__detail">
          <div className="acm-support__detail-header">
            <h3 className="acm-support__detail-subject">{activeTicket.subject}</h3>
            <div className="acm-support__detail-badges">
              <span className="acm-support__badge" style={{ backgroundColor: `${st.color}18`, color: st.color, borderColor: `${st.color}30` }}>
                {st.label}
              </span>
              {activeTicket.priority && (
                <span className="acm-support__badge" style={{ backgroundColor: `${PRIORITY_CONFIG[activeTicket.priority].color}18`, color: PRIORITY_CONFIG[activeTicket.priority].color, borderColor: `${PRIORITY_CONFIG[activeTicket.priority].color}30` }}>
                  {PRIORITY_CONFIG[activeTicket.priority].label}
                </span>
              )}
            </div>
          </div>
          <div className="acm-support__detail-date">
            <i className="bi bi-calendar3" />
            {formatDate(activeTicket.createdAt)}
          </div>
          <div className="acm-support__detail-messages">
            {(activeTicket.messages || []).map((msg, i) => (
              <div key={i} className={clsx('acm-support__msg', msg.isStaff && 'acm-support__msg--staff')}>
                <div className="acm-support__msg-author">{msg.author}</div>
                <div className="acm-support__msg-text">{msg.text}</div>
                <div className="acm-support__msg-time">{formatDate(msg.createdAt)}</div>
              </div>
            ))}
          </div>
          <div className="acm-support__status-change">
            <label className="acm-support__status-label">Statut</label>
            <select
              className="acm-support__status-select"
              value={activeTicket.status}
              onChange={(e) => onStatusChange?.(activeTicket.id, e.target.value)}
            >
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="acm-support">
      <div className="acm-support__header">
        <h4 className="acm-support__title">
          <i className="bi bi-headset" />
          Support
        </h4>
        <button type="button" className="acm-support__new" onClick={onNewTicket}>
          <i className="bi bi-plus-lg" />
          Nouveau ticket
        </button>
      </div>
      <div className="acm-support__list">
        {(!tickets || tickets.length === 0) && (
          <div className="acm-support__empty">
            <i className="bi bi-ticket" />
            <p>Aucun ticket de support</p>
          </div>
        )}
        {tickets?.map((ticket) => {
          const st = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
          const pr = ticket.priority ? PRIORITY_CONFIG[ticket.priority] : null;
          return (
            <button
              key={ticket.id}
              type="button"
              className={clsx('acm-support__ticket', activeTicket?.id === ticket.id && 'acm-support__ticket--active')}
              onClick={() => handleSelect(ticket)}
            >
              <div className="acm-support__ticket-top">
                <span className="acm-support__ticket-id">{ticket.id}</span>
                <span className="acm-support__ticket-date">{formatDate(ticket.createdAt)}</span>
              </div>
              <span className="acm-support__ticket-subject">{ticket.subject}</span>
              <div className="acm-support__ticket-badges">
                <span className="acm-support__badge" style={{ backgroundColor: `${st.color}18`, color: st.color, borderColor: `${st.color}30` }}>
                  {st.label}
                </span>
                {pr && (
                  <span className="acm-support__badge" style={{ backgroundColor: `${pr.color}18`, color: pr.color, borderColor: `${pr.color}30` }}>
                    {pr.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CounterSupportPanel;
