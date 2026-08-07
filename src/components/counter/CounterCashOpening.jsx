import { useState } from 'react';

const CounterCashOpening = ({ onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm?.({
      openingBalance: Number(amount),
      notes,
      openedAt: new Date().toISOString(),
      agent: 'Kodjo Jojo',
    });
  };

  return (
    <div className="acp-modal-overlay" onClick={onClose}>
      <div className="acp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="acp-modal-header">
          <h2 className="acp-modal-title"><i className="bi bi-box-arrow-in-right" /> Ouverture de caisse</h2>
          <button className="acp-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="acp-modal-body">
            <div className="acp-cash-form">
              <div className="acp-form-group">
                <label className="acp-form-label">Montant initial (XAF) *</label>
                <input
                  className="acp-form-input"
                  type="number"
                  placeholder="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="acp-form-group">
                <label className="acp-form-label">Agent</label>
                <input className="acp-form-input" value="Kodjo Jojo" disabled />
              </div>
              <div className="acp-form-group">
                <label className="acp-form-label">Date / Heure</label>
                <input className="acp-form-input" value={new Date().toLocaleString('fr-FR')} disabled />
              </div>
              <div className="acp-form-group">
                <label className="acp-form-label">Observations</label>
                <textarea
                  className="acp-form-textarea"
                  placeholder="Observations éventuelles..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="acp-modal-footer">
            <button type="button" className="acp-btn acp-btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="acp-btn acp-btn-success" disabled={!amount}>
              <i className="bi bi-check-lg" /> Ouvrir la caisse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterCashOpening;
