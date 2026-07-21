import { TRAVEL_TIPS } from '../../data/bookingConfirmation';

const TravelTipsCard = () => (
  <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', background: 'var(--color-primary-50)' }}>
    <div className="card-body p-4">
      <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>
        <i className="bi bi-info-circle-fill me-2" />
        Conseils pour votre voyage
      </h6>
      <div className="row g-3">
        {TRAVEL_TIPS.map((tip) => (
          <div key={tip.title} className="col-6 col-md-3">
            <div className="text-center">
              <i className={tip.icon} style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 8, display: 'block' }} />
              <div className="fw-semibold mb-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{tip.title}</div>
              <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-tight)' }}>{tip.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TravelTipsCard;
