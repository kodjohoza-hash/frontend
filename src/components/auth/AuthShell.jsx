import AppLogo from '@components/common/AppLogo';
import BenefitsSection from './BenefitsSection';
import StatsSection from './StatsSection';

const AuthShell = ({ children, leftTitle, leftHighlight, leftDesc }) => (
  <div className="auth-layout">
    <div className="auth-left">
      <div className="auth-left__bg">
        <div className="auth-left__orb auth-left__orb--1" />
        <div className="auth-left__orb auth-left__orb--2" />
        <div className="auth-left__orb auth-left__orb--3" />
        <div className="auth-left__mesh" />
      </div>

      <div className="auth-left__content">
        <div className="auth-left__brand">
          <AppLogo size={48} variant="horizontal" textClassName="auth-left__name" />
        </div>

        <div className="auth-left__badge">
          <i className="bi bi-trophy-fill" />
          Plateforme N&deg;1 de r&eacute;servation de billets de bus au Cameroun
        </div>

        <h1 className="auth-left__title">
          {leftTitle || (
            <>
              Voyagez en toute <span className="auth-left__highlight">{leftHighlight || 'confiance'}</span>
            </>
          )}
        </h1>

        <p className="auth-left__desc">
          {leftDesc || (
            <>
              R&eacute;servez vos billets de bus en quelques clics.<br />
              Comparez les compagnies.<br />
              Recevez votre billet num&eacute;rique imm&eacute;diatement.
            </>
          )}
        </p>

        <div className="auth-left__visual">
          <img
            src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&h=700&fit=crop&q=85"
            alt="Bus moderne de voyage au Cameroun"
            loading="eager"
            width="1000"
            height="700"
          />
        </div>

        <BenefitsSection />
        <StatsSection />
      </div>
    </div>

    <div className="auth-right">
      <div className="auth-right__inner">
        <div className="auth-mobile-logo">
          <AppLogo size={32} variant="horizontal" textClassName="auth-mobile-logo__text" />
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default AuthShell;
