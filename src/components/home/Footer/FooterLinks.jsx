import { memo } from 'react';
import clsx from 'clsx';

const FooterLinks = memo(({ title, links }) => (
  <div className="btc-footer-col">
    <h5 className="btc-footer-heading">{title}</h5>
    <nav className="btc-footer-nav" aria-label={title}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href || '#'}
          className={clsx('btc-footer-link', { 'btc-footer-link--muted': link.muted })}
        >
          {link.label}
        </a>
      ))}
    </nav>
  </div>
));

FooterLinks.displayName = 'FooterLinks';
export default FooterLinks;
