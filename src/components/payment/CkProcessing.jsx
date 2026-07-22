import { memo } from 'react';

const CkProcessing = memo(() => (
  <div className="ck-processing" role="alert" aria-busy="true" aria-label="Traitement en cours">
    <div className="ck-processing__card">
      <div className="ck-processing__spinner">
        <div className="ck-processing__ring" />
        <i className="bi bi-shield-lock-fill" />
      </div>
      <h3 className="ck-processing__title">Traitement en cours</h3>
      <p className="ck-processing__text">Veuillez patienter pendant que nous sécurisons votre transaction…</p>
      <div className="ck-processing__steps">
        <div className="ck-processing__step ck-processing__step--active">
          <i className="bi bi-check-circle-fill" /> Vérification des données
        </div>
        <div className="ck-processing__step">
          <i className="bi bi-hourglass-split" /> Connexion au provider
        </div>
        <div className="ck-processing__step">
          <i className="bi bi-hourglass-split" /> Confirmation
        </div>
      </div>
    </div>
  </div>
));
CkProcessing.displayName = 'CkProcessing';
export default CkProcessing;
