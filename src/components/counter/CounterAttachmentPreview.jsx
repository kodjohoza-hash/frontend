import clsx from 'clsx';

const FILE_ICONS = {
  pdf: 'bi-file-pdf',
  image: 'bi-file-image',
  doc: 'bi-file-word',
  docx: 'bi-file-word',
  xls: 'bi-file-earmark-excel',
  xlsx: 'bi-file-earmark-excel',
  zip: 'bi-file-zip',
  audio: 'bi-file-music',
  video: 'bi-file-play',
  default: 'bi-file',
};

const formatSize = (bytes) => {
  if (!bytes) return '';
  const units = ['o', 'Ko', 'Mo', 'Go'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const CounterAttachmentPreview = ({ attachments, onDownload }) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="acm-attachments">
      <div className="acm-attachments__header">
        <i className="bi bi-paperclip" />
        {attachments.length} pièce{attachments.length > 1 ? 's' : ''} jointe{attachments.length > 1 ? 's' : ''}
      </div>
      <div className="acm-attachments__grid">
        {attachments.map((file, index) => {
          const ext = (file.extension || file.name?.split('.').pop() || '').toLowerCase();
          const icon = FILE_ICONS[ext] || (file.type && FILE_ICONS[file.type]) || FILE_ICONS.default;
          return (
            <div key={file.id || index} className="acm-attachments__card">
              <div className="acm-attachments__icon-wrap">
                <i className={clsx('bi acm-attachments__icon', icon)} />
              </div>
              <div className="acm-attachments__info">
                <span className="acm-attachments__name" title={file.name}>{file.name}</span>
                <span className="acm-attachments__size">{formatSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="acm-attachments__download"
                onClick={() => onDownload?.(file)}
                title="Télécharger"
              >
                <i className="bi bi-download" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CounterAttachmentPreview;
