const AdminRoleSkeleton = () => (
  <div style={{ padding: '1.5rem 0' }}>
    <div className="admr-skeleton admr-skeleton-title" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
      {Array.from({ length: 7 }).map((_, i) => <div key={i} className="admr-skeleton admr-skeleton-card" />)}
    </div>
    <div className="admr-skeleton admr-skeleton-title" style={{ width: '40%' }} />
    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="admr-skeleton admr-skeleton-row" />)}
  </div>
);
export default AdminRoleSkeleton;
