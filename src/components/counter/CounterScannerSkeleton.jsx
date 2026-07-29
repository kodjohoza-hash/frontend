const CounterScannerSkeleton = () => (
  <div className="acv-wrapper acv-skeleton">
    <div style={{ height: 36, width: '40%', background: '#E5E7EB', borderRadius: 8, marginBottom: 24 }} />
    <div className="acv-skel-stats">
      {[...Array(6)].map((_, i) => <div key={i} className="acv-skel-stat" />)}
    </div>
    <div className="acv-skel-main">
      <div className="acv-skel-left" />
      <div className="acv-skel-right" />
    </div>
  </div>
);

export default CounterScannerSkeleton;
