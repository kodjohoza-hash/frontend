const AdminSkeleton = () => (
  <div className="adm-skeleton">
    <div className="adm-skel-header" />
    <div className="adm-skel-stats">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="adm-skel-stat" />
      ))}
    </div>
    <div className="adm-skel-charts">
      <div className="adm-skel-chart" />
      <div className="adm-skel-chart" />
    </div>
    <div className="adm-skel-bottom">
      <div className="adm-skel-bottom-item" />
      <div className="adm-skel-bottom-item" />
    </div>
  </div>
);

export default AdminSkeleton;
