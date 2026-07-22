import React, { useState, useCallback } from 'react';

const keyframes = `
  @keyframes btcErrorSlide {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes btcCardFlip {
    from { transform: perspective(800px) rotateY(0deg); }
    to { transform: perspective(800px) rotateY(180deg); }
  }
`;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  cardPreview: {
    position: 'relative',
    width: '100%',
    maxWidth: 380,
    height: 210,
    borderRadius: 'var(--radius-xl)',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a3a8a 50%, #0d2566 100%)',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 12px 40px rgba(11, 29, 81, 0.35)',
    overflow: 'hidden',
    margin: '0 auto',
  },
  cardPreviewOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '60%',
    height: '100%',
    background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.08), transparent 70%)',
    pointerEvents: 'none',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 1,
  },
  cardChip: {
    width: 36,
    height: 26,
    borderRadius: 5,
    background: 'linear-gradient(135deg, #d4a853, #c9952e)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardChipLine: {
    width: '70%',
    height: 1,
    background: 'rgba(0,0,0,0.15)',
    borderRadius: 1,
  },
  cardTypeBadge: (type) => ({
    padding: '3px 10px',
    borderRadius: 'var(--radius-sm)',
    background: type === 'visa' ? 'rgba(26, 31, 113, 0.8)' : type === 'mastercard' ? 'rgba(235, 0, 27, 0.8)' : 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontWeight: 800,
    fontSize: type === 'visa' ? '0.7rem' : '0.65rem',
    fontStyle: type === 'visa' ? 'italic' : 'normal',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  }),
  cardNumber: {
    fontSize: '1.35rem',
    fontWeight: 500,
    color: '#fff',
    letterSpacing: '0.18em',
    fontFamily: "'Courier New', monospace",
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    position: 'relative',
    zIndex: 1,
  },
  cardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    position: 'relative',
    zIndex: 1,
  },
  cardHolder: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    maxWidth: '65%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardHolderLabel: {
    fontSize: '0.5rem',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 3,
  },
  cardExpiry: {
    textAlign: 'right',
  },
  cardExpiryLabel: {
    fontSize: '0.5rem',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 3,
  },
  cardExpiryValue: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '0.08em',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  inputWithBadge: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--color-gray-200)',
    background: '#fff',
    overflow: 'hidden',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  },
  inputBadge: (type) => ({
    padding: '10px 12px',
    fontSize: '0.7rem',
    fontWeight: 800,
    color: type === 'visa' ? '#1A1F71' : type === 'mastercard' ? '#EB001B' : 'var(--text-muted)',
    background: 'var(--color-gray-50)',
    borderRight: '2px solid var(--color-gray-200)',
    fontStyle: type === 'visa' ? 'italic' : 'normal',
    letterSpacing: '0.04em',
    minWidth: 52,
    textAlign: 'center',
  }),
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '0.85rem',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
  },
  inputPlain: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '0.85rem',
    border: '2px solid var(--color-gray-200)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    background: '#fff',
    color: 'var(--text-primary)',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    fontFamily: 'inherit',
  },
  row2: {
    display: 'flex',
    gap: 14,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '0.72rem',
    color: 'var(--color-danger)',
    marginTop: 4,
    animation: 'btcErrorSlide 0.3s ease',
  },
};

