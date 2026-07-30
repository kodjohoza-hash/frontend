import { useState } from 'react';
import { formatCurrency } from '@data/counterPaymentData';

const CounterCashClosing = ({ session, payments, onClose, onConfirm }) => {
  const [cashAmount, setCashAmount] = useState('');
  const [mobileAmount, setMobileAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [signature, setSignature] = useState('');

  const cashPayments = payments.filter((p) => p.method === 'Espèces' && p.status === 'paid');
  const mobilePayments = payments.filter((p) => (p.method === 'Orange_Money' || p.method === 'MTN_Mobile_Money') && p.status === 'paid');
  const cardPayments = payments.filter((p) => p.method === 'Carte_Bancaire' && p.status === 'paid');
  const transferPayments = payments.filter((p) => p.method === 'Virement_Bancaire' && p.status === 'paid');

  const totalCash = cashPayments.reduce((s, p) => s + p.amount, 0);
  const totalMobile = mobilePayments.reduce((s, p) => s + p.amount, 0);
  const totalCard = cardPayments.reduce((s, p) => s + p.amount, 0);
  const totalTransfer = transferPayments.reduce((s, p) => s + p.amount, 0);
  const expectedTotal = totalCash + totalMobile + totalCard + totalTransfer;

  const declaredTotal = (Number(cashAmount) || 0) + (Number(mobileAmount) || 0) + (Number(cardAmount) || 0) + (Number(transferAmount) || 0);
  const difference = declaredTotal - totalCash;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm?.({
      closingBalance: declaredTotal,
      cashDeclared: Number(cashAmount) || 0,
      mobileDeclared: Number(mobileAmount) || 0,
      cardDeclared: Number(cardAmount) || 0,
      transferDeclared: Number(transferAmount) || 0,
      expectedCash: totalCash,
      expectedMobile: totalMobile,
      expectedCard: totalCard,
      expectedTransfer: totalTransfer,
      difference,
      notes,
      signature: signature || 'Kodjo Jojo',
      closedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="acp-modal-overlay" onClick={onClose}>
      <div className="acp-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div className="acp-modal-header">
          <h2 className="acp-modal-title"><i className="bi bi-box-arrow-left" /> Clôture de caisse</h2>
          <button className="acp-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="acp-modal-body">
            <div className="acp-cash-form">
              <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0B1D51', marginBottom: 12 }}>Résumé attendu</div>
                <div className="acp-report-row"><span className="acp-report-label">Espèces attendues</span><span className="acp-report-value">{formatCurrency(totalCash)}</span></div>
                <div className="acp-report-row"><span className="acp-report-label">Mobile Money attendu</span><span className="acp-report-value">{formatCurrency(totalMobile)}</span></div>
                <div className="acp-report-row"><span className="acp-report-label">Carte attendue</span><span className="acp-report-value">{formatCurrency(totalCard)}</span></div>
                <div className="acp-report-row"><span className="acp-report-label">Virement attendu</span><span className="acp-report-value">{formatCurrency(totalTransfer)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: 8, borderTop: '2px solid #0B1D51', fontSize: 16, fontWeight: 700, color: '#0B1D51' }}>
                  <span>Total attendu</span><span>{formatCurrency(expectedTotal)}</span>
                </div>
                {session?.openingBalance > 0 && (
                  <div className="acp-report-row" style={{ marginTop: 8 }}><span className="acp-report-label">Fond de caisse</span><span className="acp-report-value">{formatCurrency(session.openingBalance)}</span></div>
                )}
              </div>

              <div className="acp-cash-form-grid">
                <div className="acp-form-group">
                  <label className="acp-form-label">Espèces déclarées</label>
                  <input className="acp-form-input" type="number" placeholder="0" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} />
                </div>
                <div className="acp-form-group">
                  <label className="acp-form-label">Mobile Money déclaré</label>
                  <input className="acp-form-input" type="number" placeholder="0" value={mobileAmount} onChange={(e) => setMobileAmount(e.target.value)} />
                </div>
                <div className="acp-form-group">
                  <label className="acp-form-label">Carte déclarée</label>
                  <input className="acp-form-input" type="number" placeholder="0" value={cardAmount} onChange={(e) => setCardAmount(e.target.value)} />
                </div>
                <div className="acp-form-group">
                  <label className="acp-form-label">Virement déclaré</label>
                  <input className="acp-form-input" type="number" placeholder="0" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
                </div>
              </div>

              <div style={{ background: difference === 0 ? '#D1FAE5' : '#FEF3C7', borderRadius: 10, padding: '12px 16px', margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: difference === 0 ? '#059669' : '#D97706' }}>
                  <i className={`bi ${difference === 0 ? 'bi-check-circle' : 'bi-exclamation-triangle'}`} style={{ marginRight: 6 }} />
                  Différence
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: difference === 0 ? '#059669' : '#D97706' }}>
                  {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                </span>
              </div>

              <div className="acp-form-group">
                <label className="acp-form-label">Observations</label>
                <textarea className="acp-form-textarea" placeholder="Observations sur la clôture..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="acp-form-group">
                <label className="acp-form-label">Signature (nom complet)</label>
                <input className="acp-form-input" placeholder="Kodjo Jojo" value={signature} onChange={(e) => setSignature(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="acp-modal-footer">
            <button type="button" className="acp-btn acp-btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="acp-btn acp-btn-primary">
              <i className="bi bi-check-lg" /> Clôturer la caisse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterCashClosing;
