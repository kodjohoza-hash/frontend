import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const s = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '440px',
    background: '#0f172a',
    borderRadius: '24px',
    padding: '36px 28px 28px',
    position: 'relative',
    overflow: 'hidden',
    animation: 'btcModalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: "'Inter', sans-serif",
  },
  confetti: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  particle: (i) => ({
    position: 'absolute',
    width: `${6 + (i % 3) * 2}px`,
    height: `${6 + (i % 3) * 2}px`,
    borderRadius: i % 2 === 0 ? '50%' : '2px',
    background: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'][i % 5],
    top: '-10px',
    left: `${10 + (i * 17) % 80}%`,
    animation: `btcConfettiFall ${2 + (i % 3)}s ${i * 0.15}s ease-out forwards`,
    opacity: 0.8,
  }),
  checkCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #34d399)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: '#fff',
    fontSize: '32px',
    boxShadow: '0 0 40px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.15)',
    animation: 'btcBounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
  },
  title: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '8px',
    fontFamily: "'Inter', sans-serif",
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '24px',
    fontFamily: "'Inter', sans-serif",
  },
  details: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
  },
  detailLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: "'Inter', sans-serif",
  },
  detailValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: "'Inter', sans-serif",
  },
  route: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    padding: '10px 0',
    margin: '8px 0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  routeCity: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
  },
  routeArrow: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
  btnOutline: {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    border: '1.5px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
  },
};

const formatXAF = (amount) => new Intl.NumberFormat('fr-CM').format(amount) + ' FCFA';

const PaySuccessModal = memo(({ transactionId, reservation, seats, total, paymentMethod }) => {
  const navigate = useNavigate();

  const formattedDate = useMemo(() => {
    try {
      return new Date(reservation.departureDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return reservation.departureDate;
    }
  }, [reservation.departureDate]);

  return (
    <div style={s.backdrop} role="dialog" aria-modal="true" aria-label="Paiement réussi">
      <style>{`
        @keyframes btcModalIn { 0% { opacity:0; transform: scale(0.85) translateY(20px); } 100% { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes btcBounceIn { 0% { opacity:0; transform: scale(0); } 60% { transform: scale(1.15); } 100% { opacity:1; transform: scale(1); } }
        @keyframes btcConfettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 0.8; } 100% { transform: translateY(500px) rotate(720deg); opacity: 0; } }
      `}</style>
      <div style={s.modal}>
        <div style={s.confetti}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={s.particle(i)} />
          ))}
        </div>

        <div style={s.checkCircle}>
          <i className="bi bi-check-lg" />
        </div>

        <h2 style={s.title}>Paiement réussi !</h2>
        <p style={s.subtitle}>Votre réservation a été confirmée</p>

        <div style={s.details}>
          <div style={s.route}>
            <span style={s.routeCity}>{reservation.departureCity}</span>
            <i className="bi bi-arrow-right" style={s.routeArrow} />
            <span style={s.routeCity}>{reservation.arrivalCity}</span>
          </div>
          <div style={s.detailRow}>
            <span style={s.detailLabel}>Transaction</span>
            <span style={s.detailValue}>{transactionId || 'TXN-' + Date.now()}</span>
          </div>
          <div style={s.detailRow}>
            <span style={s.detailLabel}>Date</span>
            <span style={s.detailValue}>{formattedDate} — {reservation.departureTime}</span>
          </div>
          <div style={s.detailRow}>
            <span style={s.detailLabel}>Sièges</span>
            <span style={s.detailValue}>{(seats || reservation.seats).map(s => s.number).join(', ')}</span>
          </div>
          <div style={s.detailRow}>
            <span style={s.detailLabel}>Paiement</span>
            <span style={s.detailValue}>{paymentMethod || 'Mobile Money'}</span>
          </div>
          <div style={s.detailRow}>
            <span style={s.detailLabel}>Total payé</span>
            <span style={{ ...s.detailValue, color: '#6366f1', fontSize: '15px', fontWeight: 800 }}>{formatXAF(total)}</span>
          </div>
        </div>

        <div style={s.actions}>
          <button
            style={s.btnPrimary}
            onClick={() => navigate('/booking/confirmation')}
            aria-label="Voir mon billet"
          >
            Voir mon billet
          </button>
          <button
            style={s.btnOutline}
            onClick={() => navigate('/')}
            aria-label="Retour à l'accueil"
          >
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
});

PaySuccessModal.displayName = 'PaySuccessModal';
export default PaySuccessModal;
