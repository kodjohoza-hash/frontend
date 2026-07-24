const AgencySkeleton = () => {
  return (
    <div className="ag-skeleton">
      <div className="ag-skeleton__sidebar">
        <div className="ag-skeleton__bar" style={{ width: '70%', height: 24 }} />
        <div className="ag-skeleton__bars">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="ag-skeleton__bar" style={{ width: `${60 + Math.random() * 30}%`, height: 14 }} />
          ))}
        </div>
      </div>
      <div className="ag-skeleton__main">
        <div className="ag-skeleton__bar" style={{ width: '100%', height: 56 }} />
        <div className="ag-skeleton__bar" style={{ width: '40%', height: 28, marginTop: 24 }} />
        <div className="ag-skeleton__grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ag-skeleton__card">
              <div className="ag-skeleton__bar" style={{ width: 40, height: 40, borderRadius: 10 }} />
              <div className="ag-skeleton__bar" style={{ width: '60%', height: 20 }} />
              <div className="ag-skeleton__bar" style={{ width: '80%', height: 12 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgencySkeleton;
