/**
 * SocialLoginPlaceholder — Social login buttons (placeholder for future)
 */
const SocialLoginPlaceholder = () => (
  <div className="social-login">
    <button type="button" className="social-login__btn" disabled aria-label="Connexion avec Google (bientôt disponible)">
      <i className="bi bi-google" />
      Continuer avec Google
    </button>
    <button type="button" className="social-login__btn" disabled aria-label="Connexion avec Facebook (bientôt disponible)">
      <i className="bi bi-facebook" />
      Continuer avec Facebook
    </button>
  </div>
);

export default SocialLoginPlaceholder;
