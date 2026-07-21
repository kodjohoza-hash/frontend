import { memo } from 'react';
import clsx from 'clsx';

const FeatureCard = memo(({ feature, index, isVisible = false }) => {
  const color = feature.color || 'primary';

  return (
    <div className={clsx('feature-card', isVisible && 'is-visible', `reveal-delay-${(index % 3) + 1}`)}>
      <div className={clsx('feature-card-icon', `feature-card-icon--${color}`)}>
        <i className={`bi ${feature.icon}`} />
      </div>
      <h3 className="feature-card-title">{feature.title}</h3>
      <p className="feature-card-description">{feature.description}</p>
      <div className={clsx('feature-card-accent', `feature-card-accent--${color}`)} />
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;
