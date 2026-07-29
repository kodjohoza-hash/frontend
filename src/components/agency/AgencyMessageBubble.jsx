import clsx from 'clsx';

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export default function AgencyMessageBubble({ message, isSent, sender }) {
  return (
    <div className={clsx('amsg-bubble', { 'amsg-bubble--sent': isSent, 'amsg-bubble--received': !isSent })}>
      {!isSent && sender && (
        <div className={clsx('amsg-bubble__avatar', sender.id === 'co_002' && 'amsg-bubble__avatar--support')}>{sender.initials}</div>
      )}
      <div className="amsg-bubble__content">
        {!isSent && sender && <div className="amsg-bubble__sender">{sender.name}</div>}
        <div className="amsg-bubble__body">{message.text}</div>
        <div className="amsg-bubble__time">
          {formatTime(message.timestamp)}
          {message.edited && <span> · modifié</span>}
          {isSent && (
            <i className={clsx('amsg-bubble__status', `amsg-bubble__status--${message.status}`, message.status === 'sent' && 'bi-check', (message.status === 'delivered' || message.status === 'read') && 'bi-check-all')} />
          )}
        </div>
      </div>
      {isSent && (
        <div className="amsg-bubble__actions">
          <button type="button" className="amsg-bubble__action-btn" title="Répondre"><i className="bi bi-reply" /></button>
          <button type="button" className="amsg-bubble__action-btn" title="Transférer"><i className="bi bi-forward" /></button>
          <button type="button" className="amsg-bubble__action-btn" title="Supprimer"><i className="bi bi-trash" /></button>
          <button type="button" className="amsg-bubble__action-btn" title="Copier"><i className="bi bi-copy" /></button>
          <button type="button" className="amsg-bubble__action-btn" title="Épingler"><i className="bi bi-pin" /></button>
        </div>
      )}
    </div>
  );
}
