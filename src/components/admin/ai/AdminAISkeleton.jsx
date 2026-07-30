const AdminAISkeleton = () => (
  <div className="adai-skeleton">
    <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
      <div className="adai-skeleton-icon"></div>
      <div style={{ flex: 1 }}>
        <div className="adai-skeleton-line w60" style={{ height: 16 }}></div>
        <div className="adai-skeleton-line w80" style={{ height: 12 }}></div>
        <div className="adai-skeleton-line w40" style={{ height: 12 }}></div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <div className="adai-skeleton-line" style={{ width: 50, height: 22, borderRadius: 4 }}></div>
      <div className="adai-skeleton-line" style={{ width: 70, height: 22, borderRadius: 4 }}></div>
      <div className="adai-skeleton-line" style={{ width: 60, height: 22, borderRadius: 4 }}></div>
    </div>
  </div>
);
export default AdminAISkeleton;

export const AdminAISkeletonGrid = ({ count = 4 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 14 }}>
    {Array.from({ length: count }).map((_, i) => <AdminAISkeleton key={i} />)}
  </div>
);
