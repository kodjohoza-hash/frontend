import { useState, useRef } from 'react';

export default function AgencyDocumentSettings({ data, onSave }) {
  const [documents, setDocuments] = useState(() =>
    data.map((doc) => ({ ...doc, file: doc.file || null }))
  );
  const fileInputRef = useRef(null);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const handleDocClick = (docId) => {
    setSelectedDocId(docId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && selectedDocId) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === selectedDocId
            ? { ...doc, file, status: 'uploaded' }
            : doc
        )
      );
    }
    e.target.value = '';
    setSelectedDocId(null);
  };

  const handlePreview = (e, doc) => {
    e.stopPropagation();
    if (doc.file) {
      window.open(URL.createObjectURL(doc.file), '_blank');
    }
  };

  const handleSave = () => {
    onSave(documents);
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h2 className="aset-section__title">
            <i className="bi bi-file-earmark-text" /> Documents
          </h2>
          <p className="aset-section__subtitle">Téléversez les documents requis</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="aset-doc-upload"
            onClick={() => handleDocClick(doc.id)}
          >
            <div className="aset-doc-upload__icon">
              <i className={`bi ${doc.file ? 'bi-file-earmark-check' : 'bi-upload'}`} />
            </div>
            <div className="aset-doc-upload__info">
              <div className="aset-doc-upload__name">
                {doc.name}{' '}
                {doc.required && (
                  <span style={{ color: 'var(--aset-danger)' }}>*</span>
                )}
              </div>
              <div className="aset-doc-upload__hint">
                {doc.file ? doc.file.name : 'Cliquez pour téléverser (PDF, JPG, PNG)'}
              </div>
            </div>
            <span className={`aset-doc-upload__status aset-doc-upload__status--${doc.status}`}>
              {doc.status === 'missing' ? 'Manquant' : 'Téléversé'}
            </span>
            {doc.file && (
              <button
                className="aset-btn aset-btn--ghost aset-btn--sm"
                onClick={(e) => handlePreview(e, doc)}
              >
                <i className="bi bi-eye" />
              </button>
            )}
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.png"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="aset-btn-group">
        <button className="aset-btn aset-btn--primary" onClick={handleSave}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}
