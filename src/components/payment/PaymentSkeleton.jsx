const PaymentSkeleton = () => (
  <div className="btc-payment-skeleton" aria-busy="true" aria-label="Chargement">
    <div className="row g-4">
      <div className="col-12 col-lg-7">
        {/* Stepper skeleton */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="d-flex flex-column align-items-center gap-1">
              <div className="btc-skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
              <div className="btc-skeleton" style={{ width: 48, height: 10, borderRadius: 'var(--radius-sm)' }} />
            </div>
          ))}
        </div>

        {/* Timer skeleton */}
        <div className="btc-skeleton mx-auto mb-4" style={{ width: 300, height: 36, borderRadius: 'var(--radius-lg)' }} />

        {/* Payment methods skeleton */}
        <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="card-body p-4">
            <div className="btc-skeleton mb-3" style={{ width: 200, height: 18, borderRadius: 'var(--radius-sm)' }} />
            {[1, 2, 3].map((i) => (
              <div key={i} className="d-flex align-items-center gap-3 p-3 mb-2" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div className="btc-skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)' }} />
                <div className="flex-grow-1">
                  <div className="btc-skeleton mb-1" style={{ width: 120, height: 14, borderRadius: 'var(--radius-sm)' }} />
                  <div className="btc-skeleton" style={{ width: 180, height: 10, borderRadius: 'var(--radius-sm)' }} />
                </div>
                <div className="btc-skeleton" style={{ width: 20, height: 20, borderRadius: '50%' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-5">
        <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="card-body p-4">
            <div className="btc-skeleton mb-3" style={{ width: 150, height: 18, borderRadius: 'var(--radius-sm)' }} />
            <div className="btc-skeleton mb-2" style={{ width: '100%', height: 14, borderRadius: 'var(--radius-sm)' }} />
            <div className="btc-skeleton mb-2" style={{ width: '80%', height: 14, borderRadius: 'var(--radius-sm)' }} />
            <div className="btc-skeleton mb-3" style={{ width: '60%', height: 14, borderRadius: 'var(--radius-sm)' }} />
            <div className="btc-skeleton mb-2" style={{ width: '100%', height: 2, borderRadius: 1 }} />
            <div className="btc-skeleton mt-3" style={{ width: '100%', height: 44, borderRadius: 'var(--radius-lg)' }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentSkeleton;