const CreditCardForm = React.memo(({ onValid }) => {
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState({});

  const formatCardNumber = useCallback((value) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  }, []);

  const formatExpiry = useCallback((value) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 4);
    if (cleaned.length >= 3) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return cleaned;
  }, []);

  const getCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    return null;
  };

  const cardType = getCardType(form.number);

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'number') value = formatCardNumber(value);
    if (field === 'expiry') value = formatExpiry(value);
    if (field === 'cvv') value = value.replace(/[^0-9]/g, '').slice(0, 4);
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const handleBlur = (field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
    setFocused((p) => ({ ...p, [field]: false }));
  };

  const handleFocus = (field) => () => {
    setFocused((p) => ({ ...p, [field]: true }));
  };

  const focusStyle = (field) =>
    focused[field]
      ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px rgba(11, 29, 81, 0.1)' }
      : {};

  const errorStyle = (field) =>
    errors[field] && touched[field] ? { borderColor: 'var(--color-danger)' } : {};

  const displayNumber = form.number || '•••• •••• •••• ••••';
  const displayHolder = form.name || 'VOTRE NOM';
  const displayExpiry = form.expiry || 'MM/YY';

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.cardPreview}>
          <div style={styles.cardPreviewOverlay} />
          <div style={styles.cardTop}>
            <div style={styles.cardChip}>
              <div style={styles.cardChipLine} />
            </div>
            {cardType && <span style={styles.cardTypeBadge(cardType)}>{cardType === 'visa' ? 'VISA' : 'MC'}</span>}
          </div>
          <div style={styles.cardNumber}>
            {displayNumber}
          </div>
          <div style={styles.cardBottom}>
            <div style={{ maxWidth: '65%' }}>
              <div style={styles.cardHolderLabel}>Titulaire</div>
              <div style={styles.cardHolder}>{displayHolder.toUpperCase()}</div>
            </div>
            <div style={styles.cardExpiry}>
              <div style={styles.cardExpiryLabel}>Expire</div>
              <div style={styles.cardExpiryValue}>{displayExpiry}</div>
            </div>
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="cc-name">Nom sur la carte</label>
          <input
            id="cc-name"
            type="text"
            style={{ ...styles.inputPlain, ...focusStyle('name'), ...errorStyle('name'), textTransform: 'uppercase', letterSpacing: '0.06em' }}
            placeholder="JEAN KAMGA"
            value={form.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            onFocus={handleFocus('name')}
            autoComplete="cc-name"
            aria-label="Nom sur la carte"
            aria-invalid={!!errors.name}
          />
          {errors.name && touched.name && (
            <div style={styles.error}>
              <i className="bi bi-exclamation-circle-fill" /> {errors.name}
            </div>
          )}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="cc-number">Numéro de carte</label>
          <div style={{ ...styles.inputWithBadge, ...focusStyle('number'), ...errorStyle('number') }}>
            <span style={styles.inputBadge(cardType)}>
              {cardType === 'visa' ? 'VISA' : cardType === 'mastercard' ? 'MC' : <i className="bi bi-credit-card" />}
            </span>
            <input
              id="cc-number"
              type="text"
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              value={form.number}
              onChange={handleChange('number')}
              onBlur={handleBlur('number')}
              onFocus={handleFocus('number')}
              autoComplete="cc-number"
              aria-label="Numéro de carte bancaire"
              aria-invalid={!!errors.number}
              inputMode="numeric"
            />
          </div>
          {errors.number && touched.number && (
            <div style={styles.error}>
              <i className="bi bi-exclamation-circle-fill" /> {errors.number}
            </div>
          )}
        </div>

        <div style={styles.row2}>
          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label} htmlFor="cc-expiry">Expiration</label>
            <input
              id="cc-expiry"
              type="text"
              style={{ ...styles.inputPlain, ...focusStyle('expiry'), ...errorStyle('expiry') }}
              placeholder="MM/AA"
              value={form.expiry}
              onChange={handleChange('expiry')}
              onBlur={handleBlur('expiry')}
              onFocus={handleFocus('expiry')}
              autoComplete="cc-exp"
              aria-label="Date d'expiration"
              aria-invalid={!!errors.expiry}
              inputMode="numeric"
            />
            {errors.expiry && touched.expiry && (
              <div style={styles.error}>
                <i className="bi bi-exclamation-circle-fill" /> {errors.expiry}
              </div>
            )}
          </div>
          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label} htmlFor="cc-cvv">CVV</label>
            <input
              id="cc-cvv"
              type="password"
              style={{ ...styles.inputPlain, ...focusStyle('cvv'), ...errorStyle('cvv') }}
              placeholder="•••"
              value={form.cvv}
              onChange={handleChange('cvv')}
              onBlur={handleBlur('cvv')}
              onFocus={handleFocus('cvv')}
              autoComplete="cc-csc"
              aria-label="Code CVV"
              aria-invalid={!!errors.cvv}
              inputMode="numeric"
            />
            {errors.cvv && touched.cvv && (
              <div style={styles.error}>
                <i className="bi bi-exclamation-circle-fill" /> {errors.cvv}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default CreditCardForm;
