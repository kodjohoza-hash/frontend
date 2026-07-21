import { useState } from 'react';

const NewsletterCard = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <section className="btc-newsletter-outer">
      <div className="btc-newsletter-deco" aria-hidden="true">
        <div className="btc-newsletter-deco-orb btc-newsletter-deco-orb--1" />
        <div className="btc-newsletter-deco-orb btc-newsletter-deco-orb--2" />
      </div>
      <div className="container">
        <div className="btc-newsletter-card">
          <div className="btc-newsletter-content">
            <div className="btc-newsletter-icon" aria-hidden="true">
              <i className="bi bi-envelope-paper" />
            </div>
            <h2 className="btc-newsletter-title">
              Restez informé de nos <span className="text-accent">offres</span>
            </h2>
            <p className="btc-newsletter-text">
              Recevez les nouveautés, promotions et nouveaux trajets directement dans votre boîte mail.
            </p>
          </div>
          <form className="btc-newsletter-form" onSubmit={handleSubmit}>
            <div className="btc-newsletter-input-wrap">
              <i className="bi bi-envelope" />
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Adresse email pour la newsletter"
              />
            </div>
            <button type="submit" className="btc-newsletter-btn">
              S'abonner <i className="bi bi-send" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCard;
