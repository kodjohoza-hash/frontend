import { memo } from 'react';

const FooterBottom = memo(() => {
  const year = new Date().getFullYear();

  return (
    <div className="btc-footer-bottom">
      <div className="btc-footer-bottom-left">
        <span className="btc-footer-copyright">
          &copy; {year} BUS TIX CONNECT. Tous droits réservés.
        </span>
      </div>
      <div className="btc-footer-bottom-right">
        <span className="btc-footer-version">v1.0.0</span>
      </div>
    </div>
  );
});

FooterBottom.displayName = 'FooterBottom';
export default FooterBottom;
