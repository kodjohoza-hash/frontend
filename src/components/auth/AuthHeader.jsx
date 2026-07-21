/**
 * AuthHeader — Logo + title + subtitle for auth forms
 */
const AuthHeader = ({ title, subtitle }) => (
  <div className="auth-header">
    <div className="auth-header__logo">
      <i className="bi bi-bus-front-fill" />
    </div>
    <h1 className="auth-header__title">{title}</h1>
    {subtitle && <p className="auth-header__subtitle">{subtitle}</p>}
  </div>
);

export default AuthHeader;
