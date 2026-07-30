const AdminIntegrationSkeleton = () => (
  <div className="adi-skeleton">
    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
      <div className="adi-skeleton-line" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }}></div>
      <div style={{ flex: 1 }}>
        <div className="adi-skeleton-line w60" style={{ height: 16 }}></div>
        <div className="adi-skeleton-line w80" style={{ height: 12 }}></div>
        <div className="adi-skeleton-line w40" style={{ height: 12 }}></div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 12 }}>
      <div className="adi-skeleton-line" style={{ width: 60, height: 28, borderRadius: 6 }}></div>
      <div className="adi-skeleton-line" style={{ width: 80, height: 28, borderRadius: 6 }}></div>
    </div>
  </div>
);
export default AdminIntegrationSkeleton;

const AdminIntegrationSkeletonRow = () => (
  <tr>
    <td><div className="adi-skeleton-line" style={{ height: 14, width: 80 }}></div></td>
    <td><div className="adi-skeleton-line" style={{ height: 14, width: 120 }}></div></td>
    <td><div className="adi-skeleton-line" style={{ height: 14, width: 60 }}></div></td>
    <td><div className="adi-skeleton-line" style={{ height: 14, width: 100 }}></div></td>
  </tr>
);
export { AdminIntegrationSkeletonRow };
