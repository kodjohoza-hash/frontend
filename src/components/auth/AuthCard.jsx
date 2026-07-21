/**
 * AuthCard — Styled wrapper for auth form content
 */
const AuthCard = ({ children, className = '' }) => (
  <div className={`auth-card ${className}`}>
    {children}
  </div>
);

export default AuthCard;
