import { Outlet } from 'react-router-dom';
import AuthIllustration from '@components/auth/AuthIllustration';

/**
 * AuthLayout — Split-screen layout for auth pages
 * Left: Premium branding panel with illustration
 * Right: Form panel with Outlet
 */
const AuthLayout = () => (
  <div className="auth-layout d-flex min-vh-100">
    <AuthIllustration />

    <div className="auth-layout__content">
      <div className="auth-layout__content-inner">
        <div className="auth-mobile-logo">
          <div className="auth-mobile-logo__icon">
            <i className="bi bi-bus-front-fill" />
          </div>
          <div className="auth-mobile-logo__text">Bus Tix Connect</div>
        </div>
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
