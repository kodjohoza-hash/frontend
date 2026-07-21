import { useState } from 'react';
import clsx from 'clsx';

/**
 * Tooltip — Tooltip léger
 * Position: top, bottom, left, right
 */
const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const show = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hide = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClass = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right',
  };

  return (
    <div
      className={clsx('tooltip-wrapper', positionClass[position], className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {isVisible && content && (
        <div
          className={clsx('btc-tooltip', `tooltip-${position}`)}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
