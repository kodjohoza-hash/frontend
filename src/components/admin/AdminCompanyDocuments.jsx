const AdminCompanyDocuments = ({ documents }) => {
  if (!documents?.length) return null;
  return (
    <div className="admc-drawer-section">
      <h3><i className="bi bi-file-earmark-text" /> Documents</h3>
      <div className="admc-docs-grid">
        {documents.map((doc) => (
          <div key={doc.id} className="admc-doc-card">
            <div className={`admc-doc-icon admc-doc-icon--${doc.type === 'image' ? 'image' : 'pdf'}`}>
              <i className={`bi ${doc.type === 'image' ? 'bi-image' : 'bi-file-earmark-pdf'}`} />
            </div>
            <div className="admc-doc-info">
              <div className="admc-doc-name">{doc.name}</div>
              <div className="admc-doc-meta">{doc.ref} — {doc.size}</div>
            </div>
            <span className={`admc-doc-status admc-doc-status--${doc.status}`}>
              {doc.status === 'verified' ? 'Vérifié' : 'En attente'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminCompanyDocuments;
