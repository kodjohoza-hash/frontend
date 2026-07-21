import clsx from 'clsx';

const PaymentMethodCard = ({ method, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(method.id)}
    className={clsx(
      'btc-payment-method-card d-flex align-items-center gap-3 p-3 w-100 text-start border-0',
      isSelected && 'btc-payment-method-selected'
    )}
    type="button"
    aria-pressed={isSelected}
    aria-label={`Payer avec ${method.name}`}
    disabled={!method.available}
    style={{
      borderRadius: 'var(--radius-lg)',
      background: isSelected ? 'var(--color-primary-50)' : 'var(--bg-surface)',
      border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-default)'}`,
      transition: 'all 0.2s ease',
      opacity: method.available ? 1 : 0.5,
      cursor: method.available ? 'pointer' : 'not-allowed',
    }}
  >
    <div
      className="d-flex align-items-center justify-content-center flex-shrink-0"
      style={{
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-lg)',
        background: isSelected ? 'var(--color-primary)' : 'var(--color-gray-100)',
        color: isSelected ? 'var(--color-white)' : method.color,
        fontSize: '1.1rem',
        transition: 'all 0.2s ease',
      }}
    >
      <i className={method.icon} />
    </div>
    <div className="flex-grow-1 min-width-0">
      <div
        className="fw-semibold"
        style={{
          fontSize: 'var(--font-size-sm)',
          color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
        }}
      >
        {method.name}
      </div>
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
        {method.description}
      </div>
    </div>
    <div
      className={clsx('btc-payment-radio flex-shrink-0')}
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-gray-300)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}
    >
      {isSelected && (
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            animation: 'btc-radio-in 0.2s ease-out',
          }}
        />
      )}
    </div>
  </button>
);

export default PaymentMethodCard;
