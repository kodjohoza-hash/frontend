import { resources } from '@data/supportData';

const SupportResources = () => {
  return (
    <div className="sp-resources" id="sp-resources">
      <h3 className="sp-section-title">
        <i className="bi bi-book" />
        Ressources
      </h3>
      <div className="sp-resources__grid">
        {resources.map((r, i) => (
          <div
            key={r.id}
            className="sp-resource"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="sp-resource__icon">
              <i className={`bi ${r.icon}`} />
            </div>
            <div className="sp-resource__info">
              <span className="sp-resource__label">{r.label}</span>
              <span className="sp-resource__desc">{r.desc}</span>
            </div>
            <i className="bi bi-arrow-right sp-resource__arrow" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportResources;
