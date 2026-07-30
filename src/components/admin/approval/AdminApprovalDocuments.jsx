import React from 'react';

export default function AdminApprovalDocuments({ documents }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="adma-empty">
        <i className="fa-solid fa-folder-open" />
        <h3>No Documents</h3>
        <p>This request has no documents attached.</p>
      </div>
    );
  }
  return (
    <div className="adma-docs-gallery">
      {documents.map((doc, i) => (
        <div className="adma-doc-card" key={doc.id || i}>
          <div className={`adma-doc-preview adma-doc-preview--${doc.type || 'pdf'}`}>
            <i className={`fa-solid fa-file-${doc.type === 'image' ? 'image' : 'pdf'}`} />
          </div>
          <div className="adma-doc-card-name">{doc.name}</div>
          <div className="adma-doc-card-meta">{doc.size} • {doc.date}</div>
          <div className={`adma-doc-status adma-doc-status--${doc.status || 'pending'}`}>
            {doc.status === 'verified' ? '✓ Verified' :
             doc.status === 'rejected' ? '✗ Rejected' :
             doc.status === 'expired' ? '⚠ Expired' : '○ Pending'}
          </div>
        </div>
      ))}
    </div>
  );
}
