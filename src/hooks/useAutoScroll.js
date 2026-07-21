import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * useAutoScroll — Shared horizontal carousel logic with auto-scroll
 * @param {Object} options
 * @param {number} options.itemCount - Total number of items
 * @param {number} options.itemWidth - Width of a single item in px
 * @param {number} options.gap - Gap between items in px (default 20)
 * @param {number} options.autoScrollInterval - Auto-scroll interval in ms (default 4000)
 * @param {boolean} options.isEnabled - Whether auto-scroll is active (default true)
 */
export const useAutoScroll = ({
  itemCount,
  itemWidth,
  gap = 20,
  autoScrollInterval = 4000,
  isEnabled = true,
} = {}) => {
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < maxScroll - 5);
    const idx = Math.round(el.scrollLeft / (itemWidth + gap));
    setActiveIndex(Math.min(idx, itemCount - 1));
  }, [itemWidth, gap, itemCount]);

  const scrollTo = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = itemWidth + gap;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, [itemWidth, gap]);

  const scrollToIndex = useCallback((index) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * (itemWidth + gap), behavior: 'smooth' });
  }, [itemWidth, gap]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  useEffect(() => {
    if (!isEnabled) return;
    autoScrollRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 5) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollTo('right');
      }
    }, autoScrollInterval);
    return () => clearInterval(autoScrollRef.current);
  }, [isEnabled, scrollTo, autoScrollInterval]);

  const handleMouseEnter = useCallback(() => {
    clearInterval(autoScrollRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isEnabled) return;
    autoScrollRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 5) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollTo('right');
      }
    }, autoScrollInterval);
  }, [isEnabled, scrollTo, autoScrollInterval]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    activeIndex,
    scrollTo,
    scrollToIndex,
    handleMouseEnter,
    handleMouseLeave,
  };
};
