/**
 * AuthCard — Premium glass card wrapper
 */
const AuthCard = ({ children, className = '' }) => (
  <div className={`auth-card ${className}`}>
    {children}
  </div>
);

export default AuthCard;
