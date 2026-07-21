import React from 'react';

const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const shimmerBase = {
  background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 37%, #F1F5F9 63%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.8s ease-in-out infinite',
  borderRadius: '6px',
};

const SeatSkeleton = React.memo(function SeatSkeleton() {
  return (
    <>
      <style>{shimmerKeyframes}</style>

      {/* Bus Shape Skeleton */}
      <div
        style={{
          width: '320px',
          margin: '0 auto',
          padding: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '3px solid #E2E8F0',
            padding: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Windshield */}
          <div style={{ ...shimmerBase, height: '48px', borderRadius: '21px 21px 0 0', marginBottom: '12px' }} />

          {/* Driver */}
          <div style={{ ...shimmerBase, height: '40px', margin: '0 12px', marginBottom: '12px' }} />

          {/* Seat Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 14px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ ...shimmerBase, width: '18px', height: '12px' }} />
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ ...shimmerBase, width: '38px', height: '34px', borderRadius: '6px' }} />
                  <div style={{ ...shimmerBase, width: '38px', height: '34px', borderRadius: '6px' }} />
                </div>
                <div style={{ ...shimmerBase, width: '2px', height: '20px', borderRadius: '1px' }} />
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ ...shimmerBase, width: '38px', height: '34px', borderRadius: '6px' }} />
                  <div style={{ ...shimmerBase, width: '38px', height: '34px', borderRadius: '6px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Back wall */}
          <div style={{ ...shimmerBase, height: '6px', margin: '12px 14px 0', borderRadius: '3px' }} />
        </div>
      </div>

      {/* Legend Skeleton */}
      <div style={{ padding: '0 16px', maxWidth: '320px', margin: '16px auto 0' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '16px',
          }}
        >
          <div style={{ ...shimmerBase, width: '80px', height: '14px', marginBottom: '12px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ ...shimmerBase, width: '20px', height: '18px', borderRadius: '4px' }} />
                <div style={{ ...shimmerBase, width: '64px', height: '12px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Skeleton */}
      <div style={{ padding: '0 16px', maxWidth: '320px', margin: '16px auto 0' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ ...shimmerBase, width: '28px', height: '28px', borderRadius: '8px' }} />
            <div style={{ ...shimmerBase, width: '140px', height: '14px' }} />
          </div>
          <div style={{ ...shimmerBase, height: '50px', borderRadius: '8px', marginBottom: '12px' }} />
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            <div style={{ ...shimmerBase, width: '36px', height: '24px', borderRadius: '20px' }} />
            <div style={{ ...shimmerBase, width: '36px', height: '24px', borderRadius: '20px' }} />
          </div>
          <div style={{ ...shimmerBase, height: '60px', borderRadius: '8px', marginBottom: '12px' }} />
          <div style={{ ...shimmerBase, height: '44px', borderRadius: '10px', marginBottom: '8px' }} />
          <div style={{ ...shimmerBase, height: '36px', borderRadius: '10px' }} />
        </div>
      </div>
    </>
  );
});

export default SeatSkeleton;
