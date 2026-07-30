const AdminUserSkeleton = () => (
  <div style={{ padding: '1.5rem 0' }}>
    <div className="admu-skeleton admu-skeleton-title" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '0.65rem', marginBottom: '1.5rem' }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="admu-skeleton admu-skeleton-card" />
      ))}
    </div>
    <div className="admu-skeleton admu-skeleton-title" style={{ width: '40%' }} />
    <div className="admu-skeleton admu-skeleton-text" />
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="admu-skeleton" style={{ height: 42, marginBottom: 4, borderRadius: 4 }} />
    ))}
  </div>
);
export default AdminUserSkeleton;
