import DashboardHeader from '@components/client/DashboardHeader';
import StatsCard from '@components/client/StatsCard';
import UpcomingTripCard from '@components/client/UpcomingTripCard';
import ReservationsTable from '@components/client/ReservationsTable';
import NotificationCard from '@components/client/NotificationCard';
import QuickActionCard from '@components/client/QuickActionCard';
import DashboardFooter from '@components/client/DashboardFooter';
import {
  mockStats,
  mockUpcomingTrip,
  mockReservations,
  mockNotifications,
  mockQuickActions,
} from '@data/clientDashboard';
import '@assets/styles/dashboard.css';

const DashboardHome = () => {
  return (
    <div className="btc-dashboard d-flex flex-column min-h-0">
      <DashboardHeader />

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {mockStats.map((stat) => (
          <div key={stat.id} className="col-12 col-sm-6 col-xl-3">
            <StatsCard
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              icon={stat.icon}
              color={stat.color}
              change={stat.change}
              changeType={stat.changeType}
            />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="row g-4 mb-4">
        {/* Left Column: Upcoming Trip + Reservations */}
        <div className="col-12 col-lg-8">
          {/* Upcoming Trip */}
          <UpcomingTripCard trip={mockUpcomingTrip} />

          {/* Reservations Table */}
          <div className="card border-0 mt-4" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-body p-0">
              <div className="d-flex align-items-center justify-content-between px-4 pt-4 pb-2">
                <h6 className="fw-semibold mb-0" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
                  <i className="bi bi-clock-history me-2" style={{ color: 'var(--color-primary)' }} />
                  Historique des réservations
                </h6>
                <a href="/client/reservations" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-medium)', textDecoration: 'none' }}>
                  Voir tout <i className="bi bi-arrow-right ms-1" />
                </a>
              </div>
              <ReservationsTable reservations={mockReservations} />
            </div>
          </div>
        </div>

        {/* Right Column: Notifications + Quick Actions */}
        <div className="col-12 col-lg-4">
          {/* Notifications */}
          <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-body p-0">
              <div className="d-flex align-items-center justify-content-between px-4 pt-4 pb-2">
                <h6 className="fw-semibold mb-0" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
                  <i className="bi bi-bell-fill me-2" style={{ color: 'var(--color-warning)' }} />
                  Notifications
                </h6>
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-pill"
                  style={{
                    width: 20,
                    height: 20,
                    fontSize: 'var(--font-size-2xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    background: 'var(--color-accent)',
                    color: 'var(--color-white)',
                  }}
                >
                  {mockNotifications.filter((n) => !n.read).length}
                </span>
              </div>
              <NotificationCard notifications={mockNotifications} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card border-0 mt-4" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-body p-4">
              <h6 className="fw-semibold mb-3" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
                <i className="bi bi-lightning-fill me-2" style={{ color: 'var(--color-accent)' }} />
                Actions rapides
              </h6>
              <div className="d-flex flex-column gap-2">
                {mockQuickActions.map((action) => (
                  <QuickActionCard
                    key={action.id}
                    label={action.label}
                    description={action.description}
                    icon={action.icon}
                    color={action.color}
                    path={action.path}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default DashboardHome;
