import { useEffect, useCallback } from 'react';
import clsx from 'clsx';

/**
 * Modal — Modal réutilisable
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  centered = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
  ...props
}) => {
  const sizeClass = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl',
    full: 'modal-fullscreen',
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose?.();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className={clsx('btc-modal-overlay', isOpen && 'is-open')}
      onClick={closeOnBackdrop ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      {...props}
    >
      <div
        className={clsx('modal fade show d-block', centered && 'modal-dialog-centered', sizeClass[size])}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog">
          <div className={clsx('modal-content', className)}>
            {title && (
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">{title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Fermer"
                  onClick={onClose}
                />
              </div>
            )}
            <div className="modal-body">
              {children}
            </div>
            {footer && (
              <div className="modal-footer">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
