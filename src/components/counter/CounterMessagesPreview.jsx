import clsx from 'clsx';

const CounterMessagesPreview = ({ conversations }) => (
  <div className="act-card">
    <div className="act-card__header">
      <h3 className="act-card__title">
        <i className="bi bi-chat-dots" />
        Messagerie
      </h3>
      <span className="act-card__badge">{conversations.filter((c) => c.unread).length}</span>
    </div>
    <div className="act-msgs__list">
      {conversations.map((c) => (
        <div key={c.id} className="act-msg-mini">
          <div className="act-msg-mini__avatar">
            {c.avatar}
            {c.online && <span className="act-msg-mini__online" />}
          </div>
          <div className="act-msg-mini__body">
            <div className="act-msg-mini__name">{c.name}</div>
            <div className="act-msg-mini__last">{c.lastMessage}</div>
          </div>
          <div className="act-msg-mini__right">
            <span className="act-msg-mini__time">{c.time}</span>
            {c.unread && <span className="act-msg-mini__unread" />}
          </div>
        </div>
      ))}
    </div>
    <button type="button" className="act-show-more">
      <i className="bi bi-chat-dots" /> Voir tous les messages
    </button>
  </div>
);

export default CounterMessagesPreview;
