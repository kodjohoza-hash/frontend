import { companyInfo, quickStats } from '@data/agencyData';

const AgencyWelcome = () => {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="ag-welcome">
      <div className="ag-welcome__content">
        <div className="ag-welcome__text">
          <h1 className="ag-welcome__title">{greeting()}, {companyInfo.name}</h1>
          <p className="ag-welcome__desc">{companyInfo.slogan}</p>
        </div>
        <div className="ag-welcome__meta">
          <div className="ag-welcome__meta-item">
            <i className="bi bi-star-fill" />
            <span>{companyInfo.rating}/5</span>
            <span className="ag-welcome__meta-sep">·</span>
            <span>{companyInfo.totalReviews} avis</span>
          </div>
          <div className="ag-welcome__meta-item">
            <span className="ag-welcome__plan">{companyInfo.plan}</span>
            <span className="ag-welcome__since">Depuis {companyInfo.since}</span>
          </div>
        </div>
      </div>
      <div className="ag-welcome__illust">
        <i className="bi bi-bus-front-fill" />
      </div>
    </div>
  );
};

export default AgencyWelcome;
