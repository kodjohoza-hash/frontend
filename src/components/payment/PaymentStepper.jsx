import clsx from 'clsx';

const PaymentStepper = ({ steps, currentStep }) => (
  <div className="btc-payment-stepper d-flex align-items-center justify-content-center gap-0 mb-4" role="navigation" aria-label="Etapes du paiement">
    {steps.map((step, idx) => {
      const isCompleted = step.id < currentStep;
      const isCurrent = step.id === currentStep;
      const isUpcoming = step.id > currentStep;

      return (
        <div key={step.id} className="d-flex align-items-center">
          <div className="d-flex flex-column align-items-center" style={{ minWidth: 70 }}>
            <div
              className={clsx(
                'btc-stepper-circle d-flex align-items-center justify-content-center',
                isCompleted && 'btc-stepper-completed',
                isCurrent && 'btc-stepper-current',
                isUpcoming && 'btc-stepper-upcoming'
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {isCompleted ? (
                <i className="bi bi-check-lg" style={{ fontSize: '1rem' }} />
              ) : (
                <i className={step.icon} style={{ fontSize: '0.8rem' }} />
              )}
            </div>
            <span
              className="mt-1 text-center"
              style={{
                fontSize: 'var(--font-size-2xs)',
                fontWeight: isCurrent ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                color: isCurrent ? 'var(--color-primary)' : isCompleted ? 'var(--color-success)' : 'var(--text-muted)',
                maxWidth: 64,
                lineHeight: 1.2,
              }}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className="btc-stepper-line mx-1"
              style={{
                width: 40,
                height: 2,
                background: isCompleted ? 'var(--color-success)' : 'var(--color-gray-200)',
                borderRadius: 1,
                marginBottom: 16,
              }}
            />
          )}
        </div>
      );
    })}
  </div>
);

export default PaymentStepper;
