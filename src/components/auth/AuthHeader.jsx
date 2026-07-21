/**
 * AuthHeader — Icon + title + subtitle for auth forms
 */
const AuthHeader = ({ icon, title, subtitle }) => (
  <div className="auth-header">
    {icon && <div className="auth-header__icon">{icon}</div>}
    <h1 className="auth-header__title">{title}</h1>
    {subtitle && <p className="auth-header__subtitle">{subtitle}</p>}
  </div>
);

export default AuthHeader;
