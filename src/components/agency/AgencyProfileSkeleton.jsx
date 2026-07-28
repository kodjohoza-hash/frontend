export default function AgencyProfileSkeleton() {
  return (
    <div className="apro-page">
      <div className="apro-skeleton">
        <div className="apro-skeleton__hero" />
        <div className="apro-skeleton__stats">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="apro-skeleton__stat" />
          ))}
        </div>
        <div className="apro-skeleton__content">
          <div className="apro-skeleton__main" />
          <div className="apro-skeleton__side" />
        </div>
      </div>
    </div>
  );
}
