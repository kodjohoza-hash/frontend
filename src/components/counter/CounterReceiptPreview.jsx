import { formatCurrency, formatDateTime, generateReceipt } from '@data/counterPaymentData';

const CounterReceiptPreview = ({ payment, onClose }) => {
  const receipt = generateReceipt(payment);

  return (
    <div className="acp-modal-overlay" onClick={onClose}>
      <div className="acp-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="acp-modal-header">
          <h2 className="acp-modal-title"><i className="bi bi-receipt" /> Reçu de paiement</h2>
          <button className="acp-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="acp-modal-body">
          <div className="acp-receipt">
            <div className="acp-receipt-header">
              <div className="acp-receipt-logo">BUS TIX CONNECT</div>
              <div className="acp-receipt-company">
                <span className="acp-receipt-badge" style={{ background: receipt.companyColor }}>{receipt.companyLogo}</span>
                {receipt.company}
              </div>
              <div className="acp-receipt-title">Reçu de paiement</div>
            </div>
            <div className="acp-receipt-body">
              <div className="acp-receipt-row"><span className="acp-receipt-label">Reçu n°</span><span className="acp-receipt-value">{receipt.receiptNo}</span></div>
              <div className="acp-receipt-row"><span className="acp-receipt-label">Date</span><span className="acp-receipt-value">{formatDateTime(receipt.issueDate)}</span></div>
              <div className="acp-receipt-row"><span className="acp-receipt-label">Client</span><span className="acp-receipt-value">{receipt.clientName}</span></div>
              <div className="acp-receipt-row"><span className="acp-receipt-label">Téléphone</span><span className="acp-receipt-value">{receipt.clientPhone}</span></div>
              <div className="acp-receipt-row"><span className="acp-receipt-label">Trajet</span><span className="acp-receipt-value">{receipt.trip}</span></div>
              <div className="acp-receipt-row"><span className="acp-receipt-label">Mode</span><span className="acp-receipt-value">{receipt.method}</span></div>
              <div className="acp-receipt-row"><span className="acp-receipt-label">Agent</span><span className="acp-receipt-value">{receipt.agent}</span></div>
              {receipt.bookingRef && <div className="acp-receipt-row"><span className="acp-receipt-label">Réservation</span><span className="acp-receipt-value">{receipt.bookingRef}</span></div>}
              {receipt.ticketRef && <div className="acp-receipt-row"><span className="acp-receipt-label">Billet</span><span className="acp-receipt-value">{receipt.ticketRef}</span></div>}
              <div className="acp-receipt-total"><span>Total</span><span>{formatCurrency(receipt.amount)}</span></div>
            </div>
            <div className="acp-receipt-qr">
              <div className="acp-receipt-qr-placeholder"><i className="bi bi-qr-code" /></div>
              <div className="acp-receipt-qr-code">{receipt.qrCode}</div>
              <div style={{ fontSize: 11, marginTop: 4, fontFamily: 'Courier New', letterSpacing: 2, color: '#0B1D51' }}>{receipt.barcode}</div>
            </div>
            <div className="acp-receipt-footer">
              BUS TIX CONNECT — Reçu officiel · {formatDateTime(receipt.issueDate)}
            </div>
          </div>
          <div className="acp-receipt-actions">
            <button className="acp-btn acp-btn-secondary acp-btn-sm"><i className="bi bi-printer" /> Imprimer</button>
            <button className="acp-btn acp-btn-secondary acp-btn-sm"><i className="bi bi-download" /> PDF</button>
            <button className="acp-btn acp-btn-secondary acp-btn-sm"><i className="bi bi-envelope" /> Email</button>
            <button className="acp-btn acp-btn-secondary acp-btn-sm"><i className="bi bi-chat-dots" /> SMS</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterReceiptPreview;
