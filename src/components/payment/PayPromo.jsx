import React, { memo, useState, useCallback, useRef, useEffect } from 'react';

const s = {
  wrapper: {
    marginTop: '16px',
    fontFamily: "'Inter', sans-serif",
  },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    padding: '4px 0',
    border: 'none',
    background: 'none',
    transition: 'color 0.2s ease',
    fontFamily: "'Inter', sans-serif",
  },
  expanded: {
    overflow: 'hidden',
    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: 'none',
    borderBottom: '2px solid rgba(255,255,255,0.12)',
    borderRadius: '8px 8px 0 0',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 500,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'border-color 0.3s ease',
  },
  inputFocused: {
    borderBottomColor: '#6366f1',
  },
  btn: {
    padding: '10px 18px',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
  success: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    color: '#10b981',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    color: '#ef4444',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
  },
};

const PayPromo = memo(({ onApply }) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleApply = useCallback(() => {
    if (!code.trim()) return;
    const result = onApply?.(code.trim().toUpperCase());
    if (result && result.success) {
      setStatus('success');
      setStatusMsg(result.label || 'Code appliqué !');
    } else {
      setStatus('error');
      setStatusMsg(result?.message || 'Code invalide');
    }
  }, [code, onApply]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleApply();
  }, [handleApply]);

  return (
    <div style={s.wrapper} ref={containerRef}>
      {!open ? (
        <button
          style={s.trigger}
          onClick={() => setOpen(true)}
          aria-label="Entrer un code promo"
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <i className="bi bi-tag" style={{ fontSize: '13px' }} />
          Vous avez un code promo ?
        </button>
      ) : (
        <div style={{ ...s.expanded, maxHeight: '120px', opacity: 1 }}>
          <div style={s.inputRow}>
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus(null); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Entrez votre code"
              style={{ ...s.input, ...(focused ? s.inputFocused : {}) }}
              aria-label="Code promo"
              maxLength={20}
            />
            <button
              style={s.btn}
              onClick={handleApply}
              aria-label="Appliquer le code promo"
            >
              Appliquer
            </button>
          </div>
          {status === 'success' && (
            <div style={s.success}>
              <i className="bi bi-check-circle-fill" />
              {statusMsg}
            </div>
          )}
          {status === 'error' && (
            <div style={s.error}>
              <i className="bi bi-x-circle-fill" />
              {statusMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

PayPromo.displayName = 'PayPromo';
export default PayPromo;
