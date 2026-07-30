const AdminBackupSkeleton = () => (
  <div className="adb-skeleton">
    <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
      <div className="adb-skeleton-icon"></div>
      <div style={{ flex: 1 }}>
        <div className="adb-skeleton-line w60" style={{ height: 16 }}></div>
        <div className="adb-skeleton-line w80" style={{ height: 12 }}></div>
        <div className="adb-skeleton-line w40" style={{ height: 12 }}></div>
      </div>
    </div>
    <div className="adb-skeleton-line h32"></div>
    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
      <div className="adb-skeleton-line" style={{ width: 60, height: 28, borderRadius: 6 }}></div>
      <div className="adb-skeleton-line" style={{ width: 80, height: 28, borderRadius: 6 }}></div>
    </div>
  </div>
);
export default AdminBackupSkeleton;

export const AdminBackupRowSkeleton = () => (
  <tr>
    <td><div className="adb-skeleton-line" style={{ height: 14, width: 120 }}></div></td>
    <td><div className="adb-skeleton-line" style={{ height: 14, width: 60 }}></div></td>
    <td><div className="adb-skeleton-line" style={{ height: 14, width: 70 }}></div></td>
    <td><div className="adb-skeleton-line" style={{ height: 14, width: 100 }}></div></td>
    <td><div className="adb-skeleton-line" style={{ height: 14, width: 50 }}></div></td>
    <td><div className="adb-skeleton-line" style={{ height: 14, width: 70 }}></div></td>
    <td><div className="adb-skeleton-line" style={{ height: 14, width: 80 }}></div></td>
    <td><div className="adb-skeleton-line" style={{ height: 14, width: 60 }}></div></td>
  </tr>
);

export const AdminBackupSkeletonGrid = ({ count = 3 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 14 }}>
    {Array.from({ length: count }).map((_, i) => <AdminBackupSkeleton key={i} />)}
  </div>
);
