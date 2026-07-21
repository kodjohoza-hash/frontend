const InsuranceCard = ({ insurance, isSelected, onToggle }) => (
  <div
    className="btc-insurance-card card border-0 mb-3"
    style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}
  >
    <div className="card-body p-4">
      <label className="d-flex align-items-start gap-3 cursor-pointer mb-0" htmlFor="insurance-toggle">
        <div className="flex-shrink-0 mt-1">
          <input
            type="checkbox"
            id="insurance-toggle"
            className="btc-checkbox-lg"
            checked={isSelected}
            onChange={(e) => onToggle(e.target.checked)}
            aria-label="Ajouter une assurance voyage"
            style={{
              width: 20,
              height: 20,
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
            }}
          />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <i className="bi bi-shield-fill-check" style={{ color: 'var(--color-success)', fontSize: '1rem' }} />
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
              {insurance.name}
            </span>
            <span className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent)' }}>
              +{insurance.price.toLocaleString()} FCFA
            </span>
          </div>
          <p className="mb-0" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', lineHeight: 'var(--line-height-relaxed)' }}>
            {insurance.description}
          </p>
        </div>
      </label>
    </div>
  </div>
);

export default InsuranceCard;
