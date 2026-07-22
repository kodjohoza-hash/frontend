const PiSkeleton = () => (
  <div className="pi-skeleton">
    <div className="pi-skeleton__stepper">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="pi-skeleton__step">
          <div className="pi-skeleton__circle" />
          <div className="pi-skeleton__bar" style={{ width: 60, height: 10 }} />
        </div>
      ))}
    </div>
    <div className="pi-skeleton__content">
      <div className="pi-skeleton__main">
        <div className="pi-skeleton__card">
          <div className="pi-skeleton__bar" style={{ width: 120, height: 18, marginBottom: 16 }} />
          <div className="pi-skeleton__bar" style={{ width: '100%', height: 40 }} />
          <div className="pi-skeleton__bar" style={{ width: '100%', height: 40, marginTop: 12 }} />
          <div className="pi-skeleton__bar" style={{ width: '100%', height: 40, marginTop: 12 }} />
          <div className="pi-skeleton__bar" style={{ width: '100%', height: 40, marginTop: 12 }} />
        </div>
      </div>
      <div className="pi-skeleton__side">
        <div className="pi-skeleton__card">
          <div className="pi-skeleton__bar" style={{ width: '80%', height: 16, marginBottom: 12 }} />
          <div className="pi-skeleton__bar" style={{ width: '60%', height: 12, marginBottom: 8 }} />
          <div className="pi-skeleton__bar" style={{ width: '70%', height: 12, marginBottom: 8 }} />
          <div className="pi-skeleton__bar" style={{ width: '50%', height: 12, marginBottom: 16 }} />
          <div className="pi-skeleton__bar" style={{ width: '100%', height: 1, marginBottom: 16 }} />
          <div className="pi-skeleton__bar" style={{ width: '40%', height: 24 }} />
        </div>
      </div>
    </div>
  </div>
);

export default PiSkeleton;
