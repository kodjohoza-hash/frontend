const shimmerKeyframes = `
@keyframes btc-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

const skeletonBase = {
  borderRadius: 8,
  background: 'linear-gradient(90deg, var(--color-gray-100, #f3f4f6) 25%, var(--color-gray-50, #fafafa) 50%, var(--color-gray-100, #f3f4f6) 75%)',
  backgroundSize: '200% 100%',
  animation: 'btc-shimmer 1.8s ease-in-out infinite',
};

const SkeletonBar = ({ width, height = 14, radius, style = {} }) => (
  <div
    style={{
      ...skeletonBase,
      width,
      height,
      borderRadius: radius || 8,
      flexShrink: 0,
      ...style,
    }}
    aria-hidden="true"
  />
);

const TripCardSkeleton = () => (
  <div
    style={{
      display: 'flex',
      borderRadius: 'var(--radius-xl, 16px)',
      border: '1px solid var(--color-gray-100, #f3f4f6)',
      overflow: 'hidden',
      marginBottom: 16,
    }}
  >
    {/* Photo placeholder */}
    <div
      style={{
        width: 280,
        minHeight: 200,
        background: 'linear-gradient(90deg, var(--color-gray-100, #f3f4f6) 25%, var(--color-gray-50, #fafafa) 50%, var(--color-gray-100, #f3f4f6) 75%)',
        backgroundSize: '200% 100%',
        animation: 'btc-shimmer 1.8s ease-in-out infinite',
        flexShrink: 0,
      }}
      aria-hidden="true"
    />

    {/* Content */}
    <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Company row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <SkeletonBar width={44} height={44} radius={12} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SkeletonBar width={140} height={14} />
          <SkeletonBar width={90} height={10} />
        </div>
      </div>

      {/* Timeline row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <SkeletonBar width={60} height={28} />
          <SkeletonBar width={50} height={10} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <SkeletonBar width={50} height={10} />
          <SkeletonBar width="100%" height={4} radius={2} />
          <SkeletonBar width={40} height={8} />
        </div>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <SkeletonBar width={60} height={28} />
          <SkeletonBar width={50} height={10} />
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBar key={i} width={32} height={32} radius={8} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <SkeletonBar width={80} height={12} />
            <SkeletonBar width={100} height={24} />
          </div>
          <SkeletonBar width={140} height={40} radius={12} />
        </div>
      </div>
    </div>
  </div>
);

const SearchSkeleton = ({ count = 3 }) => (
  <div aria-busy="true" aria-label="Chargement des résultats de recherche" style={{ padding: '32px 0' }}>
    <style>{shimmerKeyframes}</style>

    {/* Hero skeleton */}
    <div
      style={{
        borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '28px 36px',
        marginBottom: 32,
        boxShadow: '0 4px 16px rgba(11, 29, 81, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SkeletonBar width={130} height={32} />
          <SkeletonBar width={36} height={36} radius={18} />
          <SkeletonBar width={110} height={32} />
        </div>
        <SkeletonBar width={1} height={32} style={{ background: 'var(--color-gray-200, #e5e7eb)', animation: 'none' }} />
        <div style={{ display: 'flex', gap: 16 }}>
          <SkeletonBar width={100} height={16} />
          <SkeletonBar width={80} height={16} />
          <SkeletonBar width={90} height={16} />
        </div>
      </div>
    </div>

    {/* Content skeleton */}
    <div style={{ display: 'flex', gap: 32 }}>
      {/* Filter sidebar skeleton */}
      <div
        style={{
          width: 280,
          flexShrink: 0,
          borderRadius: 'var(--radius-xl, 16px)',
          border: '1px solid var(--color-gray-100, #f3f4f6)',
          padding: 24,
        }}
        className="d-none d-lg-block"
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <SkeletonBar width={20} height={20} radius={6} />
          <SkeletonBar width={70} height={16} />
        </div>

        {/* Sections */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <SkeletonBar width={100} height={14} style={{ marginBottom: 12 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <SkeletonBar width="100%" height={12} />
              <SkeletonBar width="85%" height={12} />
              <SkeletonBar width="70%" height={12} />
            </div>
          </div>
        ))}
      </div>

      {/* Results skeleton */}
      <div style={{ flex: 1 }}>
        {/* Sort bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <SkeletonBar width={150} height={16} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3].map((i) => (
              <SkeletonBar key={i} width={70} height={32} radius={10} />
            ))}
          </div>
        </div>

        {/* Trip cards */}
        {Array.from({ length: count }, (_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default SearchSkeleton;
