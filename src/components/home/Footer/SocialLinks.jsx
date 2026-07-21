import { memo } from 'react';
import { SOCIAL_LINKS } from '@data/footer';

const SocialLinks = memo(() => (
  <div className="btc-footer-socials">
    {SOCIAL_LINKS.map((s) => (
      <a
        key={s.label}
        href={s.href}
        className="btc-footer-social"
        aria-label={s.label}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className={`bi ${s.icon}`} />
      </a>
    ))}
  </div>
));

SocialLinks.displayName = 'SocialLinks';
export default SocialLinks;
