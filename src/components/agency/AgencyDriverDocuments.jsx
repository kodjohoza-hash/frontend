import clsx from 'clsx';

const docs = [
  { key: 'license', label: 'Permis de conduire', icon: 'bi-card-heading', required: true },
  { key: 'nationalId', label: 'Carte nationale d\'identité', icon: 'bi-person-badge', required: true },
  { key: 'contract', label: 'Contrat de travail', icon: 'bi-file-earmark-text', required: true },
  { key: 'medical', label: 'Visite médicale', icon: 'bi-heart-pulse', required: true },
  { key: 'certificates', label: 'Certificats de formation', icon: 'bi-award', required: false },
];

export default function AgencyDriverDocuments({ driver }) {
  if (!driver) return null;
  const docsStatus = driver.documents || {};

  return (
    <div className="add-docs">
      {docs.map((doc) => {
        const uploaded = docsStatus[doc.key];
        return (
          <div key={doc.key} className={clsx('add-docs__item', { 'add-docs__item--uploaded': uploaded, 'add-docs__item--missing': !uploaded })}>
            <div className="add-docs__icon"><i className={`bi ${doc.icon}`} /></div>
            <div className="add-docs__info">
              <span className="add-docs__label">{doc.label}</span>
              <span className="add-docs__status">{uploaded ? 'Uploadé' : 'Non uploadé'}</span>
            </div>
            {doc.required && <span className="add-docs__required">Requis</span>}
            <button className="add-docs__btn" disabled={uploaded}>
              <i className={clsx('bi', uploaded ? 'bi-check-lg' : 'bi-upload')} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
