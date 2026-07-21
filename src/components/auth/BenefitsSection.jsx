/**
 * BenefitsSection — 6 advantages in 2 columns with round icons
 */
const BENEFITS = [
  { icon: 'bi-lightning-charge-fill', title: 'Réservation rapide' },
  { icon: 'bi-shield-lock-fill', title: 'Paiement sécurisé' },
  { icon: 'bi-qr-code-scan', title: 'Billet numérique' },
  { icon: 'bi-headset', title: 'Support 24/7' },
  { icon: 'bi-building', title: 'Plus de 100 compagnies' },
  { icon: 'bi-people-fill', title: 'Des milliers de voyageurs satisfaits' },
];

const BenefitsSection = () => (
  <div className="auth-benefits">
    {BENEFITS.map((b) => (
      <div key={b.title} className="auth-benefits__item">
        <div className="auth-benefits__icon">
          <i className={`bi ${b.icon}`} />
        </div>
        <span className="auth-benefits__title">{b.title}</span>
      </div>
    ))}
  </div>
);

export default BenefitsSection;
