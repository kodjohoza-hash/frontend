import { useState } from 'react';
import { formatCurrency } from '@data/counterPaymentData';

const REFUND_REASONS = [
  'Annulation du voyage',
  'Modification de réservation',
  'Client non présent',
  'Voyage annulé par la compagnie',
  'Erreur de réservation',
  'Doublon de paiement',
  'Insatisfaction client',
  'Autre',
];

const CounterRefundModal = ({ payment, onClose, onConfirm }) => {
  const [amount, setAmount] = useState(String(payment.amount));
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');

  const isPartial = Number(amount) < payment.amount;
  const maxRefund = payment.amount;

  const handleSubmit = (e) => {
    e.preventDefault();
    const refundAmount = Number(amount);
    const refundReason = reason === 'Autre' ? customReason : reason;
    onConfirm?.({
      paymentId: payment.id,
      refundAmount: refundAmount > maxRefund ? maxRefund : refundAmount,
      isPartial: refundAmount < maxRefund,
      reason: refundReason,
      notes,
      refundedAt: new Date().toISOString(),
      agent: 'Kodjo Jojo',
      originalPayment: payment,
    });
  };

  return (
    <div className="acp-modal-overlay" onClick={onClose}>
      <div className="acp-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="acp-modal-header">
          <h2 className="acp-modal-title"><i className="bi bi-arrow-return-left" /> Remboursement</h2>
          <button className="acp-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="acp-modal-body">
            <div className="acp-cash-form">
              <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div className="acp-report-row"><span className="acp-report-label">Paiement</span><span className="acp-report-value">{payment.reference}</span></div>
                <div className="acp-report-row"><span className="acp-report-label">Client</span><span className="acp-report-value">{payment.clientName}</span></div>
                <div className="acp-report-row"><span className="acp-report-label">Montant initial</span><span className="acp-report-value">{formatCurrency(payment.amount)}</span></div>
                <div className="acp-report-row"><span className="acp-report-label">Mode</span><span className="acp-report-value">{payment.methodLabel}</span></div>
              </div>

              <div className="acp-form-group">
                <label className="acp-form-label">Montant à rembourser *</label>
                <input
                  className="acp-form-input"
                  type="number"
                  max={maxRefund}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                {isPartial && (
                  <span style={{ fontSize: 11, color: '#F59E0B', marginTop: 2 }}>
                    <i className="bi bi-info-circle" /> Remboursement partiel ({formatCurrency(Number(amount))} / {formatCurrency(maxRefund)})
                  </span>
                )}
              </div>

              <div className="acp-form-group">
                <label className="acp-form-label">Motif *</label>
                <select className="acp-form-select" value={reason} onChange={(e) => setReason(e.target.value)} required>
                  <option value="">Sélectionner un motif</option>
                  {REFUND_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {reason === 'Autre' && (
                <div className="acp-form-group">
                  <label className="acp-form-label">Précisez le motif</label>
                  <input className="acp-form-input" value={customReason} onChange={(e) => setCustomReason(e.target.value)} />
                </div>
              )}

              <div className="acp-form-group">
                <label className="acp-form-label">Notes</label>
                <textarea className="acp-form-textarea" placeholder="Notes complémentaires..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="acp-modal-footer">
            <button type="button" className="acp-btn acp-btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="acp-btn acp-btn-danger" disabled={!amount || !reason}>
              <i className="bi bi-arrow-return-left" /> Confirmer le remboursement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterRefundModal;
