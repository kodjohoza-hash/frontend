const TkTicketSkeleton = () => (
  <div className="tk-skeleton">
    <div className="tk-skeleton__header">
      <div className="tk-skeleton__bar" style={{ width: 160, height: 28 }} />
      <div className="tk-skeleton__bar" style={{ width: 280, height: 14 }} />
      <div className="tk-skeleton__bar" style={{ width: 180, height: 38, borderRadius: 10 }} />
    </div>
    <div className="tk-skeleton__stats">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="tk-skeleton__stat">
          <div className="tk-skeleton__circle" />
          <div className="tk-skeleton__bar" style={{ width: '60%', height: 14 }} />
          <div className="tk-skeleton__bar" style={{ width: '40%', height: 22 }} />
        </div>
      ))}
    </div>
    <div className="tk-skeleton__search">
      <div className="tk-skeleton__bar" style={{ width: '100%', height: 44, borderRadius: 12 }} />
    </div>
    <div className="tk-skeleton__filters">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="tk-skeleton__tab" />
      ))}
    </div>
    <div className="tk-skeleton__grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="tk-skeleton__card">
          <div className="tk-skeleton__bar" style={{ width: '100%', height: 180, borderRadius: 16 }} />
        </div>
      ))}
    </div>
  </div>
);

export default TkTicketSkeleton;
