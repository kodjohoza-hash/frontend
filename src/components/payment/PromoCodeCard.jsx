import React, { useState } from 'react';
import PaymentService from '@services/paymentService';

const keyframes = `
  @keyframes btcExpand {
    from { max-height: 0; opacity: 0; }
    to { max-height: 200px; opacity: 1; }
  }
  @keyframes btcCollapse {
    from { max-height: 200px; opacity: 1; }
    to { max-height: 0; opacity: 0; }
  }
  @keyframes btcSpinner {
    to { transform: rotate(360deg); }
  }
`;

const styles = {
  card: {
    borderRadius: 'var(--radius-xl)',
    background: '#fff',
    border: '1px solid var(--color-gray-100)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
  },
  trigger: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
  },
  triggerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  triggerIcon: {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-md)',
    background: 'rgba(255, 107, 53, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-accent)',
    fontSize: '0.85rem',
  },
  triggerText: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  triggerChevron: (isOpen) => ({
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    transition: 'transform 0.3s ease',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  }),
  content: (isOpen) => ({
    maxHeight: isOpen ? 200 : 0,
    opacity: isOpen ? 1 : 0,
    overflow: 'hidden',
    transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
    padding: isOpen ? '0 20px 20px' : '0 20px',
  }),
  inputRow: {
    display: 'flex',
    gap: 10,
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '0.85rem',
    border: '2px solid var(--color-gray-200)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    background: '#fff',
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: 'inherit',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  },
  applyBtn: (disabled) => ({
    padding: '10px 20px',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#fff',
    background: disabled ? 'var(--color-gray-300)' : 'var(--color-primary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minWidth: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontFamily: 'inherit',
    transition: 'background 0.2s ease',
  }),
  spinner: {
    width: 14,
    height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'btcSpinner 0.6s linear infinite',
  },
  successMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(16, 185, 129, 0.06)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-success)',
  },
  errorMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(239, 68, 68, 0.06)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-danger)',
  },
};

const PromoCodeCard = React.memo(({ onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    setStatus('loading');
    const result = await PaymentService.validatePromoCode(code);
    if (result.valid) {
      setStatus('success');
      setMessage(result.promo.label);
      onApply?.(result.promo);
    } else {
      setStatus('error');
      setMessage(result.error || 'Code promo invalide');
      onApply?.(null);
    }
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.card}>
        <button
          type="button"
          style={styles.trigger}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label="Code promotionnel"
        >
          <div style={styles.triggerLeft}>
            <div style={styles.triggerIcon}>
              <i className="bi bi-tag-fill" />
            </div>
            <span style={styles.triggerText}>Vous avez un code promo ?</span>
          </div>
          <i className="bi bi-chevron-down" style={styles.triggerChevron(isOpen)} />
        </button>

        <div style={styles.content(isOpen)}>
          <div style={styles.inputRow}>
            <input
              type="text"
              style={styles.input}
              placeholder="Entrez votre code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setStatus(null);
              }}
              aria-label="Code promotionnel"
            />
            <button
              type="button"
              style={styles.applyBtn(!code.trim() || status === 'loading')}
              onClick={handleApply}
              disabled={!code.trim() || status === 'loading'}
              aria-label="Appliquer le code promo"
            >
              {status === 'loading' ? (
                <div style={styles.spinner} />
              ) : (
                'Appliquer'
              )}
            </button>
          </div>

          {status === 'success' && (
            <div style={styles.successMsg}>
              <i className="bi bi-check-circle-fill" />
              {message}
            </div>
          )}

          {status === 'error' && (
            <div style={styles.errorMsg}>
              <i className="bi bi-exclamation-circle-fill" />
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default PromoCodeCard;
