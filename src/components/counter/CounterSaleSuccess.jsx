const CounterSaleSuccess = ({ ticket, onNewSale, onDownloadPdf }) => {
  const showToast = (msg) => {
    alert(msg);
  };

  const handlePdf = () => {
    if (ticket?.id && onDownloadPdf) {
      onDownloadPdf(ticket.id);
    } else {
      showToast('PDF téléchargé');
    }
  };

  return (
    <div className="acs-success">
      <div className="acs-success__icon">
        <i className="bi bi-check-lg" />
      </div>
      <h2 className="acs-success__title">Vente confirmée !</h2>
      <p className="acs-success__desc">Le billet a été émis avec succès</p>

      <div className="acs-success__ref">
        <i className="bi bi-ticket-perforated" />
        {ticket?.ref}
      </div>

      <div className="acs-success__actions">
        <button type="button" className="acs-btn acs-btn--primary" onClick={() => window.print()}>
          <i className="bi bi-printer" /> Imprimer
        </button>
        <button type="button" className="acs-btn acs-btn--secondary" onClick={handlePdf}>
          <i className="bi bi-filetype-pdf" /> Télécharger PDF
        </button>
        <button type="button" className="acs-btn acs-btn--secondary" onClick={() => showToast('Email envoyé')}>
          <i className="bi bi-envelope" /> Envoyer par Email
        </button>
        <button type="button" className="acs-btn acs-btn--secondary" onClick={() => showToast('SMS envoyé')}>
          <i className="bi bi-chat-dots" /> Envoyer par SMS
        </button>
        <button type="button" className="acs-btn acs-btn--success" onClick={onNewSale}>
          <i className="bi bi-plus-lg" /> Nouvelle vente
        </button>
      </div>
    </div>
  );
};

export default CounterSaleSuccess;
