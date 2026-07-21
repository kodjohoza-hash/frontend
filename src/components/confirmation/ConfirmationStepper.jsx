import clsx from 'clsx';

const ConfirmationStepper = ({ steps }) => (
  <div className="btc-confirm-stepper d-flex align-items-center justify-content-center gap-0 mb-4" role="navigation" aria-label="Etapes">
    {steps.map((step, idx) => (
      <div key={step.id} className="d-flex align-items-center">
        <div className="d-flex flex-column align-items-center" style={{ minWidth: 64 }}>
          <div
            className={clsx(
              'btc-confirm-step-circle d-flex align-items-center justify-content-center',
              'btc-step-completed'
            )}
          >
            <i className="bi bi-check-lg" style={{ fontSize: '1rem' }} />
          </div>
          <span
            className="mt-1 text-center"
            style={{
              fontSize: 'var(--font-size-2xs)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-success)',
              maxWidth: 60,
              lineHeight: 1.2,
            }}
          >
            {step.label}
          </span>
        </div>
        {idx < steps.length - 1 && (
          <div
            className="mx-1"
            style={{ width: 32, height: 2, background: 'var(--color-success)', borderRadius: 1, marginBottom: 16 }}
          />
        )}
      </div>
    ))}
  </div>
);

export default ConfirmationStepper;
