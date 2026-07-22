import React, { memo } from 'react';

const anim = 'btcSkeletonPulse';

const s = {
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '32px',
    fontFamily: "'Inter', sans-serif",
  },
  shimmer: (w, h, br) => ({
    width: w || '100%',
    height: h || '16px',
    borderRadius: br || '8px',
    background: 'rgba(255,255,255,0.06)',
    animation: `${anim} 1.5s ease-in-out infinite`,
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%',
    backgroundPosition: '200% 0',
  }),
  shimmerLight: (w, h, br) => ({
    width: w || '100%',
    height: h || '16px',
    borderRadius: br || '8px',
    background: '#f1f5f9',
    animation: `${anim} 1.5s ease-in-out infinite`,
    backgroundImage: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
    backgroundSize: '200% 100%',
    backgroundPosition: '200% 0',
  }),
  darkPanel: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  lightPanel: {
    background: '#fff',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  gridShimmer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '16px',
  },
  tileShimmer: {
    padding: '20px 16px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  stepperRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginBottom: '24px',
    padding: '16px 24px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  countdownRow: {
    marginBottom: '20px',
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
};

const PaySkeleton = memo(() => {
  return (
    <>
      <style>{`@keyframes ${anim} { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>

      {/* Stepper skeleton */}
      <div style={s.stepperRow}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={s.shimmer('40px', '30px', '10px')} />
            {i < 5 && <div style={s.shimmer('36px', '2px', '1px')} />}
          </div>
        ))}
      </div>

      {/* Countdown skeleton */}
      <div style={s.countdownRow}>
        <div style={s.shimmer('20px', '20px', '50%')} />
        <div style={s.shimmer('60px', '18px', '4px')} />
        <div style={{ flex: 1 }} />
        <div style={s.shimmer('120px', '12px', '4px')} />
      </div>

      <div style={s.wrapper}>
        {/* Dark left panel */}
        <div style={s.darkPanel}>
          <div style={s.shimmer('120px', '16px', '6px')} />
          <div style={{ height: '8px' }} />
          <div style={s.shimmer('200px', '12px', '4px')} />

          <div style={s.gridShimmer}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={s.tileShimmer}>
                <div style={s.shimmer('48px', '48px', '50%')} />
                <div style={{ height: '12px' }} />
                <div style={s.shimmer('80px', '14px', '4px')} />
                <div style={{ height: '6px' }} />
                <div style={s.shimmer('120px', '10px', '4px')} />
              </div>
            ))}
          </div>

          <div style={{ height: '24px' }} />
          <div style={s.shimmer('100px', '14px', '4px')} />
          <div style={{ height: '8px' }} />
          <div style={s.shimmer('160px', '40px', '10px')} />
        </div>

        {/* Light right panel */}
        <div style={s.lightPanel}>
          <div style={{ ...s.shimmerLight('100%', '160px', '12px'), borderRadius: '12px 12px 0 0' }} />

          <div style={{ padding: '4px 0' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '18px' }}>
              <div style={s.shimmerLight('36px', '36px', '10px')} />
              <div>
                <div style={s.shimmerLight('140px', '14px', '4px')} />
                <div style={{ height: '4px' }} />
                <div style={s.shimmerLight('100px', '10px', '4px')} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={s.shimmerLight('80px', '40px', '8px')} />
              <div style={s.shimmerLight('40px', '2px', '1px')} />
              <div style={s.shimmerLight('80px', '40px', '8px')} />
            </div>

            <div style={{ height: '1px', background: '#f1f5f9', margin: '12px 0' }} />

            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <div style={s.shimmerLight('100px', '12px', '4px')} />
                <div style={s.shimmerLight('80px', '12px', '4px')} />
              </div>
            ))}

            <div style={{ height: '2px', background: '#f1f5f9', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={s.shimmerLight('60px', '18px', '4px')} />
              <div style={s.shimmerLight('100px', '18px', '4px')} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

PaySkeleton.displayName = 'PaySkeleton';
export default PaySkeleton;
