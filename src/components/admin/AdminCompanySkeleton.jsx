const AdminCompanySkeleton = () => (
  <div className="admc-skeleton-container" style={{ padding: '1.5rem 0' }}>
    <div className="admc-skeleton admc-skeleton-title" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="admc-skeleton admc-skeleton-card" />
      ))}
    </div>
    <div className="admc-skeleton admc-skeleton-title" style={{ width: '40%' }} />
    <div className="admc-skeleton admc-skeleton-text" />
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="admc-skeleton admc-skeleton-row" />
    ))}
  </div>
);
export default AdminCompanySkeleton;
