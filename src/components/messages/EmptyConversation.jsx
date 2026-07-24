const EmptyConversation = () => (
  <div className="msg-empty">
    <div className="msg-empty__illustration">
      <div className="msg-empty__circle msg-empty__circle--outer">
        <div className="msg-empty__circle msg-empty__circle--inner">
          <i className="bi bi-chat-dots-fill" />
        </div>
      </div>
      <div className="msg-empty__dots">
        <span />
        <span />
        <span />
      </div>
    </div>
    <h3 className="msg-empty__title">Messagerie</h3>
    <p className="msg-empty__desc">
      Sélectionnez une conversation pour commencer.
      <br />
      Échangez directement avec les compagnies et le support Bus Tix Connect.
    </p>
  </div>
);

export default EmptyConversation;
