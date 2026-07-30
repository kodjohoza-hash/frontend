import { useState } from 'react';

const STEPS = [
  { num: 1, label: 'Réception de la demande' },
  { num: 2, label: 'Analyse des documents' },
  { num: 3, label: 'Décision' },
  { num: 4, label: 'Notification' },
];

const AdminCompanyValidation = ({ company, onComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState(null);

  const steps = STEPS.map((s, i) => ({
    ...s,
    status: i < step ? 'completed' : i === step ? 'active' : 'pending',
  }));

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete?.(decision || 'validated');
    }
  };

  const handleDecision = (d) => {
    setDecision(d);
    setStep(3);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <div className="admc-alert admc-alert--info">
              <i className="bi bi-info-circle" /> Demande reçue pour <strong>{company?.name}</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.6 }}>
              La compagnie <strong>{company?.name}</strong> a soumis une demande d'inscription le {company?.createdAt}.
              Tous les documents nécessaires ont été fournis. Veuillez procéder à l'analyse des documents.
            </p>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="admc-alert admc-alert--warning">
              <i className="bi bi-exclamation-triangle" /> Vérifiez l'authenticité des documents ci-dessous.
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>
              RCCM : <strong>{company?.rccm}</strong><br />
              N° Contribuable : <strong>{company?.taxpayerId}</strong>
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="admc-alert admc-alert--warning">
              <i className="bi bi-exclamation-triangle" /> Prenez une décision pour cette compagnie.
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="admc-hero-actions" style={{ all: 'unset', cursor: 'pointer', flex: 1 }}>
                <div onClick={() => handleDecision('validated')}
                  style={{ padding: '1.5rem', borderRadius: 12, border: '2px solid #10B981', textAlign: 'center', background: 'rgba(16,185,129,0.05)', transition: 'all 0.2s' }}>
                  <i className="bi bi-check-circle" style={{ fontSize: '2rem', color: '#10B981', display: 'block', marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 600, color: '#065F46' }}>Valider</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Approuver la compagnie</div>
                </div>
              </button>
              <button className="admc-hero-actions" style={{ all: 'unset', cursor: 'pointer', flex: 1 }}>
                <div onClick={() => handleDecision('refused')}
                  style={{ padding: '1.5rem', borderRadius: 12, border: '2px solid #EF4444', textAlign: 'center', background: 'rgba(239,68,68,0.05)', transition: 'all 0.2s' }}>
                  <i className="bi bi-x-circle" style={{ fontSize: '2rem', color: '#EF4444', display: 'block', marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 600, color: '#991B1B' }}>Refuser</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Rejeter la demande</div>
                </div>
              </button>
            </div>
            {decision && (
              <div className="admc-alert" style={{ marginTop: '1rem', background: decision === 'validated' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', color: decision === 'validated' ? '#065F46' : '#991B1B' }}>
                <i className={`bi ${decision === 'validated' ? 'bi-check-circle' : 'bi-x-circle'}`} />
                Décision : {decision === 'validated' ? 'Validation' : 'Refus'}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <div className={`admc-alert ${decision === 'validated' ? 'admc-alert--success' : 'admc-alert--danger'}`}>
              <i className={`bi ${decision === 'validated' ? 'bi-check-circle' : 'bi-x-circle'}`} />
              Notification envoyée à <strong>{company?.email}</strong>
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>
              {decision === 'validated'
                ? `La compagnie ${company?.name} est désormais active sur la plateforme.`
                : `La demande de ${company?.name} a été refusée. Un email a été envoyé pour plus d'informations.`}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admc-modal-overlay" onClick={onCancel}>
      <div className="admc-modal" style={{ maxWidth: 560, textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ textAlign: 'center' }}>Workflow de validation</h3>
        <div className="admc-wizard">
          <div className="admc-wizard-steps">
            {steps.map((s, i) => (
              <div key={i} className={`admc-wizard-step ${s.status === 'active' ? 'admc-wizard-step--active' : ''} ${s.status === 'completed' ? 'admc-wizard-step--completed' : ''}`}>
                <span className="admc-wizard-step-number">{s.status === 'completed' ? <i className="bi bi-check" /> : s.num}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="admc-wizard-body">{stepContent()}</div>
          <div className="admc-wizard-actions">
            <button className="admc-modal-actions" style={{ all: 'unset', cursor: 'pointer' }}>
              <span onClick={step === 0 ? onCancel : handlePrev}
                style={{ padding: '0.6rem 1.5rem', borderRadius: 8, background: '#F3F4F6', color: '#374151', fontWeight: 600, fontSize: '0.875rem' }}>
                {step === 0 ? 'Annuler' : 'Précédent'}
              </span>
            </button>
            <button className="admc-modal-actions" style={{ all: 'unset', cursor: 'pointer' }}>
              <span onClick={handleNext}
                style={{ padding: '0.6rem 1.5rem', borderRadius: 8, background: 'var(--adm-accent)', color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>
                {step < 3 ? 'Suivant' : 'Terminer'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminCompanyValidation;
