import { contactMethods } from '@data/supportData';

const ContactCards = () => {
  return (
    <div className="sp-contact" id="sp-contact">
      <h3 className="sp-section-title">
        <i className="bi bi-telephone" />
        Nous contacter
      </h3>
      <div className="sp-contact__grid">
        {contactMethods.map((m, i) => (
          <div
            key={m.id}
            className={`sp-contact-card sp-contact-card--${m.color} ${!m.available ? 'sp-contact-card--disabled' : ''}`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`sp-contact-card__icon sp-contact-card__icon--${m.color}`}>
              <i className={`bi ${m.icon}`} />
            </div>
            <h4 className="sp-contact-card__label">{m.label}</h4>
            <p className="sp-contact-card__value">{m.value}</p>
            <div className="sp-contact-card__meta">
              <span className="sp-contact-card__meta-item">
                <i className="bi bi-clock" /> {m.hours}
              </span>
              <span className="sp-contact-card__meta-item">
                <i className="bi bi-lightning" /> {m.responseTime}
              </span>
            </div>
            <button
              type="button"
              className={`sp-contact-card__btn sp-btn sp-btn--${m.available ? m.color : 'outline'}`}
              disabled={!m.available}
            >
              {m.available ? 'Contacter' : 'Bientôt disponible'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactCards;
