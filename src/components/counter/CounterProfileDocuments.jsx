import clsx from 'clsx';
import { formatDate } from '@data/counterProfileData';

const getFileIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'pdf':
      return { icon: 'bi-filetype-pdf', color: '#EF4444', bg: '#FEF2F2' };
    case 'image':
    case 'jpg':
    case 'jpeg':
    case 'png':
      return { icon: 'bi-filetype-jpg', color: '#10B981', bg: '#ECFDF5' };
    case 'doc':
    case 'docx':
      return { icon: 'bi-filetype-docx', color: '#3B82F6', bg: '#EFF6FF' };
    case 'xls':
    case 'xlsx':
      return { icon: 'bi-filetype-xlsx', color: '#22C55E', bg: '#F0FDF4' };
    default:
      return { icon: 'bi-file-earmark', color: '#6B7280', bg: '#F3F4F6' };
  }
};

const CounterProfileDocuments = ({ documents = [] }) => {
  if (!documents.length) {
    return (
      <div className="acpr-card">
        <div className="acpr-card-header">
          <i className="bi bi-folder2-open" />
          <span>Mes documents</span>
        </div>
        <div className="acpr-timeline-empty">
          <i className="bi bi-file-earmark" />
          <span>Aucun document.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="acpr-card">
      <div className="acpr-card-header">
        <i className="bi bi-folder2-open" />
        <span>Mes documents</span>
        <button className="acpr-docs-download-all">
          <i className="bi bi-download" /> Tout télécharger
        </button>
      </div>
      <div className="acpr-docs-grid">
        {documents.map((doc) => {
          const fileMeta = getFileIcon(doc.type);
          return (
            <div key={doc.id} className="acpr-doc-card">
              <div
                className="acpr-doc-icon"
                style={{ background: fileMeta.bg, color: fileMeta.color }}
              >
                <i className={clsx('bi', fileMeta.icon)} />
              </div>
              <div className="acpr-doc-body">
                <div className="acpr-doc-name">{doc.nom}</div>
                {doc.categorie && (
                  <span className="acpr-doc-category">{doc.categorie}</span>
                )}
                <div className="acpr-doc-meta">
                  {doc.taille && <span>{doc.taille}</span>}
                  {doc.dateUpload && <span>Ajouté le {formatDate(doc.dateUpload)}</span>}
                </div>
              </div>
              <button className="acpr-doc-download" title="Télécharger">
                <i className="bi bi-download" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CounterProfileDocuments;
