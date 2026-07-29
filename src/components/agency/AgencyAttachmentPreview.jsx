import clsx from 'clsx';

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
  return (bytes / 1048576).toFixed(1) + ' Mo';
};

export default function AgencyAttachmentPreview({ attachment, onRemove }) {
  return (
    <div className="amsg-attachment">
      {(attachment.type === 'image' || attachment.type === 'gif') && (
        <div className="amsg-attachment__preview">
          <img src={attachment.url} alt={attachment.name} className="amsg-attachment__image" />
          {onRemove && (
            <button type="button" className="amsg-attachment__remove" onClick={() => onRemove(attachment.id)}>
              <i className="bi bi-x" />
            </button>
          )}
        </div>
      )}
      {(attachment.type === 'document' || attachment.type === 'audio') && (
        <div className="amsg-attachment__file">
          <i className={clsx('bi', attachment.type === 'audio' ? 'bi-mic' : 'bi-file-earmark-text', 'amsg-attachment__file-icon')} />
          <div className="amsg-attachment__file-info">
            <span className="amsg-attachment__file-name">{attachment.name}</span>
            <span className="amsg-attachment__file-size">{formatSize(attachment.size)}</span>
          </div>
          {onRemove && (
            <button type="button" className="amsg-attachment__remove" onClick={() => onRemove(attachment.id)}>
              <i className="bi bi-x" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
