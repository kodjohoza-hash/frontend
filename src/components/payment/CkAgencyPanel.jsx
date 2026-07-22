import { memo } from 'react';

const CkAgencyPanel = memo(({ onConfirm, confirmed }) => (
  <div className="ck-agency ck-form--slide">
    <div className="ck-agency__header">
      <div className="ck-agency__icon">
        <i className="bi bi-shop" />
      </div>
      <div>
        <h4 className="ck-agency__title">Paiement en agence</h4>
        <p className="ck-agency__sub">Payez en espèces au comptoir Grand Littoral</p>
      </div>
    </div>
    <div className="ck-agency__steps">
      {[
        "Présentez-vous au comptoir avec votre pièce d'identité.",
        "Communiquez votre numéro de réservation à l'agent.",
        "Effectuez le paiement et conservez votre reçu.",
      ].map((text, i) => (
        <div key={i} className="ck-agency__step">
          <span className="ck-agency__step-num">{i + 1}</span>
          <span className="ck-agency__step-text">{text}</span>
        </div>
      ))}
    </div>
    <button
      type="button"
      className={`ck-agency__btn ${confirmed ? 'ck-agency__btn--ok' : ''}`}
      onClick={onConfirm}
    >
      {confirmed ? <><i className="bi bi-check-lg" /> Réservation confirmée</> : 'Confirmer la réservation'}
    </button>
  </div>
));
CkAgencyPanel.displayName = 'CkAgencyPanel';
export default CkAgencyPanel;
