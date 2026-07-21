import { useState } from 'react';
import { useInView } from '@hooks/useLandingPage';

const NewsletterSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setTimeout(() => { setSubmitted(true); setEmail(''); setLoading(false); }, 1200);
  };

  return (
    <section id="newsletter" className="btc-newsletter" ref={ref}>
      <div className="container">
        <div className="btc-newsletter-card">
          <div className="btc-newsletter-deco" aria-hidden="true">
            <div className="btc-newsletter-deco-orb btc-newsletter-deco-orb--1" />
            <div className="btc-newsletter-deco-orb btc-newsletter-deco-orb--2" />
            <div className="btc-newsletter-deco-orb btc-newsletter-deco-orb--3" />
          </div>

          <div className={`btc-newsletter-content ${isInView ? 'is-visible' : ''}`}>
            <div className="btc-newsletter-icon">
              <i className="bi bi-envelope-heart" />
            </div>
            <h2 className="btc-newsletter-title">Restez informé des meilleures offres</h2>
            <p className="btc-newsletter-text">
              Inscrivez-vous et recevez les promotions exclusives et les nouvelles destinations en avant-première.
            </p>

            {submitted ? (
              <div className="btc-newsletter-success">
                <div className="btc-newsletter-success-icon"><i className="bi bi-check-lg" /></div>
                <strong>Merci !</strong> Vous recevrez nos prochaines offres.
              </div>
            ) : (
              <form className="btc-newsletter-form" onSubmit={handleSubmit}>
                <div className="btc-newsletter-input-group">
                  <div className="btc-newsletter-input-wrap">
                    <i className="bi bi-envelope btc-newsletter-input-icon" />
                    <input
                      type="email"
                      className="btc-newsletter-input"
                      placeholder="Votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-label="Adresse email pour la newsletter"
                    />
                  </div>
                  <button type="submit" className="btc-newsletter-btn" disabled={loading}>
                    {loading ? <span className="btc-newsletter-spinner" /> : <>S'inscrire <i className="bi bi-arrow-right" /></>}
                  </button>
                </div>
                <p className="btc-newsletter-disclaimer">
                  <i className="bi bi-shield-check me-1" /> Pas de spam. Désinscription en un clic.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
