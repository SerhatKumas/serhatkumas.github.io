import { useLayoutEffect, type RefObject } from 'react';

const STEP = 28; // px each card sits below the previous one
const BOTTOM_GAP = 16;

/**
 * Sticky card stack that works on any screen height.
 * Every card gets the tallest card's height (so none peek out below another), and each
 * sticky wrapper's `top` is capped so the whole card fits on screen: short screens pin
 * the card by its bottom edge instead of hiding it.
 * Cards are marked with `data-stack-card`; their parent is the sticky wrapper.
 */
export function useCardStack(containerRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;
    const update = () => {
      const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-stack-card]'));
      if (!cards.length) return;
      cards.forEach((card) => (card.style.minHeight = ''));
      const height = Math.max(...cards.map((card) => card.offsetHeight));
      const baseTop = window.matchMedia('(min-width: 768px)').matches ? 128 : 96;
      cards.forEach((card, i) => {
        card.style.minHeight = `${height}px`;
        const top = Math.min(baseTop + i * STEP, window.innerHeight - height - BOTTOM_GAP);
        card.parentElement!.style.top = `${top}px`;
      });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
    };
  }, [containerRef]);
}
