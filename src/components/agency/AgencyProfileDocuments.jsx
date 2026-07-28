export default function AgencyProfileDocuments({ documents, onDownload }) {
  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-file-earmark-text" /> Documents</h3>
      </div>
      <div className="apro-section__body">
        <div className="apro-doc-list">
          {documents.map((doc) => (
            <div key={doc.id} className="apro-doc-item">
              <div className="apro-doc-item__icon">
                <i className={`bi ${doc.status === 'uploaded' ? 'bi-file-earmark-check' : 'bi-file-earmark'}`} />
              </div>
              <div className="apro-doc-item__info">
                <div className="apro-doc-item__name">{doc.name}</div>
                {doc.file && <div className="apro-doc-item__file">{doc.file}</div>}
              </div>
              <span className={`apro-doc-item__status apro-doc-item__status--${doc.status}`}>
                {doc.status === 'uploaded' ? 'Téléversé' : 'Manquant'}
              </span>
              {doc.status === 'uploaded' && (
                <button className="apro-doc-item__action" onClick={() => onDownload(doc.id)}>
                  <i className="bi bi-download" /> Télécharger
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
