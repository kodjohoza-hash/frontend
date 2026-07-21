import { useState } from 'react';
import PaymentService from '@services/paymentService';

const PromoCodeCard = ({ onApply }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
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
      setMessage(result.error);
      onApply?.(null);
    }
  };

  return (
    <div className="btc-promo-card card border-0 mb-3" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="card-body p-4">
        <h6 className="fw-semibold mb-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
          <i className="bi bi-tag-fill me-2" style={{ color: 'var(--color-accent)' }} />
          Code promotionnel
        </h6>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Entrez votre code"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus(null); }}
            style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            aria-label="Code promotionnel"
          />
          <button
            onClick={handleApply}
            disabled={!code.trim() || status === 'loading'}
            className="btn btn-sm px-3"
            style={{
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: 'var(--color-white)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              minWidth: 80,
            }}
          >
            {status === 'loading' ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              'Appliquer'
            )}
          </button>
        </div>
        {status === 'success' && (
          <div className="mt-2 d-flex align-items-center gap-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)' }}>
            <i className="bi bi-check-circle-fill" />
            {message}
          </div>
        )}
        {status === 'error' && (
          <div className="mt-2 d-flex align-items-center gap-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
            <i className="bi bi-exclamation-circle-fill" />
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoCodeCard;
