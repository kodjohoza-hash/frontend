const CounterMessageSkeleton = () => (
  <div className="acm-skeleton">
    <div className="acm-skeleton__sidebar">
      <div className="acm-skeleton__folder">
        <div className="acm-skeleton__bar acm-pulse" style={{ width: 24, height: 24, borderRadius: 6 }} />
        <div className="acm-skeleton__bar acm-pulse" style={{ width: '60%', height: 14 }} />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="acm-skeleton__folder" style={{ '--i': i }}>
          <div className="acm-skeleton__bar acm-pulse" style={{ width: 20, height: 20, borderRadius: 6 }} />
          <div className="acm-skeleton__bar acm-pulse" style={{ width: `${55 - i * 5}%`, height: 12 }} />
        </div>
      ))}
    </div>
    <div className="acm-skeleton__list">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="acm-skeleton__card" style={{ '--i': i }}>
          <div className="acm-skeleton__bar acm-pulse" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div className="acm-skeleton__card-body">
            <div className="acm-skeleton__bar acm-pulse" style={{ width: '55%', height: 13 }} />
            <div className="acm-skeleton__bar acm-pulse" style={{ width: '35%', height: 11 }} />
            <div className="acm-skeleton__bar acm-pulse" style={{ width: '75%', height: 11 }} />
          </div>
        </div>
      ))}
    </div>
    <div className="acm-skeleton__chat">
      <div className="acm-skeleton__chat-header">
        <div className="acm-skeleton__bar acm-pulse" style={{ width: 40, height: 40, borderRadius: '50%' }} />
        <div className="acm-skeleton__bar acm-pulse" style={{ width: '30%', height: 16 }} />
        <div className="acm-skeleton__bar acm-pulse" style={{ width: '15%', height: 16, marginLeft: 'auto' }} />
      </div>
      <div className="acm-skeleton__chat-body">
        <div className="acm-skeleton__bubble acm-pulse" style={{ width: '55%', alignSelf: 'flex-start' }} />
        <div className="acm-skeleton__bubble acm-pulse" style={{ width: '40%', alignSelf: 'flex-end' }} />
        <div className="acm-skeleton__bubble acm-pulse" style={{ width: '65%', alignSelf: 'flex-start' }} />
        <div className="acm-skeleton__bubble acm-pulse" style={{ width: '45%', alignSelf: 'flex-end' }} />
      </div>
      <div className="acm-skeleton__composer">
        <div className="acm-skeleton__bar acm-pulse" style={{ width: '85%', height: 40, borderRadius: 10 }} />
        <div className="acm-skeleton__bar acm-pulse" style={{ width: 40, height: 40, borderRadius: 10 }} />
      </div>
    </div>
  </div>
);

export default CounterMessageSkeleton;
