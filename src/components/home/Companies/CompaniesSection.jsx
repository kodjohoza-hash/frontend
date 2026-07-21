import { COMPANIES } from '@data/landingPage';
import { useInView } from '@hooks/useLandingPage';
import CompanyCard from './CompanyCard';

const CompaniesSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="compagnies" className="btc-companies" ref={ref}>
      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-building" /> Partenaires
          </span>
          <h2 className="btc-section-title">Compagnies populaires</h2>
          <p className="btc-section-subtitle">
            Voyagez avec les meilleures compagnies de transport partenaires de BUS TIX CONNECT.
          </p>
        </div>

        <div className="btc-companies-grid">
          {COMPANIES.map((c, i) => (
            <div
              key={c.id}
              className={`btc-companies-item ${isInView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <CompanyCard company={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;
