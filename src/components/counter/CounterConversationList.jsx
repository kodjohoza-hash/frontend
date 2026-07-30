import clsx from 'clsx';
import CounterConversationCard from '@components/counter/CounterConversationCard';

const SkeletonCard = ({ style }) => (
  <div className="acm-conv-skel" style={style}>
    <div className="acm-conv-skel__avatar acm-pulse" />
    <div className="acm-conv-skel__lines">
      <div className="acm-conv-skel__line acm-pulse" style={{ width: '65%' }} />
      <div className="acm-conv-skel__line acm-pulse" style={{ width: '40%' }} />
      <div className="acm-conv-skel__line acm-pulse" style={{ width: '85%' }} />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="acm-conv-empty">
    <i className="bi bi-chat-square-dots acm-conv-empty__icon" />
    <p className="acm-conv-empty__text">Aucune conversation</p>
    <span className="acm-conv-empty__sub">Les nouveaux messages apparaîtront ici</span>
  </div>
);

const CounterConversationList = ({ conversations, activeId, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="acm-conv-list">
        {[0.7, 0.85, 0.6, 0.9, 0.75].map((w, i) => (
          <SkeletonCard key={i} style={{ '--i': i, '--w': w }} />
        ))}
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="acm-conv-list">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="acm-conv-list">
      {conversations.map((conv) => (
        <CounterConversationCard
          key={conv.id}
          conversation={conv}
          isActive={conv.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default CounterConversationList;
