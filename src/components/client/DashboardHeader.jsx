import useAuth from '@hooks/useAuth';

const DashboardHeader = () => {
  const { user } = useAuth();

  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Bonjour';
  if (hour >= 12 && hour < 18) greeting = 'Bon après-midi';
  else if (hour >= 18) greeting = 'Bonsoir';

  const formattedDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const firstName = user?.firstName || 'Voyageur';

  return (
    <div className="btc-dashboard-header mb-4">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: 'var(--font-size-2xl)' }}>
            {greeting}, {firstName} 👋
          </h4>
          <p className="mb-0" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            {formattedDate}
          </p>
        </div>
        <a
          href="/booking"
          className="btn btn-accent btn-sm d-inline-flex align-items-center gap-2"
          style={{ borderRadius: 'var(--radius-lg)', padding: '8px 16px' }}
        >
          <i className="bi bi-plus-circle" />
          Réserver un billet
        </a>
      </div>
    </div>
  );
};

export default DashboardHeader;
