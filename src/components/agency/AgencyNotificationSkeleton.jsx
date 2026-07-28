export default function AgencyNotificationSkeleton() {
  return (
    <div className="anot-page">
      <div className="anot-skeleton">
        <div className="anot-skeleton__stats">
          {[...Array(6)].map((_, i) => <div key={i} className="anot-skeleton__stat" />)}
        </div>
        <div className="anot-skeleton__filters" />
        <div className="anot-skeleton__list" />
      </div>
    </div>
  );
}
