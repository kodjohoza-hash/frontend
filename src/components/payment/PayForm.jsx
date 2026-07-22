import React, { memo, useState, useCallback, useEffect, useRef } from 'react';

const s = {
  wrapper: {
    marginTop: '20px',
    overflow: 'hidden',
    transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
  },
  fieldGroup: {
    position: 'relative',
    marginBottom: '20px',
  },
  input: (hasError) => ({
    width: '100%',
    padding: '16px 14px 8px 14px',
    background: hasError ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.06)',
    border: 'none',
    borderBottom: `2px solid ${hasError ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: '10px 10px 0 0',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 500,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease',
    letterSpacing: '0.01em',
    boxSizing: 'border-box',
  }),
  inputFocused: {
    borderBottomColor: '#6366f1',
    background: 'rgba(255,255,255,0.08)',
  },
  label: (isFocused, hasValue) => ({
    position: 'absolute',
    left: '14px',
    top: isFocused || hasValue ? '4px' : '14px',
    fontSize: isFocused || hasValue ? '10px' : '14px',
    fontWeight: isFocused || hasValue ? 600 : 400,
    color: isFocused ? '#6366f1' : hasValue ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.35)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.02em',
    textTransform: isFocused || hasValue ? 'uppercase' : 'none',
  }),
  phoneGroup: {
    display: 'flex',
    gap: '8px',
    alignItems: 'stretch',
  },
  prefix: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 14px',
    background: 'rgba(255,255,255,0.06)',
    borderBottom: '2px solid rgba(255,255,255,0.12)',
    borderRadius: '10px 10px 0 0',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    whiteSpace: 'nowrap',
    minWidth: '70px',
  },
  errorMsg: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '6px',
    fontFamily: "'Inter', sans-serif",
    animation: 'btcSlideDown 0.3s ease',
  },
  agencyInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    background: 'rgba(96,165,250,0.08)',
    border: '1px solid rgba(96,165,250,0.2)',
    borderRadius: '12px',
    marginTop: '8px',
  },
  agencyIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '20px',
  },
  agencyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    lineHeight: 1.6,
    fontFamily: "'Inter', sans-serif",
  },
  cardRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
};

const FloatingInput = memo(({ label, value, onChange, onFocus, onBlur, error, type = 'text', ...props }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    onBlur?.();
  }, [onBlur]);

  return (
    <div style={s.fieldGroup}>
      <label style={s.label(focused, !!value)}>{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          ...s.input(!!error),
          ...(focused ? s.inputFocused : {}),
        }}
        autoComplete="off"
        {...props}
      />
      {error && <div style={s.errorMsg} role="alert">{error}</div>}
    </div>
  );
});
FloatingInput.displayName = 'FloatingInput';

const PayForm = memo(({ method, onValid }) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [cardType, setCardType] = useState(null);

  useEffect(() => {
    setForm({});
    setErrors({});
    setCardType(null);
  }, [method]);

  const detectCardType = useCallback((num) => {
    const clean = num.replace(/\s/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
    return null;
  }, []);

  const formatCardNumber = useCallback((val) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(.{4})/g, '$1 ').trim();
  }, []);

  const handleChange = useCallback((field) => (e) => {
    let val = e.target.value;
    if (field === 'cardNumber') {
      val = formatCardNumber(val);
      const detected = detectCardType(val);
      setCardType(detected);
    }
    if (field === 'expiry') {
      val = val.replace(/\D/g, '').slice(0, 4);
      if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
    }
    if (field === 'cvv') {
      val = val.replace(/\D/g, '').slice(0, 4);
    }
    if (field === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 12);
    }

    setForm(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, [formatCardNumber, detectCardType]);

  useEffect(() => {
    if (!method) { onValid?.(false); return; }
    let valid = false;

    if (method === 'mtn_momo' || method === 'orange_money' || method === 'express_union') {
      valid = !!form.phone && form.phone.length >= 9 && !!form.holderName;
    } else if (method === 'visa' || method === 'mastercard') {
      valid = !!form.cardholder && (form.cardNumber || '').replace(/\s/g, '').length >= 16
        && !!form.expiry && form.expiry.length === 5 && !!form.cvv && form.cvv.length >= 3;
    } else if (method === 'agency') {
      valid = true;
    }

    onValid?.(valid);
  }, [method, form, onValid]);

  if (!method) return null;

  if (method === 'agency') {
    return (
      <div style={s.wrapper}>
        <style>{`@keyframes btcSlideDown { 0% { opacity:0; transform:translateY(-8px); } 100% { opacity:1; transform:translateY(0); } }`}</style>
        <div style={s.agencyInfo}>
          <div style={s.agencyIcon}>
            <i className="bi bi-building" />
          </div>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
            Paiement en agence
          </div>
          <div style={s.agencyText}>
            Rendez-vous dans l'agence la plus proche avec votre numéro de réservation.
            Le paiement doit être effectué avant le départ du bus.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <i className="bi bi-clock" style={{ color: '#60a5fa', fontSize: '14px' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
              Délai de paiement : 24h avant le départ
            </span>
          </div>
        </div>
      </div>
    );
  }

  const isMobile = method === 'mtn_momo' || method === 'orange_money' || method === 'express_union';
  const isCard = method === 'visa' || method === 'mastercard';

  return (
    <div style={s.wrapper}>
      <style>{`@keyframes btcSlideDown { 0% { opacity:0; transform:translateY(-8px); } 100% { opacity:1; transform:translateY(0); } }`}</style>

      {isMobile && (
        <>
          <div style={s.phoneGroup}>
            <div style={s.prefix}>+237</div>
            <div style={{ flex: 1 }}>
              <FloatingInput
                label="Numéro de téléphone"
                value={form.phone || ''}
                onChange={handleChange('phone')}
                error={errors.phone}
                inputMode="numeric"
                placeholder=""
              />
            </div>
          </div>
          <FloatingInput
            label="Nom du titulaire"
            value={form.holderName || ''}
            onChange={handleChange('holderName')}
            error={errors.holderName}
          />
        </>
      )}

      {isCard && (
        <>
          <FloatingInput
            label="Nom sur la carte"
            value={form.cardholder || ''}
            onChange={handleChange('cardholder')}
            error={errors.cardholder}
          />
          <div style={{ position: 'relative' }}>
            <FloatingInput
              label="Numéro de carte"
              value={form.cardNumber || ''}
              onChange={handleChange('cardNumber')}
              error={errors.cardNumber}
              inputMode="numeric"
              maxLength={19}
            />
            {cardType && (
              <div style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '11px',
                fontWeight: 700,
                color: cardType === 'visa' ? '#1A1F71' : '#EB001B',
                background: 'rgba(255,255,255,0.1)',
                padding: '3px 8px',
                borderRadius: '6px',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.05em',
              }}>
              {cardType === 'visa' ? 'VISA' : 'MC'}
            </div>
          )}
          </div>
          <div style={s.cardRow}>
            <FloatingInput
              label="Expiration"
              value={form.expiry || ''}
              onChange={handleChange('expiry')}
              error={errors.expiry}
              inputMode="numeric"
              maxLength={5}
              placeholder=""
            />
            <FloatingInput
              label="CVV"
              value={form.cvv || ''}
              onChange={handleChange('cvv')}
              error={errors.cvv}
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder=""
            />
          </div>
        </>
      )}
    </div>
  );
});

PayForm.displayName = 'PayForm';
export default PayForm;
