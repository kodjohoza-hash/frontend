import { Outlet } from 'react-router-dom';

/**
 * AuthLayout — Layout pour les pages d'authentification
 * Split: Branding (desktop) | Form
 */
const AuthLayout = () => {
  return (
    <div className="auth-layout d-flex min-vh-100">
      {/* Branding Panel */}
      <div className="auth-sidebar d-none d-lg-flex flex-column justify-content-center align-items-center text-white flex-grow-1">
        <div className="text-center px-5">
          <div className="navbar-logo-icon mx-auto mb-4" style={{ width: 64, height: 64, fontSize: '1.75rem' }}>
            <i className="bi bi-bus-front-fill" />
          </div>
          <h1 className="display-5 fw-bold mb-3">Bus Tix Connect</h1>
          <p className="lead opacity-75">Plateforme de réservation de billets de transport</p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-content d-flex flex-column justify-content-center align-items-center flex-grow-1 bg-white">
        <div className="w-100" style={{ maxWidth: '420px' }}>
          <div className="text-center mb-4 d-lg-none">
            <div className="navbar-logo-icon mx-auto mb-3">
              <i className="bi bi-bus-front-fill" />
            </div>
            <h2 className="fw-bold text-primary">Bus Tix Connect</h2>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
