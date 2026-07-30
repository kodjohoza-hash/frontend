const CounterPaymentSkeleton = () => (
  <div className="acp-wrapper acp-skeleton">
    <div style={{ height: 36, width: '40%', background: '#E5E7EB', borderRadius: 8, marginBottom: 24 }} />
    <div className="acp-skel-stats">
      {[...Array(6)].map((_, i) => <div key={i} className="acp-skel-stat" />)}
    </div>
    <div className="acp-skel-bar" />
    <div className="acp-skel-table" />
  </div>
);

export default CounterPaymentSkeleton;
