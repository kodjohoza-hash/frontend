const ChatSkeleton = () => (
  <div className="msg-layout">
    <div className="msg-sidebar msg-skeleton">
      <div className="msg-skeleton__header">
        <div className="msg-skeleton__bar msg-skeleton__bar--title" />
        <div className="msg-skeleton__bar msg-skeleton__bar--badge" />
      </div>
      <div className="msg-skeleton__search">
        <div className="msg-skeleton__bar msg-skeleton__bar--search" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="msg-skeleton__conv">
          <div className="msg-skeleton__avatar" />
          <div className="msg-skeleton__conv-body">
            <div className="msg-skeleton__bar msg-skeleton__bar--name" />
            <div className="msg-skeleton__bar msg-skeleton__bar--msg" />
          </div>
        </div>
      ))}
    </div>
    <div className="msg-chat msg-skeleton__chat">
      <div className="msg-skeleton__chat-header">
        <div className="msg-skeleton__avatar msg-skeleton__avatar--sm" />
        <div className="msg-skeleton__conv-body">
          <div className="msg-skeleton__bar msg-skeleton__bar--name" />
          <div className="msg-skeleton__bar msg-skeleton__bar--status" />
        </div>
      </div>
      <div className="msg-skeleton__chat-body">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`msg-skeleton__bubble ${i % 2 === 0 ? 'msg-skeleton__bubble--own' : ''}`}>
            <div className="msg-skeleton__bar msg-skeleton__bar--bubble" />
          </div>
        ))}
      </div>
      <div className="msg-skeleton__chat-input">
        <div className="msg-skeleton__bar msg-skeleton__bar--input" />
      </div>
    </div>
  </div>
);

export default ChatSkeleton;
