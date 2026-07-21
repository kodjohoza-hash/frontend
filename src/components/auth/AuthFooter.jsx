import { Link } from 'react-router-dom';

/**
 * AuthFooter — Bottom link for auth pages (e.g. "Already have account?")
 */
const AuthFooter = ({ text, linkLabel, linkTo }) => (
  <div className="auth-footer">
    <p className="auth-footer__text">
      {text}{' '}
      <Link to={linkTo} className="auth-footer__link">
        {linkLabel}
      </Link>
    </p>
  </div>
);

export default AuthFooter;
