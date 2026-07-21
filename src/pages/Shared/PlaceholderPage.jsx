import { useNavigate } from 'react-router-dom';

const PlaceholderPage = ({ title, description, icon = 'bi-tools', backTo = '/' }) => {
  const navigate = useNavigate();

  return (
    <div className="btc-placeholder-page">
      <div className="d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: '60vh' }}>
        <div
          className="d-inline-flex align-items-center justify-content-center mb-4"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--color-primary-50)',
            color: 'var(--color-primary)',
            fontSize: '2rem',
          }}
        >
          <i className={`bi ${icon}`} />
        </div>
        <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)', fontSize: 'var(--font-size-xl)' }}>
          {title}
        </h3>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', maxWidth: 400 }}>
          {description || 'Cette page est en cours de developpement. Elle sera bientot disponible.'}
        </p>
        <button
          onClick={() => navigate(backTo)}
          className="btn btn-primary mt-3"
          style={{ borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)', padding: '10px 24px' }}
        >
          <i className="bi bi-arrow-left me-2" />
          Retour
        </button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
