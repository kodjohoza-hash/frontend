import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import AppLogo from '@components/common/AppLogo';
import { useScrollPosition } from '@hooks/useLandingPage';
import { NAV_LINKS } from '@data/landingPage';

const HomeNavbar = () => {
  const scrollY = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#hero');
  const isScrolled = scrollY > 50;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveHash(`#${sections[i]}`);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setActiveHash(href);
    setMobileOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <header
        className={clsx('btc-home-header', isScrolled && 'is-scrolled')}
        role="banner"
      >
        <div className="btc-header-inner">
          {/* Logo — Left column */}
          <div className="btc-header-brand">
            <Link to="/" className="btc-home-brand" aria-label="Bus Tix Connect — Accueil">
              <AppLogo size={32} variant="horizontal" textClassName="btc-home-brand-text" />
            </Link>
          </div>

          {/* Center nav — Center column */}
          <div className="btc-header-nav d-none d-lg-flex">
            <nav className="btc-home-nav" aria-label="Navigation principale">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  className={clsx('btc-home-nav-link', activeHash === link.href && 'is-active')}
                  onClick={() => scrollTo(link.href)}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Auth buttons — Right column */}
          <div className="btc-header-actions d-none d-lg-flex">
            <Link to="/login" className="btc-btn-outline-orange">
              Connexion
            </Link>
            <Link to="/register" className="btc-btn-solid-orange">
              Créer un compte
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="btc-home-hamburger d-lg-none"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu de navigation"
          >
            <i className="bi bi-list fs-4" />
          </button>
        </div>
      </header>

      {/* Mobile Offcanvas */}
      <div
        className={clsx('btc-offcanvas-overlay', mobileOpen && 'is-open')}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <aside
        className={clsx('btc-offcanvas-panel', mobileOpen && 'is-open')}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        <div className="btc-offcanvas-header">
          <Link to="/" className="btc-home-brand" onClick={() => setMobileOpen(false)}>
              <AppLogo size={28} variant="horizontal" textClassName="btc-home-brand-text" />
          </Link>
          <button
            className="btc-offcanvas-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className="btc-offcanvas-nav">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              className={clsx('btc-offcanvas-link', activeHash === link.href && 'is-active')}
              onClick={() => scrollTo(link.href)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="btc-offcanvas-footer">
          <Link className="btc-btn-solid-orange w-100 mb-2" to="/login" onClick={() => setMobileOpen(false)}>
            Connexion
          </Link>
          <Link className="btc-btn-outline-orange w-100" to="/register" onClick={() => setMobileOpen(false)}>
            Créer un compte
          </Link>
        </div>
      </aside>
    </>
  );
};

export default HomeNavbar;
