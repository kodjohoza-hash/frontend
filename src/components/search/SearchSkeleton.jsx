const SearchSkeleton = ({ count = 3 }) => (
  <div className="btc-search-skeleton" aria-busy="true" aria-label="Chargement des résultats">
    {/* Summary skeleton */}
    <div className="card border-0 mb-4" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="btc-skeleton" style={{ width: 120, height: 28, borderRadius: 'var(--radius-md)' }} />
          <div className="btc-skeleton d-none d-sm-block" style={{ width: 16, height: 16, borderRadius: 'var(--radius-circle)' }} />
          <div className="btc-skeleton" style={{ width: 120, height: 28, borderRadius: 'var(--radius-md)' }} />
          <div className="btc-skeleton d-none d-md-block" style={{ width: 100, height: 20, borderRadius: 'var(--radius-md)' }} />
          <div className="btc-skeleton d-none d-md-block" style={{ width: 80, height: 20, borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>
    </div>

    {/* Filter skeleton */}
    <div className="row g-4">
      <div className="col-12 col-lg-3 d-none d-lg-block">
        <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="card-body p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mb-3">
                <div className="btc-skeleton mb-2" style={{ width: 100, height: 16, borderRadius: 'var(--radius-sm)' }} />
                <div className="btc-skeleton mb-1" style={{ width: '100%', height: 12, borderRadius: 'var(--radius-sm)' }} />
                <div className="btc-skeleton mb-1" style={{ width: '85%', height: 12, borderRadius: 'var(--radius-sm)' }} />
                <div className="btc-skeleton" style={{ width: '70%', height: 12, borderRadius: 'var(--radius-sm)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-9">
        {/* Sort skeleton */}
        <div className="d-flex justify-content-between mb-3">
          <div className="btc-skeleton" style={{ width: 150, height: 16, borderRadius: 'var(--radius-sm)' }} />
          <div className="btc-skeleton" style={{ width: 120, height: 32, borderRadius: 'var(--radius-md)' }} />
        </div>

        {/* Trip card skeletons */}
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="card border-0 mb-3" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="btc-skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)' }} />
                <div>
                  <div className="btc-skeleton mb-1" style={{ width: 120, height: 14, borderRadius: 'var(--radius-sm)' }} />
                  <div className="btc-skeleton" style={{ width: 80, height: 10, borderRadius: 'var(--radius-sm)' }} />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-3">
                  <div className="btc-skeleton mx-auto" style={{ width: 60, height: 28, borderRadius: 'var(--radius-sm)' }} />
                  <div className="btc-skeleton mx-auto mt-2" style={{ width: 50, height: 12, borderRadius: 'var(--radius-sm)' }} />
                </div>
                <div className="col-6">
                  <div className="btc-skeleton mx-auto mb-2" style={{ width: 60, height: 12, borderRadius: 'var(--radius-sm)' }} />
                  <div className="btc-skeleton mx-auto" style={{ width: '100%', height: 4, borderRadius: 'var(--radius-pill)' }} />
                </div>
                <div className="col-3">
                  <div className="btc-skeleton mx-auto" style={{ width: 60, height: 28, borderRadius: 'var(--radius-sm)' }} />
                  <div className="btc-skeleton mx-auto mt-2" style={{ width: 50, height: 12, borderRadius: 'var(--radius-sm)' }} />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <div className="btc-skeleton" style={{ width: 100, height: 14, borderRadius: 'var(--radius-sm)' }} />
                <div className="d-flex gap-2">
                  <div className="btc-skeleton" style={{ width: 80, height: 32, borderRadius: 'var(--radius-md)' }} />
                  <div className="btc-skeleton" style={{ width: 80, height: 32, borderRadius: 'var(--radius-md)' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SearchSkeleton;
