import clsx from 'clsx';
import AppLogo from '@components/common/AppLogo';

/**
 * Footer — Pied de page réutilisable
 */
const Footer = ({
  variant = 'default',
  className = '',
}) => {
  const isDark = variant === 'dark';
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={clsx(
        'btc-footer',
        'py-4',
        isDark ? 'bg-primary-custom text-white' : 'bg-white border-top',
        className
      )}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-4 text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <AppLogo
                size={32}
                variant="horizontal"
                textClassName={clsx('fw-bold', isDark ? 'text-white' : 'text-primary')}
              />
            </div>
          </div>

          <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
            <div className={clsx('small', isDark ? 'text-white-50' : 'text-muted')}>
              <span>&copy; {currentYear} Bus Tix Connect. Tous droits réservés.</span>
            </div>
          </div>

          <div className="col-12 col-md-4 text-center text-md-end">
            <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-3">
              <a
                href="#"
                className={clsx('small text-decoration-none', isDark ? 'text-white-50' : 'text-muted')}
                aria-label="Facebook"
              >
                <i className="bi bi-facebook fs-5" />
              </a>
              <a
                href="#"
                className={clsx('small text-decoration-none', isDark ? 'text-white-50' : 'text-muted')}
                aria-label="Twitter"
              >
                <i className="bi bi-twitter-x fs-5" />
              </a>
              <a
                href="#"
                className={clsx('small text-decoration-none', isDark ? 'text-white-50' : 'text-muted')}
                aria-label="Instagram"
              >
                <i className="bi bi-instagram fs-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
