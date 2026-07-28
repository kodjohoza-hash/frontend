export default function AgencySettingsSkeleton() {
  return (
    <div className="aset-layout">
      <aside className="aset-sidebar">
        <div className="aset-sidebar__nav aset-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aset-skeleton__line aset-skeleton__line--md" style={{ margin: '10px 16px' }} />
          ))}
        </div>
      </aside>
      <div className="aset-content aset-skeleton">
        <div className="aset-skeleton__line aset-skeleton__line--md" style={{ height: 22, marginBottom: 16 }} />
        <div className="aset-skeleton__line aset-skeleton__line--md" style={{ height: 14, marginBottom: 32, width: '45%' }} />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aset-skeleton__box" style={{ marginBottom: 16 }} />
        ))}
      </div>
    </div>
  );
}
