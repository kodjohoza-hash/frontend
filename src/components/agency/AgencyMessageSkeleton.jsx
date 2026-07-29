export default function AgencyMessageSkeleton() {
  return (
    <div className="amsg-skeleton">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="amsg-skeleton__item">
          <div className="amsg-skeleton__avatar" />
          <div className="amsg-skeleton__lines">
            <div className="amsg-skeleton__line amsg-skeleton__line--short" />
            <div className="amsg-skeleton__line amsg-skeleton__line--medium" />
            <div className="amsg-skeleton__line amsg-skeleton__line--long" />
          </div>
        </div>
      ))}
    </div>
  );
}
