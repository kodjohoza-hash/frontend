import { useState } from 'react';
import clsx from 'clsx';
import { cashMethods, payments, clients, formatCurrency } from '@data/counterPaymentData';

const STEPS = [
  { key: 'booking', label: 'Réservation', icon: 'bi-ticket-perforated' },
  { key: 'method', label: 'Paiement', icon: 'bi-credit-card' },
  { key: 'amount', label: 'Montant', icon: 'bi-cash' },
  { key: 'confirm', label: 'Confirmation', icon: 'bi-check2-square' },
  { key: 'receipt', label: 'Reçu', icon: 'bi-receipt' },
];

const CounterPaymentWizard = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState(null);

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedClient;
      case 2: return !!selectedMethod;
      case 3: return Number(amount) > 0;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => { if (step < 5 && canProceed()) setStep(step + 1); };
  const handlePrev = () => { if (step > 1) setStep(step - 1); };

  const handleConfirm = () => {
    const client = clients.find((c) => c.name === selectedClient);
    const method = cashMethods.find((m) => m.key === selectedMethod);
    const newPayment = {
      id: `PAY-2026-${String(payments.length + 1).padStart(4, '0')}`,
      reference: `PAY-BTC-${String(payments.length + 1).padStart(4, '0')}`,
      clientName: selectedClient,
      clientPhone: client?.phone || '',
      clientEmail: client?.email || '',
      bookingRef: null,
      ticketRef: null,
      tripFrom: 'Douala',
      tripTo: 'Yaoundé',
      amount: Number(amount),
      method: selectedMethod,
      methodLabel: method?.label || selectedMethod,
      methodIcon: method?.icon || 'bi-wallet',
      methodColor: method?.color || '#6B7280',
      status: 'paid',
      agent: 'Kodjo Jojo',
      createdAt: new Date().toISOString(),
      notes,
    };
    setReceipt(newPayment);
    setStep(5);
    onComplete?.(newPayment);
  };

  const renderStepIndicator = () => (
    <div className="acp-wizard-steps">
      {STEPS.map((s, i) => {
        const idx = i + 1;
        return (
          <div key={s.key} className={clsx('acp-wizard-step', { completed: idx < step, active: idx === step })}>
            <div className="acp-wizard-step-number">
              {idx < step ? <i className="bi bi-check" /> : idx}
            </div>
            <span className="acp-wizard-step-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="acp-step-title">Choisir le client</h3>
            <p className="acp-step-desc">Sélectionnez le client pour cet encaissement.</p>
            <div className="acp-form-group" style={{ marginBottom: 12 }}>
              <label className="acp-form-label">Client</label>
              <select className="acp-form-select" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                <option value="">Sélectionner un client</option>
                {clients.map((c) => (
                  <option key={c.name} value={c.name}>{c.name} — {c.phone}</option>
                ))}
              </select>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="acp-step-title">Choisir le mode de paiement</h3>
            <p className="acp-step-desc">Sélectionnez le moyen de paiement utilisé par le client.</p>
            <div className="acp-method-grid">
              {cashMethods.filter((m) => !m.key.includes('Bon') && !m.key.includes('Code')).map((m) => (
                <div key={m.key} className={clsx('acp-method-card', { selected: selectedMethod === m.key })} onClick={() => setSelectedMethod(m.key)}>
                  <div className="acp-method-icon" style={{ background: m.color }}>
                    <i className={`bi ${m.icon}`} />
                  </div>
                  <div className="acp-method-label">{m.label}</div>
                </div>
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="acp-step-title">Montant</h3>
            <p className="acp-step-desc">Saisissez le montant à encaisser.</p>
            <div className="acp-form-group">
              <label className="acp-form-label">Montant (XAF) *</label>
              <input className="acp-form-input" type="number" placeholder="15000" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
            </div>
            <div className="acp-form-group" style={{ marginTop: 12 }}>
              <label className="acp-form-label">Notes</label>
              <textarea className="acp-form-textarea" placeholder="Notes optionnelles..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            {amount > 0 && (
              <div style={{ marginTop: 16, padding: 12, background: '#F9FAFB', borderRadius: 8, textAlign: 'right' }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Montant à encaisser : </span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#0B1D51' }}>{formatCurrency(Number(amount))}</span>
              </div>
            )}
          </>
        );
      case 4:
        return (
          <>
            <h3 className="acp-step-title">Confirmation</h3>
            <p className="acp-step-desc">Vérifiez les informations avant de finaliser l'encaissement.</p>
            <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 16 }}>
              <div className="acp-report-row"><span className="acp-report-label">Client</span><span className="acp-report-value">{selectedClient}</span></div>
              <div className="acp-report-row"><span className="acp-report-label">Mode de paiement</span><span className="acp-report-value">{cashMethods.find((m) => m.key === selectedMethod)?.label}</span></div>
              <div className="acp-report-row"><span className="acp-report-label">Montant</span><span className="acp-report-value" style={{ fontWeight: 700, color: '#0B1D51' }}>{formatCurrency(Number(amount))}</span></div>
              <div className="acp-report-row"><span className="acp-report-label">Agent</span><span className="acp-report-value">Kodjo Jojo</span></div>
              {notes && <div className="acp-report-row"><span className="acp-report-label">Notes</span><span className="acp-report-value">{notes}</span></div>}
            </div>
          </>
        );
      case 5:
        return receipt && (
          <>
            <h3 className="acp-step-title" style={{ textAlign: 'center' }}>Encaissement réussi</h3>
            <p className="acp-step-desc" style={{ textAlign: 'center' }}>
              <i className="bi bi-check-circle-fill" style={{ color: '#10B981', fontSize: 24 }} />
            </p>
            <div className="acp-receipt">
              <div className="acp-receipt-header">
                <div className="acp-receipt-logo">BUS TIX CONNECT</div>
                <div className="acp-receipt-company">
                  <span className="acp-receipt-badge" style={{ background: '#0B1D51' }}>FV</span>
                  Finex Voyages
                </div>
                <div className="acp-receipt-title">Reçu de paiement</div>
              </div>
              <div className="acp-receipt-body">
                <div className="acp-receipt-row"><span className="acp-receipt-label">Reçu n°</span><span className="acp-receipt-value">RCP-{receipt.reference}</span></div>
                <div className="acp-receipt-row"><span className="acp-receipt-label">Date</span><span className="acp-receipt-value">{new Date().toLocaleDateString('fr-FR')}</span></div>
                <div className="acp-receipt-row"><span className="acp-receipt-label">Client</span><span className="acp-receipt-value">{selectedClient}</span></div>
                <div className="acp-receipt-row"><span className="acp-receipt-label">Mode</span><span className="acp-receipt-value">{cashMethods.find((m) => m.key === selectedMethod)?.label}</span></div>
                <div className="acp-receipt-row"><span className="acp-receipt-label">Agent</span><span className="acp-receipt-value">Kodjo Jojo</span></div>
                <div className="acp-receipt-total"><span>Total</span><span>{formatCurrency(Number(amount))}</span></div>
              </div>
              <div className="acp-receipt-qr">
                <div className="acp-receipt-qr-placeholder"><i className="bi bi-qr-code" /></div>
                <div className="acp-receipt-qr-code">BTC-RCP-{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
              </div>
              <div className="acp-receipt-footer">
                BUS TIX CONNECT — Reçu généré le {new Date().toLocaleString('fr-FR')}
              </div>
            </div>
            <div className="acp-receipt-actions">
              <button className="acp-btn acp-btn-secondary acp-btn-sm"><i className="bi bi-printer" /> Imprimer</button>
              <button className="acp-btn acp-btn-secondary acp-btn-sm"><i className="bi bi-download" /> PDF</button>
              <button className="acp-btn acp-btn-secondary acp-btn-sm"><i className="bi bi-envelope" /> Email</button>
              <button className="acp-btn acp-btn-secondary acp-btn-sm"><i className="bi bi-chat-dots" /> SMS</button>
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="acp-modal-overlay" onClick={onClose}>
      <div className="acp-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div className="acp-modal-header">
          <h2 className="acp-modal-title"><i className="bi bi-cash-stack" /> Nouvel encaissement</h2>
          <button className="acp-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="acp-modal-body">
          {step < 5 && renderStepIndicator()}
          {renderStep()}
        </div>
        {step < 5 && (
          <div className="acp-wizard-actions">
            <div className="acp-wizard-left">
              {step > 1 && (
                <button className="acp-btn acp-btn-outline" onClick={handlePrev}>
                  <i className="bi bi-arrow-left" /> Précédent
                </button>
              )}
            </div>
            <div className="acp-wizard-right">
              <button className="acp-btn acp-btn-secondary" onClick={onClose}>Annuler</button>
              {step < 4 ? (
                <button className="acp-btn acp-btn-primary" onClick={handleNext} disabled={!canProceed()}>
                  Suivant <i className="bi bi-arrow-right" />
                </button>
              ) : (
                <button className="acp-btn acp-btn-success" onClick={handleConfirm}>
                  <i className="bi bi-check-lg" /> Confirmer l'encaissement
                </button>
              )}
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="acp-modal-footer">
            <button className="acp-btn acp-btn-primary" onClick={onClose}>
              <i className="bi bi-check-lg" /> Terminer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterPaymentWizard;
